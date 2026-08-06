-- ─────────────────────────────────────────────────────────────────────────
-- create_order_from_cart
-- Called via supabase.rpc() from the storefront checkout.
--
-- Security model:
--   SECURITY DEFINER — runs as the function owner (bypasses RLS internally)
--   All prices are read from the database — client cannot tamper with amounts
--   auth.uid() identifies the buyer — client cannot spoof another user's order
--
-- What it does atomically (all or nothing):
--   1. Resolve customer record from auth.uid()
--   2. Find the user's cart and verify it is not empty
--   3. Compute subtotal from actual DB prices — never trust client amounts
--   4. Compute shipping fee server-side
--   5. If delivery + no saved address — insert a new address row
--   6. Insert the order row
--   7. Insert order_items — snapshots product_name, variant_name, price at time of order
--   8. Clear the cart
--   9. Return a summary for the success page
-- ─────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION create_order_from_cart(
  p_fulfillment_method TEXT,       -- 'pickup' | 'delivery'
  p_payment_method     TEXT,       -- 'cash' | 'mpesa'
  p_address_id         UUID    DEFAULT NULL,   -- existing saved address id
  p_delivery_address   JSONB   DEFAULT NULL,   -- {constituency, ward, street} for new address
  p_mpesa_phone        TEXT    DEFAULT NULL,   -- mpesa phone if payment_method = 'mpesa'
  p_notes              TEXT    DEFAULT NULL
)
RETURNS TABLE (
  order_id       UUID,
  order_status   TEXT,
  payment_status TEXT,
  subtotal_ksh   INTEGER,
  shipping_ksh   INTEGER,
  total_ksh      INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id  UUID;
  v_cart_id      UUID;
  v_address_id   UUID;
  v_order_id     UUID;
  v_subtotal_ksh INTEGER := 0;
  v_shipping_ksh INTEGER := 0;
  v_total_ksh    INTEGER := 0;
  v_item         RECORD;
BEGIN

  -- ── 1. resolve the authenticated user's customer record ──────────────
  SELECT id INTO v_customer_id
  FROM customers
  WHERE profile_id = auth.uid()
    AND customer_type = 'online';

  IF v_customer_id IS NULL THEN
    RAISE EXCEPTION 'No customer account found. Please log in and try again.';
  END IF;


  -- ── 2. find the user's cart ───────────────────────────────────────────
  SELECT id INTO v_cart_id
  FROM cart
  WHERE user_id = auth.uid();

  IF v_cart_id IS NULL THEN
    RAISE EXCEPTION 'No cart found for this user.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM cart_items WHERE cart_id = v_cart_id
  ) THEN
    RAISE EXCEPTION 'Your cart is empty.';
  END IF;


  -- ── 3. compute subtotal from actual DB prices — never trust the client ─
  SELECT COALESCE(SUM(pv.price_ksh * ci.quantity), 0)
  INTO v_subtotal_ksh
  FROM cart_items ci
  JOIN product_variants pv ON pv.id = ci.variant_id
  WHERE ci.cart_id = v_cart_id;


  -- ── 4. compute shipping server-side ──────────────────────────────────
  -- flat rate for now — swap this logic when shipping_zones is implemented
  v_shipping_ksh := CASE WHEN p_fulfillment_method = 'delivery' THEN 100 ELSE 0 END;
  v_total_ksh    := v_subtotal_ksh + v_shipping_ksh;


  -- ── 5. resolve delivery address ───────────────────────────────────────
  IF p_fulfillment_method = 'delivery' THEN
    IF p_address_id IS NOT NULL THEN
      -- use an existing saved address
      v_address_id := p_address_id;

    ELSIF p_delivery_address IS NOT NULL THEN
      -- insert a new address row from the checkout form
      INSERT INTO addresses (user_id, label, constituency, ward, street, is_default)
      VALUES (
        auth.uid(),
        'other',
        p_delivery_address->>'constituency',
        p_delivery_address->>'ward',
        p_delivery_address->>'street',
        false
      )
      RETURNING id INTO v_address_id;

    ELSE
      RAISE EXCEPTION 'Delivery requires an address.';
    END IF;
  END IF;


  -- ── 6. insert the order ───────────────────────────────────────────────
  INSERT INTO orders (
    customer_id,
    address_id,
    status,
    fulfillment_method,
    payment_method,
    payment_status,
    payment_reference,
    subtotal_ksh,
    shipping_ksh,
    discount_ksh,
    tax_ksh,
    total_ksh,
    notes
  )
  VALUES (
    v_customer_id,
    v_address_id,
    'pending',
    p_fulfillment_method,
    p_payment_method,
    'unpaid',
    p_mpesa_phone,    -- stored as reference for cash/mpesa tracking
    v_subtotal_ksh,
    v_shipping_ksh,
    0,
    0,
    v_total_ksh,
    p_notes
  )
  RETURNING id INTO v_order_id;


  -- ── 7. insert order_items — snapshot names and prices from the DB ─────
  FOR v_item IN
    SELECT
      ci.product_id,
      ci.variant_id,
      ci.quantity,
      p.name    AS product_name,
      pv.name   AS variant_name,
      pv.price_ksh AS unit_price_ksh
    FROM cart_items ci
    JOIN product_variants pv ON pv.id = ci.variant_id
    JOIN products          p  ON p.id  = ci.product_id
    WHERE ci.cart_id = v_cart_id
  LOOP
    INSERT INTO order_items (
      order_id,
      product_id,
      variant_id,
      product_name,
      variant_name,
      unit_price_ksh,
      quantity,
      total_ksh
    )
    VALUES (
      v_order_id,
      v_item.product_id,
      v_item.variant_id,
      v_item.product_name,
      v_item.variant_name,
      v_item.unit_price_ksh,
      v_item.quantity,
      v_item.unit_price_ksh * v_item.quantity
    );
  END LOOP;


  -- ── 8. clear the cart ─────────────────────────────────────────────────
  DELETE FROM cart_items WHERE cart_id = v_cart_id;


  -- ── 9. return summary for the checkout success page ───────────────────
  RETURN QUERY
  SELECT
    v_order_id,
    'pending'::TEXT,
    'unpaid'::TEXT,
    v_subtotal_ksh,
    v_shipping_ksh,
    v_total_ksh;

END;
$$;
