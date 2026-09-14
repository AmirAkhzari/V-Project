# Digikala Jet / Supermarket — UI/UX Rebuild Specification
**For: Figma Make Agent**
**Prepared by: Product Design (reverse-engineered from 10 mobile screenshots)**
**Platform:** Mobile Web (Safari-in-app), RTL, Persian (Farsi) language
**Domains observed:** `digikalajet.com` (onboarding/checkout-setup surface) → `digikala.com` (core marketplace/hypermarket surface)

---

## 0. How to use this file
Build screens in the exact order listed under "Screen Specs." Each screen includes: purpose, layout (top→bottom), components, exact copy (Farsi + English gloss), states, and interaction notes. Global tokens and shared components are defined once in Section 1–2 and referenced by name afterward.

**⚠️ Single unified theme — orange only.** The source screenshots were captured across two live surfaces (`digikalajet.com`, orange, screens 1–7, and `digikala.com`, green, screens 8–10), but this is **not** a two-theme product. The final design system uses **one theme: the digikalajet orange system** end-to-end. The green "Hypermarket" screens (Cart, Orders, Home — Screens 8–10) are **reference content only**: rebuild their layout, structure, and copy exactly as captured, but **re-skin every green element to the orange system** (Section 1.2 `brand.orange.primary` / `brand.orange.tint`). Do not carry the green palette, green icons, or green badges into the final build anywhere. There is no theme switch to implement — remove any "theme variable" concept and hardcode the orange system as the only brand color across all 10 screens.

---

## 1. Global Design Tokens

### 1.1 Layout
- Base frame: **375×812** (iPhone-class), scrollable single-column, full-bleed edge-to-edge content, **16px** horizontal page margin.
- Direction: **RTL**. All text right-aligned by default; icons that imply direction (back/forward chevrons, arrows) are mirrored for RTL (the "continue/next" arrow points **left**, matching RTL flow).
- Status bar: mock native status bar at top (time left, signal/LTE/battery right) — only needed if simulating an in-browser mobile view; otherwise omit for a native app build.
- Bottom browser chrome (back/forward/reload/tab/share icons + URL pill) appears in screenshots because captures are from mobile Safari — **do not rebuild this**, it's OS chrome, not app UI.

### 1.2 Color Tokens

**This is the only color system used across all 10 screens.** Every reference elsewhere in this document to "green" (Screens 8–10, ported from the `digikala.com` hypermarket reference) must be substituted with the orange equivalents below at build time.

| Token | Hex (approx) | Usage |
|---|---|---|
| `brand.orange.primary` | `#F97316` / `#FA6D18` | **All** primary CTAs, active tab icon + label, active states, links-as-buttons, discount badges, "+" add-to-cart buttons, active segmented-control fill (or `text.primary` dark fill per Screen 9 spec) — used everywhere the reference screenshots show orange (1–7) **and** everywhere they show green (8–10) |
| `brand.orange.tint` | `#FDECD8` | Banner/callout background (invite-friends card), light accent fills, eco-tag pill background (replacing green eco-tag) |
| `brand.orange.badge` | `#FB8A2E` | Discount % badge fill on product cards (replaces `brand.green.badge`), quick-add "+" button outline/fill on Home carousel |
| `accent.red.deal` | `#D91E2A` | Deals/percent-off promo banner background (unchanged — this red banner already appears correctly on the Home screenshot and should be kept as-is) |
| `text.primary` | `#1A1A1A` | Headlines, body |
| `text.secondary` | `#8A8A8A` / `#9B9B9B` | Placeholder text, helper captions |
| `text.link` | `#2AA9E0` | Inline links (e.g., "قوانین و شرایط", "ویرایش شماره") |
| `error.red` | `#E5342E` | Field validation error text ("لطفا این قسمت را خالی نگذارید") |
| `surface.white` | `#FFFFFF` | Cards, inputs, sheets |
| `surface.grayLight` | `#F5F5F5` / `#FAFAFA` | Page background, disabled input fill |
| `border.default` | `#E3E3E3` | Input borders, dividers |
| `border.focus` | `#26B4E0` | Focused input border (cyan-blue, seen on address search field) |
| `overlay.scrim` | `#000000` @ 40% | Bottom-sheet / map-picker backdrop |

