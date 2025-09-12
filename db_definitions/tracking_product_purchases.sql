create view public.tracking_product_purchases as
with
    unnested_items as (
        select
            p.t,
            jsonb_array_elements(p.items::jsonb) as item_data
        from
            "Purchases" p
        where
            p.t is not null
          and p.payment_confirmed = true
    )
select
    unnested_items.t as tracking_link,
    unnested_items.item_data ->> 'product_id'::text as product_id,
        unnested_items.item_data ->> 'product_name'::text as product_name,
        count(*) as number_of_purchases,
        sum(
        (unnested_items.item_data ->> 'quantity'::text)::integer
        ) as total_quantity
        from
        unnested_items
        group by
        unnested_items.t,
        (unnested_items.item_data ->> 'product_id'::text),
        (unnested_items.item_data ->> 'product_name'::text)
        order by
        unnested_items.t,
        (count(*)) desc;