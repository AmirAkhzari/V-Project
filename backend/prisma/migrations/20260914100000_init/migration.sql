-- V-Project initial schema: tenant tables, case-only inventory, RLS.

CREATE TYPE "Availability" AS ENUM ('available', 'unavailable');
CREATE TYPE "OrderStatus" AS ENUM ('placed');
CREATE TYPE "PaymentStatus" AS ENUM ('pending');

CREATE TABLE "distributors" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "distributors_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "shopkeepers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shopkeepers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "distributor_id" UUID NOT NULL,
    "barcode" TEXT,
    "name" TEXT NOT NULL,
    "price_per_case" DECIMAL(18,2) NOT NULL,
    "stock_in_cases" INTEGER NOT NULL,
    "min_order_qty" INTEGER NOT NULL,
    "units_per_case" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "products_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "products_stock_in_cases_nonneg" CHECK ("stock_in_cases" >= 0),
    CONSTRAINT "products_min_order_qty_positive" CHECK ("min_order_qty" >= 1),
    CONSTRAINT "products_units_per_case_positive" CHECK ("units_per_case" >= 1)
);

CREATE UNIQUE INDEX "products_distributor_id_barcode_key"
    ON "products" ("distributor_id", "barcode")
    WHERE "barcode" IS NOT NULL;

CREATE TABLE "carts" (
    "id" UUID NOT NULL,
    "shopkeeper_id" UUID NOT NULL,
    "distributor_id" UUID NOT NULL,
    "delivery_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "carts_shopkeeper_id_key" ON "carts" ("shopkeeper_id");

CREATE TABLE "cart_items" (
    "id" UUID NOT NULL,
    "cart_id" UUID NOT NULL,
    "product_id" UUID,
    "barcode" TEXT,
    "qty" INTEGER NOT NULL,
    "unit_price" DECIMAL(18,2) NOT NULL,
    "availability" "Availability" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "cart_items_qty_cases_nonneg" CHECK ("qty" >= 0)
);

CREATE UNIQUE INDEX "cart_items_cart_id_product_id_key"
    ON "cart_items" ("cart_id", "product_id")
    WHERE "product_id" IS NOT NULL;

CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "shopkeeper_id" UUID NOT NULL,
    "distributor_id" UUID NOT NULL,
    "delivery_date" DATE NOT NULL,
    "total" DECIMAL(18,2) NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "order_items" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "barcode" TEXT,
    "qty" INTEGER NOT NULL,
    "unit_price" DECIMAL(18,2) NOT NULL,
    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "order_items_qty_cases_positive" CHECK ("qty" >= 1)
);

CREATE TABLE "delivery_capacity" (
    "id" UUID NOT NULL,
    "distributor_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "slots_remaining" INTEGER NOT NULL,
    CONSTRAINT "delivery_capacity_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "delivery_capacity_slots_nonneg" CHECK ("slots_remaining" >= 0)
);

CREATE UNIQUE INDEX "delivery_capacity_distributor_id_date_key"
    ON "delivery_capacity" ("distributor_id", "date");

CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "order_idempotency" (
    "id" UUID NOT NULL,
    "shopkeeper_id" UUID NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "request_hash" TEXT NOT NULL,
    "order_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_idempotency_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "order_idempotency_shopkeeper_id_idempotency_key_key"
    ON "order_idempotency" ("shopkeeper_id", "idempotency_key");

ALTER TABLE "products"
    ADD CONSTRAINT "products_distributor_id_fkey"
    FOREIGN KEY ("distributor_id") REFERENCES "distributors"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "carts"
    ADD CONSTRAINT "carts_shopkeeper_id_fkey"
    FOREIGN KEY ("shopkeeper_id") REFERENCES "shopkeepers"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "carts"
    ADD CONSTRAINT "carts_distributor_id_fkey"
    FOREIGN KEY ("distributor_id") REFERENCES "distributors"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "cart_items"
    ADD CONSTRAINT "cart_items_cart_id_fkey"
    FOREIGN KEY ("cart_id") REFERENCES "carts"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cart_items"
    ADD CONSTRAINT "cart_items_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "orders"
    ADD CONSTRAINT "orders_shopkeeper_id_fkey"
    FOREIGN KEY ("shopkeeper_id") REFERENCES "shopkeepers"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "orders"
    ADD CONSTRAINT "orders_distributor_id_fkey"
    FOREIGN KEY ("distributor_id") REFERENCES "distributors"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "order_items"
    ADD CONSTRAINT "order_items_order_id_fkey"
    FOREIGN KEY ("order_id") REFERENCES "orders"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "order_items"
    ADD CONSTRAINT "order_items_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "delivery_capacity"
    ADD CONSTRAINT "delivery_capacity_distributor_id_fkey"
    FOREIGN KEY ("distributor_id") REFERENCES "distributors"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payments"
    ADD CONSTRAINT "payments_order_id_fkey"
    FOREIGN KEY ("order_id") REFERENCES "orders"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "order_idempotency"
    ADD CONSTRAINT "order_idempotency_shopkeeper_id_fkey"
    FOREIGN KEY ("shopkeeper_id") REFERENCES "shopkeepers"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "order_idempotency"
    ADD CONSTRAINT "order_idempotency_order_id_fkey"
    FOREIGN KEY ("order_id") REFERENCES "orders"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Session tenant helpers used by RLS policies.
CREATE OR REPLACE FUNCTION app_shopkeeper_id() RETURNS uuid AS $$
BEGIN
  RETURN NULLIF(current_setting('app.shopkeeper_id', true), '')::uuid;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION app_distributor_id() RETURNS uuid AS $$
BEGIN
  RETURN NULLIF(current_setting('app.distributor_id', true), '')::uuid;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- RLS: every tenant table is forced so the app role cannot skip it.
ALTER TABLE "shopkeepers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shopkeepers" FORCE ROW LEVEL SECURITY;
CREATE POLICY shopkeepers_self ON "shopkeepers"
    USING (id = app_shopkeeper_id())
    WITH CHECK (id = app_shopkeeper_id());

ALTER TABLE "distributors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "distributors" FORCE ROW LEVEL SECURITY;
CREATE POLICY distributors_select ON "distributors" FOR SELECT
    USING (app_shopkeeper_id() IS NOT NULL OR id = app_distributor_id());
CREATE POLICY distributors_write ON "distributors"
    USING (id = app_distributor_id())
    WITH CHECK (id = app_distributor_id());

ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" FORCE ROW LEVEL SECURITY;
CREATE POLICY products_select ON "products" FOR SELECT
    USING (app_shopkeeper_id() IS NOT NULL OR distributor_id = app_distributor_id());
CREATE POLICY products_insert ON "products" FOR INSERT
    WITH CHECK (distributor_id = app_distributor_id());
CREATE POLICY products_update ON "products" FOR UPDATE
    USING (distributor_id = app_distributor_id())
    WITH CHECK (distributor_id = app_distributor_id());
CREATE POLICY products_delete ON "products" FOR DELETE
    USING (distributor_id = app_distributor_id());

ALTER TABLE "carts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "carts" FORCE ROW LEVEL SECURITY;
CREATE POLICY carts_tenant ON "carts"
    USING (shopkeeper_id = app_shopkeeper_id())
    WITH CHECK (shopkeeper_id = app_shopkeeper_id());

ALTER TABLE "cart_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cart_items" FORCE ROW LEVEL SECURITY;
CREATE POLICY cart_items_tenant ON "cart_items"
    USING (EXISTS (
        SELECT 1 FROM "carts" c
        WHERE c.id = "cart_items"."cart_id" AND c.shopkeeper_id = app_shopkeeper_id()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM "carts" c
        WHERE c.id = "cart_items"."cart_id" AND c.shopkeeper_id = app_shopkeeper_id()
    ));

ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders" FORCE ROW LEVEL SECURITY;
CREATE POLICY orders_tenant ON "orders"
    USING (shopkeeper_id = app_shopkeeper_id() OR distributor_id = app_distributor_id())
    WITH CHECK (shopkeeper_id = app_shopkeeper_id() OR distributor_id = app_distributor_id());

ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_items" FORCE ROW LEVEL SECURITY;
CREATE POLICY order_items_tenant ON "order_items"
    USING (EXISTS (
        SELECT 1 FROM "orders" o
        WHERE o.id = "order_items"."order_id"
          AND (o.shopkeeper_id = app_shopkeeper_id() OR o.distributor_id = app_distributor_id())
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM "orders" o
        WHERE o.id = "order_items"."order_id"
          AND (o.shopkeeper_id = app_shopkeeper_id() OR o.distributor_id = app_distributor_id())
    ));

ALTER TABLE "delivery_capacity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "delivery_capacity" FORCE ROW LEVEL SECURITY;
CREATE POLICY delivery_capacity_select ON "delivery_capacity" FOR SELECT
    USING (app_shopkeeper_id() IS NOT NULL OR distributor_id = app_distributor_id());
CREATE POLICY delivery_capacity_insert ON "delivery_capacity" FOR INSERT
    WITH CHECK (distributor_id = app_distributor_id());
CREATE POLICY delivery_capacity_update ON "delivery_capacity" FOR UPDATE
    USING (distributor_id = app_distributor_id())
    WITH CHECK (distributor_id = app_distributor_id());
CREATE POLICY delivery_capacity_delete ON "delivery_capacity" FOR DELETE
    USING (distributor_id = app_distributor_id());

ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" FORCE ROW LEVEL SECURITY;
CREATE POLICY payments_tenant ON "payments"
    USING (EXISTS (
        SELECT 1 FROM "orders" o
        WHERE o.id = "payments"."order_id"
          AND (o.shopkeeper_id = app_shopkeeper_id() OR o.distributor_id = app_distributor_id())
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM "orders" o
        WHERE o.id = "payments"."order_id"
          AND (o.shopkeeper_id = app_shopkeeper_id() OR o.distributor_id = app_distributor_id())
    ));

ALTER TABLE "order_idempotency" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_idempotency" FORCE ROW LEVEL SECURITY;
CREATE POLICY order_idempotency_tenant ON "order_idempotency"
    USING (shopkeeper_id = app_shopkeeper_id())
    WITH CHECK (shopkeeper_id = app_shopkeeper_id());

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'vproject_app') THEN
        CREATE ROLE vproject_app LOGIN PASSWORD 'vproject_app' NOSUPERUSER NOBYPASSRLS;
    END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO vproject_app;
GRANT USAGE ON TYPE "Availability" TO vproject_app;
GRANT USAGE ON TYPE "OrderStatus" TO vproject_app;
GRANT USAGE ON TYPE "PaymentStatus" TO vproject_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO vproject_app;
GRANT EXECUTE ON FUNCTION app_shopkeeper_id() TO vproject_app;
GRANT EXECUTE ON FUNCTION app_distributor_id() TO vproject_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO vproject_app;