### 1.3 Typography
- Font family: Persian geometric sans (e.g., **IRANSans / Yekan Bakh / Vazirmatn**-equivalent). Numerals rendered in **Farsi/Eastern Arabic digits** (۰۱۲۳...) throughout — replicate this, don't use Western digits in Farsi copy.
- Scale:
  - H1 / Page hero title: 28–32px, bold — e.g., "جستجوی آدرس", "تایید شماره"
  - H2 / Section title: 20–22px, bold — e.g., "جزئیات آدرس"
  - Body / Input label: 15–16px, regular–medium
  - Caption / Helper: 13px, regular, `text.secondary`
  - Button label: 16px, bold, centered

### 1.4 Shape & Elevation
- Buttons & inputs: **12–14px** corner radius, full-width within page margin.
- Primary CTA button: solid fill (brand color), 52–56px height, bold centered white label, no border.
- Bottom sheets / modals: rounded **top corners only** (20px), slide up from bottom, scrim behind.
- Cards (promo, product): 12px radius, subtle 1px border or soft shadow, white fill.
- Dividers: 1px solid `border.default`, full-bleed or inset to text.

### 1.5 Iconography
- Line-style icons, ~24px, `text.primary` or brand color when active.
- Bottom tab icons: person (profile), shopping bag (cart), receipt/list (orders), house (home).
- Illustration style: soft 3D/clay-render emoji-like icons used for empty states and promos (shopping cart 🛒-style render, grocery basket render, megaphone+gift render) — flat vector alternative acceptable if 3D asset unavailable.

### 1.6 Spacing Scale
`4 / 8 / 12 / 16 / 20 / 24 / 32 / 48px` — use 16px as the standard page gutter and 24px as the standard vertical rhythm between major blocks.

---

## 2. Shared Global Components

### 2.1 Bottom Tab Bar (persists on Profile, Cart, Orders, Home)
Fixed to bottom, white background, 1px top border, safe-area padding.

RTL visual order (right → left, matching reading direction): **خانه (Home)** far right → **سفارش‌ها (Orders)** → **سبد خرید (Cart)** → **پروفایل (Profile)** far left.
*(Confirm against screenshots: left-to-right pixel order in captures is Profile, Cart, Orders, Home — build in that literal LTR pixel order since the whole bar is a fixed component row, then let RTL text/icoccupy naturally.)*

Each tab: icon (24px) + label (11–12px) stacked vertically.
- Active tab: icon + label colored `brand.orange.primary` (applies on **every** screen — Profile, Cart, Orders, and Home all use the orange active-state, replacing the green active-state seen on the Cart/Orders/Home reference screenshots); inactive: `text.secondary`/black outline.
- Icons: پروفایل = person-circle outline · سبد خرید = shopping bag outline · سفارش‌ها = receipt/list outline · خانه = house outline.

### 2.2 Top Header Pattern
Two variants seen:
- **Minimal header:** small forward-pointing arrow icon top-right (functions as "back" in RTL) with no title, large H1 title starts ~24px below it (used on Login, OTP, Address Search, Address Details).
- **Titled header:** arrow icon top-right + inline page title next to it, e.g. "جزئیات آدرس ←" (used on Address Details confirmation, Cart, Orders).

### 2.3 Text Input Field
- Full-width, 52–56px height, 1–1.5px border (`border.default`, or `border.focus` cyan when active/focused), 12px radius, 16px inner padding, placeholder in `text.secondary` italic-style example text (e.g. "مثلا 09123456789").
- Required-field marker: red asterisk `*` before/after the label depending on RTL flow.
- Inline validation message appears directly below field in `error.red`, small text, no icon.

### 2.4 Primary Button
Full-bleed within margins, solid brand color, white bold label, 52–56px height, 12–14px radius, centered text, no icon (except where noted).

### 2.5 Bottom Sheet
Slides up over a dimmed/grayed backdrop of the page beneath it. Rounded top corners, drag/close affordance optional, header row with title + "+ افزودن آدرس" (Add address) secondary action top-left, search input below header, then a scrollable list of selectable rows (radio-style, selected item shows filled orange circle on the right).

