# Contract → code mapping

Locked product rules mapped to schema, SQL, and API handlers. No extra product decisions.

## Tenancy and auth

| Rule | Code |
| --- | --- |
| Real multi-tenancy on one Postgres DB | `prisma/migrations/20260914100000_init/migration.sql` + `20260914120000_tighten_catalog_rls` (RLS + `FORCE ROW LEVEL SECURITY`) |
| Every sensitive query filters by `distributor_id` and/or `shopkeeper_id` | `src/tenant.ts` (`SET LOCAL app.shopkeeper_id` / `app.distributor_id`); service `where` clauses |
| `shopkeeper_id` only from auth token | `src/auth.ts`, `src/middleware/auth.ts` |
| Client `shopkeeper_id` in body/query → 401 | `src/middleware/rejectClientShopkeeper.ts` |
| App role cannot bypass RLS | migration creates `vproject_app` `NOBYPASSRLS`; `DATABASE_URL` vs `DATABASE_ADMIN_URL` |
| Before a cart distributor is selected, shopkeepers may list distributors only | `distributors_select` allows authenticated shopkeepers; `products` / `delivery_capacity` SELECT require selected cart or session `app.distributor_id` |
| After selection, catalog + capacity only for that `distributor_id` | `products_select` / `delivery_capacity_select` (cart.distributor_id or `app.distributor_id`); `GET /delivery-capacity` compares query to cart (`DISTRIBUTOR_MISMATCH` if they differ) |

## Cart = one distributor

| Rule | Code |
| --- | --- |
| `distributor_id` locked on cart | `Cart.distributorId`; `src/services/cartService.ts` `addItem` |
| Reject items outside `cart.distributor_id` | `POST /cart/items` → `DISTRIBUTOR_LOCKED` |
| One active cart per shopkeeper | `UNIQUE (shopkeeper_id)` on `carts` |
| Cart is server-side SoT for Home/Cart/Checkout | `GET /cart`, `PATCH /cart` |
| Clear cart is separate destructive DELETE | `DELETE /cart` only — there is no `DELETE /cart/items`. Switch does not clear. |

## Cases / stock / MOQ

| Rule | Code |
| --- | --- |
| Sales only in cases | `cart_items.qty` / `order_items.qty` integers; `CASES_ONLY` if not an integer ≥ 1 |
| Stock as `stock_in_cases` | `products.stock_in_cases`; order decrements this column under `FOR UPDATE` |
| `units_per_case` display-only | Stored and returned; never used in price, stock, MOQ, or totals |
| `min_order_qty` independent (min cases) | `MOQ_NOT_MET` on add/patch/place for **available** items only |

## Switch distributor

| Rule | Code |
| --- | --- |
| Atomic transaction | `src/services/cartService.ts` `switchDistributor` inside `withTenant` tx |
| Match **only** by barcode | `src/services/productMatch.ts` |
| Null, empty-string, or whitespace-only barcode → unavailable | `productMatch.ts` (`usableBarcode` trims; blank after trim is treated as null) |
| Duplicate barcode in new distributor → unavailable | `productMatch.ts` (`matches.length !== 1`) |
| Unmatched → unavailable | `productMatch.ts` |
| Recalculate prices from DB | matched item `unitPrice = product.pricePerCase` |
| After match, same availability as GET/PATCH (`stock_in_cases`, new `min_order_qty`) | `cartService.refreshAvailability` after switch |
| Unique barcode per distributor | `UNIQUE (distributor_id, barcode) WHERE barcode IS NOT NULL` |

## Prices

| Rule | Code |
| --- | --- |
| Final price always server-side from DB | `src/services/orderService.ts` totals from locked product rows |
| Never trust client price/total | `src/clientPrice.ts` → `CLIENT_PRICE_REJECTED` |
| DB price ≠ cart snapshot | `PRICE_CHANGED` |
| Unavailable excluded from totals/MOQ but still block order | `UNAVAILABLE_ITEMS`; totals/MOQ skip unavailable lines |

## Delivery

| Rule | Code |
| --- | --- |
| Dates Gregorian ISO 8601 in DB | `DATE` columns; API `YYYY-MM-DD` |
| Shamsi display-only | not stored |
| Capacity `(distributor_id, date, slots_remaining)` | `delivery_capacity` |
| Empty capacity exact Persian message | `src/constants.ts` `CAPACITY_UNAVAILABLE_MESSAGE`; `GET /delivery-capacity` and `POST /orders` only when capacity is empty/zero for the cart distributor |
| Query `distributor_id` ≠ selected cart distributor | `GET /delivery-capacity` → `DISTRIBUTOR_MISMATCH` (not the Persian capacity message) |
| Row locks on stock and slots | `SELECT ... FOR UPDATE` in `orderService.ts` |

## Idempotency

| Rule | Code |
| --- | --- |
| `Idempotency-Key` store | `order_idempotency` |
| Same key + body → original order | hash compare, return stored `order_id` |
| Same key + different body → 409 `IDEMPOTENCY_KEY_REUSE` | `orderService.ts` |
| Race safety | `pg_advisory_xact_lock` on shopkeeper+key |

## Endpoints

| Method | Path | Handler |
| --- | --- | --- |
| GET | `/cart` | `src/routes/cart.ts` |
| PATCH | `/cart` | `src/routes/cart.ts` |
| POST | `/cart/items` | `src/routes/cart.ts` |
| POST | `/cart/switch-distributor` | `src/routes/cart.ts` |
| DELETE | `/cart` | clear cart (`src/routes/cart.ts`) — not `/cart/items` |
| GET | `/delivery-capacity` | `src/routes/deliveryCapacity.ts` |
| POST | `/orders` | `src/routes/orders.ts` |
