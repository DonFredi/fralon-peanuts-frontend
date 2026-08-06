-- Apply this migration in the Supabase dashboard (or through the Supabase CLI).
-- It is the authoritative inventory guard for individual cart rows. Carts do not
-- reserve inventory; final stock reservation/deduction belongs in the future
-- transactional order-creation flow.

create or replace function public.enforce_cart_item_stock()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  variant_record public.product_variants%rowtype;
  product_record public.products%rowtype;
begin
  if new.quantity <= 0 then
    raise exception 'Cart item quantity must be greater than zero'
      using errcode = '23514';
  end if;

  select *
    into variant_record
    from public.product_variants
   where id = new.variant_id
   for key share;

  if not found or not coalesce(variant_record.is_active, false) or not coalesce(variant_record.available, false) then
    raise exception 'Product variant is unavailable'
      using errcode = '23514';
  end if;

  select *
    into product_record
    from public.products
   where id = variant_record.product_id
   for key share;

  if not found or not coalesce(product_record.is_active, false) then
    raise exception 'Product is unavailable'
      using errcode = '23514';
  end if;

  if new.product_id is distinct from variant_record.product_id then
    raise exception 'Cart item product does not match its variant'
      using errcode = '23514';
  end if;

  if new.quantity > variant_record.stock_quantity then
    raise exception 'Requested cart quantity exceeds available stock'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

drop trigger if exists cart_items_enforce_stock on public.cart_items;

create trigger cart_items_enforce_stock
before insert or update of product_id, variant_id, quantity on public.cart_items
for each row
execute function public.enforce_cart_item_stock();
