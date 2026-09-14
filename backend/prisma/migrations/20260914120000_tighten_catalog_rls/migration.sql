-- Tighten catalog and delivery_capacity SELECT so shopkeepers cannot
-- read other tenants' products/capacity. Before a cart distributor is
-- selected, only listing distributors is allowed. After selection,
-- products and delivery_capacity are readable only for that distributor_id
-- (or an explicit session app.distributor_id, used while switching).

DROP POLICY IF EXISTS products_select ON "products";
CREATE POLICY products_select ON "products" FOR SELECT
    USING (
        distributor_id = app_distributor_id()
        OR EXISTS (
            SELECT 1 FROM "carts" c
            WHERE c.shopkeeper_id = app_shopkeeper_id()
              AND c.distributor_id = "products"."distributor_id"
        )
    );

DROP POLICY IF EXISTS delivery_capacity_select ON "delivery_capacity";
CREATE POLICY delivery_capacity_select ON "delivery_capacity" FOR SELECT
    USING (
        distributor_id = app_distributor_id()
        OR EXISTS (
            SELECT 1 FROM "carts" c
            WHERE c.shopkeeper_id = app_shopkeeper_id()
              AND c.distributor_id = "delivery_capacity"."distributor_id"
        )
    );
