import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Typography scale (used as inline constants for consistency)
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  brand:   { fontSize: 36, fontWeight: 900, letterSpacing: -1 },
  h1:      { fontSize: 26, fontWeight: 800 },
  h2:      { fontSize: 18, fontWeight: 700 },
  h3:      { fontSize: 16, fontWeight: 700 },
  body:    { fontSize: 15, fontWeight: 400 },
  bodyMd:  { fontSize: 15, fontWeight: 600 },
  caption: { fontSize: 13, fontWeight: 400 },
  label:   { fontSize: 13, fontWeight: 600 },
  micro:   { fontSize: 11, fontWeight: 500 },
  btn:     { fontSize: 16, fontWeight: 700 },
  tabLbl:  { fontSize: 10, fontWeight: 600 },
};
const FF = "'Vazirmatn', sans-serif";

// ─────────────────────────────────────────────────────────────────────────────
// SVG Icon Library — all vectors, no emojis
// ─────────────────────────────────────────────────────────────────────────────
const Ic = {
  ChevronLeft: ({ size = 20, color = "currentColor" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: ({ size = 20, color = "currentColor" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  ChevronDown: ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Search: ({ size = 18, color = "#8A8A8A" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  X: ({ size = 18, color = "currentColor" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  MapPin: ({ size = 20, color = "currentColor" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Home: ({ active }: { active: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#fff" : "none"} stroke={active ? "#fff" : "#9B9B9B"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  ShoppingBag: ({ active }: { active: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9B9B9B"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Receipt: ({ active }: { active: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9B9B9B"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v16l-3-2-2 2-2-2-2 2-2-2-3 2V4z" />
      <line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="15" y2="13" />
    </svg>
  ),
  Person: ({ active }: { active: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9B9B9B"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Crosshair: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C3F6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  ),
  Wallet: ({ color = "#9B9B9B" }: { color?: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
      <path d="M16 12h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a2 2 0 0 1 0-4z" />
    </svg>
  ),
  Headset: ({ color = "#9B9B9B" }: { color?: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  Gift: ({ color = "#9B9B9B", size = 20 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <path d="M12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  ),
  Tag: ({ color = "#9B9B9B" }: { color?: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  MessageCircle: ({ color = "#9B9B9B" }: { color?: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Calendar: ({ color = "white" }: { color?: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: ({ color = "white" }: { color?: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Pencil: ({ color = "#2AA9E0" }: { color?: string }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Building: ({ color = "#1C3F6E" }: { color?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 22V12h6v10M3 9h18M9 3v3M15 3v3" />
    </svg>
  ),
  Store: ({ color = "#1C3F6E" }: { color?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1-4h16l1 4"/><path d="M3 9a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2"/>
      <path d="M5 11v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/><line x1="10" y1="15" x2="10" y2="20"/><line x1="14" y1="15" x2="14" y2="20"/>
    </svg>
  ),
  Warehouse: ({ color = "#1C3F6E" }: { color?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 9V20a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9"/><path d="M1 4l11-3 11 3v5H1z"/>
      <rect x="8" y="14" width="8" height="7"/>
    </svg>
  ),
  Branch: ({ color = "#1C3F6E" }: { color?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  HomeSmall: ({ color = "#1C3F6E" }: { color?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Megaphone: ({ color = "#1C3F6E" }: { color?: string }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  ),
  Star: ({ color = "#1C3F6E", size = 16 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Sparkle: ({ color = "#fff", size = 16 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l2.4 7.6H22l-6.2 4.8 2.4 7.6L12 17.2l-6.2 4.8 2.4-7.6L2 9.6h7.6z" />
    </svg>
  ),
  Plus: ({ size = 20, color = "#1C3F6E" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Info: ({ color = "#9B9B9B" }: { color?: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Phone: ({ color = "#9B9B9B", size = 20 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  CheckCircle: ({ color = "#1C3F6E", size = 20 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  ShoppingCart: ({ color = "#D0D0D0", size = 80 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect x="10" y="10" width="80" height="60" rx="8" fill="#F5F5F5" stroke={color} strokeWidth="3" />
      <path d="M25 35 L30 55 L70 55 L75 35 Z" fill={color} />
      <circle cx="38" cy="65" r="6" fill={color} />
      <circle cx="62" cy="65" r="6" fill={color} />
      <path d="M25 35 L20 20" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M15 15 L10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  Basket: ({ color = "#D0D0D0", size = 80 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M15 45 L85 45 L78 80 H22 Z" fill="#F5F5F5" stroke={color} strokeWidth="3" strokeLinejoin="round" />
      <path d="M10 45 H90" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M35 45 L40 20" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M65 45 L60 20" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="50" cy="44" rx="25" ry="6" fill={color} opacity="0.2" />
      <rect x="38" y="55" width="8" height="15" rx="2" fill={color} />
      <rect x="52" y="55" width="8" height="15" rx="2" fill={color} />
    </svg>
  ),
  SearchEmpty: ({ size = 72 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="42" cy="42" r="28" fill="#F5F5F5" stroke="#E3E3E3" strokeWidth="4" />
      <line x1="62" y1="62" x2="85" y2="85" stroke="#E3E3E3" strokeWidth="5" strokeLinecap="round" />
      <line x1="34" y1="42" x2="50" y2="42" stroke="#C8C8C8" strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="34" x2="42" y2="50" stroke="#C8C8C8" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared Layout
// ─────────────────────────────────────────────────────────────────────────────
const MobileShell = ({ children, bg = "#F5F5F5" }: { children: React.ReactNode; bg?: string }) => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)", padding: "24px 0", direction: "ltr" }}>
    <div style={{ width: 375, minHeight: 812, background: bg, borderRadius: 44, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)", position: "relative", display: "flex", flexDirection: "column", fontFamily: FF, direction: "rtl" }}>
      {/* Status bar — always LTR (time left, battery right) */}
      <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 0 24px", background: bg, flexShrink: 0, direction: "ltr" }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>۹:۴۱</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="3" width="3" height="9" rx="1" fill="#1A1A1A" opacity="0.3" /><rect x="4.5" y="2" width="3" height="10" rx="1" fill="#1A1A1A" opacity="0.5" /><rect x="9" y="0" width="3" height="12" rx="1" fill="#1A1A1A" opacity="0.8" /><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#1A1A1A" /></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="#1A1A1A"><path d="M8 1C4.5 1 1.5 2.8 0 5.5l1.5 1.5C2.7 4.8 5.2 3.5 8 3.5S13.3 4.8 14.5 7L16 5.5C14.5 2.8 11.5 1 8 1zm0 3c-2.2 0-4.1 1-5.4 2.6L4 8c1-1.2 2.4-2 4-2s3 .8 4 2l1.4-1.4C12.1 5 10.2 4 8 4zm0 3c-1.1 0-2.1.5-2.8 1.2L8 11l2.8-2.8C10.1 7.5 9.1 7 8 7z" /></svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#1A1A1A" strokeOpacity="0.35" /><rect x="2" y="2" width="16" height="8" rx="2" fill="#1A1A1A" /><path d="M23 4.5v3a1.5 1.5 0 0 0 0-3z" fill="#1A1A1A" fillOpacity="0.4" /></svg>
        </div>
      </div>
      {children}
    </div>
  </div>
);

const BackHeader = ({ onBack, title }: { onBack: () => void; title?: string }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px 4px" }}>
    {/* In RTL: back button is on the right, chevron points right (→) = "go back" */}
    <div style={{ width: 36 }} />
    <span style={{ ...T.h3, color: "#1A1A1A", fontFamily: FF }}>{title || ""}</span>
    <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F5F5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Ic.ChevronRight size={20} color="#1A1A1A" />
    </button>
  </div>
);

const BottomTabBar = ({ active, onTab }: { active: "home" | "cart" | "orders" | "profile"; onTab: (t: "home" | "cart" | "orders" | "profile") => void }) => {
  const tabs = [
    { key: "profile" as const, label: "پروفایل", Icon: Ic.Person },
    { key: "cart" as const, label: "سبد خرید", Icon: Ic.ShoppingBag },
    { key: "orders" as const, label: "سفارش‌ها", Icon: Ic.Receipt },
    { key: "home" as const, label: "خانه", Icon: Ic.Home },
  ];
  return (
    <div style={{ background: "#fff", borderTop: "1px solid #EBEBEB", display: "flex", direction: "ltr", flexShrink: 0, paddingBottom: 8 }}>
      {tabs.map(({ key, label, Icon }) => (
        <button key={key} onClick={() => onTab(key)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0 6px", background: "none", border: "none", cursor: "pointer", gap: 3 }}>
          <div style={{ padding: "4px 12px", borderRadius: 20, background: active === key ? "#1C3F6E" : "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "background 0.15s" }}>
            <Icon active={active === key} />
            <span style={{ ...T.tabLbl, color: active === key ? "#fff" : "#9B9B9B", fontFamily: FF }}>{label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

// Input with focus state
const FormInput = ({
  value, onChange, placeholder, type = "text", height = 52,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; height?: number;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ width: "100%", height, border: `1.5px solid ${focused ? "#1C3F6E" : "#E3E3E3"}`, borderRadius: 12, padding: "0 16px 0 40px", fontSize: 15, direction: "ltr", textAlign: "right", background: focused ? "#fff" : "#FAFAFA", fontFamily: FF, outline: "none", color: "#1A1A1A", transition: "border-color 0.2s, background 0.2s" }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Brand wordmark
// ─────────────────────────────────────────────────────────────────────────────
const VisitorLogo = ({ size = "lg" }: { size?: "sm" | "lg" }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size === "lg" ? 10 : 6 }}>
    <div style={{ width: size === "lg" ? 10 : 7, height: size === "lg" ? 10 : 7, borderRadius: "50%", background: "#1C3F6E" }} />
    <span style={{ fontSize: size === "lg" ? 34 : 20, fontWeight: 900, color: "#1A1A1A", letterSpacing: -1, fontFamily: FF }}>ویزیتور</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Screen 1 — Phone Login
// ─────────────────────────────────────────────────────────────────────────────
function Screen1({ onNext, onDemo }: { onNext: () => void; onDemo: () => void }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);

  const handleContinue = () => {
    if (!phone.trim()) { setError(true); return; }
    setError(false); onNext();
  };

  return (
    <MobileShell bg="#fff">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 20px 32px" }}>

        {/* Brand header */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40, marginBottom: 48 }}>
          <VisitorLogo />
        </div>

        {/* Tagline */}
        <div style={{ marginBottom: 32, textAlign: "right" }}>
          <h1 style={{ ...T.h1, color: "#1A1A1A", fontFamily: FF, marginBottom: 6 }}>ورود به حساب</h1>
          <p style={{ ...T.caption, color: "#9B9B9B", fontFamily: FF, lineHeight: 1.7 }}>شماره موبایل خود را وارد کنید</p>
        </div>

        {/* Phone field */}
        <div style={{ marginBottom: 8 }}>
          <label style={{ ...T.label, color: "#1A1A1A", fontFamily: FF, display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
            <span style={{ color: "#E5342E" }}>*</span> شماره موبایل
          </label>
          <div style={{ position: "relative" }}>
            <FormInput
              value={phone} onChange={v => { setPhone(v); setError(false); }}
              placeholder="مثلا ۰۹۱۲۳۴۵۶۷۸۹" type="tel"
            />
            <div style={{ position: "absolute", top: "50%", left: 14, transform: "translateY(-50%)" }}>
              <Ic.Phone color={phone ? "#1C3F6E" : "#C8C8C8"} size={18} />
            </div>
          </div>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#E5342E"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
              <span style={{ ...T.caption, color: "#E5342E", fontFamily: FF }}>لطفا این قسمت را خالی نگذارید</span>
            </div>
          )}
        </div>

        {/* Member hint */}
        <div style={{ background: "#FAFAFA", borderRadius: 14, padding: "14px 16px", marginTop: 8, borderRight: "3px solid #1C3F6E" }}>
          <div style={{ ...T.bodyMd, color: "#1A1A1A", fontFamily: FF, marginBottom: 4 }}>
            عضو <span style={{ color: "#1C3F6E" }}>ویزیتور</span> هستید؟
          </div>
          <div style={{ ...T.caption, color: "#9B9B9B", fontFamily: FF, lineHeight: 1.7 }}>
            با شماره موبایل ویزیتورتان وارد شوید تا آدرس‌هایتان را ببینید.
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={handleContinue}
          style={{ width: "100%", height: 54, background: "#1C3F6E", border: "none", borderRadius: 14, color: "#fff", ...T.btn, fontFamily: FF, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "opacity 0.15s" }}
          onMouseDown={e => (e.currentTarget.style.opacity = "0.88")}
          onMouseUp={e => (e.currentTarget.style.opacity = "1")}
        >
          ادامه
          <Ic.ChevronLeft size={18} color="#fff" />
        </button>

        <button onClick={onDemo} style={{ width: "100%", height: 50, marginTop: 10, background: "transparent", border: "1.5px solid #1C3F6E", borderRadius: 14, color: "#1C3F6E", ...T.btn, fontFamily: FF, cursor: "pointer" }}>
          ورود آزمایشی
        </button>

        <div style={{ textAlign: "center", marginTop: 14, ...T.caption, color: "#9B9B9B", fontFamily: FF }}>
          با زدن ادامه <span style={{ color: "#2AA9E0", fontWeight: 600, cursor: "pointer" }}>قوانین و شرایط</span> را می‌پذیرم.
        </div>
      </div>
    </MobileShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 2 — OTP
// ─────────────────────────────────────────────────────────────────────────────
function Screen2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [digits, setDigits] = useState(["", "", "", "", ""]);
  const [seconds, setSeconds] = useState(119);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const toFarsi = (n: number) => n.toString().replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[+d]);
  const filled = digits.every(d => d !== "");

  // Normalise Persian/Arabic-Indic digits → ASCII
  const toAsciiDigit = (s: string) =>
    s.replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 0x06F0))
     .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660));

  const handleDigit = (i: number, val: string) => {
    const normalised = toAsciiDigit(val);
    // Handle paste: if multiple digits received, distribute across cells
    const digits_only = normalised.replace(/\D/g, "");
    if (digits_only.length > 1) {
      const next = ["", "", "", "", ""];
      digits_only.slice(0, 5).split("").forEach((ch, idx) => { next[idx] = ch; });
      setDigits(next);
      const lastFilled = Math.min(digits_only.length - 1, 4);
      inputRefs.current[lastFilled]?.focus();
      return;
    }
    const v = digits_only.slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 4) inputRefs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
      const next = [...digits]; next[i - 1] = ""; setDigits(next);
    }
  };

  return (
    <MobileShell bg="#fff">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 20px 32px" }}>
        <button onClick={onBack} style={{ alignSelf: "flex-end", width: 36, height: 36, borderRadius: "50%", background: "#F5F5F5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ic.ChevronRight size={20} color="#1A1A1A" />
        </button>

        <div style={{ marginTop: 24, marginBottom: 32 }}>
          <Ic.CheckCircle size={40} color="#1C3F6E" />
          <h1 style={{ ...T.h1, color: "#1A1A1A", fontFamily: FF, marginTop: 16, marginBottom: 8 }}>تایید شماره</h1>
          <p style={{ ...T.body, color: "#4A4A4A", fontFamily: FF, lineHeight: 1.8 }}>
            کد تایید به <span style={{ fontWeight: 700, color: "#1A1A1A" }}>۰۹۱۴۳۶۶۲۰۵۱</span> ارسال شد
          </p>
          <button style={{ ...T.caption, color: "#2AA9E0", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: FF, padding: 0, marginTop: 4 }}>
            ویرایش شماره
          </button>
        </div>

        <label style={{ ...T.label, color: "#1A1A1A", fontFamily: FF, marginBottom: 12, display: "block" }}>
          <span style={{ color: "#E5342E" }}>*</span> کد پیامک شده را وارد کنید
        </label>

        {/* 5-cell OTP input — always LTR for digit order */}
        <div style={{ display: "flex", gap: 10, direction: "ltr", justifyContent: "center", marginBottom: 24 }}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              value={d} maxLength={1} inputMode="numeric"
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKey(i, e)}
              style={{ width: 52, height: 60, border: `2px solid ${d ? "#1C3F6E" : "#E3E3E3"}`, borderRadius: 12, fontSize: 24, fontWeight: 700, textAlign: "center", fontFamily: FF, outline: "none", background: d ? "#EBF2FF" : "#FAFAFA", color: "#1A1A1A", transition: "all 0.15s" }}
            />
          ))}
        </div>

        {/* Countdown */}
        <div style={{ textAlign: "center", ...T.caption, color: "#9B9B9B", fontFamily: FF }}>
          {canResend
            ? <button style={{ color: "#1C3F6E", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: FF, fontSize: 14 }}>ارسال مجدد کد</button>
            : <span>{toFarsi(seconds)} ثانیه تا دریافت کد جدید</span>
          }
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={filled ? onNext : undefined}
          disabled={!filled}
          style={{ width: "100%", height: 54, background: filled ? "#1C3F6E" : "#F5F5F5", border: "none", borderRadius: 14, color: filled ? "#fff" : "#C0C0C0", ...T.btn, fontFamily: FF, cursor: filled ? "pointer" : "default", transition: "all 0.2s" }}
        >
          تایید شماره موبایل
        </button>
      </div>
    </MobileShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 3 — Address Bottom Sheet
// ─────────────────────────────────────────────────────────────────────────────
function Screen3({ onAddNew, onSelect }: { onAddNew: () => void; onSelect: () => void }) {
  return (
    <MobileShell bg="#F5F5F5">
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Dimmed backdrop */}
        <div style={{ padding: "12px 20px 0", opacity: 0.35, pointerEvents: "none" }}>
          <div style={{ background: "#D91E2A", borderRadius: 12, padding: "12px 16px", color: "#fff", ...T.bodyMd, fontFamily: FF, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <Ic.Sparkle color="#fff" size={14} />
            تا ۹۰٪ تخفیف موجود است — فرصت محدود
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <Ic.MapPin size={16} color="#1C3F6E" />
            <span style={{ ...T.bodyMd, fontFamily: FF }}>ارسال به خانه</span>
            <Ic.ChevronDown size={14} />
          </div>
          <div style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <Ic.Search size={16} color="#C0C0C0" />
            <span style={{ ...T.body, color: "#C0C0C0", fontFamily: FF }}>جستجو در انبار</span>
          </div>
          {[0, 1].map(i => (
            <div key={i} style={{ display: "flex", gap: 12, marginTop: 14 }}>
              {[0, 1].map(j => <div key={j} style={{ flex: 1, height: 110, background: "#E8E8E8", borderRadius: 14 }} />)}
            </div>
          ))}
        </div>

        {/* Scrim */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />

        {/* Bottom Sheet */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "24px 24px 0 0", direction: "rtl" }}>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 8 }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E3E3E3" }} />
          </div>

          <div style={{ padding: "0 20px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <button onClick={onAddNew} style={{ display: "flex", alignItems: "center", gap: 6, color: "#1C3F6E", ...T.label, fontFamily: FF, background: "none", border: "none", cursor: "pointer" }}>
                <Ic.Plus size={16} color="#1C3F6E" />
                افزودن آدرس
              </button>
              <span style={{ ...T.h3, color: "#1A1A1A", fontFamily: FF }}>انتخاب آدرس مغازه</span>
            </div>

            <div style={{ background: "#F5F5F5", borderRadius: 12, padding: "11px 14px", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Ic.Search size={16} color="#9B9B9B" />
              <span style={{ ...T.body, color: "#9B9B9B", fontFamily: FF }}>جستجوی آدرس، محله یا خیابان</span>
            </div>

            <button onClick={onSelect} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 0", background: "none", border: "none", cursor: "pointer", textAlign: "right", borderBottom: "1px solid #F0F0F0" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2.5px solid #1C3F6E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#1C3F6E" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...T.bodyMd, color: "#1A1A1A", fontFamily: FF }}>خانه</div>
                <div style={{ ...T.caption, color: "#9B9B9B", fontFamily: FF, marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 260 }}>
                  ولیعصر جنوبی، بل ملکی تبریزی، خ. باختر، خ. ۱۸ متری شمالی...
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// City search data & helpers
// ─────────────────────────────────────────────────────────────────────────────
const CITIES = [
  { main: "تهران", sub: "شهر تهران، استان تهران" },
  { main: "استان تهران", sub: "استان تهران" },
  { main: "تبریز", sub: "شهر تبریز، استان آذربایجان شرقی" },
  { main: "اصفهان", sub: "شهر اصفهان، استان اصفهان" },
  { main: "شیراز", sub: "شهر شیراز، استان فارس" },
  { main: "کرج", sub: "شهر کرج، استان البرز" },
  { main: "مشهد", sub: "شهر مشهد، استان خراسان رضوی" },
  { main: "اهواز", sub: "شهر اهواز، استان خوزستان" },
  { main: "قم", sub: "شهر قم، استان قم" },
  { main: "کرمانشاه", sub: "شهر کرمانشاه، استان کرمانشاه" },
  { main: "ارومیه", sub: "شهر ارومیه، استان آذربایجان غربی" },
  { main: "رشت", sub: "شهر رشت، استان گیلان" },
  { main: "زاهدان", sub: "شهر زاهدان، استان سیستان و بلوچستان" },
  { main: "همدان", sub: "شهر همدان، استان همدان" },
  { main: "کرمان", sub: "شهر کرمان، استان کرمان" },
  { main: "یزد", sub: "شهر یزد، استان یزد" },
  { main: "اردبیل", sub: "شهر اردبیل، استان اردبیل" },
  { main: "بندرعباس", sub: "شهر بندرعباس، استان هرمزگان" },
  { main: "سنندج", sub: "شهر سنندج، استان کردستان" },
  { main: "خرم‌آباد", sub: "شهر خرم‌آباد، استان لرستان" },
  { main: "گرگان", sub: "شهر گرگان، استان گلستان" },
  { main: "ساری", sub: "شهر ساری، استان مازندران" },
  { main: "بوشهر", sub: "شهر بوشهر، استان بوشهر" },
  { main: "قزوین", sub: "شهر قزوین، استان قزوین" },
  { main: "زنجان", sub: "شهر زنجان، استان زنجان" },
  { main: "سمنان", sub: "شهر سمنان، استان سمنان" },
  { main: "ایلام", sub: "شهر ایلام، استان ایلام" },
  { main: "شهرکرد", sub: "شهر شهرکرد، استان چهارمحال و بختیاری" },
  { main: "بجنورد", sub: "شهر بجنورد، استان خراسان شمالی" },
  { main: "بیرجند", sub: "شهر بیرجند، استان خراسان جنوبی" },
  { main: "خوی", sub: "شهر خوی، استان آذربایجان غربی" },
  { main: "مراغه", sub: "شهر مراغه، استان آذربایجان شرقی" },
  { main: "آمل", sub: "شهر آمل، استان مازندران" },
  { main: "بابل", sub: "شهر بابل، استان مازندران" },
  { main: "قائم‌شهر", sub: "شهر قائم‌شهر، استان مازندران" },
  { main: "آبادان", sub: "شهر آبادان، استان خوزستان" },
  { main: "دزفول", sub: "شهر دزفول، استان خوزستان" },
  { main: "سبزوار", sub: "شهر سبزوار، استان خراسان رضوی" },
  { main: "نیشابور", sub: "شهر نیشابور، استان خراسان رضوی" },
  { main: "کاشان", sub: "شهر کاشان، استان اصفهان" },
  { main: "خمینی‌شهر", sub: "شهر خمینی‌شهر، استان اصفهان" },
  { main: "نجف‌آباد", sub: "شهر نجف‌آباد، استان اصفهان" },
  { main: "شاهین‌شهر", sub: "شهر شاهین‌شهر، استان اصفهان" },
  { main: "لار", sub: "شهر لار، استان فارس" },
  { main: "جهرم", sub: "شهر جهرم، استان فارس" },
  { main: "مرودشت", sub: "شهر مرودشت، استان فارس" },
  { main: "اسلامشهر", sub: "شهر اسلامشهر، استان تهران" },
  { main: "ورامین", sub: "شهر ورامین، استان تهران" },
  { main: "پاکدشت", sub: "شهر پاکدشت، استان تهران" },
  { main: "شهریار", sub: "شهر شهریار، استان تهران" },
];

function norm(s: string) {
  return s.replace(/[‌‍‎‏]/g, "").replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/آ/g, "ا").replace(/أ|إ/g, "ا").toLowerCase();
}

function scoreCity(city: string, q: string): number {
  const cn = norm(city), qn = norm(q);
  if (!qn) return 0;
  if (cn === qn) return 100;
  if (cn.startsWith(qn)) return 90;
  if (cn.includes(qn)) return 70;
  let ci = 0, qi = 0;
  while (ci < cn.length && qi < qn.length) { if (cn[ci] === qn[qi]) qi++; ci++; }
  if (qi === qn.length) return Math.round(50 * (qn.length / cn.length));
  return 0;
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = norm(text).indexOf(norm(query));
  if (idx !== -1) return (
    <>{text.slice(0, idx)}<span style={{ color: "#1C3F6E", fontWeight: 800 }}>{text.slice(idx, idx + query.length)}</span>{text.slice(idx + query.length)}</>
  );
  return <>{text}</>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 4 — Address Search
// ─────────────────────────────────────────────────────────────────────────────
function Screen4({ onBack, onSelect }: { onBack: () => void; onSelect: (city: string) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = query.trim()
    ? CITIES.map(c => ({ ...c, s: Math.max(scoreCity(c.main, query), scoreCity(c.sub, query) * 0.6) }))
        .filter(c => c.s > 0).sort((a, b) => b.s - a.s).slice(0, 8)
    : [];

  return (
    <MobileShell bg="#fff">
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <BackHeader onBack={onBack} />

        <div style={{ padding: "12px 20px 0" }}>
          <h1 style={{ ...T.h1, color: "#1A1A1A", fontFamily: FF, marginBottom: 18 }}>جستجوی آدرس</h1>

          <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${focused || query ? "#1C3F6E" : "#E3E3E3"}`, borderRadius: 14, padding: "0 14px", height: 52, background: focused || query ? "#fff" : "#FAFAFA", gap: 10, transition: "all 0.2s" }}>
            <Ic.Search size={18} color={focused || query ? "#1C3F6E" : "#9B9B9B"} />
            <input
              ref={inputRef} value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              placeholder="نام شهر، محله یا خیابان..."
              style={{ flex: 1, border: "none", outline: "none", ...T.body, direction: "rtl", fontFamily: FF, background: "transparent", color: "#1A1A1A" }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 2 }}>
                <Ic.X size={16} color="#9B9B9B" />
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", marginTop: 8 }}>
          {!query && (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <Ic.SearchEmpty size={72} />
              <div style={{ ...T.caption, color: "#9B9B9B", fontFamily: FF, lineHeight: 1.9, marginTop: 16 }}>
                برای مثال <span style={{ color: "#1C3F6E", fontWeight: 700 }}>«ته»</span> را تایپ کنید<br />تا <span style={{ fontWeight: 700, color: "#1A1A1A" }}>تهران</span> پیشنهاد داده شود
              </div>
            </div>
          )}

          {query && results.length === 0 && (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <Ic.SearchEmpty size={64} />
              <div style={{ ...T.body, color: "#9B9B9B", fontFamily: FF, marginTop: 16 }}>نتیجه‌ای برای «{query}» یافت نشد</div>
            </div>
          )}

          {results.map((r, i) => (
            <button key={i} onClick={() => onSelect(r.main)}
              style={{ width: "100%", display: "flex", alignItems: "center", padding: "14px 20px", background: "none", border: "none", borderBottom: "1px solid #F5F5F5", cursor: "pointer", gap: 14, textAlign: "right" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#FFF7F2")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EBF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Ic.MapPin size={18} color="#1C3F6E" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...T.bodyMd, color: "#1A1A1A", fontFamily: FF }}>
                  <Highlight text={r.main} query={query} />
                </div>
                <div style={{ ...T.caption, color: "#9B9B9B", fontFamily: FF, marginTop: 3 }}>
                  <Highlight text={r.sub} query={query} />
                </div>
              </div>
              <Ic.ChevronLeft size={16} color="#C8C8C8" />
            </button>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 5 — Map Pin
// ─────────────────────────────────────────────────────────────────────────────
function Screen5({ onBack, onConfirm }: { onBack: () => void; onConfirm: () => void }) {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => { const t = setTimeout(() => setShowTooltip(false), 3500); return () => clearTimeout(t); }, []);

  return (
    <MobileShell bg="#E8E8E0">
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Map SVG */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <rect width="375" height="812" fill="#EEF0E8" />
          <rect width="375" height="812" fill="url(#grid)" />
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E4E6DC" strokeWidth="0.5" />
            </pattern>
          </defs>
          {/* Blocks */}
          {[[28,95,55,70],[95,85,80,75],[188,78,95,80],[28,195,50,70],[95,290,75,55],[185,285,90,60],[288,185,65,60],[30,370,80,50],[130,365,70,45]].map(([x,y,w,h],i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx={4} fill="#E0DDD6" stroke="#D4D1CA" strokeWidth="0.5" />
          ))}
          {/* Roads */}
          <rect x="0" y="178" width="375" height="10" fill="#FFF9EE" />
          <rect x="0" y="278" width="375" height="10" fill="#FFF9EE" />
          <rect x="78" y="0" width="10" height="812" fill="#FFF9EE" />
          <rect x="178" y="0" width="10" height="812" fill="#FFF9EE" />
          <rect x="288" y="0" width="10" height="812" fill="#FFF9EE" />
          {/* Road labels */}
          <text x="180" y="174" fontSize="9" fill="#B0AA9F" fontFamily="Vazirmatn, sans-serif" textAnchor="middle">خ. فردوسی</text>
          <text x="180" y="274" fontSize="9" fill="#B0AA9F" fontFamily="Vazirmatn, sans-serif" textAnchor="middle">خ. باختر</text>
          <text x="83" y="150" fontSize="9" fill="#B0AA9F" fontFamily="Vazirmatn, sans-serif" writing-mode="tb">خ. تقوی</text>
          {/* POIs */}
          <circle cx="250" cy="145" r="7" fill="#4A90D9" opacity="0.65" />
          <text x="250" y="162" fontSize="8" fill="#4A90D9" fontFamily="Vazirmatn, sans-serif" textAnchor="middle">بیمارستان</text>
          <circle cx="130" cy="330" r="7" fill="#48A868" opacity="0.65" />
          <text x="130" y="347" fontSize="8" fill="#48A868" fontFamily="Vazirmatn, sans-serif" textAnchor="middle">پارک</text>
          <circle cx="310" cy="210" r="6" fill="#E07020" opacity="0.55" />
          <text x="310" y="226" fontSize="8" fill="#E07020" fontFamily="Vazirmatn, sans-serif" textAnchor="middle">بانک</text>
        </svg>

        {/* Header */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", padding: "8px 16px 12px", background: "linear-gradient(to bottom, rgba(255,255,255,0.96) 70%, transparent)", gap: 10 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "1px solid #E3E3E3", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic.ChevronRight size={20} color="#1A1A1A" />
          </button>
          <span style={{ ...T.h3, color: "#1A1A1A", fontFamily: FF, flex: 1, textAlign: "right" }}>انتخاب از روی نقشه</span>
        </div>

        {/* Search on map */}
        <div style={{ position: "relative", zIndex: 10, margin: "0 16px" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "11px 14px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}>
            <Ic.Search size={16} color="#9B9B9B" />
            <span style={{ ...T.body, color: "#9B9B9B", fontFamily: FF }}>جستجوی آدرس، محله یا خیابان</span>
          </div>
        </div>

        {/* Center pin */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -100%)", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {showTooltip && (
            <div style={{ background: "#1A1A1A", color: "#fff", ...T.label, fontFamily: FF, padding: "7px 14px", borderRadius: 20, marginBottom: 8, whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.25)" }}>
              نقشه را جابجا کنید
            </div>
          )}
          <svg width="32" height="44" viewBox="0 0 36 52" fill="none">
            <path d="M18 0C8.06 0 0 8.06 0 18C0 33 18 52 18 52C18 52 36 33 36 18C36 8.06 27.94 0 18 0Z" fill="#1C3F6E" />
            <circle cx="18" cy="18" r="8" fill="white" />
            <circle cx="18" cy="18" r="4" fill="#1C3F6E" />
          </svg>
          <div style={{ width: 12, height: 5, background: "rgba(0,0,0,0.15)", borderRadius: "50%", marginTop: -2 }} />
        </div>

        {/* Locate me */}
        <button style={{ position: "absolute", bottom: 88, left: 16, width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "1px solid #E3E3E3", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.12)", zIndex: 20 }}>
          <Ic.Crosshair />
        </button>

        {/* Confirm bar */}
        <button onClick={onConfirm} style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#1C3F6E", border: "none", color: "#fff", height: 72, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FF, zIndex: 20, flexDirection: "column" }}>
          <span style={{ ...T.btn, fontFamily: FF }}>تایید موقعیت مکانی</span>
          <span style={{ ...T.caption, color: "rgba(255,255,255,0.8)", fontFamily: FF, display: "flex", alignItems: "center", gap: 4 }}>
            <Ic.MapPin size={12} color="rgba(255,255,255,0.8)" />
            خ. فردوسی
          </span>
        </button>
      </div>
    </MobileShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 6 — Address Details
// ─────────────────────────────────────────────────────────────────────────────
function Screen6({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  const [fullAddr, setFullAddr] = useState("خ. فردوسی، بعد از خ. تقوی، خ. گل پرور");
  const [unit, setUnit] = useState("");
  const [plaque, setPlaque] = useState("");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState<"store" | "warehouse" | "branch" | null>(null);
  const [branchName, setBranchName] = useState("");

  const FocusInput = ({ value, onChange, placeholder, height = 50 }: { value: string; onChange: (v: string) => void; placeholder?: string; height?: number }) => {
    const [f, setF] = useState(false);
    return (
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ width: "100%", height, border: `1.5px solid ${f ? "#1C3F6E" : "#E3E3E3"}`, borderRadius: 12, padding: "0 14px", ...T.body, fontFamily: FF, outline: "none", marginTop: 6, direction: "rtl", background: f ? "#fff" : "#FAFAFA", transition: "all 0.2s" }} />
    );
  };

  return (
    <MobileShell bg="#F5F5F5">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ background: "#fff", padding: "8px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F0F0F0" }}>
          <div style={{ width: 36 }} />
          <span style={{ ...T.h3, color: "#1A1A1A", fontFamily: FF }}>جزئیات آدرس</span>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F5F5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic.ChevronRight size={20} color="#1A1A1A" />
          </button>
        </div>

        {/* Map thumbnail */}
        <div style={{ position: "relative", height: 190, background: "#EEF0E8", overflow: "hidden" }}>
          <svg width="375" height="190" viewBox="0 0 375 190">
            <rect width="375" height="190" fill="#EEF0E8" />
            {[[28,10,90,65],[140,5,100,75],[258,10,85,60],[28,100,70,65],[200,100,100,55]].map(([x,y,w,h],i) => (
              <rect key={i} x={x} y={y} width={w} height={h} rx={4} fill="#E0DDD6" stroke="#D4D1CA" strokeWidth="0.5" />
            ))}
            <rect x="0" y="88" width="375" height="10" fill="#FFF9EE" />
            <rect x="120" y="0" width="10" height="190" fill="#FFF9EE" />
            <text x="187" y="84" fontSize="9" fill="#B0AA9F" fontFamily="Vazirmatn" textAnchor="middle">خ. فردوسی</text>
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -100%)" }}>
            <svg width="24" height="34" viewBox="0 0 36 52" fill="none">
              <path d="M18 0C8.06 0 0 8.06 0 18C0 33 18 52 18 52C18 52 36 33 36 18C36 8.06 27.94 0 18 0Z" fill="#1C3F6E" />
              <circle cx="18" cy="18" r="8" fill="white" /><circle cx="18" cy="18" r="4" fill="#1C3F6E" />
            </svg>
          </div>
          <button style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(249,115,22,0.92)", border: "none", color: "#fff", ...T.label, fontFamily: FF, padding: "8px 18px", borderRadius: 30, cursor: "pointer", backdropFilter: "blur(4px)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
            <Ic.Pencil color="#fff" />
            ویرایش موقعیت مکانی
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: "16px 20px 32px" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px", marginBottom: 12 }}>
            <label style={{ ...T.label, color: "#1A1A1A", fontFamily: FF }}>
              آدرس کامل <span style={{ color: "#E5342E" }}>*</span>
            </label>
            <div style={{ position: "relative", marginTop: 8 }}>
              <textarea value={fullAddr} onChange={e => setFullAddr(e.target.value)}
                style={{ width: "100%", minHeight: 72, border: "1.5px solid #E3E3E3", borderRadius: 12, padding: "12px 14px", ...T.body, fontFamily: FF, outline: "none", resize: "none", direction: "rtl", background: "#FAFAFA" }} />
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ ...T.label, color: "#1A1A1A", fontFamily: FF }}>واحد</label>
                <FocusInput value={unit} onChange={setUnit} placeholder="واحد" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ ...T.label, color: "#1A1A1A", fontFamily: FF }}>پلاک <span style={{ color: "#E5342E" }}>*</span></label>
                <FocusInput value={plaque} onChange={setPlaque} placeholder="پلاک" />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ ...T.label, color: "#1A1A1A", fontFamily: FF }}>عنوان آدرس</label>
              <FocusInput value={title} onChange={setTitle} placeholder="عنوان دلخواه شما (اختیاری)" />
            </div>
          </div>

          {/* Tags */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 20 }}>
            <label style={{ ...T.label, color: "#9B9B9B", fontFamily: FF, display: "block", marginBottom: 10 }}>نوع آدرس</label>
            <div style={{ display: "flex", gap: 8 }}>
              {([
                { key: "store" as const, label: "فروشگاه اصلی", Icon: Ic.Store },
                { key: "warehouse" as const, label: "انبار", Icon: Ic.Warehouse },
                { key: "branch" as const, label: "شعبه", Icon: Ic.Branch },
              ] as { key: "store" | "warehouse" | "branch"; label: string; Icon: (p: { color?: string }) => React.ReactElement }[]).map(({ key, label, Icon }) => (
                <button key={key} onClick={() => setTag(tag === key ? null : key)}
                  style={{ flex: 1, height: 52, border: `2px solid ${tag === key ? "#1C3F6E" : "#E3E3E3"}`, borderRadius: 12, background: tag === key ? "#EBF2FF" : "#FAFAFA", color: tag === key ? "#1C3F6E" : "#4A4A4A", ...T.caption, fontFamily: FF, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, transition: "all 0.2s" }}>
                  <Icon color={tag === key ? "#1C3F6E" : "#9B9B9B"} />
                  {label}
                </button>
              ))}
            </div>
            {tag === "branch" && (
              <div style={{ marginTop: 12 }}>
                <input
                  value={branchName}
                  onChange={e => setBranchName(e.target.value)}
                  placeholder="نام شعبه را وارد کنید"
                  style={{ width: "100%", height: 46, border: "1.5px solid #E3E3E3", borderRadius: 10, padding: "0 14px", ...T.bodyMd, fontFamily: FF, color: "#1A1A1A", outline: "none", boxSizing: "border-box", direction: "rtl" }}
                />
              </div>
            )}
          </div>

          <button onClick={onSave} style={{ width: "100%", height: 54, background: "#1C3F6E", border: "none", borderRadius: 14, color: "#fff", ...T.btn, fontFamily: FF, cursor: "pointer" }}>
            ثبت آدرس
          </button>
        </div>
      </div>
    </MobileShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 7 — Profile
// ─────────────────────────────────────────────────────────────────────────────
type WalletTransaction = { id: string; amount: number; createdAt: string; status: "success" | "failed" };

function Screen7({ onTab, walletBalance, transactions, toast, onTopUp }: {
  onTab: (t: "home" | "cart" | "orders" | "profile") => void;
  walletBalance: number;
  transactions: WalletTransaction[];
  toast?: string;
  onTopUp: () => void;
}) {
  const menuItems = [
    { label: "سفارش‌ها", Icon: Ic.Receipt },
    { label: "آدرس‌ها", Icon: () => <Ic.MapPin size={20} color="#9B9B9B" /> },
    { label: "کدهای تخفیف", Icon: Ic.Tag },
    { label: "کارت‌های هدیه", Icon: Ic.Gift },
    { label: "تماس با پشتیبانی", Icon: Ic.Headset },
  ];

  return (
    <MobileShell bg="#F5F5F5">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", position: "relative" }}>
        {toast && (
          <div style={{ position: "absolute", top: 10, left: 20, right: 20, zIndex: 4, background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#15803D", borderRadius: 12, padding: "10px 14px", fontSize: 12, fontWeight: 700, fontFamily: FF, textAlign: "right" }}>{toast}</div>
        )}
        <div style={{ padding: "8px 20px 0" }}>

          {/* Profile card */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px", marginBottom: 12 }}>

            {/* RTL row: avatar+name on the RIGHT (start), edit button on the LEFT (end) */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              {/* LEFT end: edit button */}
              <button style={{ display: "flex", alignItems: "center", gap: 6, color: "#2AA9E0", ...T.label, fontFamily: FF, background: "none", border: "none", cursor: "pointer" }}>
                ویرایش
                <Ic.Pencil color="#2AA9E0" />
              </button>
              {/* RIGHT start: avatar then name (avatar is outermost = rightmost) */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #1C3F6E, #1C3F6E)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: FF }}>ا</span>
                </div>
                <div>
                  <div style={{ ...T.h2, color: "#1A1A1A", fontFamily: FF }}>امیررضا اخضری</div>
                  <div style={{ ...T.caption, color: "#9B9B9B", fontFamily: FF, marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                    ۰۹۱۴۳۶۶۲۰۵۱
                    <Ic.Phone color="#9B9B9B" size={12} />
                  </div>
                </div>
              </div>
            </div>

            {/* Invite banner — RTL: text on RIGHT (start), icon on LEFT (end) */}
            <div style={{ background: "linear-gradient(135deg, #EBF2FF 0%, #EBF2FF 100%)", borderRadius: 14, padding: "16px", display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              {/* RIGHT start: text block */}
              <div style={{ flex: 1 }}>
                <div style={{ ...T.caption, color: "#9B9B9B", fontFamily: FF }}>دوستاتو دعوت کن</div>
                <div style={{ ...T.h3, color: "#1C3F6E", fontFamily: FF, marginTop: 3 }}>۱۲۰ هزار تومان هدیه بگیر</div>
                <button style={{ marginTop: 10, background: "#1C3F6E", border: "none", color: "#fff", ...T.label, fontFamily: FF, padding: "7px 16px", borderRadius: 20, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  دعوت از دوستان
                  <Ic.ChevronLeft size={12} color="#fff" />
                </button>
              </div>
              {/* LEFT end: icon tile */}
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#1C3F6E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Ic.Megaphone color="#fff" />
              </div>
            </div>

            {/* Carousel dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E3E3E3" }} />
              <div style={{ width: 20, height: 6, borderRadius: 3, background: "#1C3F6E" }} />
            </div>
          </div>

          {/* Wallet + messages card */}
          <div style={{ background: "#fff", borderRadius: 20, marginBottom: 12, overflow: "hidden" }}>
            {/* Messages row — RTL: icon+label on RIGHT, info icon on LEFT */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid #F5F5F5" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* RIGHT start: icon tile + label */}
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ic.MessageCircle color="#9B9B9B" />
                </div>
                <span style={{ ...T.bodyMd, color: "#1A1A1A", fontFamily: FF }}>پیام‌ها</span>
              </div>
              {/* LEFT end: help icon */}
              <Ic.Info color="#C0C0C0" />
            </div>

            {/* Wallet row — RTL: wallet info on RIGHT, top-up button on LEFT */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}>
              {/* RIGHT start: wallet icon + label */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ic.Wallet />
                </div>
                <span style={{ ...T.body, color: "#1A1A1A", fontFamily: FF }}>کیف پول: <span style={{ fontWeight: 700 }}>{walletBalance.toLocaleString("fa-IR")} تومان</span></span>
              </div>
              {/* LEFT end: top-up button */}
              <button onClick={onTopUp} style={{ background: "#EBF2FF", border: "none", color: "#1C3F6E", ...T.label, fontFamily: FF, padding: "7px 14px", borderRadius: 20, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                افزایش اعتبار
                <Ic.Plus size={14} color="#1C3F6E" />
              </button>
            </div>
          </div>

          {transactions.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 20, marginBottom: 12, padding: "14px 18px" }}>
              <div style={{ ...T.h3, color: "#1A1A1A", fontFamily: FF, marginBottom: 10 }}>تاریخچه کیف پول</div>
              {transactions.slice(0, 3).map(tx => (
                <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderTop: "1px solid #F5F5F5" }}>
                  <span style={{ fontSize: 12, color: "#15803D", fontWeight: 700, fontFamily: FF }}>+{tx.amount.toLocaleString("fa-IR")} تومان</span>
                  <span style={{ fontSize: 11, color: "#9B9B9B", fontFamily: FF }}>{tx.createdAt} · موفق</span>
                </div>
              ))}
            </div>
          )}

          {/* Menu list — RTL: icon+label on RIGHT, chevron on LEFT */}
          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden" }}>
            {menuItems.map(({ label, Icon }, i) => (
              <div key={label}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 18px", borderBottom: i < menuItems.length - 1 ? "1px solid #F5F5F5" : "none", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FAFAFA")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                {/* RIGHT start: icon tile + label */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon active={false} />
                  </div>
                  <span style={{ ...T.bodyMd, color: "#1A1A1A", fontFamily: FF }}>{label}</span>
                </div>
                {/* LEFT end: drill-down chevron */}
                <Ic.ChevronLeft size={16} color="#C8C8C8" />
              </div>
            ))}
          </div>

          <div style={{ height: 16 }} />
        </div>
      </div>
      <BottomTabBar active="profile" onTab={onTab} />
    </MobileShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Wallet top-up flow
// ─────────────────────────────────────────────────────────────────────────────
function WalletTopUpScreen({ balance, onBack, onPay }: { balance: number; onBack: () => void; onPay: (amount: number) => void }) {
  const [amount, setAmount] = useState(50_000);
  const MIN = 10_000;
  const MAX = 10_000_000;
  const fmt = (n: number) => n.toLocaleString("fa-IR");
  const valid = Number.isFinite(amount) && amount >= MIN && amount <= MAX;
  const adjust = (delta: number) => setAmount(prev => Math.min(MAX, Math.max(MIN, prev + delta)));
  return (
    <MobileShell bg="#F5F5F5">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <BackHeader onBack={onBack} title="افزایش اعتبار کیف پول" />
        <div style={{ padding: "16px 20px 28px" }}>
          <div style={{ background: H.primary, borderRadius: 18, padding: "18px 20px", color: "#fff", marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: FF }}>موجودی فعلی</div>
            <div style={{ fontSize: 25, fontWeight: 900, fontFamily: FF, marginTop: 6 }}>{fmt(balance)} <span style={{ fontSize: 13, fontWeight: 500 }}>تومان</span></div>
          </div>
          <div style={{ ...T.h3, color: H.textPrimary, fontFamily: FF, marginBottom: 12 }}>مبلغ افزایش اعتبار</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 18 }}>
            {[50_000, 150_000, 300_000].map(p => (
              <button key={p} onClick={() => setAmount(p)} style={{ height: 48, borderRadius: 12, border: `1.5px solid ${amount === p ? H.primaryMid : H.border}`, background: amount === p ? H.primaryLight : "#fff", color: amount === p ? H.primaryMid : H.textSec, fontSize: 12, fontWeight: 700, fontFamily: FF, cursor: "pointer" }}>{fmt(p)} تومان</button>
            ))}
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: `1px solid ${H.border}`, marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: H.textSec, fontFamily: FF, marginBottom: 10 }}>مبلغ دلخواه</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", direction: "ltr" }}>
              <button onClick={() => adjust(-10_000)} aria-label="کاهش مبلغ" style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${H.border}`, background: H.bg, color: H.primaryMid, fontSize: 22, cursor: "pointer" }}>−</button>
              <input value={Number.isFinite(amount) ? fmt(amount) : ""} onChange={e => { const raw = e.target.value.replace(/[,،۰-۹]/g, c => "۰۱۲۳۴۵۶۷۸۹".includes(c) ? String("۰۱۲۳۴۵۶۷۸۹".indexOf(c)) : "").replace(/\D/g, ""); setAmount(raw ? Number(raw) : 0); }} inputMode="numeric" aria-label="مبلغ دلخواه" style={{ flex: 1, margin: "0 10px", height: 44, border: `1.5px solid ${valid ? H.primaryMid : "#E3E3E3"}`, borderRadius: 10, textAlign: "center", fontSize: 17, fontWeight: 800, color: H.textPrimary, fontFamily: FF, outline: "none" }} />
              <button onClick={() => adjust(10_000)} aria-label="افزایش مبلغ" style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${H.border}`, background: H.bg, color: H.primaryMid, fontSize: 22, cursor: "pointer" }}>+</button>
            </div>
            <div style={{ fontSize: 11, color: valid ? H.textMuted : "#B42318", fontFamily: FF, marginTop: 9, textAlign: "center" }}>حداقل {fmt(MIN)} و حداکثر {fmt(MAX)} تومان</div>
          </div>
          <button disabled={!valid} onClick={() => valid && onPay(amount)} style={{ width: "100%", height: 54, borderRadius: 14, border: "none", background: valid ? H.primary : "#C8C8C8", color: "#fff", fontSize: 16, fontWeight: 800, fontFamily: FF, cursor: valid ? "pointer" : "not-allowed" }}>پرداخت</button>
        </div>
      </div>
    </MobileShell>
  );
}

function WalletGatewayScreen({ amount, onSuccess, onFail }: { amount: number; onSuccess: () => void; onFail: () => void }) {
  const rial = amount * 10;
  const fmt = (n: number) => n.toLocaleString("fa-IR");
  return (
    <MobileShell bg="#F8FAFF">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "24px 20px" }}>
        <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: `1px solid ${H.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: H.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontFamily: FF }}>SEP</div>
            <div><div style={{ fontSize: 15, fontWeight: 800, color: H.textPrimary, fontFamily: FF }}>درگاه پرداخت SEP</div><div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF }}>شاپرک · محیط آزمایشی</div></div>
          </div>
          <div style={{ background: H.bg, borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontSize: 13, fontWeight: 800, color: H.textPrimary, fontFamily: FF }}>ویزیتور</span><span style={{ fontSize: 12, color: H.textMuted, fontFamily: FF }}>پذیرنده</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 16, fontWeight: 900, color: H.primary, fontFamily: FF }}>{fmt(rial)} ریال</span><span style={{ fontSize: 12, color: H.textMuted, fontFamily: FF }}>مبلغ پرداخت</span></div>
          </div>
          <div style={{ fontSize: 11, color: H.textMuted, lineHeight: 1.8, fontFamily: FF, textAlign: "right", marginBottom: 18 }}>این یک درگاه شبیه‌سازی‌شده برای نمونه اولیه است و اطلاعات کارت واقعی دریافت نمی‌کند.</div>
          <button onClick={onSuccess} style={{ width: "100%", height: 50, borderRadius: 13, border: "none", background: H.primary, color: "#fff", fontSize: 14, fontWeight: 800, fontFamily: FF, cursor: "pointer", marginBottom: 10 }}>موفقیت پرداخت</button>
          <button onClick={onFail} style={{ width: "100%", height: 48, borderRadius: 13, border: `1.5px solid #B42318`, background: "#FEF3F2", color: "#B42318", fontSize: 14, fontWeight: 700, fontFamily: FF, cursor: "pointer" }}>انصراف یا شکست</button>
        </div>
      </div>
    </MobileShell>
  );
}

function WalletPaymentFailedScreen({ amount, onRetry, onProfile }: { amount: number; onRetry: () => void; onProfile: () => void }) {
  return (
    <MobileShell bg="#F8FAFF">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: 84, height: 84, borderRadius: "50%", background: "#FEF3F2", border: "3px solid #FECDCA", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, color: "#B42318", fontSize: 40 }}>×</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: H.textPrimary, fontFamily: FF, marginBottom: 10 }}>پرداخت ناموفق</div>
        <div style={{ fontSize: 13, color: H.textMuted, fontFamily: FF, textAlign: "center", lineHeight: 1.9, marginBottom: 26 }}>مبلغی از کیف پول شما کم نشد. دوباره تلاش کنید یا به پروفایل برگردید.</div>
        <button onClick={onRetry} style={{ width: "100%", height: 52, borderRadius: 15, background: H.primary, border: "none", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: FF, cursor: "pointer", marginBottom: 10 }}>تلاش مجدد</button>
        <button onClick={onProfile} style={{ width: "100%", height: 50, borderRadius: 15, background: "transparent", border: `1.5px solid ${H.primaryMid}`, color: H.primaryMid, fontSize: 14, fontWeight: 700, fontFamily: FF, cursor: "pointer" }}>بازگشت به پروفایل</button>
      </div>
    </MobileShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 8 — Cart (Empty)
// ─────────────────────────────────────────────────────────────────────────────
// Screen 8 — Cart
// ─────────────────────────────────────────────────────────────────────────────

const DIST_NAME = "شرکت پخش ایران";
const MIN_ORDER = 500_000; // تومان

type CartItem = {
  id: string; name: string; price: number; img: string;
  unitsPerCarton: number; qty: number;
};

const PREV_ORDERS: Array<{ id: string; name: string; price: number; img: string; unitsPerCarton: number }> = [
  { id: "pr1", name: "آب معدنی دماوند ۱.۵ لیتری",     price: 28_000,  img: "https://images.unsplash.com/photo-1633949698015-0f8a8b261c07?w=200&h=200&fit=crop&auto=format", unitsPerCarton: 12 },
  { id: "pr2", name: "نوشابه کوکاکولا ۱.۵ لیتری",      price: 115_900, img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200&h=200&fit=crop&auto=format", unitsPerCarton: 12 },
  { id: "pr3", name: "چیپس خانواده ۱۷۰ گرمی",          price: 42_000,  img: "https://images.unsplash.com/photo-1641693148759-843d17ceac24?w=200&h=200&fit=crop&auto=format", unitsPerCarton: 24 },
  { id: "pr4", name: "شیر پاستوریزه میهن ۱ لیتری",     price: 45_000,  img: "https://images.unsplash.com/photo-1536238202089-6ce355328a96?w=200&h=200&fit=crop&auto=format", unitsPerCarton: 12 },
];

const SEED_ITEMS: CartItem[] = [
  { id: "c1", name: "نوشابه پرتقالی فانتا ۳۳۰ میلی‌لیتری", price: 83_400,  img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&h=200&fit=crop&auto=format", unitsPerCarton: 24, qty: 2 },
  { id: "c3", name: "نوشابه کوکاکولا ۱.۵ لیتری",           price: 115_900, img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&h=200&fit=crop&auto=format", unitsPerCarton: 12, qty: 1 },
];

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

function Screen8({ onBack, onTab, onCheckout, items, onInc, onDec, onRemove, onAddItem }: {
  onBack: () => void;
  onTab: (t: "home" | "cart" | "orders" | "profile") => void;
  onCheckout: () => void;
  items: CartItem[];
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
  onAddItem: (item: CartItem) => void;
}) {
  const [prevAdded, setPrevAdded] = useState<Record<string, boolean>>({});

  const isEmpty = items.length === 0;
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const minMet = total >= MIN_ORDER;
  const progress = Math.min(total / MIN_ORDER, 1);

  const inc = onInc;
  const dec = onDec;
  const remove = onRemove;

  const addPrev = (p: typeof PREV_ORDERS[0]) => {
    setPrevAdded(pa => ({ ...pa, [p.id]: true }));
    onAddItem({ ...p, qty: 1 });
  };

  const fmt = (n: number) => n.toLocaleString("fa-IR");

  return (
    <MobileShell bg={H.bg}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>

        {/* ── HEADER ── */}
        <div style={{ background: H.primary, padding: "14px 20px 18px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.12)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Ic.ChevronLeft size={20} color="#fff" />
            </button>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: FF }}>سبد خرید از</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", fontFamily: FF }}>{DIST_NAME}</div>
            </div>
          </div>
        </div>

        {/* ── EMPTY STATE ── */}
        {isEmpty && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 40px", gap: 16 }}>
            <div style={{ width: 96, height: 96, borderRadius: 28, background: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E3E3E3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: H.textPrimary, fontFamily: FF }}>سبد خرید خالی است</div>
            <div style={{ fontSize: 13, color: H.textMuted, fontFamily: FF, textAlign: "center", lineHeight: 1.8 }}>محصولات مورد نظر را از کاتالوگ انتخاب کنید</div>
          </div>
        )}

        {/* ── CART ITEMS ── */}
        {!isEmpty && (
          <div style={{ padding: "16px 16px 0" }}>
            {/* Min-order progress bar */}
            {!minMet && (
              <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 14, border: `1px solid ${H.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: H.textMuted, fontFamily: FF }}>
                    تا حداقل سفارش:{" "}
                    <strong style={{ color: H.primaryMid }}>{fmt(MIN_ORDER - total)}</strong> تومان مانده
                  </div>
                  <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF }}>حداقل {fmt(MIN_ORDER)} تومان</div>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: H.bg, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progress * 100}%`, borderRadius: 4, background: `linear-gradient(90deg, ${H.primaryMid}, ${H.accent})`, transition: "width 0.4s" }} />
                </div>
                <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF, marginTop: 6, textAlign: "right" }}>
                  {Math.round(progress * 100)}٪ از حداقل خرید رسیده‌اید
                </div>
              </div>
            )}

            {/* Item rows */}
            <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${H.border}`, overflow: "hidden", marginBottom: 16 }}>
              {items.map((item, idx) => (
                <div key={item.id}>
                  {idx > 0 && <div style={{ height: 1, background: H.border, margin: "0 16px" }} />}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                    {/* Image */}
                    <div style={{ width: 68, height: 68, borderRadius: 12, overflow: "hidden", background: H.bg, flexShrink: 0 }}>
                      <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: H.textPrimary, fontFamily: FF, lineHeight: 1.5, marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF, marginBottom: 6 }}>
                        {item.unitsPerCarton} عدد / کارتن
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: H.primary, fontFamily: FF }}>
                        {fmt(item.price * item.qty)}
                        <span style={{ fontSize: 11, fontWeight: 400, color: H.textSec, marginRight: 4 }}>تومان</span>
                      </div>
                    </div>

                    {/* Qty stepper */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => inc(item.id)} style={{ width: 32, height: 32, borderRadius: 10, background: H.primaryLight, border: `1.5px solid ${H.primaryMid}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Ic.Plus size={16} color={H.primaryMid} />
                      </button>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: H.textPrimary, fontFamily: FF }}>{fmt(item.qty)}</div>
                        <div style={{ fontSize: 9, color: H.textMuted, fontFamily: FF }}>کارتن</div>
                      </div>
                      {item.qty > 1 ? (
                        <button onClick={() => dec(item.id)} style={{ width: 32, height: 32, borderRadius: 10, background: "#FFF0F0", border: "1.5px solid #FEB2B2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </button>
                      ) : (
                        <button onClick={() => remove(item.id)} style={{ width: 32, height: 32, borderRadius: 10, background: "#FFF0F0", border: "1.5px solid #FEB2B2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PREVIOUS ORDERS ── */}
        <div style={{ padding: isEmpty ? "0 16px 100px" : "0 16px 100px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <button style={{ fontSize: 12, color: H.primaryMid, fontWeight: 600, fontFamily: FF, background: "none", border: "none", cursor: "pointer" }}>مشاهده همه</button>
            <span style={{ fontSize: 15, fontWeight: 800, color: H.textPrimary, fontFamily: FF }}>خریدهای قبلی</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PREV_ORDERS.map(p => {
              const done = !!prevAdded[p.id];
              return (
                <div key={p.id} style={{ background: "#fff", borderRadius: 14, border: `1px solid ${H.border}`, display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 10, overflow: "hidden", background: H.bg, flexShrink: 0 }}>
                    <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1, textAlign: "right" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: H.textPrimary, fontFamily: FF, lineHeight: 1.5, marginBottom: 3, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF }}>{p.unitsPerCarton} عدد / کارتن</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: H.primary, fontFamily: FF, marginTop: 3 }}>
                      {fmt(p.price)} <span style={{ fontSize: 10, fontWeight: 400, color: H.textSec }}>تومان / کارتن</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addPrev(p)}
                    style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: done ? H.primaryLight : H.primary, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }}
                  >
                    {done
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={H.primaryMid} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      : <Ic.Plus size={16} color="#fff" />
                    }
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── STICKY FOOTER ── */}
      <div style={{ background: "#fff", borderTop: `1px solid ${H.border}`, padding: "12px 16px 16px", flexShrink: 0, boxShadow: "0 -4px 20px rgba(0,0,0,0.07)" }}>
        {/* Total row */}
        {!isEmpty && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: H.primary, fontFamily: FF }}>{fmt(total)}</span>
              <span style={{ fontSize: 12, color: H.textSec, fontFamily: FF }}>تومان</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: H.textSec, fontFamily: FF }}>
              جمع کل ({fmt(items.reduce((s,i) => s + i.qty, 0))} کارتن)
            </span>
          </div>
        )}

        {/* CTA button */}
        <button
          onClick={() => { if (isEmpty) onTab("home"); else if (minMet) onCheckout(); }}
          style={{ width: "100%", height: 54, borderRadius: 16, border: "none", cursor: "pointer", fontFamily: FF, fontSize: 16, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "background 0.25s",
            background: isEmpty
              ? H.textMuted
              : minMet
                ? H.primary
                : `linear-gradient(135deg, ${H.primaryMid}, ${H.accent})`,
          }}
        >
          {isEmpty ? (
            <>
              <Ic.Plus size={18} color="#fff" />
              افزودن کالا
            </>
          ) : minMet ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              ادامه فرآیند خرید
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              تکمیل سبد تا حداقل سفارش
            </>
          )}
        </button>
      </div>

      <BottomTabBar active="cart" onTab={onTab} />
    </MobileShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen 9 — Orders (Empty)
// ─────────────────────────────────────────────────────────────────────────────
function Screen9({ onBack, onTab }: { onBack: () => void; onTab: (t: "home" | "cart" | "orders" | "profile") => void }) {
  const [activeTab, setActiveTab] = useState<"current" | "delivered" | "cancelled">("current");

  const tabs = [
    { key: "current" as const, label: "جاری" },
    { key: "delivered" as const, label: "تحویل شده" },
    { key: "cancelled" as const, label: "لغو شده" },
  ];

  return (
    <MobileShell bg="#F5F5F5">
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #F0F0F0" }}>
          <BackHeader onBack={onBack} title="سفارش‌ها" />
          <div style={{ padding: "8px 20px 14px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
            {tabs.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                style={{ padding: "7px 18px", borderRadius: 30, border: `1.5px solid ${activeTab === key ? "#1A1A1A" : "#E3E3E3"}`, background: activeTab === key ? "#1A1A1A" : "transparent", color: activeTab === key ? "#fff" : "#9B9B9B", ...T.label, fontFamily: FF, cursor: "pointer", transition: "all 0.2s" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 40px", gap: 16 }}>
          <div style={{ padding: 24, background: "#fff", borderRadius: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <Ic.Basket color="#E3E3E3" size={90} />
          </div>
          <div style={{ ...T.h2, color: "#1A1A1A", fontFamily: FF, textAlign: "center" }}>هنوز سفارشی ثبت نکردی!</div>
          <div style={{ ...T.caption, color: "#9B9B9B", fontFamily: FF, textAlign: "center", lineHeight: 1.8 }}>
            {activeTab === "current" ? "سفارش فعالی وجود ندارد" : activeTab === "delivered" ? "هنوز سفارشی تحویل نگرفته‌اید" : "هیچ سفارشی لغو نشده"}
          </div>
        </div>
      </div>
      <BottomTabBar active="orders" onTab={onTab} />
    </MobileShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// Screen 10 — Home (B2B Distribution)
// ─────────────────────────────────────────────────────────────────────────────

// Professional neutral palette — no loud orange
const H = {
  primary:      "#1C3F6E",   // deep navy blue
  primaryMid:   "#2557A7",   // medium blue (buttons, badges)
  primaryLight: "#EBF2FF",   // blue tint surface
  accent:       "#0EA5E9",   // sky-blue CTA highlight
  bg:           "#F2F4F7",   // page background
  surface:      "#FFFFFF",
  border:       "#E4E7EC",
  textPrimary:  "#101828",
  textSec:      "#667085",
  textMuted:    "#98A2B3",
  discount:     "#B42318",   // muted red for discounts
  discountBg:   "#FEF3F2",
  success:      "#027A48",
};

const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Search Overlay (shown over Home)
// ─────────────────────────────────────────────────────────────────────────────

const allProducts = [
  { id: "s1", name: "آب معدنی دماوند ۱.۵ لیتر", sku: "DW150", price: "۲۸۰,۰۰۰", unit: "× ۱۲ بطری",
    img: "https://images.unsplash.com/photo-1633949698015-0f8a8b261c07?w=120&h=120&fit=crop&auto=format" },
  { id: "s2", name: "روغن نباتی اویلا ۱.۸ لیتر", sku: "OL180", price: "۱,۸۵۰,۰۰۰", unit: "× ۶ بطری",
    img: "https://images.unsplash.com/photo-1552592074-ea7a91b851b3?w=120&h=120&fit=crop&auto=format" },
  { id: "s3", name: "چیپس خانواده ۱۷۰ گرمی", sku: "CH170", price: "۶۴۰,۰۰۰", unit: "× ۲۴ بسته",
    img: "https://images.unsplash.com/photo-1641693148759-843d17ceac24?w=120&h=120&fit=crop&auto=format" },
  { id: "s4", name: "شیر پاستوریزه میهن ۱ لیتر", sku: "ML100", price: "۵۴۰,۰۰۰", unit: "× ۱۲ پاکت",
    img: "https://images.unsplash.com/photo-1536238202089-6ce355328a96?w=120&h=120&fit=crop&auto=format" },
  { id: "s5", name: "ماست پاستوریزه کاله ۴۵۰ گرم", sku: "YG450", price: "۳۶۰,۰۰۰", unit: "× ۱۲ عدد",
    img: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=120&h=120&fit=crop&auto=format" },
  { id: "s6", name: "نوشابه کوکاکولا ۱ لیتر", sku: "CC100", price: "۴۸۰,۰۰۰", unit: "× ۱۲ بطری",
    img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=120&h=120&fit=crop&auto=format" },
  { id: "s7", name: "پنیر پیتزای رامک ۴۵۰ گرم", sku: "CH450", price: "۶۸۰,۰۰۰", unit: "× ۸ بسته",
    img: "https://images.unsplash.com/photo-1634487359989-3e90c9432133?w=120&h=120&fit=crop&auto=format" },
  { id: "s8", name: "تخم مرغ درجه یک ۳۰ عددی", sku: "EG030", price: "۱۸۰,۰۰۰", unit: "× ۶ شانه",
    img: "https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=120&h=120&fit=crop&auto=format" },
  { id: "s9", name: "مایع ظرفشویی گلرنگ ۱ لیتر", sku: "DW100", price: "۸۸۰,۰۰۰", unit: "× ۱۲ بطری",
    img: "https://images.unsplash.com/photo-1720468750623-39e9a09f5067?w=120&h=120&fit=crop&auto=format" },
  { id: "s10", name: "آبمیوه سیب طبیعی ۱ لیتر", sku: "AJ100", price: "۴۲۰,۰۰۰", unit: "× ۶ بطری",
    img: "https://images.unsplash.com/photo-1592391303704-f3380c4fa7d0?w=120&h=120&fit=crop&auto=format" },
];

const trending = ["شیر", "روغن", "بستنی", "پنیر", "تخم مرغ", "چیپس", "ماست", "سیگار", "آب معدنی", "نوشابه"];

const searchCategories = [
  { label: "تنقلات",            img: "https://images.unsplash.com/photo-1641693148759-843d17ceac24?w=200&h=200&fit=crop&auto=format" },
  { label: "لبنیات و بستنی",   img: "https://images.unsplash.com/photo-1536238202089-6ce355328a96?w=200&h=200&fit=crop&auto=format" },
  { label: "محصولات کالابرگی", img: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200&h=200&fit=crop&auto=format" },
  { label: "میوه و سبزیجات",   img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop&auto=format" },
  { label: "خواربار و نان",    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop&auto=format" },
  { label: "نوشیدنی",          img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200&h=200&fit=crop&auto=format" },
  { label: "دخانیات",          img: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=200&h=200&fit=crop&auto=format" },
  { label: "کودک و نوزاد",     img: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=200&h=200&fit=crop&auto=format" },
  { label: "آرایشی و بهداشتی", img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=200&h=200&fit=crop&auto=format" },
  { label: "کنسرو و غذای آماده",img: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=200&h=200&fit=crop&auto=format" },
  { label: "چاشنی و افزودنی",  img: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=200&h=200&fit=crop&auto=format" },
  { label: "صبحانه",           img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=200&h=200&fit=crop&auto=format" },
];

function fuzzyScore(query: string, target: string): number {
  if (!query) return 0;
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase();
  if (t.includes(q)) return 2;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length ? 1 : 0;
}

// Trending arrow icon
const TrendArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={H.primaryMid} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
);

function SearchOverlay({ onClose, onCategorySelect }: { onClose: () => void; onCategorySelect: (cat: string) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const results = query.trim().length > 0
    ? allProducts
        .map(p => ({ ...p, score: Math.max(fuzzyScore(query, p.name), fuzzyScore(query, p.sku)) }))
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score)
    : [];

  const showResults = query.trim().length > 0;

  return (
    <div style={{
      position: "absolute", inset: 0, background: "#fff", zIndex: 100,
      display: "flex", flexDirection: "column", overflowY: "auto",
    }}>
      {/* ── SEARCH BAR ROW ── */}
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${H.border}`, background: "#fff", position: "sticky", top: 0, zIndex: 10 }}>
        {/* Back arrow */}
        <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: 10, background: H.primaryLight, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={H.primaryMid} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        {/* Input */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: H.bg, borderRadius: 12, padding: "10px 14px", border: `1.5px solid ${H.primaryMid}` }}>
          <Ic.Search size={17} color={H.textMuted} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="جستجو بین همه کالاها"
            dir="rtl"
            style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 14, fontFamily: FF, color: H.textPrimary, textAlign: "right" }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
              <Ic.X size={16} color={H.textMuted} />
            </button>
          )}
        </div>
      </div>

      {/* ── SEARCH RESULTS (when typing) ── */}
      {showResults && (
        <div style={{ flex: 1 }}>
          {results.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: H.textMuted, fontFamily: FF, fontSize: 14 }}>
              نتیجه‌ای یافت نشد
            </div>
          ) : (
            results.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderBottom: i < results.length - 1 ? `1px solid ${H.border}` : "none", cursor: "pointer" }}>
                <div style={{ textAlign: "right", flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: H.textPrimary, fontFamily: FF, marginBottom: 3 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF, marginBottom: 5 }}>SKU: {p.sku} · {p.unit}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: H.primaryMid, fontFamily: FF }}>
                    {p.price} <span style={{ fontSize: 10, fontWeight: 400, color: H.textSec }}>تومان / کارتن</span>
                  </div>
                </div>
                <div style={{ width: 60, height: 60, borderRadius: 10, overflow: "hidden", background: H.bg, flexShrink: 0 }}>
                  <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── IDLE STATE: trending + categories ── */}
      {!showResults && (
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Trending searches */}
          <div style={{ padding: "20px 20px 0" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: H.textPrimary, fontFamily: FF, marginBottom: 14, textAlign: "right" }}>
              جستجوهای پرطرفدار
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-end" }}>
              {trending.map(t => (
                <button key={t} onClick={() => setQuery(t)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 30, border: `1.5px solid ${H.border}`, background: H.surface, cursor: "pointer", flexDirection: "row-reverse" }}>
                  <TrendArrow />
                  <span style={{ fontSize: 13, fontWeight: 600, color: H.textPrimary, fontFamily: FF }}>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category grid */}
          <div style={{ padding: "24px 20px 28px" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: H.textPrimary, fontFamily: FF, marginBottom: 14, textAlign: "right" }}>
              خرید از دسته‌بندی‌ها
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {searchCategories.map(cat => (
                <button key={cat.label} onClick={() => onCategorySelect(cat.label)} style={{ background: H.surface, border: `1px solid ${H.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: H.textPrimary, fontFamily: FF, padding: "8px 8px 4px", textAlign: "center", lineHeight: 1.4 }}>{cat.label}</div>
                  <div style={{ width: "100%", aspectRatio: "1 / 1", overflow: "hidden" }}>
                    <img src={cat.img} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Category Screen (overlay)
// ─────────────────────────────────────────────────────────────────────────────

const catTabs: Record<string, { subs: string[]; filters: string[] }> = {
  "نوشیدنی":          { subs: ["نوشیدنی", "لبنیات و بستنی", "تنقلات", "خواربار و نان", "میوه و سبزیجات"], filters: ["آب معدنی، طعم‌دار و گازدار", "ماءالشعیر", "آبمیوه بدون گاز", "چای و قهوه"] },
  "لبنیات":           { subs: ["لبنیات و بستنی", "نوشیدنی", "تنقلات", "خواربار و نان"], filters: ["شیر", "ماست", "پنیر", "کره", "بستنی"] },
  "تنقلات":           { subs: ["تنقلات", "لبنیات و بستنی", "خواربار و نان", "نوشیدنی"], filters: ["چیپس", "پفک", "آجیل", "شکلات", "کاکائو"] },
  "خواربار":          { subs: ["خواربار و نان", "تنقلات", "کنسرو", "نوشیدنی"], filters: ["برنج", "روغن", "قند و شکر", "آرد", "نمک"] },
  "بهداشتی":          { subs: ["آرایشی و بهداشتی", "کودک و نوزاد", "خواربار و نان"], filters: ["شامپو", "صابون", "خمیردندان", "مایع ظرفشویی"] },
  "default":          { subs: ["نوشیدنی", "لبنیات و بستنی", "تنقلات", "خواربار و نان", "میوه و سبزیجات"], filters: ["همه", "پرفروش", "تخفیف‌دار", "جدید"] },
};

type CatProduct = {
  id: string; name: string; size: string; price: string;
  original?: string; disc?: number; img: string;
  brand: string; category: string; subCategory: string;
  unitsPerCarton: number; minOrderQty: number;
  lastOrder?: { cartons: number; daysAgo: number };
  sku: string;
};

const catProducts: Record<string, CatProduct[]> = {
  "نوشیدنی": [
    { id: "c1", name: "نوشابه پرتقالی فانتا ۳۳۰ میلی‌لیتری", size: "۳۳۰ میلی لیتری", price: "۸۳,۴۰۰", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=600&fit=crop&auto=format", brand: "فانتا", category: "نوشیدنی", subCategory: "نوشابه", sku: "FT-330-OR", unitsPerCarton: 24, minOrderQty: 1, lastOrder: { cartons: 5, daysAgo: 12 } },
    { id: "c2", name: "نوشابه کوکاکولا ۳۳۰ میلی‌لیتری", size: "۳۳۰ میلی لیتری", price: "۸۳,۵۰۰", img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&h=600&fit=crop&auto=format", brand: "کوکاکولا", category: "نوشیدنی", subCategory: "نوشابه", sku: "CC-330", unitsPerCarton: 24, minOrderQty: 2 },
    { id: "c3", name: "نوشابه کوکاکولا ۱.۵ لیتری", size: "۱.۵ لیتری", price: "۱۱۵,۹۰۰", original: "۱۲۲,۰۰۰", disc: 5, img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&h=600&fit=crop&auto=format", brand: "کوکاکولا", category: "نوشیدنی", subCategory: "نوشابه", sku: "CC-1500", unitsPerCarton: 12, minOrderQty: 1, lastOrder: { cartons: 10, daysAgo: 3 } },
    { id: "c4", name: "نوشیدنی هلو پالپ‌دار رانی ۲۴۰ میلی‌لیتری", size: "۲۴۰ میلی لیتری", price: "۸۵,۵۰۰", original: "۹۵,۰۰۰", disc: 10, img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=600&fit=crop&auto=format", brand: "رانی", category: "نوشیدنی", subCategory: "آبمیوه", sku: "RN-240-PE", unitsPerCarton: 30, minOrderQty: 3 },
    { id: "c5", name: "آب معدنی دماوند ۱.۵ لیتری", size: "۱.۵ لیتری", price: "۲۸,۰۰۰", img: "https://images.unsplash.com/photo-1633949698015-0f8a8b261c07?w=600&h=600&fit=crop&auto=format", brand: "دماوند", category: "نوشیدنی", subCategory: "آب معدنی", sku: "DW-1500", unitsPerCarton: 12, minOrderQty: 1, lastOrder: { cartons: 20, daysAgo: 7 } },
    { id: "c6", name: "آبمیوه سیب طبیعی ۱ لیتری", size: "۱ لیتری", price: "۷۲,۰۰۰", original: "۸۰,۰۰۰", disc: 10, img: "https://images.unsplash.com/photo-1592391303704-f3380c4fa7d0?w=600&h=600&fit=crop&auto=format", brand: "محلی", category: "نوشیدنی", subCategory: "آبمیوه", sku: "AJ-1000-AP", unitsPerCarton: 6, minOrderQty: 2 },
  ],
  "لبنیات": [
    { id: "d1", name: "شیر پاستوریزه میهن ۱ لیتری", size: "۱ لیتری", price: "۴۵,۰۰۰", img: "https://images.unsplash.com/photo-1536238202089-6ce355328a96?w=600&h=600&fit=crop&auto=format", brand: "میهن", category: "لبنیات", subCategory: "شیر", sku: "MH-1000", unitsPerCarton: 12, minOrderQty: 1, lastOrder: { cartons: 8, daysAgo: 5 } },
    { id: "d2", name: "ماست پاستوریزه کاله ۴۵۰ گرمی", size: "۴۵۰ گرمی", price: "۳۸,۰۰۰", img: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600&h=600&fit=crop&auto=format", brand: "کاله", category: "لبنیات", subCategory: "ماست", sku: "KL-450-YG", unitsPerCarton: 12, minOrderQty: 2 },
    { id: "d3", name: "پنیر پیتزای رامک ۴۵۰ گرمی", size: "۴۵۰ گرمی", price: "۸۵,۰۰۰", original: "۹۵,۰۰۰", disc: 11, img: "https://images.unsplash.com/photo-1634487359989-3e90c9432133?w=600&h=600&fit=crop&auto=format", brand: "رامک", category: "لبنیات", subCategory: "پنیر", sku: "RM-450-CH", unitsPerCarton: 8, minOrderQty: 1 },
    { id: "d4", name: "کره حیوانی صباح ۱۰۰ گرمی", size: "۱۰۰ گرمی", price: "۶۸,۰۰۰", img: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&h=600&fit=crop&auto=format", brand: "صباح", category: "لبنیات", subCategory: "کره", sku: "SB-100-BT", unitsPerCarton: 24, minOrderQty: 5 },
  ],
  "تنقلات": [
    { id: "t1", name: "چیپس خانواده ۱۷۰ گرمی", size: "۱۷۰ گرمی", price: "۴۲,۰۰۰", img: "https://images.unsplash.com/photo-1641693148759-843d17ceac24?w=600&h=600&fit=crop&auto=format", brand: "خانواده", category: "تنقلات", subCategory: "چیپس", sku: "KH-170-CH", unitsPerCarton: 24, minOrderQty: 1, lastOrder: { cartons: 6, daysAgo: 20 } },
    { id: "t2", name: "شکلات کیت‌کت ۴۱.۵ گرمی", size: "۴۱.۵ گرمی", price: "۵۵,۰۰۰", original: "۶۰,۰۰۰", disc: 8, img: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600&h=600&fit=crop&auto=format", brand: "کیت‌کت", category: "تنقلات", subCategory: "شکلات", sku: "KK-415", unitsPerCarton: 36, minOrderQty: 2 },
    { id: "t3", name: "پفک نمکی ۶۵ گرمی", size: "۶۵ گرمی", price: "۲۲,۰۰۰", img: "https://images.unsplash.com/photo-1594736797933-d0401ba2b65a?w=600&h=600&fit=crop&auto=format", brand: "محلی", category: "تنقلات", subCategory: "پفک", sku: "PF-065", unitsPerCarton: 48, minOrderQty: 1 },
    { id: "t4", name: "آجیل مخلوط ممتاز ۵۰۰ گرمی", size: "۵۰۰ گرمی", price: "۱۸۵,۰۰۰", original: "۲۲۰,۰۰۰", disc: 16, img: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=600&h=600&fit=crop&auto=format", brand: "ممتاز", category: "تنقلات", subCategory: "آجیل", sku: "MZ-500-NX", unitsPerCarton: 12, minOrderQty: 3 },
  ],
};

// Converts a Persian-formatted price string to a number for multiplication
function priceNum(p: string) { return parseInt(p.replace(/[,،]/g, ""), 10) || 0; }
function toFaNum(n: number) { return n.toLocaleString("fa-IR"); }

function ProductDetailSheet({ product, onClose, onAdd, cartTotal, isOOS, onViewOtherDists }: {
  product: CatProduct;
  onClose: () => void;
  onAdd: (count: number) => void;
  cartTotal: number;
  isOOS?: boolean;
  onViewOtherDists?: () => void;
}) {
  const [qty, setQty] = useState(product.minOrderQty);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const totalPrice = priceNum(product.price) * qty;
  const remaining = Math.max(0, MIN_ORDER - cartTotal);
  const moqMet = cartTotal >= MIN_ORDER;

  const handleAdd = () => {
    if (isOOS) return;
    onAdd(qty);
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 700);
  };

  return (
    /* Dimmed backdrop */
    <div
      onClick={onClose}
      style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
    >
      {/* Sheet panel — stops click propagation */}
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "22px 22px 0 0", overflow: "hidden", maxHeight: "92%", display: "flex", flexDirection: "column" }}
      >
        {/* ── IMAGE ZONE ── */}
        <div style={{ position: "relative", background: "#F4F5F7", flexShrink: 0 }}>
          <img
            src={product.img}
            alt={product.name}
            style={{ width: "100%", height: 280, objectFit: "contain", display: "block", padding: "20px 40px 16px" }}
          />

          {/* OOS badge */}
          {isOOS && (
            <div style={{ position: "absolute", top: 16, left: 16, background: "#B42318", color: "#fff", fontSize: 12, fontWeight: 800, fontFamily: FF, padding: "4px 12px", borderRadius: 10, zIndex: 2 }}>
              ناموجود
            </div>
          )}
          {/* OOS overlay tint */}
          {isOOS && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.5)", zIndex: 1, pointerEvents: "none" }} />
          )}

          {/* Discount badge */}
          {!isOOS && product.disc && (
            <div style={{ position: "absolute", top: 16, left: 16, background: "#1C3F6E", color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: FF, padding: "4px 10px", borderRadius: 10 }}>
              {product.disc}٪
            </div>
          )}

          {/* Heart — top-left (LTR left = RTL right) */}
          <button
            onClick={() => setWished(w => !w)}
            style={{ position: "absolute", top: 14, right: 14, width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={wished ? "#E53E3E" : "none"} stroke={wished ? "#E53E3E" : "#9B9B9B"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Close — top-left in RTL (visually top-left corner of sheet) */}
          <button
            onClick={onClose}
            style={{ position: "absolute", top: 14, left: 14, width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <Ic.X size={18} color={H.textSec} />
          </button>

          {/* Drag handle */}
          <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", width: 36, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.15)" }} />
        </div>

        {/* ── SCROLLABLE INFO ── */}
        <div style={{ overflowY: "auto", flex: 1, padding: "18px 20px 24px", direction: "rtl" }}>

          {/* Product name */}
          <h2 style={{ fontSize: 18, fontWeight: 800, color: H.textPrimary, fontFamily: FF, margin: "0 0 10px", lineHeight: 1.5 }}>
            {product.name}
          </h2>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#1C3F6E", fontWeight: 600, fontFamily: FF }}>{product.brand}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={H.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            <span style={{ fontSize: 13, color: "#1C3F6E", fontWeight: 600, fontFamily: FF }}>{product.subCategory}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={H.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            <span style={{ fontSize: 13, color: "#1C3F6E", fontWeight: 600, fontFamily: FF }}>{product.category}</span>
          </div>

          {/* ── CARTON BADGE — the most important element ── */}
          <div style={{ background: H.primary, borderRadius: 14, padding: "12px 16px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Box icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: FF }}>هر کارتن</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: FF }}>{toFaNum(product.unitsPerCarton)}</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: FF }}>عدد</span>
            </div>
          </div>

          {/* SKU */}
          <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF, marginBottom: 14, textAlign: "left" }}>SKU: {product.sku}</div>

          {/* Price block */}
          <div style={{ background: H.bg, borderRadius: 14, padding: "14px 16px", marginBottom: product.lastOrder ? 14 : 20 }}>
            <div style={{ fontSize: 12, color: H.textMuted, fontFamily: FF, marginBottom: 6 }}>قیمت هر کارتن</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                {product.original && (
                  <span style={{ fontSize: 13, color: H.textMuted, fontFamily: FF, textDecoration: "line-through" }}>{product.original}</span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: H.textPrimary, fontFamily: FF }}>{product.price}</span>
                <span style={{ fontSize: 13, color: H.textSec, fontFamily: FF }}>تومان / کارتن</span>
              </div>
            </div>
          </div>

          {/* Last order info */}
          {product.lastOrder && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "10px 14px", marginBottom: 20 }}>
              <div style={{ flex: 1, textAlign: "right" }}>
                <span style={{ fontSize: 12, color: "#92400E", fontFamily: FF }}>
                  آخرین سفارش شما:{" "}
                  <strong>{toFaNum(product.lastOrder.cartons)} کارتن</strong>
                  {" "}·{" "}
                  {toFaNum(product.lastOrder.daysAgo)} روز پیش
                </span>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          )}

          {/* ── MOQ CALLOUT ── */}
          {!isOOS && !moqMet && (
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 14, padding: "12px 14px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
              <div style={{ flex: 1, textAlign: "right" }}>
                <span style={{ fontSize: 12, color: "#15803D", fontFamily: FF, lineHeight: 1.7 }}>
                  {remaining.toLocaleString("fa-IR")} تومان تا رسیدن به حداقل سفارش (۵۰۰٬۰۰۰ تومان) باقی مانده است.
                </span>
              </div>
            </div>
          )}
          {!isOOS && moqMet && (
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 14, padding: "12px 14px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span style={{ fontSize: 12, color: "#15803D", fontFamily: FF, lineHeight: 1.7 }}>
                سبد شما به حداقل مبلغ سفارش رسیده است. می‌توانید سفارش دهید.
              </span>
            </div>
          )}

          {/* ── QUANTITY STEPPER ── */}
          <div style={{ marginBottom: 100 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: H.textPrimary, fontFamily: FF, marginBottom: 10 }}>
              تعداد سفارش
              {product.minOrderQty > 1 && (
                <span style={{ fontSize: 11, color: H.textMuted, fontWeight: 400, marginRight: 8 }}>
                  (حداقل {toFaNum(product.minOrderQty)} کارتن)
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 0, border: `2px solid ${H.primaryMid}`, borderRadius: 16, overflow: "hidden", justifyContent: "space-between" }}>
              {/* Minus */}
              <button
                onClick={() => setQty(q => Math.max(product.minOrderQty, q - 1))}
                disabled={qty <= product.minOrderQty}
                style={{ width: 56, height: 56, background: qty <= product.minOrderQty ? H.bg : H.primaryLight, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: qty <= product.minOrderQty ? "default" : "pointer", flexShrink: 0 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={qty <= product.minOrderQty ? H.textMuted : H.primaryMid} strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>

              {/* Count display */}
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: H.textPrimary, fontFamily: FF, lineHeight: 1 }}>{toFaNum(qty)}</div>
                <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF, marginTop: 3 }}>کارتن</div>
              </div>

              {/* Plus */}
              <button
                onClick={() => setQty(q => q + 1)}
                style={{ width: 56, height: 56, background: H.primaryLight, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
              >
                <Ic.Plus size={20} color={H.primaryMid} />
              </button>
            </div>

            {/* Total price preview */}
            <div style={{ marginTop: 12, textAlign: "center", fontSize: 13, color: H.textSec, fontFamily: FF }}>
              جمع کل:{" "}
              <strong style={{ color: H.textPrimary, fontWeight: 800 }}>{toFaNum(totalPrice)}</strong>
              {" "}تومان
            </div>
          </div>
        </div>

        {/* ── STICKY ADD BUTTON ── */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 20px 20px", background: "linear-gradient(to top, #fff 80%, transparent)", zIndex: 10 }}>
          {isOOS ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button disabled style={{ width: "100%", height: 54, borderRadius: 16, background: "#F2F4F7", border: "none", cursor: "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={H.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                <span style={{ fontSize: 15, fontWeight: 700, color: H.textMuted, fontFamily: FF }}>این کالا ناموجود است</span>
              </button>
              <button
                onClick={onViewOtherDists}
                style={{ width: "100%", height: 48, borderRadius: 16, background: "transparent", border: `2px solid ${H.primaryMid}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={H.primaryMid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <span style={{ fontSize: 14, fontWeight: 700, color: H.primaryMid, fontFamily: FF }}>مشاهده توزیع‌کننده‌های دیگر</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              style={{ width: "100%", height: 54, borderRadius: 16, background: added ? H.success : "#1C3F6E", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "background 0.2s" }}
            >
              {added ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              )}
              <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: FF }}>
                {added ? "افزوده شد" : `افزودن ${toFaNum(qty)} کارتن به سفارش`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#E53E3E" : "none"} stroke={filled ? "#E53E3E" : "#9B9B9B"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={H.textSec} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

function CategoryScreen({ categoryName, onClose, onCartView, cartItems, onAddItem, onInc, onDec }: {
  categoryName: string;
  onClose: () => void;
  onCartView: () => void;
  cartItems: CartItem[];
  onAddItem: (item: CartItem) => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
}) {
  const cfg = catTabs[categoryName] ?? catTabs["default"];
  const prods = catProducts[categoryName] ?? catProducts["نوشیدنی"];

  const [activeTab, setActiveTab] = useState(cfg.subs[0]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [detailProduct, setDetailProduct] = useState<CatProduct | null>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);

  const cartCounts: Record<string, number> = {};
  cartItems.forEach(i => { cartCounts[i.id] = i.qty; });
  const totalCart = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = 1655;

  // Mock OOS: last product in each category is out of stock with current distributor
  const OOS_IDS = new Set([prods[prods.length - 1]?.id]);

  const parsePersianPrice = (s: string) => parseInt(s.replace(/[,،]/g, "").replace(/[۰-۹]/g, c => String(c.charCodeAt(0) - 0x06F0)), 10) || 0;

  const add = (id: string, prod?: CatProduct) => {
    if (cartCounts[id]) { onInc(id); }
    else if (prod) {
      onAddItem({ id, name: prod.name, price: parsePersianPrice(prod.price), img: prod.img, unitsPerCarton: prod.unitsPerCarton, qty: 1 });
    }
  };
  const sub = (id: string) => onDec(id);
  const toggleWish = (id: string) => setWishlist(p => ({ ...p, [id]: !p[id] }));

  return (
    <div style={{ position: "absolute", inset: 0, background: H.bg, zIndex: 110, display: "flex", flexDirection: "column" }}>

      {/* Product detail sheet */}
      {detailProduct && (
        <ProductDetailSheet
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          cartTotal={cartTotal}
          isOOS={OOS_IDS.has(detailProduct.id)}
          onViewOtherDists={() => { setDetailProduct(null); onClose(); }}
          onAdd={count => {
            const existing = cartCounts[detailProduct.id] || 0;
            if (existing) {
              for (let i = 0; i < count; i++) onInc(detailProduct.id);
            } else {
              onAddItem({ id: detailProduct.id, name: detailProduct.name, price: parsePersianPrice(detailProduct.price), img: detailProduct.img, unitsPerCarton: detailProduct.unitsPerCarton, qty: count });
            }
            setDetailProduct(null);
          }}
        />
      )}

      {/* ── STICKY HEADER ── */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${H.border}`, flexShrink: 0 }}>
        {/* Search row */}
        <div style={{ padding: "12px 16px 0", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: 10, background: H.primaryLight, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={H.primaryMid} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: H.bg, borderRadius: 12, padding: "9px 14px", border: `1px solid ${H.border}` }}>
            <Ic.Search size={16} color={H.textMuted} />
            <span style={{ fontSize: 13, color: H.textMuted, fontFamily: FF }}>جستجو بین همه کالاها</span>
          </div>
        </div>

        {/* Category tabs */}
        <div ref={tabBarRef} style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none", padding: "0 4px", marginTop: 4 }}>
          {cfg.subs.map(sub => (
            <button key={sub} onClick={() => setActiveTab(sub)} style={{ flexShrink: 0, padding: "10px 16px", background: "none", border: "none", cursor: "pointer", position: "relative", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 14, fontWeight: activeTab === sub ? 800 : 500, color: activeTab === sub ? H.textPrimary : H.textSec, fontFamily: FF }}>
                {sub}
              </span>
              {activeTab === sub && (
                <div style={{ position: "absolute", bottom: 0, left: 8, right: 8, height: 3, borderRadius: 2, background: H.textPrimary }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Filter chips */}
        <div style={{ display: "flex", gap: 8, padding: "12px 16px", overflowX: "auto", scrollbarWidth: "none", flexShrink: 0 }}>
          {cfg.filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(activeFilter === f ? null : f)}
              style={{ padding: "6px 14px", borderRadius: 30, border: `1.5px solid ${activeFilter === f ? H.primaryMid : H.border}`, background: activeFilter === f ? H.primaryLight : "#fff", color: activeFilter === f ? H.primaryMid : H.textSec, fontSize: 12, fontWeight: 600, fontFamily: FF, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Count + filter row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px 14px" }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", border: `1px solid ${H.border}`, borderRadius: 20, background: "#fff", cursor: "pointer" }}>
            <FilterIcon />
            <span style={{ fontSize: 12, fontWeight: 600, color: H.textSec, fontFamily: FF }}>فیلتر</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={H.textSec} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
          <span style={{ fontSize: 15, fontWeight: 800, color: H.textPrimary, fontFamily: FF }}>
            {totalItems.toLocaleString("fa-IR")} کالا
          </span>
        </div>

        {/* Product grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 12px", paddingBottom: totalCart > 0 ? 90 : 24 }}>
          {prods.map(p => {
            const count = cartCounts[p.id] || 0;
            const oos = OOS_IDS.has(p.id);
            return (
              <div key={p.id} style={{ background: "#fff", borderRadius: 16, border: `1px solid ${oos ? "#FECDCA" : H.border}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", opacity: oos ? 0.85 : 1 }}>
                {/* Image area — tap opens detail sheet */}
                <div onClick={() => setDetailProduct(p)} style={{ position: "relative", background: "#F8F9FA", cursor: "pointer" }}>
                  <img src={p.img} alt={p.name} style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block" }} />
                  {oos && <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.4)" }} />}

                  {/* OOS badge */}
                  {oos ? (
                    <div style={{ position: "absolute", top: 10, left: 10, background: "#B42318", color: "#fff", fontSize: 10, fontWeight: 800, fontFamily: FF, padding: "3px 8px", borderRadius: 8 }}>
                      ناموجود
                    </div>
                  ) : p.disc ? (
                    <div style={{ position: "absolute", top: 10, left: 10, background: "#1C3F6E", color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: FF, padding: "3px 8px", borderRadius: 8 }}>
                      {p.disc}٪
                    </div>
                  ) : null}

                  {/* Heart */}
                  <button onClick={e => { e.stopPropagation(); toggleWish(p.id); }} style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
                    <HeartIcon filled={!!wishlist[p.id]} />
                  </button>

                  {/* Add / counter button */}
                  {!oos && (count === 0 ? (
                    <button onClick={e => { e.stopPropagation(); add(p.id, p); }} style={{ position: "absolute", bottom: 10, left: 10, width: 34, height: 34, borderRadius: "50%", background: "#fff", border: `1.5px solid ${H.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}>
                      <Ic.Plus size={16} color={H.textPrimary} />
                    </button>
                  ) : (
                    <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 8, left: 8, display: "flex", alignItems: "center", gap: 4, background: H.primaryMid, borderRadius: 20, padding: "4px 6px" }}>
                      <button onClick={() => add(p.id, p)} style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Ic.Plus size={12} color="#fff" />
                      </button>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", fontFamily: FF, minWidth: 14, textAlign: "center" }}>{count}</span>
                      <button onClick={() => sub(p.id)} style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Text info */}
                <div onClick={() => setDetailProduct(p)} style={{ padding: "10px 12px 12px", textAlign: "right", cursor: "pointer" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: H.textPrimary, fontFamily: FF, lineHeight: 1.6, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF, marginBottom: 8 }}>{p.size}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: H.textPrimary, fontFamily: FF }}>
                    از {p.price}
                    <span style={{ fontSize: 10, fontWeight: 400, color: H.textSec, marginRight: 3 }}>تومان</span>
                  </div>
                  {p.original && (
                    <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF, textDecoration: "line-through", marginTop: 2 }}>{p.original}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── STICKY CART BAR ── */}
      {totalCart > 0 && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: `1px solid ${H.border}`, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)", zIndex: 10 }}>
          <button onClick={onCartView} style={{ background: H.primaryMid, color: "#fff", border: "none", borderRadius: 12, padding: "11px 22px", fontSize: 13, fontWeight: 700, fontFamily: FF, cursor: "pointer" }}>
            مشاهده سبد
          </button>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: H.textPrimary, fontFamily: FF }}>
              {totalCart} کالا در سبد
            </div>
            <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF }}>آماده ارسال</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Distributor data (shared by Screen10 header + DistributorSelectScreen)
// ─────────────────────────────────────────────────────────────────────────────

type Distributor = {
  id: string; name: string; logoText: string; logoBg: string;
  status: "active" | "full";
  deliveryMins: number; deliveryFee: number | "free";
  priceMultiplier: number;
};

const DISTRIBUTORS: Distributor[] = [
  { id: "d1", name: "شرکت پخش ایران (مرکزی)", logoText: "پخش\nایران", logoBg: "#1C3F6E", status: "active", deliveryMins: 45, deliveryFee: 14_000, priceMultiplier: 1.00 },
  { id: "d2", name: "توزیع و پخش البرز", logoText: "البرز\nپخش", logoBg: "#2D7DD2", status: "active", deliveryMins: 60, deliveryFee: "free", priceMultiplier: 1.05 },
  { id: "d3", name: "شرکت توزیع آریا تجارت", logoText: "آریا\nتجارت", logoBg: "#38A169", status: "full", deliveryMins: 90, deliveryFee: "free", priceMultiplier: 0.97 },
  { id: "d4", name: "پخش پیشرو نوین", logoText: "پیشرو\nنوین", logoBg: "#744210", status: "active", deliveryMins: 30, deliveryFee: 8_000, priceMultiplier: 1.08 },
];

const PREVIEW_PRODUCTS = [
  { name: "نوشابه پرتقالی فانتا ۳۳۰ml", qty: 2, basePrice: 83_400, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=160&h=160&fit=crop&auto=format" },
  { name: "نوشابه کوکاکولا ۱.۵L", qty: 1, basePrice: 115_900, img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=160&h=160&fit=crop&auto=format" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Screen 10 — Home (B2B Distribution)
// ─────────────────────────────────────────────────────────────────────────────

function Screen10({ onTab, onDistSelect, activeDistId, isDemo, cartItems, onAddItem, onInc, onDec }: {
  onTab: (t: "home" | "cart" | "orders" | "profile") => void;
  onDistSelect: () => void;
  activeDistId: string;
  isDemo: boolean;
  cartItems: CartItem[];
  onAddItem: (item: CartItem) => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
}) {
  const activeDist = DISTRIBUTORS.find(d => d.id === activeDistId) ?? DISTRIBUTORS[0];
  const [activeCat, setActiveCat] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState<string | null>(null);

  const cartCounts: Record<string, number> = {};
  cartItems.forEach(i => { cartCounts[i.id] = i.qty; });
  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);

  const add = (id: string, p?: { name: string; price: number; img: string; unitsPerCarton: number }) => {
    if (cartCounts[id]) { onInc(id); }
    else if (p) { onAddItem({ id, name: p.name, price: p.price, img: p.img, unitsPerCarton: p.unitsPerCarton, qty: 1 }); }
  };
  const sub = (id: string) => onDec(id);

  const categories = [
    { id: 0, label: "همه" },
    { id: 1, label: "نوشیدنی" },
    { id: 2, label: "لبنیات" },
    { id: 3, label: "خواربار" },
    { id: 4, label: "بهداشتی" },
    { id: 5, label: "تنقلات" },
    { id: 6, label: "روغن و چربی" },
    { id: 7, label: "کنسرو" },
  ];

  const quickReorders = [
    {
      id: "qr1", name: "آب معدنی دماوند ۱.۵ لیتر", cartons: 12,
      img: "https://images.unsplash.com/photo-1633949698015-0f8a8b261c07?w=160&h=160&fit=crop&auto=format",
    },
    {
      id: "qr2", name: "روغن نباتی اویلا ۱.۸ لیتر", cartons: 6,
      img: "https://images.unsplash.com/photo-1552592074-ea7a91b851b3?w=160&h=160&fit=crop&auto=format",
    },
    {
      id: "qr3", name: "چیپس خانواده ۱۷۰ گرمی", cartons: 24,
      img: "https://images.unsplash.com/photo-1641693148759-843d17ceac24?w=160&h=160&fit=crop&auto=format",
    },
    {
      id: "qr4", name: "شیر پاستوریزه میهن ۱ لیتر", cartons: 12,
      img: "https://images.unsplash.com/photo-1536238202089-6ce355328a96?w=160&h=160&fit=crop&auto=format",
    },
  ];

  const products = [
    { id: "p1", name: "آب معدنی دماوند", unit: "× ۱۲ بطری", price: "۲۸۰,۰۰۰", numPrice: 280_000, unitsPerCarton: 12, original: "۳۲۰,۰۰۰", disc: 12,
      img: "https://images.unsplash.com/photo-1633949698015-0f8a8b261c07?w=300&h=300&fit=crop&auto=format" },
    { id: "p2", name: "روغن نباتی اویلا", unit: "× ۶ بطری", price: "۱,۸۵۰,۰۰۰", numPrice: 1_850_000, unitsPerCarton: 6, original: "۲,۱۰۰,۰۰۰", disc: 12,
      img: "https://images.unsplash.com/photo-1552592074-ea7a91b851b3?w=300&h=300&fit=crop&auto=format" },
    { id: "p3", name: "چیپس خانواده", unit: "× ۲۴ بسته", price: "۶۴۰,۰۰۰", numPrice: 640_000, unitsPerCarton: 24, original: null, disc: 0,
      img: "https://images.unsplash.com/photo-1641693148759-843d17ceac24?w=300&h=300&fit=crop&auto=format" },
    { id: "p4", name: "شیر پاستوریزه ۱ لیتر", unit: "× ۱۲ پاکت", price: "۵۴۰,۰۰۰", numPrice: 540_000, unitsPerCarton: 12, original: "۶۰۰,۰۰۰", disc: 10,
      img: "https://images.unsplash.com/photo-1536238202089-6ce355328a96?w=300&h=300&fit=crop&auto=format" },
    { id: "p5", name: "آبمیوه سیب طبیعی", unit: "× ۶ بطری", price: "۴۲۰,۰۰۰", numPrice: 420_000, unitsPerCarton: 6, original: null, disc: 0,
      img: "https://images.unsplash.com/photo-1592391303704-f3380c4fa7d0?w=300&h=300&fit=crop&auto=format" },
    { id: "p6", name: "مایع ظرفشویی گلرنگ", unit: "× ۱۲ بطری", price: "۸۸۰,۰۰۰", numPrice: 880_000, unitsPerCarton: 12, original: "۱,۰۲۰,۰۰۰", disc: 14,
      img: "https://images.unsplash.com/photo-1720468750623-39e9a09f5067?w=300&h=300&fit=crop&auto=format" },
  ];

  return (
    <MobileShell bg={H.bg}>
      {/* Overlays */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} onCategorySelect={cat => { setSearchOpen(false); setCategoryOpen(cat); }} />}
      {categoryOpen && <CategoryScreen categoryName={categoryOpen} onClose={() => setCategoryOpen(null)} onCartView={() => { setCategoryOpen(null); onTab("cart"); }} cartItems={cartItems} onAddItem={onAddItem} onInc={onInc} onDec={onDec} />}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div style={{ background: H.primary, padding: "10px 20px 18px" }}>
          {/* Row 1: store name + cart */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            {/* Cart — LEFT (end in RTL) */}
            <button
              onClick={() => onTab("cart")}
              style={{ position: "relative", width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <div style={{ position: "absolute", top: 6, left: 6, minWidth: 18, height: 18, borderRadius: 9, background: "#E53E3E", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", fontFamily: FF }}>{totalItems}</span>
                </div>
              )}
            </button>
            {/* Active distributor — tappable */}
            <button onClick={onDistSelect} style={{ textAlign: "right", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <div style={{ ...T.micro, color: "rgba(255,255,255,0.6)", fontFamily: FF, marginBottom: 2 }}>شرکت توزیع فعال</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Ic.ChevronDown size={14} color="rgba(255,255,255,0.7)" />
                <span style={{ fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: FF, letterSpacing: -0.3 }}>{activeDist.name.split(" (")[0]}</span>
              </div>
            </button>
          </div>

          {/* Search bar — tap to open overlay */}
          <button onClick={() => setSearchOpen(true)} style={{ background: "#fff", borderRadius: 12, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10, border: "none", cursor: "pointer", width: "100%", textAlign: "right" }}>
            <Ic.Search size={17} color={H.textMuted} />
            <span style={{ ...T.body, color: H.textMuted, fontFamily: FF, flex: 1 }}>
              جستجو بین همه کالاها...
            </span>
          </button>
        </div>

        {/* ── CONTENT ────────────────────────────────────────────── */}
        <div style={{ flex: 1 }}>
          {isDemo && (
            <div style={{ margin: "14px 20px 0", background: "#fff", borderRadius: 14, border: `1px solid ${H.border}`, padding: "12px 14px", direction: "rtl" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: H.primary, fontFamily: FF }}>فروشگاه اصلی</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: H.textPrimary, fontFamily: FF }}>آدرس تحویل</span>
              </div>
              <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF }}>تهران، خیابان ولیعصر، کوچه باختر، پلاک ۱۸</div>
            </div>
          )}

          {/* ── QUICK REORDER ── */}
          <div style={{ padding: "18px 20px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <button style={{ ...T.label, color: H.primaryMid, fontFamily: FF, background: "none", border: "none", cursor: "pointer" }}>مشاهده همه</button>
              <span style={{ ...T.h3, color: H.textPrimary, fontFamily: FF }}>سفارش مجدد سریع</span>
            </div>

            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, marginRight: -20, paddingRight: 20, scrollbarWidth: "none" }}>
              {quickReorders.map(item => (
                <div key={item.id} style={{ minWidth: 140, background: H.surface, borderRadius: 14, border: `1px solid ${H.border}`, overflow: "hidden", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ height: 88, overflow: "hidden", background: "#F9FAFB" }}>
                    <img
                      src={item.img} alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "8px 10px 10px" }}>
                    <div style={{ ...T.micro, color: H.textPrimary, fontWeight: 600, fontFamily: FF, lineHeight: 1.5, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                      {item.name}
                    </div>
                    <button style={{ width: "100%", height: 30, background: H.primaryLight, border: `1.5px solid ${H.primaryMid}`, borderRadius: 8, color: H.primaryMid, fontSize: 11, fontWeight: 700, fontFamily: FF, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                      <Ic.Plus size={11} color={H.primaryMid} />
                      افزودن {item.cartons} کارتن
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CATEGORY BAR ── */}
          <div style={{ padding: "14px 20px 0", marginBottom: 4 }}>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2, marginRight: -20, paddingRight: 20, scrollbarWidth: "none" }}>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => { setActiveCat(cat.id); if (cat.id !== 0) setCategoryOpen(cat.label); }}
                  style={{ padding: "6px 14px", borderRadius: 30, border: `1.5px solid ${activeCat === cat.id ? H.primaryMid : H.border}`, background: activeCat === cat.id ? H.primaryMid : H.surface, color: activeCat === cat.id ? "#fff" : H.textSec, fontSize: 12, fontWeight: 600, fontFamily: FF, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── SECTION LABEL ── */}
          <div style={{ padding: "14px 20px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button style={{ ...T.label, color: H.primaryMid, fontFamily: FF, background: "none", border: "none", cursor: "pointer" }}>مشاهده همه</button>
            <span style={{ ...T.h3, color: H.textPrimary, fontFamily: FF }}>
              {activeCat === 0 ? "پرفروش‌ترین‌ها" : categories.find(c => c.id === activeCat)?.label}
            </span>
          </div>

          {/* ── PRODUCT GRID ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 20px 24px" }}>
            {products.map(p => {
              const count = cartCounts[p.id] || 0;
              return (
                <div key={p.id} style={{ background: H.surface, borderRadius: 14, border: `1px solid ${H.border}`, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  {/* Image */}
                  <div style={{ position: "relative", height: 116, background: "#F9FAFB", overflow: "hidden" }}>
                    {p.disc > 0 && (
                      <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2, background: H.discount, color: "#fff", fontSize: 10, fontWeight: 800, fontFamily: FF, padding: "2px 7px", borderRadius: 6 }}>
                        {p.disc}٪
                      </div>
                    )}
                    <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  {/* Info */}
                  <div style={{ padding: "10px 10px 10px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: H.textPrimary, fontFamily: FF, lineHeight: 1.5, marginBottom: 2, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                      {p.name}
                    </div>
                    <div style={{ ...T.micro, color: H.textMuted, fontFamily: FF, marginBottom: 8 }}>{p.unit}</div>

                    {/* Price */}
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: H.textPrimary, fontFamily: FF, lineHeight: 1 }}>
                        {p.price}
                        <span style={{ fontSize: 10, fontWeight: 400, color: H.textSec, marginRight: 3 }}>تومان</span>
                      </div>
                      {p.original && (
                        <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF, textDecoration: "line-through", marginTop: 2 }}>{p.original}</div>
                      )}
                    </div>

                    {/* Add / counter */}
                    {count === 0 ? (
                      <button onClick={() => add(p.id, { name: p.name, price: p.numPrice, img: p.img, unitsPerCarton: p.unitsPerCarton })} style={{ width: "100%", height: 32, background: H.primaryLight, border: `1.5px solid ${H.primaryMid}`, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, color: H.primaryMid, fontSize: 12, fontWeight: 700, fontFamily: FF }}>
                        <Ic.Plus size={14} color={H.primaryMid} />
                        افزودن
                      </button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 32, background: H.primaryMid, borderRadius: 8, padding: "0 4px" }}>
                        <button onClick={() => add(p.id, { name: p.name, price: p.numPrice, img: p.img, unitsPerCarton: p.unitsPerCarton })} style={{ width: 26, height: 26, borderRadius: 6, background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Ic.Plus size={13} color="#fff" />
                        </button>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: FF }}>{count}</span>
                        <button onClick={() => sub(p.id)} style={{ width: 26, height: 26, borderRadius: 6, background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <MinusIcon />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* ── MOQ STICKY CHIP ── */}
      {totalItems > 0 && (() => {
        const cartVal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
        const moqMet = cartVal >= MIN_ORDER;
        const pct = Math.min(cartVal / MIN_ORDER, 1);
        const remaining = MIN_ORDER - cartVal;
        const fmt = (n: number) => n.toLocaleString("fa-IR");
        return (
          <div style={{ position: "absolute", bottom: 62, left: 12, right: 12, zIndex: 50, background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px rgba(0,0,0,0.13)", border: `1px solid ${moqMet ? "#BBF7D0" : H.border}`, padding: "12px 16px 10px", direction: "rtl" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                {moqMet ? (
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#15803D", fontFamily: FF }}>حداقل سفارش تامین شد ✓</span>
                ) : (
                  <span style={{ fontSize: 11, color: H.textMuted, fontFamily: FF }}>
                    <strong style={{ color: "#B42318" }}>{fmt(remaining)}</strong> تومان تا امکان ثبت سفارش
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: moqMet ? "#15803D" : H.primaryMid, fontFamily: FF }}>
                  {Math.round(pct * 100)}٪
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: H.textPrimary, fontFamily: FF }}>حداقل سفارش</span>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height: 6, borderRadius: 3, background: H.bg, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ height: "100%", width: `${pct * 100}%`, borderRadius: 3, background: moqMet ? "#22C55E" : `linear-gradient(90deg, ${H.primaryMid}, ${H.accent})`, transition: "width 0.4s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, color: H.textMuted, fontFamily: FF }}>۵۰۰٬۰۰۰ تومان</span>
              <span style={{ fontSize: 10, color: H.textPrimary, fontFamily: FF }}>
                {fmt(cartVal)} از ۵۰۰٬۰۰۰ تومان
              </span>
            </div>
          </div>
        );
      })()}

      <BottomTabBar active="home" onTab={onTab} />
    </MobileShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App Router
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// Distributor Select Screen
// ─────────────────────────────────────────────────────────────────────────────

function DistributorLogo({ d }: { d: Distributor }) {
  return (
    <div style={{ width: 64, height: 64, borderRadius: 16, background: d.logoBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: FF, textAlign: "center", lineHeight: 1.4, whiteSpace: "pre-line" }}>{d.logoText}</span>
    </div>
  );
}

function DistributorSelectScreen({ activeDistId, onSelect, onBack, cartItems, onClearCart }: {
  activeDistId: string;
  onSelect: (id: string) => void;
  onBack: () => void;
  cartItems: CartItem[];
  onClearCart: () => void;
}) {
  const [pending, setPending] = useState<Distributor | null>(null);

  const fmt = (n: number) => n.toLocaleString("fa-IR");

  const handleSelect = (d: Distributor) => {
    if (d.status === "full") return;
    if (d.id !== activeDistId && cartItems.length > 0) {
      setPending(d);
    } else {
      onSelect(d.id);
    }
  };

  const applyKeepCart = () => {
    if (pending) { onSelect(pending.id); }
    setPending(null);
  };
  const applyClearCart = () => {
    if (pending) { onClearCart(); onSelect(pending.id); }
    setPending(null);
  };

  return (
    <MobileShell bg={H.bg}>
      {/* ── CONFIRM DIALOG ── */}
      {pending && (
        <div onClick={() => setPending(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 300, display: "flex", alignItems: "flex-end" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "28px 20px 36px", width: "100%" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: H.border, margin: "0 auto 22px" }} />

            {/* Icon */}
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: H.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={H.primaryMid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>

            <div style={{ fontSize: 17, fontWeight: 800, color: H.textPrimary, fontFamily: FF, textAlign: "center", marginBottom: 10 }}>تغییر توزیع‌کننده</div>

            {/* Info rows */}
            <div style={{ background: H.bg, borderRadius: 14, padding: "14px 16px", marginBottom: 22, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, textAlign: "right" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: H.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={H.primaryMid} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span style={{ fontSize: 13, color: H.textSec, fontFamily: FF, lineHeight: 1.7, flex: 1 }}>
                  کالاهای سبد شما نگه داشته می‌شوند و قیمت‌ها بر اساس توزیع‌کننده جدید محاسبه مجدد می‌شوند.
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, textAlign: "right" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#FEF3F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B42318" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </div>
                <span style={{ fontSize: 13, color: H.textSec, fontFamily: FF, lineHeight: 1.7, flex: 1 }}>
                  کالاهایی که توزیع‌کننده جدید ارائه نمی‌دهد با برچسب <strong style={{ color: "#B42318" }}>ناموجود</strong> نشان داده می‌شوند.
                </span>
              </div>
            </div>

            {/* 3 buttons stacked */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Primary */}
              <button onClick={applyKeepCart} style={{ width: "100%", height: 52, borderRadius: 16, border: "none", background: H.primary, fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: FF, cursor: "pointer" }}>
                اعمال توزیع‌کننده جدید
              </button>
              {/* Destructive */}
              <button onClick={applyClearCart} style={{ width: "100%", height: 48, borderRadius: 16, border: `1.5px solid #FECDCA`, background: "#FEF3F2", fontSize: 14, fontWeight: 700, color: "#B42318", fontFamily: FF, cursor: "pointer" }}>
                خالی کردن سبد و تعویض
              </button>
              {/* Ghost */}
              <button onClick={() => setPending(null)} style={{ width: "100%", height: 44, borderRadius: 16, border: "none", background: "transparent", fontSize: 14, fontWeight: 600, color: H.textMuted, fontFamily: FF, cursor: "pointer" }}>
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* ── HEADER ── */}
        <div style={{ background: H.primary, padding: "14px 20px 20px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.12)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Ic.ChevronLeft size={20} color="#fff" />
            </button>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: FF }}>انتخاب شرکت توزیع</div>
            <div style={{ width: 38 }} />
          </div>
          <div style={{ marginTop: 14, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: FF }}>جستجو در شرکت‌های توزیع...</span>
          </div>
        </div>

        {/* ── DISTRIBUTOR CARDS ── */}
        <div style={{ padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
          {DISTRIBUTORS.map(d => {
            const isActive = d.id === activeDistId;
            const isFull = d.status === "full";
            const totalBase = PREVIEW_PRODUCTS.reduce((s, p) => s + p.basePrice * p.qty, 0);
            const total = Math.round(totalBase * d.priceMultiplier);

            return (
              <div key={d.id} style={{ background: "#fff", borderRadius: 20, border: `2px solid ${isActive ? H.primaryMid : H.border}`, overflow: "hidden", boxShadow: isActive ? `0 0 0 1px ${H.primaryMid}20` : "0 2px 8px rgba(0,0,0,0.05)", opacity: isFull ? 0.65 : 1 }}>
                {/* ── TOP ROW: logo + name + status ── */}
                <div style={{ padding: "16px 16px 14px", display: "flex", alignItems: "flex-start", gap: 14, borderBottom: `1px solid ${H.border}` }}>
                  <DistributorLogo d={d} />
                  <div style={{ flex: 1, textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {isActive && (
                        <div style={{ background: H.primaryLight, color: H.primaryMid, fontSize: 10, fontWeight: 800, fontFamily: FF, padding: "2px 8px", borderRadius: 20 }}>
                          انتخاب فعلی
                        </div>
                      )}
                      <div style={{ background: isFull ? "#FEF3F2" : "#F0FFF4", color: isFull ? "#B42318" : "#027A48", fontSize: 10, fontWeight: 700, fontFamily: FF, padding: "2px 8px", borderRadius: 20 }}>
                        {isFull ? "ظرفیت امروز تکمیل شده" : "فعال"}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: H.textPrimary, fontFamily: FF, marginBottom: 8, lineHeight: 1.4 }}>{d.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 11, color: H.textSec, fontFamily: FF }}>
                          {d.deliveryFee === "free" ? "ارسال رایگان" : `${fmt(d.deliveryFee as number)} تومان ارسال`}
                        </span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={d.deliveryFee === "free" ? "#027A48" : H.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                        </svg>
                      </div>
                      <div style={{ width: 1, height: 12, background: H.border }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 11, color: H.textSec, fontFamily: FF }}>تا {fmt(d.deliveryMins)} دقیقه</span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={H.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── PRODUCT PREVIEWS ── */}
                <div style={{ padding: "12px 16px 0" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: H.textMuted, fontFamily: FF, marginBottom: 10, textAlign: "right" }}>پیش‌نمایش قیمت سبد شما</div>
                  {PREVIEW_PRODUCTS.map((p, pi) => {
                    const linePrice = Math.round(p.basePrice * d.priceMultiplier) * p.qty;
                    return (
                      <div key={pi} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div style={{ textAlign: "right", flex: 1 }}>
                          <div style={{ fontSize: 11, color: H.textPrimary, fontWeight: 600, fontFamily: FF, marginBottom: 2 }}>{p.name}</div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: H.primary, fontFamily: FF }}>
                            {fmt(linePrice)} <span style={{ fontSize: 10, fontWeight: 400, color: H.textSec }}>تومان</span>
                          </div>
                        </div>
                        {/* Product thumbnail with qty badge */}
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <div style={{ width: 56, height: 56, borderRadius: 12, overflow: "hidden", background: H.bg }}>
                            <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                          <div style={{ position: "absolute", bottom: 4, left: 4, width: 20, height: 20, borderRadius: "50%", background: H.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", fontFamily: FF }}>{p.qty}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── FOOTER: total + CTA ── */}
                <div style={{ padding: "12px 16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${H.border}`, marginTop: 4 }}>
                  <button
                    onClick={() => handleSelect(d)}
                    disabled={isFull}
                    style={{ height: 44, padding: "0 20px", borderRadius: 12, border: "none", background: isFull ? H.textMuted : isActive ? H.primaryMid : H.primary, color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: FF, cursor: isFull ? "default" : "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    {isActive ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        انتخاب‌شده
                      </>
                    ) : isFull ? "ظرفیت تکمیل" : "ادامه با این شرکت"}
                  </button>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF }}>جمع کل تخمینی</div>
                    <div style={{ fontSize: 17, fontWeight: 900, color: H.textPrimary, fontFamily: FF }}>
                      {fmt(total)} <span style={{ fontSize: 11, fontWeight: 400, color: H.textSec }}>تومان</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MobileShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Jalali Calendar
// ─────────────────────────────────────────────────────────────────────────────

// Hardcoded for Shahrivar & Mehr 1405 (Sept–Oct 2026)
// Shahrivar 1, 1405 = Aug 23, 2026 = Monday → offset 2 in Sat-based week
// Mehr 1, 1405 = Sep 23, 2026 = Thursday → offset 5
const JALALI_MONTHS = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const WEEK_LABELS   = ["ش","ی","د","س","چ","پ","ج"];
// unavailable days per month index (0=Shahrivar, 1=Mehr)
const UNAVAILABLE: Record<number, number[]> = { 0: [26, 29], 1: [5, 12] };
const TODAY_DAY = 21; // Shahrivar 21

type JalaliMonth = { year: number; month: number; days: number; offset: number };
const MONTHS_DATA: JalaliMonth[] = [
  { year: 1405, month: 5, days: 31, offset: 2 }, // Shahrivar (month index 5, 0-based)
  { year: 1405, month: 6, days: 30, offset: 5 }, // Mehr
];

type CalendarDay = { day: number; past: boolean; unavailable: boolean };

function buildGrid(mi: number): (CalendarDay | null)[] {
  const { days, offset } = MONTHS_DATA[mi];
  const cells: (CalendarDay | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= days; d++) {
    const past = mi === 0 && d <= TODAY_DAY;
    const unavailable = (UNAVAILABLE[mi] ?? []).includes(d);
    cells.push({ day: d, past, unavailable });
  }
  // pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function JalaliCalendar({ onClose, onConfirm }: {
  onClose: () => void;
  onConfirm: (label: string) => void;
}) {
  const [mi, setMi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const grid = buildGrid(mi);
  const { year, month } = MONTHS_DATA[mi];
  const fmt = (n: number) => n.toLocaleString("fa-IR");

  const tap = (day: CalendarDay) => {
    if (day.past || day.unavailable || checking) return;
    setSelected(day.day);
    setError(null);
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      if ((UNAVAILABLE[mi] ?? []).includes(day.day)) {
        setError("سرویس توزیع در دسترس برای تاریخ انتخابی موجود نیست، لطفاً تاریخ دیگری انتخاب کنید.");
        setSelected(null);
      } else {
        const label = `${fmt(day.day)} ${JALALI_MONTHS[month]} ${fmt(year)}`;
        onConfirm(label);
      }
    }, 1100);
  };

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 400, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "22px 22px 0 0", padding: "0 0 28px" }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: H.border, margin: "12px auto 0" }} />

        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px" }}>
          <button onClick={() => { if (mi < MONTHS_DATA.length - 1) { setMi(m => m + 1); setSelected(null); setError(null); } }}
            style={{ width: 36, height: 36, borderRadius: 10, background: mi < MONTHS_DATA.length - 1 ? H.primaryLight : H.bg, border: "none", cursor: mi < MONTHS_DATA.length - 1 ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic.ChevronLeft size={18} color={mi < MONTHS_DATA.length - 1 ? H.primaryMid : H.textMuted} />
          </button>
          <span style={{ fontSize: 16, fontWeight: 800, color: H.textPrimary, fontFamily: FF }}>
            {JALALI_MONTHS[month]} {(year).toLocaleString("fa-IR")}
          </span>
          <button onClick={() => { if (mi > 0) { setMi(m => m - 1); setSelected(null); setError(null); } }}
            style={{ width: 36, height: 36, borderRadius: 10, background: mi > 0 ? H.primaryLight : H.bg, border: "none", cursor: mi > 0 ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic.ChevronRight size={18} color={mi > 0 ? H.primaryMid : H.textMuted} />
          </button>
        </div>

        {/* Week labels */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "0 12px", marginBottom: 6 }}>
          {WEEK_LABELS.map(l => (
            <div key={l} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: H.textMuted, fontFamily: FF, padding: "4px 0" }}>{l}</div>
          ))}
        </div>

        {/* Days grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "0 12px", gap: "4px 0" }}>
          {grid.map((cell, i) => {
            if (!cell) return <div key={i} />;
            const isSel = selected === cell.day && mi === mi;
            const isToday = mi === 0 && cell.day === TODAY_DAY;
            const disabled = cell.past || cell.unavailable;
            return (
              <button key={i} onClick={() => !disabled && tap(cell)}
                style={{ height: 40, borderRadius: 10, border: "none", cursor: disabled ? "default" : "pointer", background: isSel ? H.primary : isToday ? H.primaryLight : "transparent",
                  color: disabled ? H.textMuted : isSel ? "#fff" : isToday ? H.primaryMid : H.textPrimary,
                  fontSize: 13, fontWeight: isSel || isToday ? 800 : 500, fontFamily: FF,
                  textDecoration: cell.unavailable ? "line-through" : "none", opacity: cell.past ? 0.35 : 1 }}>
                {cell.day.toLocaleString("fa-IR")}
              </button>
            );
          })}
        </div>

        {/* Checking loader */}
        {checking && (
          <div style={{ margin: "16px 20px 0", display: "flex", alignItems: "center", gap: 10, background: H.primaryLight, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", border: `3px solid ${H.primaryMid}`, borderTopColor: "transparent", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: H.primaryMid, fontFamily: FF, fontWeight: 600 }}>در حال بررسی موجودیت...</span>
          </div>
        )}

        {/* Error */}
        {error && !checking && (
          <div style={{ margin: "14px 20px 0", background: "#FEF3F2", border: "1px solid #FECACA", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B42318" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize: 12, color: "#B42318", fontFamily: FF, lineHeight: 1.6 }}>{error}</span>
          </div>
        )}

        {/* ── LEGEND NOTE — always visible ── */}
        <div style={{ margin: "14px 16px 0", background: H.bg, borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={H.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize: 11, color: H.textSec, fontFamily: FF, lineHeight: 1.7 }}>
              تاریخ‌های در دسترس بر اساس آدرس تحویل و ظرفیت شرکت توزیع محاسبه می‌شوند.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingRight: 23 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: "#F2F4F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 11, color: H.textMuted, fontFamily: FF, textDecoration: "line-through" }}>۵</span>
              </div>
              <span style={{ fontSize: 11, color: H.textMuted, fontFamily: FF }}>تکمیل / ناموجود</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: H.primaryLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 11, color: H.primaryMid, fontFamily: FF, fontWeight: 800 }}>۱</span>
              </div>
              <span style={{ fontSize: 11, color: H.textMuted, fontFamily: FF }}>امروز</span>
            </div>
          </div>
        </div>

        <div style={{ height: 16 }} />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Checkout Screen
// ─────────────────────────────────────────────────────────────────────────────

const CHECKOUT_ITEMS = [
  { name: "نوشابه پرتقالی فانتا ۳۳۰ میلی‌لیتری", cartons: 2, pricePerCarton: 83_400, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=120&h=120&fit=crop&auto=format" },
  { name: "نوشابه کوکاکولا ۱.۵ لیتری",           cartons: 1, pricePerCarton: 115_900, img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=120&h=120&fit=crop&auto=format" },
];
const DISCOUNT = 28_300;

// Static SVG map
function StaticMap() {
  return (
    <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", height: 140, background: "#e8ecef" }}>
      <svg width="100%" height="140" viewBox="0 0 360 140" xmlns="http://www.w3.org/2000/svg">
        <rect width="360" height="140" fill="#e8ecef"/>
        {/* streets */}
        {[20,60,100,140].map(y => <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="#d0d8e0" strokeWidth="8"/>)}
        {[40,100,160,220,280,340].map(x => <line key={x} x1={x} y1="0" x2={x} y2="140" stroke="#d0d8e0" strokeWidth="8"/>)}
        {/* blocks */}
        {[[42,22,56,36],[102,22,56,36],[162,22,56,36],[222,22,56,36],[42,62,56,36],[102,62,56,36],[162,62,56,36],[222,62,116,36],[42,102,56,36],[102,102,56,36],[162,102,116,36]].map(([x,y,w,h], i) =>
          <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#dce4ed"/>
        )}
        {/* main road highlight */}
        <line x1="0" y1="100" x2="360" y2="100" stroke="#c8d4e0" strokeWidth="14"/>
        <line x1="160" y1="0" x2="160" y2="140" stroke="#c8d4e0" strokeWidth="12"/>
      </svg>
      {/* Pin */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-100%)", zIndex: 2 }}>
        <svg width="30" height="38" viewBox="0 0 30 38" fill="none">
          <path d="M15 0C6.72 0 0 6.72 0 15C0 26.25 15 38 15 38C15 38 30 26.25 30 15C30 6.72 23.28 0 15 0Z" fill={H.primary}/>
          <circle cx="15" cy="15" r="6" fill="white"/>
        </svg>
      </div>
      {/* Label chip */}
      <div style={{ position: "absolute", top: "28%", left: "50%", transform: "translateX(-50%)", background: H.primary, color: "#fff", fontSize: 11, fontWeight: 700, fontFamily: FF, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>
        محل تحویل سفارش
      </div>
    </div>
  );
}

function CheckoutScreen({ onBack, onPay, cartItems }: { onBack: () => void; onPay: (date: string, total: number) => void; cartItems: CartItem[] }) {
  const [calOpen, setCalOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const DISCOUNT = cartItems.length > 0 ? Math.round(subtotal * 0.04) : 0;
  const total = subtotal - DISCOUNT;
  const totalCartons = cartItems.reduce((s, i) => s + i.qty, 0);
  const fmt = (n: number) => n.toLocaleString("fa-IR");

  return (
    <MobileShell bg={H.bg}>
      {calOpen && (
        <JalaliCalendar
          onClose={() => setCalOpen(false)}
          onConfirm={label => { setDeliveryDate(label); setCalOpen(false); }}
        />
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ background: H.primary, padding: "14px 20px 18px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.12)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Ic.ChevronLeft size={20} color="#fff" />
            </button>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", fontFamily: FF }}>بررسی نهایی</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: FF, marginTop: 2 }}>شرکت پخش ایران</div>
            </div>
            <div style={{ width: 38 }} />
          </div>
        </div>

        <div style={{ padding: "16px 16px 110px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* ── ADDRESS CARD ── */}
          <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${H.border}`, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button style={{ fontSize: 13, fontWeight: 700, color: H.primaryMid, fontFamily: FF, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={H.primaryMid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                تغییر آدرس
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: H.textPrimary, fontFamily: FF }}>آدرس تحویل</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={H.primaryMid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
            </div>
            <div style={{ padding: "0 16px 14px" }}>
              <StaticMap />
              <div style={{ marginTop: 12, fontSize: 12, color: H.textSec, fontFamily: FF, lineHeight: 1.8, textAlign: "right" }}>
                تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۴ — سوپرمارکت احمدی
              </div>
            </div>
          </div>

          {/* ── DELIVERY DATE CARD ── */}
          <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${H.border}`, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, justifyContent: "flex-end" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: H.textPrimary, fontFamily: FF }}>زمان ارسال</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={H.primaryMid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>

            {deliveryDate ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: H.primaryLight, borderRadius: 12, padding: "12px 14px" }}>
                <button onClick={() => setCalOpen(true)} style={{ fontSize: 12, color: H.primaryMid, fontWeight: 600, fontFamily: FF, background: "none", border: "none", cursor: "pointer" }}>تغییر</button>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: H.primary, fontFamily: FF }}>{deliveryDate}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={H.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
            ) : (
              <button onClick={() => setCalOpen(true)} style={{ width: "100%", height: 50, borderRadius: 12, border: `2px dashed ${H.primaryMid}`, background: H.primaryLight, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={H.primaryMid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span style={{ fontSize: 14, fontWeight: 700, color: H.primaryMid, fontFamily: FF }}>انتخاب تاریخ تحویل</span>
              </button>
            )}
          </div>

          {/* ── ORDER ITEMS ── */}
          <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${H.border}`, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: H.textPrimary, fontFamily: FF }}>خلاصه سفارش</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={H.primaryMid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderTop: `1px solid ${H.border}` }}>
                <div style={{ textAlign: "right", flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: H.textPrimary, fontFamily: FF, marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF }}>
                    {item.qty.toLocaleString("fa-IR")} کارتن × {fmt(item.price)} تومان
                  </div>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", background: H.bg, flexShrink: 0 }}>
                  <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
            ))}
            {/* Summary rows */}
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${H.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: H.textSec, fontFamily: FF }}>{fmt(totalCartons)} کارتن</span>
                <span style={{ fontSize: 12, color: H.textSec, fontFamily: FF }}>تعداد اقلام</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: H.textSec, fontFamily: FF }}>{fmt(subtotal)} تومان</span>
                <span style={{ fontSize: 12, color: H.textSec, fontFamily: FF }}>جمع جزء</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: H.success, fontFamily: FF, fontWeight: 700 }}>− {fmt(DISCOUNT)} تومان</span>
                <span style={{ fontSize: 12, color: H.textSec, fontFamily: FF }}>تخفیف</span>
              </div>
              <div style={{ height: 1, background: H.border }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: H.primary, fontFamily: FF }}>{fmt(total)} تومان</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: H.textPrimary, fontFamily: FF }}>جمع کل</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div style={{ background: "#fff", borderTop: `1px solid ${H.border}`, padding: "12px 16px 16px", flexShrink: 0, boxShadow: "0 -4px 20px rgba(0,0,0,0.07)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: H.primary, fontFamily: FF }}>{fmt(total)} <span style={{ fontSize: 12, fontWeight: 400, color: H.textSec }}>تومان</span></div>
          <span style={{ fontSize: 12, color: H.textSec, fontFamily: FF }}>مبلغ قابل پرداخت</span>
        </div>
        <button
          onClick={() => deliveryDate && onPay(deliveryDate, total)}
          style={{ width: "100%", height: 54, borderRadius: 16, border: "none", background: deliveryDate ? H.primary : H.textMuted, color: "#fff", fontSize: 16, fontWeight: 800, fontFamily: FF, cursor: deliveryDate ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          {deliveryDate ? "تایید و پرداخت" : "ابتدا تاریخ تحویل را انتخاب کنید"}
        </button>
      </div>

      <BottomTabBar active="cart" onTab={() => {}} />
    </MobileShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Payment Gateway Screen (mock)
// ─────────────────────────────────────────────────────────────────────────────

function PaymentGatewayScreen({ onComplete, onFail, orderTotal }: { onComplete: () => void; onFail: () => void; orderTotal: number }) {
  const [step, setStep] = useState(0); // 0=loading, 1=form, 2=processing
  const [shouldFail, setShouldFail] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStep(1), 1400);
    return () => clearTimeout(t);
  }, []);

  const pay = () => {
    setStep(2);
    if (shouldFail) {
      setTimeout(onFail, 1800);
    } else {
      setTimeout(onComplete, 1600);
    }
  };

  return (
    <MobileShell bg="#F8FAFF">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        {/* Gateway logo block */}
        <div style={{ width: 90, height: 90, borderRadius: 24, background: H.primary, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: `0 8px 32px ${H.primary}40` }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        </div>

        {step === 0 && (
          <>
            <div style={{ fontSize: 17, fontWeight: 800, color: H.textPrimary, fontFamily: FF, marginBottom: 10 }}>در حال انتقال به درگاه پرداخت...</div>
            <div style={{ fontSize: 13, color: H.textMuted, fontFamily: FF }}>لطفاً صبر کنید</div>
            <div style={{ marginTop: 28, width: 40, height: 40, borderRadius: "50%", border: `4px solid ${H.primaryLight}`, borderTopColor: H.primaryMid, animation: "spin 0.8s linear infinite" }} />
          </>
        )}

        {step === 1 && (
          <div style={{ width: "100%", background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF, marginBottom: 4, textAlign: "center" }}>درگاه پرداخت امن ملت</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: H.textPrimary, fontFamily: FF, marginBottom: 4, textAlign: "center" }}>اطلاعات کارت بانکی</div>
            {/* Amount meta */}
            <div style={{ fontSize: 13, fontWeight: 800, color: H.primary, fontFamily: FF, textAlign: "center", marginBottom: 18 }}>
              {orderTotal.toLocaleString("fa-IR")} <span style={{ fontSize: 11, fontWeight: 400, color: H.textSec }}>تومان</span>
            </div>
            {[{ label: "شماره کارت", placeholder: "---- ---- ---- ----", dir: "ltr" }, { label: "تاریخ انقضا", placeholder: "MM/YY", dir: "ltr" }, { label: "CVV2", placeholder: "•••", dir: "ltr" }].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: H.textSec, fontFamily: FF, marginBottom: 5, textAlign: "right" }}>{f.label}</div>
                <input readOnly placeholder={f.placeholder} dir={f.dir as "ltr"}
                  style={{ width: "100%", height: 46, borderRadius: 12, border: `1.5px solid ${H.border}`, padding: "0 14px", fontSize: 14, fontFamily: "monospace", outline: "none", background: H.bg, textAlign: "center", color: H.textPrimary }} />
              </div>
            ))}
            {/* Dev toggle: simulate failure */}
            <button
              onClick={() => setShouldFail(f => !f)}
              style={{ width: "100%", marginBottom: 10, height: 34, borderRadius: 10, border: `1.5px solid ${shouldFail ? "#B42318" : H.border}`, background: shouldFail ? "#FEF3F2" : H.bg, fontSize: 11, fontWeight: 700, color: shouldFail ? "#B42318" : H.textMuted, fontFamily: FF, cursor: "pointer" }}
            >
              {shouldFail ? "⚠ شبیه‌سازی خطای پرداخت فعال" : "شبیه‌سازی خطای پرداخت (dev)"}
            </button>
            <button onClick={pay} style={{ width: "100%", height: 50, borderRadius: 14, background: H.primary, border: "none", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: FF, cursor: "pointer" }}>
              پرداخت
            </button>
          </div>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize: 17, fontWeight: 800, color: H.textPrimary, fontFamily: FF, marginBottom: 8 }}>در حال پردازش پرداخت...</div>
            <div style={{ marginTop: 20, width: 40, height: 40, borderRadius: "50%", border: `4px solid ${H.primaryLight}`, borderTopColor: H.success, animation: "spin 0.8s linear infinite" }} />
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </MobileShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Order Confirmed Screen
// ─────────────────────────────────────────────────────────────────────────────

function OrderConfirmedScreen({ deliveryDate, total, onHome, onOrderDetails }: {
  deliveryDate: string; total: number; onHome: () => void; onOrderDetails: () => void;
}) {
  const orderNum = "JT-" + Math.floor(100000 + Math.random() * 900000);
  const fmt = (n: number) => n.toLocaleString("fa-IR");

  return (
    <MobileShell bg={H.bg}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", gap: 0 }}>
        {/* Big green checkmark */}
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#F0FFF4", border: `3px solid ${H.success}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke={H.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <div style={{ fontSize: 22, fontWeight: 900, color: H.textPrimary, fontFamily: FF, marginBottom: 8 }}>سفارش شما ثبت شد!</div>
        <div style={{ fontSize: 13, color: H.textMuted, fontFamily: FF, marginBottom: 28 }}>پیامک تأیید برای شما ارسال خواهد شد</div>

        {/* Info card */}
        <div style={{ width: "100%", background: "#fff", borderRadius: 20, border: `1px solid ${H.border}`, padding: "20px 20px", marginBottom: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "شماره سفارش", value: orderNum, mono: true },
            { label: "جمع کل پرداخت‌شده", value: fmt(total) + " تومان", mono: false },
            { label: "تاریخ تحویل", value: deliveryDate, mono: false },
            { label: "شرکت توزیع", value: "شرکت پخش ایران", mono: false },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: row.mono ? 800 : 600, color: H.primary, fontFamily: row.mono ? "monospace" : FF }}>{row.value}</span>
              <span style={{ fontSize: 12, color: H.textMuted, fontFamily: FF }}>{row.label}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <button onClick={onOrderDetails} style={{ width: "100%", height: 52, borderRadius: 16, background: H.primary, border: "none", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: FF, cursor: "pointer", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          مشاهده جزئیات سفارش
        </button>
        <button onClick={onHome} style={{ width: "100%", height: 48, borderRadius: 16, background: H.primaryLight, border: `1.5px solid ${H.primaryMid}`, color: H.primaryMid, fontSize: 14, fontWeight: 700, fontFamily: FF, cursor: "pointer" }}>
          بازگشت به صفحه اصلی
        </button>
      </div>
    </MobileShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Payment Failed Screen
// ─────────────────────────────────────────────────────────────────────────────

function PaymentFailedScreen({ orderTotal, onRetry, onBackToCart }: {
  orderTotal: number;
  onRetry: () => void;
  onBackToCart: () => void;
}) {
  const fmt = (n: number) => n.toLocaleString("fa-IR");
  return (
    <MobileShell bg="#F8FAFF">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>

        {/* Error icon */}
        <div style={{ width: 96, height: 96, borderRadius: "50%", background: "#FEF3F2", border: "3px solid #FECDCA", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#B42318" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>

        <div style={{ fontSize: 22, fontWeight: 900, color: H.textPrimary, fontFamily: FF, marginBottom: 10 }}>پرداخت ناموفق</div>

        {/* Trust copy */}
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 14, padding: "14px 16px", marginBottom: 24, width: "100%", display: "flex", alignItems: "flex-start", gap: 10 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span style={{ fontSize: 13, color: "#15803D", fontFamily: FF, lineHeight: 1.7 }}>
            هیچ مبلغی از حساب شما کسر نشده است. تراکنش شما لغو شد و وجهی برداشت نگردید.
          </span>
        </div>

        {/* Meta card */}
        <div style={{ width: "100%", background: "#fff", borderRadius: 18, border: `1px solid ${H.border}`, padding: "18px 20px", marginBottom: 28, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "مبلغ پرداخت‌نشده", value: fmt(orderTotal) + " تومان", highlight: true },
            { label: "وضعیت تراکنش", value: "ناموفق" },
            { label: "شرکت توزیع", value: "شرکت پخش ایران" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: row.highlight ? "#B42318" : H.textPrimary, fontFamily: FF }}>{row.value}</span>
              <span style={{ fontSize: 12, color: H.textMuted, fontFamily: FF }}>{row.label}</span>
            </div>
          ))}
          <div style={{ height: 1, background: H.border }} />
          <div style={{ fontSize: 11, color: H.textMuted, fontFamily: FF, textAlign: "right", lineHeight: 1.7 }}>
            سبد خرید شما دست‌نخورده باقی مانده است. می‌توانید مجدداً تلاش کنید یا پس از بررسی سبد، پرداخت را انجام دهید.
          </div>
        </div>

        {/* Buttons */}
        <button onClick={onRetry} style={{ width: "100%", height: 54, borderRadius: 16, background: H.primary, border: "none", color: "#fff", fontSize: 16, fontWeight: 800, fontFamily: FF, cursor: "pointer", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          تلاش مجدد
        </button>
        <button onClick={onBackToCart} style={{ width: "100%", height: 50, borderRadius: 16, background: "transparent", border: `2px solid ${H.primaryMid}`, color: H.primaryMid, fontSize: 14, fontWeight: 700, fontFamily: FF, cursor: "pointer" }}>
          بازگشت به سبد خرید
        </button>
      </div>
    </MobileShell>
  );
}

type Screen = "login" | "otp" | "addr-sheet" | "addr-search" | "map" | "addr-details" | "profile" | "cart" | "orders" | "home" | "dist-select" | "checkout" | "payment-gw" | "payment-failed" | "order-confirmed" | "wallet-topup" | "wallet-gateway" | "wallet-failed";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [activeDistId, setActiveDistId] = useState("d1");
  const [orderDeliveryDate, setOrderDeliveryDate] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [walletTopUpAmount, setWalletTopUpAmount] = useState(0);
  const [profileToast, setProfileToast] = useState("");

  const goTab = (t: "home" | "cart" | "orders" | "profile") => {
    setScreen(t as Screen);
  };

  const onAddItem = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + item.qty } : i);
      return [...prev, item];
    });
  };
  const onInc = (id: string) => setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  const onDec = (id: string) => setCartItems(prev => {
    const item = prev.find(i => i.id === id);
    if (!item) return prev;
    if (item.qty <= 1) return prev.filter(i => i.id !== id);
    return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
  });
  const onRemove = (id: string) => setCartItems(prev => prev.filter(i => i.id !== id));
  const onClearCart = () => setCartItems([]);

  const handleDemo = () => {
    setIsDemo(true);
    setCartItems(SEED_ITEMS);
    setScreen("home");
  };

  const cartProps = { cartItems, onAddItem, onInc, onDec };
  const completeWalletTopUp = () => {
    const amount = walletTopUpAmount;
    setWalletBalance(prev => prev + amount);
    setWalletTransactions(prev => [{ id: String(Date.now()), amount, createdAt: "همین الان", status: "success" }, ...prev]);
    setProfileToast(`پرداخت ${amount.toLocaleString("fa-IR")} تومان با موفقیت انجام شد`);
    setScreen("profile");
  };

  switch (screen) {
    case "login":        return <Screen1 onNext={() => setScreen("otp")} onDemo={handleDemo} />;
    case "otp":          return <Screen2 onNext={() => setScreen("addr-sheet")} onBack={() => setScreen("login")} />;
    case "addr-sheet":   return <Screen3 onAddNew={() => setScreen("addr-search")} onSelect={() => setScreen("home")} />;
    case "addr-search":  return <Screen4 onBack={() => setScreen("addr-sheet")} onSelect={() => setScreen("map")} />;
    case "map":          return <Screen5 onBack={() => setScreen("addr-search")} onConfirm={() => setScreen("addr-details")} />;
    case "addr-details": return <Screen6 onBack={() => setScreen("map")} onSave={() => setScreen("home")} />;
    case "profile":      return <Screen7 onTab={goTab} walletBalance={walletBalance} transactions={walletTransactions} toast={profileToast} onTopUp={() => { setProfileToast(""); setScreen("wallet-topup"); }} />;
    case "wallet-topup": return <WalletTopUpScreen balance={walletBalance} onBack={() => setScreen("profile")} onPay={amount => { setWalletTopUpAmount(amount); setScreen("wallet-gateway"); }} />;
    case "wallet-gateway": return <WalletGatewayScreen amount={walletTopUpAmount} onSuccess={completeWalletTopUp} onFail={() => setScreen("wallet-failed")} />;
    case "wallet-failed": return <WalletPaymentFailedScreen amount={walletTopUpAmount} onRetry={() => setScreen("wallet-gateway")} onProfile={() => setScreen("profile")} />;
    case "cart":         return <Screen8 onBack={() => setScreen("home")} onTab={goTab} onCheckout={() => setScreen("checkout")} items={cartItems} onInc={onInc} onDec={onDec} onRemove={onRemove} onAddItem={onAddItem} />;
    case "orders":       return <Screen9 onBack={() => setScreen("home")} onTab={goTab} />;
    case "home":         return <Screen10 onTab={goTab} onDistSelect={() => setScreen("dist-select")} activeDistId={activeDistId} isDemo={isDemo} {...cartProps} />;
    case "dist-select":  return <DistributorSelectScreen activeDistId={activeDistId} onSelect={id => { setActiveDistId(id); setScreen("home"); }} onBack={() => setScreen("home")} cartItems={cartItems} onClearCart={onClearCart} />;
    case "checkout":     return <CheckoutScreen onBack={() => setScreen("cart")} onPay={(date, total) => { setOrderDeliveryDate(date); setOrderTotal(total); setScreen("payment-gw"); }} cartItems={cartItems} />;
    case "payment-gw":   return <PaymentGatewayScreen onComplete={() => setScreen("order-confirmed")} onFail={() => setScreen("payment-failed")} orderTotal={orderTotal} />;
    case "payment-failed": return <PaymentFailedScreen orderTotal={orderTotal} onRetry={() => setScreen("payment-gw")} onBackToCart={() => setScreen("cart")} />;
    case "order-confirmed": return <OrderConfirmedScreen deliveryDate={orderDeliveryDate} total={orderTotal} onHome={() => { onClearCart(); setScreen("home"); }} onOrderDetails={() => setScreen("orders")} />;
    default:             return <Screen1 onNext={() => setScreen("otp")} onDemo={handleDemo} />;
  }
}
