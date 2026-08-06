-- Creates the first-party order transaction. Apply in the Supabase SQL Editor.
-- Payment providers can later update payment_status/reference without changing
-- order creation or stock reservation.

alter table public.orders
  add column if not exists fulfillment_method text not null default 'delivery'
    constraint orders_fulfillment_method_valid check (fulfillment_method in ('pickup', 'delivery')),
  add column if not exists payment_method text not null default 'cash'
    constraint orders_payment_method_valid check (payment_method in ('cash', 'mpesa')),
  add column if not exists payment_status text not null default 'pending'
    constraint orders_payment_status_valid check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  add column if not exists payment_reference text,
  add column if not exists mpesa_phone text;

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "customers can read own orders" on public.orders;
create policy "customers can read own orders"
on public.orders for select
to authenticated
using (
  exists (
    select 1 from public.customers
    where customers.id = orders.user_id
      and customers.profile_id = auth.uid()
  )
);

drop policy if exists "customers can read own order items" on public.order_items;
create policy "customers can read own order items"
on public.order_items for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    join public.customers on customers.id = orders.user_id
    where orders.id = order_items.order_id
      and customers.profile_id = auth.uid()
  )
);

grant select on table public.orders, public.order_items to authenticated;

create or replace function public.create_order_from_cart(
  p_fulfillment_method text,
  p_payment_method text,
  p_address_id uuid default null,
  p_delivery_address jsonb default null,
  p_mpesa_phone text default null,
  p_notes text default null
)
returns table (
  order_id uuid,
  order_status text,
  payment_status text,
  subtotal_ksh integer,
  shipping_ksh integer,
  total_ksh integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile_id uuid := auth.uid();
  v_customer_id uuid;
  v_cart_id uuid;
  v_address_id uuid := p_address_id;
  v_order_id uuid;
  v_subtotal integer := 0;
  v_shipping integer := 0;
  v_total integer;
  cart_item record;
begin
  if v_profile_id is null then
    raise exception 'Authentication is required' using errcode = '28000';
  end if;

  if p_fulfillment_method not in ('pickup', 'delivery') then
    raise exception 'Invalid fulfillment method' using errcode = '22023';
  end if;

  if p_payment_method not in ('cash', 'mpesa') then
    raise exception 'Invalid payment method' using errcode = '22023';
  end if;

  if p_payment_method = 'mpesa' and nullif(trim(p_mpesa_phone), '') is null then
    raise exception 'M-Pesa phone number is required' using errcode = '22023';
  end if;

  select id into v_customer_id
  from public.customers
  where profile_id = v_profile_id
    and customer_type = 'online'
    and is_active = true
  limit 1;

  if v_customer_id is null then
    raise exception 'Customer profile was not found' using errcode = 'P0001';
  end if;

  select id into v_cart_id
  from public.cart
  where user_id = v_profile_id
  for update;

  if v_cart_id is null then
    raise exception 'Cart was not found' using errcode = 'P0001';
  end if;

  if p_fulfillment_method = 'delivery' then
    if v_address_id is not null then
      if not exists (
        select 1 from public.addresses
        where id = v_address_id and user_id = v_profile_id
      ) then
        raise exception 'Delivery address does not belong to the current user' using errcode = '42501';
      end if;
    else
      if p_delivery_address is null
        or nullif(trim(p_delivery_address->>'constituency'), '') is null
        or nullif(trim(p_delivery_address->>'ward'), '') is null
        or nullif(trim(p_delivery_address->>'street'), '') is null then
        raise exception 'A complete delivery address is required' using errcode = '22023';
      end if;

      insert into public.addresses (user_id, label, country, city, constituency, ward, street, is_default)
      values (
        v_profile_id,
        'other',
        'Kenya',
        'Nairobi',
        trim(p_delivery_address->>'constituency'),
        trim(p_delivery_address->>'ward'),
        trim(p_delivery_address->>'street'),
        false
      )
      returning id into v_address_id;
    end if;
    v_shipping := 100;
  else
    v_address_id := null;
  end if;

  -- Lock every variant before calculating totals or changing stock. This
  -- serializes competing orders for the same inventory rows.
  for cart_item in
    select
      ci.id,
      ci.product_id,
      ci.variant_id,
      ci.quantity,
      v.name as variant_name,
      v.price_ksh,
      v.stock_quantity,
      v.available as variant_available,
      v.is_active as variant_active,
      p.name as product_name,
      p.is_active as product_active
    from public.cart_items ci
    join public.product_variants v on v.id = ci.variant_id
    join public.products p on p.id = v.product_id
    where ci.cart_id = v_cart_id
    order by ci.variant_id
    for update of ci, v, p
  loop
    if not cart_item.variant_active or not cart_item.product_active or not cart_item.variant_available then
      raise exception 'A product in your cart is no longer available' using errcode = '23514';
    end if;
    if cart_item.quantity > cart_item.stock_quantity then
      raise exception 'A product in your cart no longer has enough stock' using errcode = '23514';
    end if;
    v_subtotal := v_subtotal + (cart_item.price_ksh * cart_item.quantity);
  end loop;

  if v_subtotal <= 0 then
    raise exception 'Your cart is empty' using errcode = 'P0001';
  end if;

  v_total := v_subtotal + v_shipping;

  insert into public.orders (
    user_id, addresses_id, status, fulfillment_method, payment_method,
    payment_status, mpesa_phone, subtotal_ksh, shipping_ksh, discount_ksh,
    tax_ksh, total_ksh, notes
  )
  values (
    v_customer_id, v_address_id, 'pending', p_fulfillment_method, p_payment_method,
    'pending', nullif(trim(p_mpesa_phone), ''), v_subtotal, v_shipping, 0,
    0, v_total, p_notes
  )
  returning id into v_order_id;

  for cart_item in
    select
      ci.product_id,
      ci.variant_id,
      ci.quantity,
      v.name as variant_name,
      v.price_ksh,
      v.stock_quantity,
      p.name as product_name
    from public.cart_items ci
    join public.product_variants v on v.id = ci.variant_id
    join public.products p on p.id = v.product_id
    where ci.cart_id = v_cart_id
    order by ci.variant_id
    for update of ci, v, p
  loop
    insert into public.order_items (
      order_id, product_id, variant_id, product_name, unit_price_ksh, quantity, total_ksh
    )
    values (
      v_order_id, cart_item.product_id, cart_item.variant_id, cart_item.product_name,
      cart_item.price_ksh, cart_item.quantity, cart_item.price_ksh * cart_item.quantity
    );

    update public.product_variants
    set
      stock_quantity = stock_quantity - cart_item.quantity,
      available = case when stock_quantity - cart_item.quantity = 0 then false else available end,
      updated_at = now()
    where id = cart_item.variant_id;
  end loop;

  delete from public.cart_items where cart_id = v_cart_id;

  return query
  select v_order_id, 'pending'::text, 'pending'::text, v_subtotal, v_shipping, v_total;
end;
$$;

revoke all on function public.create_order_from_cart(text, text, uuid, jsonb, text, text) from public, anon;
grant execute on function public.create_order_from_cart(text, text, uuid, jsonb, text, text) to authenticated;