### 2.6 Empty State Pattern
Centered vertically in content area: 3D illustration (~180px) + bold single-line message below it, no CTA button shown in captured states (cart/orders empty states are purely informational). Keep generous top whitespace (~350–400px before illustration) so illustration sits roughly at vertical-center-upper-third.

### 2.7 Product / Promo Card (Horizontal Carousel)
Used in Home "شگفت‌انگیز" (Amazing Deals) rail: white card, 12px radius, top-left discount badge (**orange** pill — `brand.orange.badge`, replacing the green badge seen in the reference screenshot — % value + "تجزیه‌پذیر" eco tag optional, eco tag pill uses `brand.orange.tint` background), product image centered, floating circular "+" add-to-cart button (**orange** outline — `brand.orange.primary`, replacing the green outline in the reference, bottom-right of image), price block below (current price bold + strikethrough original price in gray, currency unit "تومان" as small superscript-style glyph next to number).

---

## 3. Screen Specs

---

### Screen 1 — Phone Number Entry (Login)
**Shell:** Jet (orange) · **Domain:** digikalajet.com

**Layout (top→bottom):**
1. Header: forward arrow icon, top-right, no title.
2. Brand wordmark "**سوپرمارکت**" (Supermarket) — large, bold, orange, custom rounded display lettering, centered, ~64px tall, generous top margin (~120px from header).
3. Label: "لطفا شماره موبایل خود را وارد کنید *" (Please enter your mobile number) — bold, right-aligned.
4. Phone input field (see 2.3) — placeholder "مثلا 09123456789".
5. Inline validation text (red, shown by default/on error in this capture): "لطفا این قسمت را خالی نگذارید" (Please don't leave this field empty).
6. Secondary prompt block: "عضو **دیجی‌کالا** هستید؟" (Are you a Digikala member?) — "دیجی‌کالا" in red, bold, rest black regular.
7. Helper line below: "با شماره موبایل دیجی‌کالایتان وارد شوید تا آدرس‌هایتان را ببینید." (Sign in with your Digikala mobile number to see your addresses.) — gray, smaller.
8. Primary button: "ادامه" (Continue) — full-width orange.
9. Footnote: "با زدن دکمه ادامه **قوانین و شرایط** را می‌پذیرم." (By clicking Continue I accept the **Terms & Conditions**) — "قوانین و شرایط" as blue link, rest gray, centered.

**States:** default / field-empty-error (shown).
**Notes:** No app-level navbar on this screen — it's a standalone auth screen.

---

### Screen 2 — OTP / Verify Number
**Shell:** Jet (orange)

**Layout:**
1. Header: forward arrow, top-right.
2. H1: "تایید شماره" (Verify number) — bold, large.
3. Body line: "کد تایید برای شماره موبایل **09143662051** ارسال شد،" (A verification code was sent to mobile number 09143662051,) — phone number bold/black, rest regular gray-black.
4. Link: "ویرایش شماره" (Edit number) — blue, small, left-aligned under the line above.
5. Label: "کد پیامک شده را وارد کنید *" (Enter the SMS code) — bold.
6. **OTP input:** single wide bordered field styled as 5 segments separated by dashes (placeholder shows "‑ ‑ ‑ ‑ ‑"), i.e. a 5-digit code entry, RTL digit order.
7. Countdown helper text, centered: "119 ثانیه مانده تا دریافت کد جدید" (119 seconds left to request a new code) — gray, centered, live countdown timer ticking down.
8. Primary button: "تایید شماره موبایل" (Confirm mobile number) — full-width orange, appears in a **disabled/lighter tint state** until code fully entered (button renders lighter orange in capture — treat as disabled style).

**Interaction:** Countdown drives a "resend code" affordance once it hits 0 (not shown but standard pattern — implement countdown expiring into a clickable "ارسال مجدد کد" link).

---

### Screen 3 — Select Delivery Address (Bottom Sheet, entry point)
**Shell:** Jet (orange) · overlays a Home-like backdrop

**Background (dimmed/grayed):** Home page skeleton — top red percent-off banner ("تا ۹۰٪ تخفیف موجود است! ...فرصت محدود"), "ارسال به خانه ▾" location selector with pin icon, search bar "جستجو در سوپرمارکت 🔍", grayed-out product grid placeholders below.

**Bottom Sheet (foreground):**
1. Sheet header row: "+ افزودن آدرس" (Add address) link top-left · "انتخاب آدرس تحویل" (Select delivery address) title top-right, bold.
2. Search input: "جستجوی آدرس، محله یا خیابان 🔍" (Search address, neighborhood, or street) placeholder, full width, light gray fill, rounded.
3. List row: label "**خانه**" (Home) bold + full address text below in gray, truncated with ellipsis (e.g. "ولیعصر جنوبی، بل ملکی تبریزی، خ. باختر، خ. ۱۸ متری شمالی پر...") · **selected-state indicator**: orange ring/filled circle radio on the far right of the row.
4. Divider line under the row.
5. Bottom info strip (from backdrop, partially visible): "ارسال به خانه ▾" repeated near sheet's bottom edge — ignore, it's backdrop bleed-through.

---

### Screen 4 — Address Search (Full Screen)
**Shell:** Jet (orange)

**Layout:**
1. Header: forward arrow, top-right.
2. H1: "جستجوی آدرس" (Address search) — bold, large.
3. Search input, **focused state** (cyan/blue border), pre-filled with typed query "تهران" (Tehran), search icon left-inside, clear "×" icon right-inside.
4. Results list, each row: back-chevron "‹" icon far-left of row (RTL: points toward opening/drill-in), **bold** primary match text right-aligned (e.g. "تهران"), gray secondary descriptor below it (e.g. "شهر تهران، تهران"), location-pin icon far-right, divider between rows.
   - Row 1: تهران / شهر تهران، تهران
   - Row 2: استان تهران / استان تهران
   - Row 3: شهرستان تهران / شهرستان تهران

**Interaction:** Live-filter list as user types; tapping a row proceeds to map pin placement (Screen 5).

---

### Screen 5 — Pin Location on Map
**Shell:** Jet (orange)

**Layout:**
1. Modal-style full-screen map view, dimmed gray strip at very top (status bar area) then header row: "×" close icon top-left, "انتخاب از روی نقشه" (Choose from map) title, forward arrow top-right (global header still present).
2. Search-on-map input pinned below header: "جستجوی آدرس، محله یا خیابان 🔍".
3. Interactive map fills remaining space (light gray/white cartographic style, minimal color, labeled streets/POIs in Farsi, hospital/hotel/university icons as small colored markers).
4. **Fixed center-pin**: a single black pin marker anchored to the exact screen-center, stays centered while the map pans underneath it (standard "drag map, not pin" UX pattern).
5. Transient tooltip bubble above the pin: "نقشه را حرکت دهید!" (Move the map!) — dark rounded tooltip, dismisses after first interaction or a timeout.
6. Floating circular "locate me" button bottom-right (crosshair/GPS icon) above the CTA.
7. Bottom sticky bar: orange full-width bar reading "‹ تایید موقعیت مکانی: خ. فردوسی" (Confirm location: Ferdowsi St.) — chevron + street-name update live based on pin position, entire bar is tappable as the primary CTA.

---

### Screen 6 — Address Details Form
**Shell:** Jet (orange)

**Layout:**
1. Header bar (gray-tinted band, slightly different from pure white — matches map preview color): "جزئیات آدرس ←" (Address details) title + trailing arrow.
2. Static map preview thumbnail (non-interactive), same pin styling as Screen 5, ~230px tall, full-bleed width.
3. Overlaid on the map thumbnail: centered pill button "ویرایش موقعیت مکانی" (Edit location) — orange, floats over the lower-third of the map image.
4. Label + textarea: "آدرس کامل *" (Full address) — multi-line text field, pre-filled/editable, bordered box, e.g. "خ. فردوسی، بعد از خ. تقوی، خ. گل پرور".
5. Two side-by-side inputs on one row: **left = "واحد" (Unit)** placeholder, **right = "پلاک *" (Plaque/No.)** required — remember RTL: the *required* field (پلاک) sits visually on the right, "واحد" on the left, each roughly half-width with a gutter between.
6. Label + input: "عنوان آدرس" (Address title) — optional, placeholder "عنوان دلخواه شما" (Your custom title).
7. Two pill/tag toggle buttons side by side below that input: "🏠 خانه" (Home) and "🏢 محل کار" (Work) — selectable tags to categorize the address, outlined style, unselected by default.
8. Primary button, bottom: "ثبت آدرس" (Save address) — full-width orange.

---

### Screen 7 — Profile Page
**Shell:** Jet (orange) · has bottom tab bar (Profile tab active)

**Layout:**
1. Profile header card (white, rounded, sits in a light-gray page background): "ویرایش ✎" edit link top-left · user full name top-right bold large (e.g. "امیررضا اخضری") · phone number below name, gray, right-aligned (e.g. "09143662051").
2. Promo banner card inside same white block: light-orange tint background, megaphone+gift 3D illustration left, headline right "دوستاتو دعوت کن" (Invite your friends) bold, sub-headline below "۱۲۰ هزار تومان هدیه بگیر!" (Get 120,000 Toman as a gift!) larger/bolder, CTA pill button below: "‹ دعوت از دوستان" (Invite friends).
3. Carousel dots indicator below banner (2 dots, first inactive-small, second active-elongated pill) — implies a swipeable card stack (only 1 of N visible).
4. List row (own white card): "پیام‌ها" (Messages) label right-aligned + "?" circular help icon left, divider below.
5. Row: "افزایش موجودی +" (Top up) — orange pill/link on far-left, paired inline with "کیف پول: 0 تومان" (Wallet: 0 Toman) label+value right-aligned, wallet icon far-right edge.
6. New white card block containing a plain vertical list, each row = label (right) + icon (left), divider between each:
   - "سفارش‌ ها" (Orders) — receipt icon
   - "آدرس‌ها" (Addresses) — pin icon
   - "کدهای تخفیف" (Discount codes) — percent-badge icon
   - "کارت‌های هدیه" (Gift cards) — gift icon
   - "تماس با پشتیبانی" (Contact support) — headset icon
7. Bottom tab bar, "پروفایل" tab active (colored).

---

### Screen 8 — Cart (Empty State)
**Theme:** Orange (unified system) · **Reference source:** digikala.com (green) — re-skin to orange

**Layout:**
1. Header: forward arrow top-right + "سبد خرید" (Cart) title inline.
2. Bottom tab bar visible, "سبد خرید" tab active — colored **orange** (`brand.orange.primary`), not green as in the reference screenshot.
3. Empty-state block, vertically centered-upper: 3D shopping-cart illustration (~200px) with sparkle accents, message below, bold, single line: "سبد خرید شما خالی است" (Your cart is empty). Illustration can keep neutral/metallic cart rendering as-is (it's not brand-colored in the reference) — no green elements to swap here besides the active tab icon.
4. No CTA button present in this state — purely informational per capture.

---

### Screen 9 — Orders (Empty State)
**Theme:** Orange (unified system) · **Reference source:** digikala.com (green) — re-skin to orange

**Layout:**
1. Header: forward arrow top-right + "سفارش‌ها" (Orders) title inline.
2. **Segmented control / pill tabs**, right-aligned row of 3: "جاری" (Current — active/filled dark pill, keep as neutral dark-gray/black fill per reference — this control is not brand-colored, no change needed), "تحویل شده" (Delivered — outline pill), "لغو شده" (Cancelled — outline pill). Active tab has solid dark-gray fill + white/black bold text; inactive tabs are outline-only with gray text.
3. Divider under tab row.
4. Empty-state block: 3D grocery-basket illustration (~200px, basket with bread+jar+grapes — illustration itself can stay as multi-color 3D render, it's not a brand-color element), message below: "هنوز سفارشی ثبت نکردی!" (You haven't placed an order yet!).
5. Bottom tab bar, "سفارش‌ها" tab active — colored **orange** (`brand.orange.primary`), not green as in the reference screenshot.

---

### Screen 10 — Home / Catalog
**Theme:** Orange (unified system) · **Reference source:** digikala.com (green) — re-skin to orange

**Layout (top→bottom):**
1. Location selector row: chevron-down "▾" + "ارسال به تست" (Deliver to "Test" — the address nickname) + location-pin icon, left-right split, top of page.
2. Utility icon row: circular **orange** (`brand.orange.primary`, replacing green) calendar/schedule icon button (left-most) + a secondary small utility icon next to it (clock/recent icon) — likely "scheduled delivery" and "order history/reorder" shortcuts.
3. Search bar: pill-shaped, light-gray fill, magnifier icon far-right (RTL), placeholder text "جستجو در **سوپرمارکت** 🔍" (Search in Supermarket) with brand name in bold **orange** (replacing green, and using the "سوپرمارکت" brand name from Screen 1 instead of "هایپرمارکت دیجی‌کالا" to stay consistent with the unified product).
4. Full-bleed **hero promo banner**, red gradient background (unchanged, keep as-is — this is a distinct deal-callout color, not the brand color), "%" motif graphics + product renders (oil bottle, spaghetti, canned tomato) on the left, right-aligned text block: "تخفیف تا ۴۰٪" (Up to 40% off) bold large, "قیمت قدیم خرید کن" (Buy at old prices) subhead, "انواع محصولات سوپرمارکتی" (All kinds of supermarket products) caption, white pill button "خرید" (Shop) bottom-right of text block. A thin vertical accent bar at the extreme left edge of the banner — render this in `brand.orange.primary` (replacing the blue/green accent seen in the reference).
5. **"شگفت‌انگیز 🎁%" (Amazing Deals)** section: **orange** (`brand.orange.primary`) rounded-top container header — replacing the green container in the reference — with "‹ همه" (All / see-all, top-left) and section title with gift+percent emoji (top-right, bold white on orange).
6. Horizontal scrollable product-card carousel (see component 2.7, already specified in orange) inside the orange container, 3 cards partially visible:
   - Card: % badge, product image, price w/ strikethrough, title (e.g. "سفره یکبار مصرف مدل حریر رو...").
   - Card: "۵۲٪" badge (orange), "KLASSNO" coffee creamer box image, price "286,559 تومان" struck "598,000", title "کافی کریمر کلاسنو بسته 50 عددی".
   - Card: "۷۰٪" badge (orange) + **orange-tint** "تجزیه‌پذیر" (biodegradable) eco-tag pill (replacing green eco-tag), trash-bag product image, price "167,700 تومان" struck "559,000", title "کیسه زباله 3 رول کوالا - 54 عدد".
   - Each card has a circular **orange** outline "+" quick-add button overlapping the bottom-right corner of the product image (replacing green outline).
7. Bottom tab bar, "خانه" tab active — colored **orange** (`brand.orange.primary`), not green as in the reference screenshot.

---

## 4. End-to-End User Flow (as evidenced by screenshots)

```
[Screen 1] Enter phone number
      ↓ (tap "ادامه")
[Screen 2] Enter OTP → auto/manual confirm
      ↓
[Screen 3] Address bottom-sheet appears over Home (pick saved "خانه" or add new)
      ↓ (tap "+ افزودن آدرس")
[Screen 4] Search address text (e.g. "تهران")
      ↓ (select a result)
[Screen 5] Fine-tune exact pin location on map → confirm street
      ↓ (tap confirm bar)
[Screen 6] Fill in full address details (unit, plaque, title, home/work tag)
      ↓ (tap "ثبت آدرس")
   → Address saved, returns user to shopping context
[Screen 7] Profile tab — view account, wallet, orders, addresses, support
[Screen 8] Cart tab — currently empty
[Screen 9] Orders tab — currently no orders, 3-way status filter available
[Screen 10] Home tab — main hypermarket catalog, promos, deals carousel
```

**Key UX principle to preserve:** address collection is a **linear guided flow** (search → map-pin refine → structured detail form) rather than a single free-text field — this is the core "get-it-right" moment for a grocery-delivery app and should not be collapsed or simplified.

**Visual continuity note:** the user should experience **one consistent brand** across this entire flow — the orange system from Screens 1–7 carries through, unchanged, into Screens 8–10. There is no visible "hand-off" to a different colored app; the green appearance in the original Cart/Orders/Home screenshots is a reference-capture artifact only, not part of the intended design.

---

## 5. Cross-Screen Consistency Rules for the Agent

1. **RTL first:** build every screen mirrored — text right-aligned, "back/next" chevrons pointing left for forward-progress, right for drill-down/back navigation, radio/selection indicators on the trailing (right) edge of list rows.
2. **One theme only — orange:** do not implement a theme switch or carry any green token into the build. Every screen (1–10) uses the single `brand.orange.*` token set from Section 1.2. Screens 8–10 are reconstructed from a green reference but must render entirely in orange, per Section 3's per-screen notes.
3. **Farsi numerals** everywhere numbers appear in Farsi copy (prices, countdown, percentages, phone numbers as shown in-context).
4. **Currency formatting:** "تومان" unit rendered as a small stacked/superscript glyph immediately after the number, thousands-separated (e.g. `۲۸۶,۵۵۹ تومان`), with original price shown struck-through in gray directly below or beside the discounted price.
5. **Empty states are illustration + one-line message only** — no buttons, no secondary text, generous vertical whitespace above.
6. **Primary buttons are always full-width, solid, 52–56px tall, bold centered label** — never ghost/outline for primary actions; secondary actions use pill-outline or plain text links instead.
7. **Bottom sheets dim the background** (don't fully hide it) so context is preserved during address selection.

---

## 6. Copy Glossary (Farsi → English) for content population

| Farsi | English |
|---|---|
| سوپرمارکت | Supermarket |
| لطفا شماره موبایل خود را وارد کنید | Please enter your mobile number |
| ادامه | Continue |
| عضو دیجی‌کالا هستید؟ | Are you a Digikala member? |
| قوانین و شرایط | Terms & Conditions |
| تایید شماره | Verify number |
| کد پیامک شده را وارد کنید | Enter the SMS code |
| ثانیه مانده تا دریافت کد جدید | seconds left to request a new code |
| تایید شماره موبایل | Confirm mobile number |
| انتخاب آدرس تحویل | Select delivery address |
| افزودن آدرس | Add address |
| جستجوی آدرس | Search address |
| انتخاب از روی نقشه | Choose from map |
| نقشه را حرکت دهید | Move the map |
| تایید موقعیت مکانی | Confirm location |
| جزئیات آدرس | Address details |
| آدرس کامل | Full address |
| واحد | Unit |
| پلاک | Plaque / house number |
| عنوان آدرس | Address title |
| خانه | Home |
| محل کار | Work |
| ثبت آدرس | Save address |
| ویرایش | Edit |
| دوستاتو دعوت کن | Invite your friends |
| هزار تومان هدیه بگیر | Get [N] thousand Toman as a gift |
| دعوت از دوستان | Invite friends |
| پیام‌ها | Messages |
| کیف پول | Wallet |
| افزایش موجودی | Top up balance |
| سفارش‌ها | Orders |
| آدرس‌ها | Addresses |
| کدهای تخفیف | Discount codes |
| کارت‌های هدیه | Gift cards |
| تماس با پشتیبانی | Contact support |
| سبد خرید | Cart |
| سبد خرید شما خالی است | Your cart is empty |
| جاری / تحویل شده / لغو شده | Current / Delivered / Cancelled |
| هنوز سفارشی ثبت نکردی | You haven't placed an order yet |
| ارسال به | Deliver to |
| جستجو در هایپرمارکت دیجی‌کالا | Search in Digikala Hypermarket |
| تخفیف تا ۴۰٪ | Up to 40% off |
| قیمت قدیم خرید کن | Buy at the old price |
| خرید | Shop / Buy |
| شگفت‌انگیز | Amazing deals |
| همه | See all / All |
| تجزیه‌پذیر | Biodegradable |
| پروفایل / سبد خرید / سفارش‌ها / خانه | Profile / Cart / Orders / Home |

---

## 7. Deliverable Checklist for Figma Make

- [ ] Design tokens set up (Section 1) as Figma variables/styles — **orange only**, no theme switch, no green tokens carried over from the reference screenshots.
- [ ] Global components built once, reused: bottom tab bar, header (2 variants), text input, primary button, bottom sheet, empty state, product card.
- [ ] 10 screens assembled per Section 3, RTL, using Farsi numerals and the copy glossary (Section 6).
- [ ] Prototype links wired per the flow in Section 4 (phone → OTP → address sheet → search → map → details → back into app; tab bar linking Profile/Cart/Orders/Home).
- [ ] Validation/disabled/countdown states included on Screens 1 and 2.
- [ ] Discount badge, eco-tag, and strikethrough-price patterns implemented on the product carousel (Screen 10).
