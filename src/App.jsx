import { useState, useMemo, useRef, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
`;

const C = {
  bg: "#080808", surface: "#101010", surfaceHigh: "#161616", border: "#1e1e1e",
  gold: "#C9A84C", goldLight: "#E8C97A", goldDim: "#2E2410",
  green: "#2ECC71", greenDim: "#0D2E1A", red: "#E74C3C", redDim: "#2E0D0D",
  blue: "#3498DB", purple: "#9B59B6",
  text: "#F0EDE6", textDim: "#555050", textMid: "#999490",
};

// ── ACCOUNTS ─────────────────────────────────────────────────────────────────
const INIT_ACCOUNTS = [
  { id: "nu_nom", nombre: "NU Nómina", emoji: "🏦", tipo: "Débito", color: C.purple },
  { id: "tdc", nombre: "TDC", emoji: "💳", tipo: "Crédito", color: C.gold },
  { id: "efectivo", nombre: "Efectivo", emoji: "💵", tipo: "Cash", color: "#27AE60" },
];

// ── CATEGORIES ─────────────────────────────────────────────────────────────
const INIT_CATS = [
  { id: "deudas", nombre: "Deudas", emoji: "💳", color: "#E53E3E", subs: [
    { id: "deuda_pasiva", nombre: "Deuda pasiva", emoji: "🔴" },
    { id: "deuda_buena", nombre: "Deuda buena", emoji: "🟢" },
    { id: "prestamo", nombre: "Préstamo", emoji: "🏦" },
  ]},
  { id: "vivienda", nombre: "Vivienda", emoji: "🏠", color: "#C05621", subs: [
    { id: "gastos_hogar", nombre: "Gastos del hogar", emoji: "🧹" },
  ]},
  { id: "movilidad", nombre: "Movilidad", emoji: "🏍️", color: "#DD6B20", subs: [
    { id: "moto_mant", nombre: "Mantenimiento moto", emoji: "🔧" },
    { id: "transporte", nombre: "Transporte", emoji: "🚌" },
    { id: "uber", nombre: "Uber", emoji: "🚗" },
  ]},
  { id: "comida", nombre: "Comida", emoji: "🍽️", color: "#38A169", subs: [
    { id: "gusto", nombre: "Gusto", emoji: "🍕" },
    { id: "basura", nombre: "Basura", emoji: "🍬" },
  ]},
  { id: "salud", nombre: "Salud", emoji: "🏥", color: "#319795", subs: [
    { id: "salud_general", nombre: "Salud general", emoji: "🩺" },
    { id: "farmacia", nombre: "Farmacia", emoji: "💊" },
    { id: "fisio", nombre: "Fisio", emoji: "🦴" },
  ]},
  { id: "educacion", nombre: "Educación", emoji: "📚", color: "#805AD5", subs: [
    { id: "papeleria", nombre: "Papelería", emoji: "✏️" },
    { id: "trabajuguetes", nombre: "Trabajuguetes", emoji: "🛠️" },
    { id: "herramientas", nombre: "Herramientas", emoji: "⚙️" },
  ]},
  { id: "estilo", nombre: "Ropa & Estilo", emoji: "👕", color: "#D53F8C", subs: [
    { id: "ropa", nombre: "Ropa", emoji: "👗" },
  ]},
  { id: "tiempo_libre", nombre: "Tiempo Libre", emoji: "🎯", color: "#D69E2E", subs: [
    { id: "caprichos", nombre: "Caprichos", emoji: "✨" },
    { id: "apuestas", nombre: "Apuestas", emoji: "🎲" },
    { id: "ocio", nombre: "Ocio / Salidas", emoji: "🎉" },
  ]},
  { id: "ahorro", nombre: "Ahorro / Inversión", emoji: "💰", color: "#2F855A", subs: [
    { id: "cajitas", nombre: "Cajitas NU", emoji: "🪙" },
    { id: "premios", nombre: "Premios", emoji: "🏆" },
  ]},
  { id: "ingresos", nombre: "Ingresos", emoji: "⬆️", color: "#2ECC71", subs: [
    { id: "salario", nombre: "Salario", emoji: "🏢" },
    { id: "freelance", nombre: "Freelance", emoji: "💻" },
    { id: "didi_ing", nombre: "DIDI / Delivery", emoji: "🛵" },
    { id: "tanda_ing", nombre: "Tanda", emoji: "💵" },
    { id: "otro_ing", nombre: "Otro ingreso", emoji: "⬆️" },
  ]},
  { id: "otros", nombre: "Otros", emoji: "📦", color: "#718096", subs: [
    { id: "otros_general", nombre: "Otros", emoji: "🔹" },
  ]},
];

const INIT_TXS = [];

const INIT_PRESUPUESTO = {
  q1: [
    { id: "renta", nombre: "Renta", emoji: "🏠", monto: 2000, frecuencia: "Mensual", pagado: false },
    { id: "moto", nombre: "Moto", emoji: "🏍️", monto: 4200, frecuencia: "Mensual", pagado: false },
    { id: "comida_real", nombre: "Comida real", emoji: "🥩", monto: 1600, frecuencia: "Mensual", pagado: false },
    { id: "uni", nombre: "Uni", emoji: "🎓", monto: 1600, frecuencia: "Mensual", pagado: false },
    { id: "gym", nombre: "GYM", emoji: "🏆", monto: 450, frecuencia: "Mensual", pagado: false },
    { id: "att", nombre: "AT&T", emoji: "📞", monto: 200, frecuencia: "Mensual", pagado: false },
    { id: "casa", nombre: "Casa", emoji: "🏡", monto: 1000, frecuencia: "Mensual", pagado: false },
    { id: "barber", nombre: "Barber", emoji: "✂️", monto: 100, frecuencia: "Mensual", pagado: false },
    { id: "psicologo", nombre: "Psicólogo", emoji: "🧠", monto: 600, frecuencia: "Quincenal", pagado: false },
    { id: "gas", nombre: "Gas", emoji: "⛽", monto: 285, frecuencia: "Semanal", pagado: false },
  ],
  q2: [
    { id: "moto_q2", nombre: "Moto", emoji: "🏍️", monto: 4200, frecuencia: "Mensual", pagado: false },
    { id: "comida_real_q2", nombre: "Comida real", emoji: "🥩", monto: 1600, frecuencia: "Mensual", pagado: false },
    { id: "psicologo_q2", nombre: "Psicólogo", emoji: "🧠", monto: 600, frecuencia: "Quincenal", pagado: false },
    { id: "gas_q2", nombre: "Gas", emoji: "⛽", monto: 285, frecuencia: "Semanal", pagado: false },
  ],
};

const INIT_DEUDAS = [];
const INIT_TDCS = [];

const INIT_CFG = {
  ingreso_quincena: 0, horas_dia: 8, dias_semana: 5,
  horas_extra: 0, ingreso_extra: 0,
  nombre: "", meta_ahorro_pct: 20, meta_deuda_pct: 25,
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
function toTime(mxn, rate, hd = 8) {
  if (!rate || rate <= 0) return "—";
  const h = mxn / rate;
  if (h < 1) return `${Math.round(h * 60)}min`;
  if (h < hd) return `${h.toFixed(1)}h`;
  const d = h / hd;
  if (d < 5) return `${d.toFixed(1)} días`;
  return `${(d / 5).toFixed(1)} sem`;
}
function fmt(n, dec = 0) { return `$${Math.abs(n).toLocaleString("es-MX", { minimumFractionDigits: dec, maximumFractionDigits: dec })}`; }
function fmtDate(iso) { return new Date(iso + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "short" }); }
function groupByMonth(txs) {
  const map = {};
  txs.forEach(t => { const k = t.fecha.slice(0, 7); if (!map[k]) map[k] = []; map[k].push(t); });
  return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
}
function monthLabel(ym) {
  const [y, m] = ym.split("-");
  return `${["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][+m-1]} ${y}`;
}
function compoundGrowth(capital, rate, years) {
  return capital * Math.pow(1 + rate / 100, years);
}
function healthScore(txs, cfg) {
  const gastos = txs.filter(t => t.tipo === "gasto").reduce((a, t) => a + t.monto, 0);
  const deudas = txs.filter(t => t.tipo === "gasto" && t.catId === "deudas").reduce((a, t) => a + t.monto, 0);
  const ahorros = txs.filter(t => t.tipo === "gasto" && t.catId === "ahorro").reduce((a, t) => a + t.monto, 0);
  const ing = cfg.ingreso_quincena;
  const savRate = ing > 0 ? (ahorros / ing) * 100 : 0;
  const dRate = ing > 0 ? (deudas / ing) * 100 : 0;
  let s = 50;
  s += (ing - gastos) > 0 ? 15 : -20;
  s += savRate >= cfg.meta_ahorro_pct ? 20 : (savRate / cfg.meta_ahorro_pct) * 10;
  s += dRate <= cfg.meta_deuda_pct ? 15 : -(dRate - cfg.meta_deuda_pct) * 0.5;
  s = Math.max(0, Math.min(100, Math.round(s)));
  const [label, icon, color] = s >= 75 ? ["Buen camino","🌱",C.green] : s >= 50 ? ["Alerta","⚠️",C.gold] : s >= 30 ? ["Empobreciendo","📉","#E67E22"] : ["Crisis","🔴",C.red];
  return { score: s, label, icon, color, savRate, dRate };
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  ::-webkit-scrollbar { display: none; }
  html, body { background: #080808; font-family: 'Sora', sans-serif; }
  .app { font-family: 'Sora', sans-serif; background: #080808; min-height: 100vh; max-width: 430px; margin: 0 auto; color: #F0EDE6; }
  .mono { font-family: 'Space Mono', monospace; }
  .scr { padding: 0 0 96px; animation: fadeIn .2s ease; }
  .hdr { padding: 52px 20px 16px; }
  .card { background: #101010; border: 1px solid #1e1e1e; border-radius: 18px; padding: 16px; }
  .tabbar { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: rgba(8,8,8,0.97); backdrop-filter: blur(24px); border-top: 1px solid #1a1a1a; display: flex; padding: 8px 0 22px; z-index: 100; }
  .ti { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 7px 0; opacity: .25; transition: opacity .2s; background: none; border: none; color: #F0EDE6; }
  .ti.on { opacity: 1; }
  .ti.on .tlbl { color: #C9A84C; }
  .tlbl { font-size: 9px; font-family: 'Sora', sans-serif; letter-spacing: .04em; }
  .ticon { font-size: 18px; }
  .fab { position: fixed; bottom: 84px; right: calc(50% - 215px + 18px); width: 54px; height: 54px; border-radius: 50%; background: #C9A84C; border: none; cursor: pointer; z-index: 90; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 28px #C9A84C55; font-size: 26px; color: #000; font-weight: 300; transition: transform .15s; }
  .fab:active { transform: scale(.92); }
  .ptk { height: 5px; background: #1e1e1e; border-radius: 100px; overflow: hidden; }
  .ptf { height: 100%; border-radius: 100px; transition: width .7s cubic-bezier(.23,1,.32,1); }
  .row { display: flex; align-items: center; gap: 12px; padding: 13px 0; border-bottom: 1px solid #161616; }
  .row:last-child { border-bottom: none; }
  .sec { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: #555050; font-weight: 600; margin-bottom: 10px; font-family: 'Sora', sans-serif; }
  .inp { background: #141414; border: 1px solid #1e1e1e; border-radius: 12px; padding: 13px 14px; color: #F0EDE6; font-family: 'Sora', sans-serif; font-size: 15px; width: 100%; outline: none; transition: border-color .2s; }
  .inp:focus { border-color: #C9A84C66; }
  select.inp { -webkit-appearance: none; }
  .chip { display: inline-flex; align-items: center; gap: 5px; padding: 5px 11px; border-radius: 100px; font-size: 12px; background: #161616; border: 1px solid #1e1e1e; cursor: pointer; transition: all .18s; font-family: 'Sora', sans-serif; }
  .chip.sel { background: #2E2410; border-color: #C9A84C; color: #C9A84C; }
`;

// ── WEBHOOK ───────────────────────────────────────────────────────────────────
const WEBHOOK_URL = "https://hook.eu1.make.com/1tgq5dkauhk7of5julki7g132mciupq4";

async function sendToMake(payload) {
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (e) {
    console.error("Make error:", e);
    return false;
  }
}

// ── TRANSACTION FORM — single screen ─────────────────────────────────────────
function TxForm({ cats, accounts, cfg, rate, onSave, onClose }) {
  const today = new Date().toISOString().split("T")[0];
  const [tipo, setTipo] = useState("gasto");
  const [monto, setMonto] = useState("");
  const [catId, setCatId] = useState("");
  const [subId, setSubId] = useState("");
  const [cuentaId, setCuentaId] = useState(accounts[0]?.id || "");
  const [cuentaDestId, setCuentaDestId] = useState(accounts[1]?.id || "");
  const [fecha, setFecha] = useState(today);
  const [nota, setNota] = useState("");
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [showSubPicker, setShowSubPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const montoParsed = parseFloat(monto) || 0;
  const tipoColor = tipo === "ingreso" ? C.green : tipo === "transferencia" ? C.blue : C.gold;
  const currentCat = cats.find(c => c.id === catId);
  const currentSub = currentCat?.subs.find(s => s.id === subId);
  const tiempoStr = montoParsed > 0 ? toTime(montoParsed, rate, cfg.horas_dia) : null;
  const cuenta = accounts.find(a => a.id === cuentaId);

  async function save() {
    if (!montoParsed || (!catId && tipo !== "transferencia")) return;
    setSaving(true);

    const tx = {
      id: `tx_${Date.now()}`,
      fecha,
      tipo,
      monto: montoParsed,
      categoria: currentCat?.nombre || catId,
      subcategoria: currentSub?.nombre || subId || "",
      cuenta: cuenta?.nombre || cuentaId,
      nota,
      quincena: new Date(fecha + "T12:00:00").getDate() <= 15 ? 1 : 2,
      mes: fecha.slice(0, 7),
    };

    await sendToMake(tx);

    onSave({ ...tx, catId: catId || "otros", subId: subId || "", cuentaId });
    setSaving(false);
    onClose();
  }

  const QUICK = [100, 200, 344, 500, 800, 1000, 1600, 2100];

  const sectionTitle = (txt) => (
    <p style={{ fontSize: 11, color: C.textDim, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 10, marginTop: 20 }}>{txt}</p>
  );

  const fieldRow = (icon, label, value, onClick, accent) => (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 16px", background: C.surfaceHigh, border: `1px solid ${accent ? C.gold + "55" : C.border}`, borderRadius: 14, width: "100%", textAlign: "left", cursor: "pointer", transition: "all .18s", marginBottom: 8 }}>
      <span style={{ fontSize: 20, width: 28, textAlign: "center", flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 2, fontFamily: "'Sora',sans-serif" }}>{label}</div>
        <div style={{ fontSize: 14, color: accent ? C.goldLight : C.text, fontWeight: 500, fontFamily: "'Sora',sans-serif" }}>{value}</div>
      </div>
      <span style={{ color: C.textDim, fontSize: 16 }}>›</span>
    </button>
  );

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: C.bg, zIndex: 999, display: "flex", flexDirection: "column", animation: "slideUp .28s cubic-bezier(.32,0,.32,1) both", maxWidth: 430, margin: "0 auto" }}>
      {/* Top bar */}
      <div style={{ padding: "52px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: "50%", background: "#161616", border: `1px solid ${C.border}`, color: C.text, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        <div style={{ display: "flex", background: "#141414", borderRadius: 12, padding: 3, gap: 2 }}>
          {[["gasto","Gasto",C.gold],["ingreso","Ingreso",C.green],["transferencia","↔",C.blue]].map(([v,l,col]) => (
            <button key={v} onClick={() => setTipo(v)} style={{ padding: "8px 14px", border: "none", borderRadius: 9, fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", background: tipo === v ? col : "transparent", color: tipo === v ? "#000" : C.textDim, transition: "all .2s" }}>{l}</button>
          ))}
        </div>
        <button onClick={save} disabled={saving} style={{ background: tipoColor, border: "none", borderRadius: 12, padding: "10px 18px", color: "#000", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: (!montoParsed || (!catId && tipo !== "transferencia") || saving) ? 0.35 : 1 }}>{saving ? "..." : "Guardar"}</button>
      </div>

      {/* Amount hero */}
      <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
        <div style={{ background: "#0d0d0d", border: `1px solid ${tipoColor}33`, borderRadius: 20, padding: "20px 20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18, color: tipoColor, fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>MXN</span>
            <input
              type="number" inputMode="decimal" autoFocus placeholder="0"
              value={monto} onChange={e => setMonto(e.target.value)}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: tipoColor, fontFamily: "'Space Mono',monospace", fontSize: 42, fontWeight: 700, minWidth: 0 }}
            />
          </div>
          {tiempoStr && (
            <div style={{ fontSize: 13, color: C.textDim, fontFamily: "'Space Mono',monospace" }}>
              ⏱ <span style={{ color: tipoColor }}>{tiempoStr}</span> de tu vida
            </div>
          )}
          {/* Quick amounts */}
          <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
            {QUICK.map(v => (
              <button key={v} onClick={() => setMonto(v.toString())} style={{ padding: "5px 10px", background: "#1a1a1a", border: `1px solid ${monto === String(v) ? tipoColor : C.border}`, borderRadius: 8, color: monto === String(v) ? tipoColor : C.textDim, fontFamily: "'Space Mono',monospace", fontSize: 12, cursor: "pointer" }}>
                {fmt(v)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable fields */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 0" }}>

        {sectionTitle("Categoría")}
        <button onClick={() => setShowCatPicker(true)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 16px", background: catId ? `${currentCat?.color}18` : "#141414", border: `1px solid ${catId ? (currentCat?.color + "55") : C.border}`, borderRadius: 14, width: "100%", textAlign: "left", cursor: "pointer", marginBottom: 8 }}>
          <span style={{ fontSize: 22, width: 30, textAlign: "center" }}>{currentCat?.emoji || "🏷️"}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: C.textDim, marginBottom: 2 }}>Categoría</div>
            <div style={{ fontSize: 14, color: catId ? C.text : C.textDim, fontWeight: catId ? 500 : 400 }}>{currentCat?.nombre || "Seleccionar"}</div>
          </div>
          {catId && currentCat?.subs?.length > 0 && (
            <button onClick={e => { e.stopPropagation(); setShowSubPicker(true); }} style={{ background: subId ? "#2E2410" : "#1a1a1a", border: `1px solid ${subId ? C.gold : C.border}`, borderRadius: 10, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 14 }}>{currentSub?.emoji || "·"}</span>
              <span style={{ fontSize: 12, color: subId ? C.goldLight : C.textDim, fontFamily: "'Sora',sans-serif" }}>{currentSub?.nombre || "Sub"}</span>
            </button>
          )}
          {!catId && <span style={{ color: C.textDim, fontSize: 16 }}>›</span>}
        </button>

        {sectionTitle("Cuenta")}
        {tipo === "transferencia" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            {[["Desde", cuentaId, setCuentaId], ["Hacia", cuentaDestId, setCuentaDestId]].map(([label, val, setter]) => (
              <div key={label}>
                <p style={{ fontSize: 11, color: C.textDim, marginBottom: 6 }}>{label}</p>
                <select className="inp" value={val} onChange={e => setter(e.target.value)} style={{ fontSize: 13, padding: "11px 12px" }}>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.emoji} {a.nombre}</option>)}
                </select>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            {accounts.filter(a => a.tipo !== "Pasivo").map(a => (
              <button key={a.id} onClick={() => setCuentaId(a.id)} className={`chip ${cuentaId === a.id ? "sel" : ""}`}>
                <span>{a.emoji}</span><span style={{ color: cuentaId === a.id ? C.goldLight : C.text }}>{a.nombre}</span>
              </button>
            ))}
          </div>
        )}

        {sectionTitle("Fecha")}
        <input type="date" className="inp" value={fecha} onChange={e => setFecha(e.target.value)} style={{ marginBottom: 8 }} />

        {sectionTitle("Nota")}
        <input className="inp" placeholder="Descripción opcional..." value={nota} onChange={e => setNota(e.target.value)} style={{ marginBottom: 24 }} />

      </div>

      {/* Category picker overlay */}
      {showCatPicker && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 10, display: "flex", flexDirection: "column" }} onClick={() => setShowCatPicker(false)}>
          <div style={{ background: C.surface, borderRadius: "20px 20px 0 0", padding: "20px 20px 40px", marginTop: "auto", maxHeight: "70vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Elige categoría</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {cats.map(c => (
                <button key={c.id} onClick={() => { setCatId(c.id); setSubId(""); setShowCatPicker(false); }} style={{ background: catId === c.id ? `${c.color}22` : "#141414", border: `1px solid ${catId === c.id ? c.color : C.border}`, borderRadius: 14, padding: "16px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 26 }}>{c.emoji}</span>
                  <span style={{ fontSize: 11, color: catId === c.id ? C.goldLight : C.textDim, textAlign: "center", lineHeight: 1.3, fontFamily: "'Sora',sans-serif" }}>{c.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub picker overlay */}
      {showSubPicker && currentCat && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 10, display: "flex", flexDirection: "column" }} onClick={() => setShowSubPicker(false)}>
          <div style={{ background: C.surface, borderRadius: "20px 20px 0 0", padding: "20px 20px 40px", marginTop: "auto", maxHeight: "60vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 22 }}>{currentCat.emoji}</span>
              <p style={{ fontSize: 16, fontWeight: 600 }}>{currentCat.nombre}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
              {currentCat.subs.map(s => (
                <button key={s.id} onClick={() => { setSubId(s.id); setShowSubPicker(false); }} style={{ background: subId === s.id ? C.goldDim : "#141414", border: `1px solid ${subId === s.id ? C.gold : C.border}`, borderRadius: 12, padding: "14px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{s.emoji}</span>
                  <span style={{ fontSize: 13, color: subId === s.id ? C.goldLight : C.text, fontFamily: "'Sora',sans-serif" }}>{s.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ANÁLISIS TAB ──────────────────────────────────────────────────────────────
function AnalisisTab({ txs, cats, cfg, rate }) {
  const [view, setView] = useState("gastos"); // gastos | suficiencia | interes

  const totalG = txs.filter(t => t.tipo === "gasto").reduce((a, t) => a + t.monto, 0);
  const totalI = txs.filter(t => t.tipo === "ingreso").reduce((a, t) => a + t.monto, 0);

  // Category breakdown
  const catData = cats.map(c => {
    const value = txs.filter(t => t.tipo === "gasto" && t.catId === c.id).reduce((a, t) => a + t.monto, 0);
    return { ...c, value, pct: totalG > 0 ? (value / totalG) * 100 : 0 };
  }).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  const pieData = catData.slice(0, 8);

  // Suficiencia / libertad
  const gastosMensuales = txs.filter(t => t.tipo === "gasto").reduce((a, t) => a + t.monto, 0) / 2; // aprox mensual
  const ingresosMensuales = cfg.ingreso_quincena * 2;
  const tasaAhorro = ingresosMensuales > 0 ? ((ingresosMensuales - gastosMensuales) / ingresosMensuales) * 100 : 0;
  // FI number: gastos_anuales × 25 (regla del 4%)
  const gastosAnuales = gastosMensuales * 12;
  const fiNumber = gastosAnuales * 25;
  const ahorroActual = txs.filter(t => t.tipo === "gasto" && t.catId === "ahorro").reduce((a, t) => a + t.monto, 0);
  const pctHaciaFI = fiNumber > 0 ? Math.min((ahorroActual / fiNumber) * 100, 100) : 0;

  // Compound interest calculator
  const [capital, setCapital] = useState("5000");
  const [rendimiento, setRendimiento] = useState("12");
  const [años, setAnios] = useState("10");
  const capitalN = parseFloat(capital) || 0;
  const rendN = parseFloat(rendimiento) || 0;
  const añosN = parseInt(años) || 0;
  const finalValue = compoundGrowth(capitalN, rendN, añosN);
  const ganancia = finalValue - capitalN;
  const fomoMensual = capitalN > 0 && rendN > 0 ? capitalN * (Math.pow(1 + rendN / 100, 1 / 12) - 1) : 0;

  const CUSTOM_TOOLTIP = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return <div style={{ background: "#161616", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.text }}>{fmt(payload[0]?.value || 0)}</div>;
  };

  return (
    <div className="scr">
      <div className="hdr">
        <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 16 }}>Análisis</h1>
        <div style={{ display: "flex", background: "#141414", borderRadius: 12, padding: 3, gap: 2 }}>
          {[["gastos","💸 Gastos"],["suficiencia","🌱 Suficiencia"],["interes","📈 Interés"]].map(([v,l]) => (
            <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: "9px 4px", border: "none", borderRadius: 9, fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", background: view === v ? C.gold : "transparent", color: view === v ? "#000" : C.textDim, transition: "all .2s" }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>

        {/* GASTOS VIEW */}
        {view === "gastos" && (<>
          {/* Donut + stats */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>TOTAL GASTOS</p>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 26, color: C.red, fontWeight: 700 }}>{fmt(totalG)}</p>
                <p style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{txs.filter(t => t.tipo === "gasto").length} transacciones · {cats.filter(c => catData.find(d => d.id === c.id)).length} categorías</p>
              </div>
              <ResponsiveContainer width={110} height={110} style={{ flexShrink: 0, marginLeft: "auto" }}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={32} outerRadius={50} dataKey="value" strokeWidth={0}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} opacity={0.9} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category list like Budget Flow */}
            {catData.map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderTop: `1px solid ${C.border}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${c.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{c.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{c.nombre}</span>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.textDim }}>{c.pct.toFixed(0)}%</span>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: C.red, fontWeight: 700 }}>{fmt(c.value)}</span>
                    </div>
                  </div>
                  <div className="ptk">
                    <div className="ptf" style={{ width: `${c.pct}%`, background: c.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Promedio por transacción y por día */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { l: "Ø por transacción", v: fmt(totalG / Math.max(txs.filter(t => t.tipo === "gasto").length, 1)) },
              { l: "Ø por día (30d)", v: fmt(totalG / 30) },
            ].map(s => (
              <div key={s.l} className="card" style={{ textAlign: "center", padding: "14px 10px" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, color: C.gold }}>{s.v}</div>
                <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Tu tiempo */}
          <div className="card">
            <p className="sec">costo en tiempo de vida</p>
            {catData.slice(0, 5).map((c, i) => (
              <div key={c.id} className="row" style={{ borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 20 }}>{c.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13 }}>{c.nombre}</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: C.gold }}>{toTime(c.value, rate, cfg.horas_dia)}</div>
                </div>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 13 }}>{fmt(c.value)}</span>
              </div>
            ))}
          </div>
        </>)}

        {/* SUFICIENCIA VIEW */}
        {view === "suficiencia" && (<>
          {/* FI Number */}
          <div style={{ border: `1px solid ${C.green}44`, borderRadius: 20, padding: 20, background: `${C.green}07`, marginBottom: 16 }}>
            <p style={{ fontSize: 10, color: C.green, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Tu número de libertad</p>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 32, color: C.green, fontWeight: 700 }}>{fmt(fiNumber)}</p>
            <p style={{ fontSize: 12, color: C.textDim, marginTop: 6, lineHeight: 1.6 }}>Con este capital invertido al 4%, tus inversiones cubren tus gastos para siempre. Es la regla del 4% — la base de la independencia financiera.</p>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: C.textDim }}>Camino recorrido</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.green }}>{pctHaciaFI.toFixed(2)}%</span>
              </div>
              <div className="ptk" style={{ height: 8 }}>
                <div className="ptf" style={{ width: `${Math.max(pctHaciaFI, 0.5)}%`, background: `linear-gradient(90deg, ${C.green}66, ${C.green})` }} />
              </div>
            </div>
          </div>

          {/* Suficiencia concept */}
          <div className="card" style={{ marginBottom: 16 }}>
            <p className="sec">el concepto de suficiente</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: "🧠", titulo: "Riqueza invisible", texto: "Los ricos de verdad son los que tienen dinero que no ves. La riqueza es lo que NO gastas. — Morgan Housel" },
                { icon: "⚡", titulo: "Capacidad, no posesión", texto: "Suficiente no es tener poco. Es tener la capacidad de comprar pero elegir no hacerlo. Es poder renunciar si algo no te conviene." },
                { icon: "🎯", titulo: "Tu número de suficiencia", texto: `Con tus gastos actuales necesitas ${fmt(fiNumber)} invertidos para ser libre. Cada peso ahorrado hoy te acerca a ese número.` },
              ].map(item => (
                <div key={item.titulo} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 5 }}>{item.titulo}</div>
                    <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.6 }}>{item.texto}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasa de ahorro */}
          <div className="card">
            <p className="sec">tasa de ahorro real</p>
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 48, color: tasaAhorro >= 20 ? C.green : tasaAhorro >= 0 ? C.gold : C.red, fontWeight: 700, lineHeight: 1 }}>{tasaAhorro.toFixed(1)}%</div>
              <p style={{ fontSize: 12, color: C.textDim, marginTop: 8 }}>de tu ingreso te quedas. Meta mínima: 20%.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
              <div style={{ textAlign: "center", background: "#141414", borderRadius: 12, padding: "12px 8px" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, color: C.green }}>{fmt(ingresosMensuales)}</div>
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 3 }}>Ingreso mensual</div>
              </div>
              <div style={{ textAlign: "center", background: "#141414", borderRadius: 12, padding: "12px 8px" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, color: C.red }}>{fmt(gastosMensuales)}</div>
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 3 }}>Gasto mensual</div>
              </div>
            </div>
          </div>
        </>)}

        {/* INTERÉS COMPUESTO VIEW */}
        {view === "interes" && (<>
          <div className="card" style={{ marginBottom: 16 }}>
            <p className="sec">calculadora de interés compuesto</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { l: "Capital inicial (MXN)", val: capital, set: setCapital, prefix: "$" },
                { l: "Rendimiento anual (%)", val: rendimiento, set: setRendimiento, prefix: "%" },
                { l: "Años", val: años, set: setAnios, prefix: "📅" },
              ].map(f => (
                <div key={f.l}>
                  <label style={{ fontSize: 11, color: C.textDim, display: "block", marginBottom: 6, letterSpacing: ".06em", textTransform: "uppercase" }}>{f.l}</label>
                  <input type="number" className="inp mono" value={f.val} onChange={e => f.set(e.target.value)} style={{ fontFamily: "'Space Mono',monospace", fontSize: 18 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Result */}
          {capitalN > 0 && rendN > 0 && añosN > 0 && (
            <div style={{ border: `1px solid ${C.gold}44`, borderRadius: 20, padding: 20, background: `${C.gold}07`, marginBottom: 16 }}>
              <p style={{ fontSize: 10, color: C.gold, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Resultado en {añosN} años</p>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 36, color: C.gold, fontWeight: 700 }}>{fmt(finalValue)}</div>
              <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: C.textDim }}>Tu dinero creció</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, color: C.green, marginTop: 3 }}>+{fmt(ganancia)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.textDim }}>FOMO mensual</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, color: C.red, marginTop: 3 }}>-{fmt(fomoMensual, 0)}/mes</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: C.textDim, marginTop: 12, lineHeight: 1.6 }}>
                Cada mes que no inviertes {fmt(capitalN)} al {rendN}% estás dejando de ganar <span style={{ color: C.red, fontFamily: "'Space Mono',monospace" }}>{fmt(fomoMensual, 0)}</span>.
              </p>
            </div>
          )}

          {/* Growth table */}
          {capitalN > 0 && rendN > 0 && (
            <div className="card">
              <p className="sec">crecimiento año a año</p>
              {[1, 2, 5, 10, 15, 20, 30].filter(y => y <= Math.max(añosN, 30)).map(y => {
                const val = compoundGrowth(capitalN, rendN, y);
                const width = Math.min((val / compoundGrowth(capitalN, rendN, Math.max(añosN, 30))) * 100, 100);
                return (
                  <div key={y} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.textDim, width: 40, flexShrink: 0 }}>Año {y}</span>
                    <div style={{ flex: 1 }}>
                      <div className="ptk" style={{ height: 4 }}>
                        <div className="ptf" style={{ width: `${width}%`, background: C.gold }} />
                      </div>
                    </div>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: C.gold, width: 80, textAlign: "right", flexShrink: 0 }}>{fmt(val)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}

// ── PRESUPUESTO TAB ───────────────────────────────────────────────────────────
function PlanTab({ presupuesto, setPresupuesto, cfg, rate }) {
  const [quincena, setQuincena] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({ nombre: "", emoji: "💸", monto: "", frecuencia: "Quincena" });

  const qKey = `q${quincena}`;
  const items = presupuesto[qKey] || [];
  const pendientes = items.filter(i => !i.pagado);
  const pagados = items.filter(i => i.pagado);
  const totalPlaneado = items.reduce((a, i) => a + i.monto, 0);
  const totalPagado = pagados.reduce((a, i) => a + i.monto, 0);
  const disponible = cfg.ingreso_quincena - totalPlaneado;
  const pctAsig = Math.min((totalPlaneado / cfg.ingreso_quincena) * 100, 100);
  const pctPagado = totalPlaneado > 0 ? (totalPagado / totalPlaneado) * 100 : 0;

  const pieData = [
    { name: "Pagado", value: totalPagado, color: C.green },
    { name: "Pendiente", value: totalPlaneado - totalPagado, color: C.gold },
    { name: "Libre", value: Math.max(disponible, 0), color: "#1e1e1e" },
  ].filter(d => d.value > 0);

  function toggle(id) { setPresupuesto(p => ({ ...p, [qKey]: p[qKey].map(i => i.id === id ? { ...i, pagado: !i.pagado } : i) })); }
  function del(id) { setPresupuesto(p => ({ ...p, [qKey]: p[qKey].filter(i => i.id !== id) })); }
  function add() {
    if (!newItem.nombre || !newItem.monto) return;
    setPresupuesto(p => ({ ...p, [qKey]: [...p[qKey], { id: Date.now().toString(), nombre: newItem.nombre, emoji: newItem.emoji, monto: parseFloat(newItem.monto), frecuencia: newItem.frecuencia, pagado: false }] }));
    setNewItem({ nombre: "", emoji: "💸", monto: "", frecuencia: "Quincena" });
    setShowAdd(false);
  }
  function saveEdit() {
    if (!editItem) return;
    setPresupuesto(p => ({ ...p, [qKey]: p[qKey].map(i => i.id === editItem.id ? { ...i, nombre: editItem.nombre, emoji: editItem.emoji, monto: parseFloat(editItem.monto) || i.monto, frecuencia: editItem.frecuencia } : i) }));
    setEditItem(null);
  }

  return (
    <div className="scr">
      <div className="hdr">
        <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Presupuesto</h1>
        <p style={{ fontSize: 13, color: C.textDim }}>Cada centavo ya tiene dueño antes de llegar.</p>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", background: "#141414", borderRadius: 14, padding: 3, gap: 2, marginBottom: 16 }}>
          {[1,2].map(q => (
            <button key={q} onClick={() => setQuincena(q)} style={{ flex: 1, padding: "12px 0", border: "none", borderRadius: 11, fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", background: quincena === q ? C.gold : "transparent", color: quincena === q ? "#000" : C.textDim, transition: "all .22s" }}>
              {q === 1 ? "1ª · 1–15" : "2ª · 16–31"}
            </button>
          ))}
        </div>

        {/* Donut card */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={55} dataKey="value" strokeWidth={0} startAngle={90} endAngle={-270}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: disponible >= 0 ? C.gold : C.red, fontWeight: 700 }}>{fmt(disponible)}</div>
                <div style={{ fontSize: 9, color: C.textDim, marginTop: 1 }}>libre</div>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { l: "Ingreso", v: fmt(cfg.ingreso_quincena), c: C.green },
                { l: "Planeado", v: fmt(totalPlaneado), c: C.gold },
                { l: "Pagado", v: fmt(totalPagado), c: C.text },
                { l: "Real disponible", v: fmt(cfg.ingreso_quincena - totalPagado), c: disponible >= 0 ? C.green : C.red },
              ].map(r => (
                <div key={r.l} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: C.textDim }}>{r.l}</span>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: r.c, fontWeight: 700 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { l: "Asignado del sueldo", v: pctAsig, c: pctAsig > 95 ? C.red : C.gold },
              { l: "Pagado de lo planeado", v: pctPagado, c: C.green },
            ].map(b => (
              <div key={b.l}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: C.textDim }}>{b.l}</span>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: b.c }}>{b.v.toFixed(0)}%</span>
                </div>
                <div className="ptk"><div className="ptf" style={{ width: `${b.v}%`, background: b.c }} /></div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: "10px 14px", background: "#0d0d0d", borderRadius: 10, border: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 12, color: C.textDim, lineHeight: 1.6 }}>
              Lo libre equivale a <span style={{ color: disponible >= 0 ? C.gold : C.red, fontFamily: "'Space Mono',monospace" }}>{toTime(Math.abs(disponible), rate, cfg.horas_dia)}</span> de tu tiempo.{disponible < 0 ? " Ya gastaste trabajo que no has hecho." : ""}
            </p>
          </div>
        </div>

        {/* Por pagar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <p className="sec" style={{ margin: 0 }}>Por pagar · {fmt(pendientes.reduce((a,i) => a+i.monto, 0))}</p>
          <button onClick={() => setShowAdd(true)} style={{ background: C.gold, border: "none", borderRadius: 8, padding: "5px 12px", color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>+ Agregar</button>
        </div>
        <div className="card" style={{ padding: "2px 16px", marginBottom: 16 }}>
          {pendientes.length === 0 && <div style={{ padding: "18px 0", textAlign: "center", color: C.textDim, fontSize: 13 }}>🎉 ¡Todo pagado!</div>}
          {pendientes.map((item, i) => (
            <div key={item.id} className="row" style={{ borderBottom: i < pendientes.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <button onClick={() => toggle(item.id)} style={{ width: 26, height: 26, borderRadius: 7, border: `2px solid ${C.border}`, background: "transparent", cursor: "pointer", flexShrink: 0 }} />
              <span style={{ fontSize: 20 }}>{item.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.nombre}</div>
                <div style={{ fontSize: 11, color: C.textDim }}>{item.frecuencia} · <span style={{ color: C.gold, fontFamily: "'Space Mono',monospace" }}>{toTime(item.monto, rate, cfg.horas_dia)}</span></div>
              </div>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, marginRight: 8 }}>{fmt(item.monto)}</span>
              <button onClick={() => setEditItem({ ...item, monto: String(item.monto) })} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "4px 8px", color: C.textDim, fontSize: 11, cursor: "pointer", fontFamily: "'Sora',sans-serif", marginRight: 4 }}>✏️</button>
              <button onClick={() => del(item.id)} style={{ background: "none", border: `1px solid ${C.red}44`, borderRadius: 8, padding: "4px 8px", color: C.red, fontSize: 13, cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>
          ))}
        </div>

        {pagados.length > 0 && (<>
          <p className="sec">✓ Pagados · {fmt(totalPagado)}</p>
          <div className="card" style={{ padding: "2px 16px", opacity: 0.6 }}>
            {pagados.map((item, i) => (
              <div key={item.id} className="row" style={{ borderBottom: i < pagados.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <button onClick={() => toggle(item.id)} style={{ width: 26, height: 26, borderRadius: 7, border: `2px solid ${C.green}`, background: `${C.green}22`, cursor: "pointer", color: C.green, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✓</button>
                <span style={{ fontSize: 20, opacity: 0.5 }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: C.textDim, textDecoration: "line-through" }}>{item.nombre}</div>
                </div>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: C.textDim, textDecoration: "line-through" }}>{fmt(item.monto)}</span>
              </div>
            ))}
          </div>
        </>)}
      </div>

      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)", zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end", maxWidth: 430, left: "50%", transform: "translateX(-50%)" }} onClick={() => setShowAdd(false)}>
          <div style={{ background: "#111", borderRadius: "24px 24px 0 0", padding: "28px 20px 48px", border: `1px solid ${C.border}` }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>Nuevo compromiso</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: "#1a1a1a", border: `1px solid ${C.border}`, borderRadius: "50%", width: 32, height: 32, color: C.textDim, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <input value={newItem.emoji} onChange={e => setNewItem(p => ({ ...p, emoji: e.target.value }))} className="inp" style={{ width: 58, textAlign: "center", fontSize: 24 }} placeholder="💸" />
              <input placeholder="Nombre (ej: Renta)" value={newItem.nombre} onChange={e => setNewItem(p => ({ ...p, nombre: e.target.value }))} className="inp" style={{ flex: 1 }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: C.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Monto</label>
              <input type="number" inputMode="decimal" placeholder="0" value={newItem.monto} onChange={e => setNewItem(p => ({ ...p, monto: e.target.value }))} className="inp" style={{ fontFamily: "'Space Mono',monospace", fontSize: 22, textAlign: "center" }} />
              {newItem.monto && <p style={{ fontSize: 12, color: C.gold, marginTop: 6, textAlign: "center", fontFamily: "'Space Mono',monospace" }}>= {toTime(parseFloat(newItem.monto) || 0, rate, cfg.horas_dia)} de tu tiempo</p>}
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: C.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Frecuencia</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Quincena","Mensual","Semanal","Único"].map(f => (
                  <button key={f} onClick={() => setNewItem(p => ({ ...p, frecuencia: f }))} style={{ flex: 1, padding: "10px 4px", border: `1px solid ${newItem.frecuencia === f ? C.gold : C.border}`, borderRadius: 10, background: newItem.frecuencia === f ? C.goldDim : "#141414", color: newItem.frecuencia === f ? C.goldLight : C.textDim, fontSize: 11, cursor: "pointer", fontFamily: "'Sora',sans-serif", fontWeight: 600 }}>{f}</button>
                ))}
              </div>
            </div>
            <button onClick={add} style={{ background: (!newItem.nombre || !newItem.monto) ? "#1a1a1a" : C.gold, color: (!newItem.nombre || !newItem.monto) ? C.textDim : "#000", border: "none", borderRadius: 14, padding: "16px", fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%" }}>Agregar compromiso</button>
          </div>
        </div>
      )}

      {editItem && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)", zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end", maxWidth: 430, left: "50%", transform: "translateX(-50%)" }} onClick={() => setEditItem(null)}>
          <div style={{ background: "#111", borderRadius: "24px 24px 0 0", padding: "28px 20px 48px", border: `1px solid ${C.border}` }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>Editar compromiso</h3>
              <button onClick={() => setEditItem(null)} style={{ background: "#1a1a1a", border: `1px solid ${C.border}`, borderRadius: "50%", width: 32, height: 32, color: C.textDim, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <input value={editItem.emoji} onChange={e => setEditItem(p => ({ ...p, emoji: e.target.value }))} className="inp" style={{ width: 58, textAlign: "center", fontSize: 24 }} />
              <input value={editItem.nombre} onChange={e => setEditItem(p => ({ ...p, nombre: e.target.value }))} className="inp" style={{ flex: 1 }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: C.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Monto</label>
              <input type="number" inputMode="decimal" value={editItem.monto} onChange={e => setEditItem(p => ({ ...p, monto: e.target.value }))} className="inp" style={{ fontFamily: "'Space Mono',monospace", fontSize: 22, textAlign: "center" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: C.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Frecuencia</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Quincena","Mensual","Semanal","Único"].map(f => (
                  <button key={f} onClick={() => setEditItem(p => ({ ...p, frecuencia: f }))} style={{ flex: 1, padding: "10px 4px", border: `1px solid ${editItem.frecuencia === f ? C.gold : C.border}`, borderRadius: 10, background: editItem.frecuencia === f ? C.goldDim : "#141414", color: editItem.frecuencia === f ? C.goldLight : C.textDim, fontSize: 11, cursor: "pointer", fontFamily: "'Sora',sans-serif", fontWeight: 600 }}>{f}</button>
                ))}
              </div>
            </div>
            <button onClick={saveEdit} style={{ background: C.gold, color: "#000", border: "none", borderRadius: 14, padding: "16px", fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%" }}>Guardar cambios</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── LOCALSTORAGE ─────────────────────────────────────────────────────────────
function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}
function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}


// ── DEUDAS TAB ────────────────────────────────────────────────────────────────
function DeudasTab({ deudas, setDeudas, tdcs, setTdcs, rate, cfg }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editDeuda, setEditDeuda] = useState(null);
  const [newD, setNewD] = useState({ nombre: "", emoji: "⛓️", saldo_inicial: "", saldo_actual: "", tasa_mensual: "", pago_mensual: "" });
  const [showAddTdc, setShowAddTdc] = useState(false);
  const [editTdc, setEditTdc] = useState(null);
  const [newT, setNewT] = useState({ nombre: "", emoji: "💳", limite: "", saldo: "", tasa_mensual: "", fecha_corte: "", fecha_pago: "" });

  function add() {
    if (!newD.nombre || !newD.saldo_actual) return;
    const d = {
      id: Date.now().toString(),
      nombre: newD.nombre, emoji: newD.emoji,
      saldo_inicial: parseFloat(newD.saldo_inicial) || parseFloat(newD.saldo_actual),
      saldo_actual: parseFloat(newD.saldo_actual),
      tasa_mensual: parseFloat(newD.tasa_mensual) || 0,
      pago_mensual: parseFloat(newD.pago_mensual) || 0,
      fecha_inicio: new Date().toISOString().split("T")[0],
    };
    setDeudas(p => [...p, d]);
    setNewD({ nombre: "", emoji: "⛓️", saldo_inicial: "", saldo_actual: "", tasa_mensual: "", pago_mensual: "" });
    setShowAdd(false);
  }

  function del(id) { setDeudas(p => p.filter(d => d.id !== id)); }

  function addTdc() {
    if (!newT.nombre || !newT.limite) return;
    const t = { id: Date.now().toString(), nombre: newT.nombre, emoji: newT.emoji, limite: parseFloat(newT.limite) || 0, saldo: parseFloat(newT.saldo) || 0, tasa_mensual: parseFloat(newT.tasa_mensual) || 0, fecha_corte: newT.fecha_corte, fecha_pago: newT.fecha_pago };
    setTdcs(p => [...p, t]);
    setNewT({ nombre: '', emoji: '💳', limite: '', saldo: '', tasa_mensual: '', fecha_corte: '', fecha_pago: '' });
    setShowAddTdc(false);
  }
  function delTdc(id) { setTdcs(p => p.filter(t => t.id !== id)); }
  function saveTdc() {
    setTdcs(p => p.map(t => t.id === editTdc.id ? { ...t, nombre: editTdc.nombre, emoji: editTdc.emoji, limite: parseFloat(editTdc.limite) || t.limite, saldo: parseFloat(editTdc.saldo) || 0, tasa_mensual: parseFloat(editTdc.tasa_mensual) || 0, fecha_corte: editTdc.fecha_corte, fecha_pago: editTdc.fecha_pago } : t));
    setEditTdc(null);
  }

  function saveEdit() {
    setDeudas(p => p.map(d => d.id === editDeuda.id ? {
      ...d,
      nombre: editDeuda.nombre, emoji: editDeuda.emoji,
      saldo_actual: parseFloat(editDeuda.saldo_actual) || d.saldo_actual,
      tasa_mensual: parseFloat(editDeuda.tasa_mensual) || 0,
      pago_mensual: parseFloat(editDeuda.pago_mensual) || 0,
    } : d));
    setEditDeuda(null);
  }

  function interesQuincena(d) { return d.saldo_actual * (d.tasa_mensual / 100 / 2); }
  function mesesRestantes(d) {
    if (!d.pago_mensual || d.pago_mensual <= 0) return null;
    const intMes = d.saldo_actual * (d.tasa_mensual / 100);
    if (d.pago_mensual <= intMes) return null;
    return Math.ceil(Math.log(d.pago_mensual / (d.pago_mensual - intMes)) / Math.log(1 + d.tasa_mensual / 100));
  }

  const totalDeuda = deudas.reduce((a, d) => a + d.saldo_actual, 0);
  const totalInteresMes = deudas.reduce((a, d) => a + d.saldo_actual * (d.tasa_mensual / 100), 0);

  const inp = { background: "#141414", border: `1px solid #1e1e1e`, borderRadius: 12, padding: "13px 14px", color: "#F0EDE6", fontFamily: "'Sora',sans-serif", fontSize: 15, width: "100%", outline: "none" };

  return (
    <div style={{ padding: "0 0 96px" }}>
      <div style={{ padding: "52px 20px 16px" }}>
        <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Deudas</h1>
        <p style={{ fontSize: 13, color: "#5A5550" }}>Lo que le debes al pasado.</p>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Resumen */}
        {deudas.length > 0 && (
          <div style={{ background: "#101010", border: `1px solid #E53E3E44`, borderRadius: 18, padding: 18, marginBottom: 16 }}>
            <p style={{ fontSize: 10, color: "#E53E3E", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Total deuda</p>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 36, color: "#E53E3E", fontWeight: 700 }}>${totalDeuda.toLocaleString("es-MX", { minimumFractionDigits: 0 })}</div>
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: "#5A5550" }}>Interés mensual</div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 15, color: "#E53E3E", marginTop: 2 }}>${Math.round(totalInteresMes).toLocaleString("es-MX")}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#5A5550" }}>Costo por día</div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 15, color: "#E53E3E", marginTop: 2 }}>${Math.round(totalInteresMes / 30).toLocaleString("es-MX")}</div>
              </div>
            </div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#0d0d0d", borderRadius: 10, border: "1px solid #1a1a1a" }}>
              <p style={{ fontSize: 12, color: "#5A5550", lineHeight: 1.6 }}>
                Cada día que pasa te cuesta <span style={{ color: "#E53E3E", fontFamily: "'Space Mono',monospace" }}>${Math.round(totalInteresMes / 30).toLocaleString("es-MX")}</span> en intereses sin hacer nada.
              </p>
            </div>
          </div>
        )}

        {/* Lista deudas */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <p style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5550", fontWeight: 600 }}>Mis deudas</p>
          <button onClick={() => setShowAdd(true)} style={{ background: "#C9A84C", border: "none", borderRadius: 8, padding: "5px 12px", color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>+ Agregar</button>
        </div>

        {deudas.length === 0 && (
          <div style={{ background: "#101010", border: "1px solid #1e1e1e", borderRadius: 16, padding: "32px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
            <p style={{ fontSize: 14, color: "#5A5550" }}>Sin deudas registradas.</p>
            <p style={{ fontSize: 12, color: "#3A3733", marginTop: 4 }}>Agrega tus deudas para ver cómo te afectan.</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          {deudas.map(d => {
            const meses = mesesRestantes(d);
            const intMes = d.saldo_actual * (d.tasa_mensual / 100);
            const pctPagado = d.saldo_inicial > 0 ? Math.min(((d.saldo_inicial - d.saldo_actual) / d.saldo_inicial) * 100, 100) : 0;
            return (
              <div key={d.id} style={{ background: "#101010", border: "1px solid #1e1e1e", borderRadius: 16, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{d.emoji}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{d.nombre}</div>
                      <div style={{ fontSize: 11, color: "#5A5550", marginTop: 2 }}>
                        {d.tasa_mensual}% mensual · {meses ? `${meses} meses restantes` : "pago insuficiente"}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setEditDeuda({ ...d, saldo_actual: String(d.saldo_actual), tasa_mensual: String(d.tasa_mensual), pago_mensual: String(d.pago_mensual) })} style={{ background: "none", border: `1px solid #1e1e1e`, borderRadius: 8, padding: "4px 8px", color: "#5A5550", fontSize: 11, cursor: "pointer" }}>✏️</button>
                    <button onClick={() => del(d.id)} style={{ background: "none", border: `1px solid #E53E3E44`, borderRadius: 8, padding: "4px 8px", color: "#E53E3E", fontSize: 13, cursor: "pointer" }}>×</button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  {[
                    { l: "Saldo actual", v: `$${d.saldo_actual.toLocaleString("es-MX")}`, c: "#E53E3E" },
                    { l: "Interés/mes", v: `$${Math.round(intMes).toLocaleString("es-MX")}`, c: "#E8895A" },
                    { l: "Pago mensual", v: `$${d.pago_mensual.toLocaleString("es-MX")}`, c: "#F0EDE6" },
                    { l: "Abona a capital", v: `$${Math.max(0, Math.round(d.pago_mensual - intMes)).toLocaleString("es-MX")}`, c: "#3DB87A" },
                  ].map(r => (
                    <div key={r.l} style={{ background: "#141414", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, color: r.c, fontWeight: 700 }}>{r.v}</div>
                      <div style={{ fontSize: 10, color: "#5A5550", marginTop: 3 }}>{r.l}</div>
                    </div>
                  ))}
                </div>

                {d.saldo_inicial > 0 && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: "#5A5550" }}>Progreso de pago</span>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#3DB87A" }}>{pctPagado.toFixed(1)}%</span>
                    </div>
                    <div style={{ height: 6, background: "#1e1e1e", borderRadius: 100, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pctPagado}%`, background: "linear-gradient(90deg, #3DB87A88, #3DB87A)", borderRadius: 100, transition: "width .6s" }} />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)", zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end", maxWidth: 430, left: "50%", transform: "translateX(-50%)" }} onClick={() => setShowAdd(false)}>
          <div style={{ background: "#111", borderRadius: "24px 24px 0 0", padding: "28px 20px 48px", border: "1px solid #1e1e1e", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>Nueva deuda</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: "#1a1a1a", border: "1px solid #1e1e1e", borderRadius: "50%", width: 32, height: 32, color: "#5A5550", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <input value={newD.emoji} onChange={e => setNewD(p => ({ ...p, emoji: e.target.value }))} style={{ ...inp, width: 58, textAlign: "center", fontSize: 24 }} placeholder="⛓️" />
              <input placeholder="Nombre (ej: Moto)" value={newD.nombre} onChange={e => setNewD(p => ({ ...p, nombre: e.target.value }))} style={{ ...inp, flex: 1 }} />
            </div>
            {[
              { l: "Deuda original (cuando la adquiriste)", k: "saldo_inicial", ph: "66000" },
              { l: "Saldo actual (lo que debes hoy)", k: "saldo_actual", ph: "55000" },
              { l: "Tasa de interés mensual (%)", k: "tasa_mensual", ph: "3.5" },
              { l: "Pago mensual", k: "pago_mensual", ph: "2100" },
            ].map(f => (
              <div key={f.k} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: "#5A5550", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>{f.l}</label>
                <input type="number" inputMode="decimal" placeholder={f.ph} value={newD[f.k]} onChange={e => setNewD(p => ({ ...p, [f.k]: e.target.value }))} style={{ ...inp, fontFamily: "'Space Mono',monospace", fontSize: 18 }} />
              </div>
            ))}
            <button onClick={add} style={{ background: (!newD.nombre || !newD.saldo_actual) ? "#1a1a1a" : "#C9A84C", color: (!newD.nombre || !newD.saldo_actual) ? "#5A5550" : "#000", border: "none", borderRadius: 14, padding: "16px", fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", marginTop: 6 }}>Agregar deuda</button>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editDeuda && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)", zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end", maxWidth: 430, left: "50%", transform: "translateX(-50%)" }} onClick={() => setEditDeuda(null)}>
          <div style={{ background: "#111", borderRadius: "24px 24px 0 0", padding: "28px 20px 48px", border: "1px solid #1e1e1e", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>Editar deuda</h3>
              <button onClick={() => setEditDeuda(null)} style={{ background: "#1a1a1a", border: "1px solid #1e1e1e", borderRadius: "50%", width: 32, height: 32, color: "#5A5550", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <input value={editDeuda.emoji} onChange={e => setEditDeuda(p => ({ ...p, emoji: e.target.value }))} style={{ ...inp, width: 58, textAlign: "center", fontSize: 24 }} />
              <input value={editDeuda.nombre} onChange={e => setEditDeuda(p => ({ ...p, nombre: e.target.value }))} style={{ ...inp, flex: 1 }} />
            </div>
            {[
              { l: "Saldo actual", k: "saldo_actual" },
              { l: "Tasa mensual (%)", k: "tasa_mensual" },
              { l: "Pago mensual", k: "pago_mensual" },
            ].map(f => (
              <div key={f.k} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: "#5A5550", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>{f.l}</label>
                <input type="number" inputMode="decimal" value={editDeuda[f.k]} onChange={e => setEditDeuda(p => ({ ...p, [f.k]: e.target.value }))} style={{ ...inp, fontFamily: "'Space Mono',monospace", fontSize: 18 }} />
              </div>
            ))}
            <button onClick={saveEdit} style={{ background: "#C9A84C", color: "#000", border: "none", borderRadius: 14, padding: "16px", fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%" }}>Guardar cambios</button>
          </div>
        </div>
      )}

      {/* ── TDC SECTION ── */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, marginTop: 24 }}>
          <p style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5550", fontWeight: 600 }}>Tarjetas de crédito</p>
          <button onClick={() => setShowAddTdc(true)} style={{ background: "#C9A84C", border: "none", borderRadius: 8, padding: "5px 12px", color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>+ Agregar</button>
        </div>

        {tdcs.length === 0 && (
          <div style={{ background: "#101010", border: "1px solid #1e1e1e", borderRadius: 16, padding: "24px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#5A5550" }}>Sin tarjetas registradas.</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tdcs.map(t => {
            const pctUso = t.limite > 0 ? Math.min((t.saldo / t.limite) * 100, 100) : 0;
            const disponible = t.limite - t.saldo;
            const colorUso = pctUso > 80 ? "#E53E3E" : pctUso > 50 ? "#C9A84C" : "#3DB87A";
            const diasCorte = t.fecha_corte ? (() => { const hoy = new Date(); const corte = new Date(new Date().getFullYear(), new Date().getMonth(), parseInt(t.fecha_corte)); if (corte < hoy) corte.setMonth(corte.getMonth() + 1); return Math.ceil((corte - hoy) / (1000*60*60*24)); })() : null;
            return (
              <div key={t.id} style={{ background: "#101010", border: "1px solid #1e1e1e", borderRadius: 16, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{t.emoji}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{t.nombre}</div>
                      <div style={{ fontSize: 11, color: "#5A5550", marginTop: 2 }}>
                        {t.tasa_mensual}% mensual · límite {fmt(t.limite)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setEditTdc({ ...t, limite: String(t.limite), saldo: String(t.saldo), tasa_mensual: String(t.tasa_mensual) })} style={{ background: "none", border: "1px solid #1e1e1e", borderRadius: 8, padding: "4px 8px", color: "#5A5550", fontSize: 11, cursor: "pointer" }}>✏️</button>
                    <button onClick={() => delTdc(t.id)} style={{ background: "none", border: "1px solid #E53E3E44", borderRadius: 8, padding: "4px 8px", color: "#E53E3E", fontSize: 13, cursor: "pointer" }}>×</button>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  {[
                    { l: "Saldo usado", v: fmt(t.saldo), c: "#E53E3E" },
                    { l: "Disponible", v: fmt(disponible), c: "#3DB87A" },
                    { l: "Corte día", v: t.fecha_corte ? `Día ${t.fecha_corte}${diasCorte !== null ? ` (${diasCorte}d)` : ""}` : "—", c: "#C9A84C" },
                    { l: "Límite de pago", v: t.fecha_pago ? `Día ${t.fecha_pago}` : "—", c: "#F0EDE6" },
                  ].map(r => (
                    <div key={r.l} style={{ background: "#141414", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: r.c, fontWeight: 700 }}>{r.v}</div>
                      <div style={{ fontSize: 10, color: "#5A5550", marginTop: 3 }}>{r.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "#5A5550" }}>Uso del crédito</span>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: colorUso }}>{pctUso.toFixed(0)}%</span>
                </div>
                <div style={{ height: 6, background: "#1e1e1e", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pctUso}%`, background: colorUso, borderRadius: 100, transition: "width .6s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add TDC modal */}
      {showAddTdc && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)", zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end", maxWidth: 430, left: "50%", transform: "translateX(-50%)" }} onClick={() => setShowAddTdc(false)}>
          <div style={{ background: "#111", borderRadius: "24px 24px 0 0", padding: "28px 20px 48px", border: "1px solid #1e1e1e", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>Nueva tarjeta</h3>
              <button onClick={() => setShowAddTdc(false)} style={{ background: "#1a1a1a", border: "1px solid #1e1e1e", borderRadius: "50%", width: 32, height: 32, color: "#5A5550", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <input value={newT.emoji} onChange={e => setNewT(p => ({ ...p, emoji: e.target.value }))} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: "13px 14px", color: "#F0EDE6", fontFamily: "'Sora',sans-serif", fontSize: 24, width: 58, outline: "none", textAlign: "center" }} placeholder="💳" />
              <input placeholder="Nombre (ej: TDC NU)" value={newT.nombre} onChange={e => setNewT(p => ({ ...p, nombre: e.target.value }))} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: "13px 14px", color: "#F0EDE6", fontFamily: "'Sora',sans-serif", fontSize: 15, flex: 1, outline: "none" }} />
            </div>
            {[
              { l: "Límite de crédito", k: "limite", ph: "15000" },
              { l: "Saldo actual (lo que debes)", k: "saldo", ph: "3500" },
              { l: "Tasa de interés mensual (%)", k: "tasa_mensual", ph: "8.5" },
              { l: "Día de corte", k: "fecha_corte", ph: "15" },
              { l: "Día límite de pago", k: "fecha_pago", ph: "10" },
            ].map(f => (
              <div key={f.k} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: "#5A5550", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>{f.l}</label>
                <input type="number" inputMode="decimal" placeholder={f.ph} value={newT[f.k]} onChange={e => setNewT(p => ({ ...p, [f.k]: e.target.value }))} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: "13px 14px", color: "#F0EDE6", fontFamily: "'Space Mono',monospace", fontSize: 18, width: "100%", outline: "none" }} />
              </div>
            ))}
            <button onClick={addTdc} style={{ background: (!newT.nombre || !newT.limite) ? "#1a1a1a" : "#C9A84C", color: (!newT.nombre || !newT.limite) ? "#5A5550" : "#000", border: "none", borderRadius: 14, padding: "16px", fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", marginTop: 6 }}>Agregar tarjeta</button>
          </div>
        </div>
      )}

      {/* Edit TDC modal */}
      {editTdc && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)", zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end", maxWidth: 430, left: "50%", transform: "translateX(-50%)" }} onClick={() => setEditTdc(null)}>
          <div style={{ background: "#111", borderRadius: "24px 24px 0 0", padding: "28px 20px 48px", border: "1px solid #1e1e1e", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>Editar tarjeta</h3>
              <button onClick={() => setEditTdc(null)} style={{ background: "#1a1a1a", border: "1px solid #1e1e1e", borderRadius: "50%", width: 32, height: 32, color: "#5A5550", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <input value={editTdc.emoji} onChange={e => setEditTdc(p => ({ ...p, emoji: e.target.value }))} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: "13px", color: "#F0EDE6", fontSize: 24, width: 58, outline: "none", textAlign: "center" }} />
              <input value={editTdc.nombre} onChange={e => setEditTdc(p => ({ ...p, nombre: e.target.value }))} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: "13px 14px", color: "#F0EDE6", fontFamily: "'Sora',sans-serif", fontSize: 15, flex: 1, outline: "none" }} />
            </div>
            {[
              { l: "Límite de crédito", k: "limite" },
              { l: "Saldo actual", k: "saldo" },
              { l: "Tasa mensual (%)", k: "tasa_mensual" },
              { l: "Día de corte", k: "fecha_corte" },
              { l: "Día límite de pago", k: "fecha_pago" },
            ].map(f => (
              <div key={f.k} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: "#5A5550", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>{f.l}</label>
                <input type="number" inputMode="decimal" value={editTdc[f.k] || ""} onChange={e => setEditTdc(p => ({ ...p, [f.k]: e.target.value }))} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: "13px 14px", color: "#F0EDE6", fontFamily: "'Space Mono',monospace", fontSize: 18, width: "100%", outline: "none" }} />
              </div>
            ))}
            <button onClick={saveTdc} style={{ background: "#C9A84C", color: "#000", border: "none", borderRadius: 14, padding: "16px", fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%" }}>Guardar cambios</button>
          </div>
        </div>
      )}
    </div>
  );
}


// ── BABYLON CHAT ──────────────────────────────────────────────────────────────
function BabylonChat({ txs, deudas, tdcs, presupuesto, cfg, rate }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Soy Babylon. Dame tus números y te digo la verdad. ¿Qué quieres saber?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const totalDeuda = deudas.reduce((a, d) => a + d.saldo_actual, 0);
  const totalTdc = tdcs.reduce((a, t) => a + t.saldo, 0);
  const totalG = txs.filter(t => t.tipo === "gasto").reduce((a, t) => a + t.monto, 0);
  const totalI = txs.filter(t => t.tipo === "ingreso").reduce((a, t) => a + t.monto, 0);

  const context = `Datos financieros del usuario:
- Ingreso quincena: $${cfg.ingreso_quincena}
- Total gastado: $${totalG}
- Balance: $${totalI - totalG}
- Deuda total: $${totalDeuda}
- Saldo TDC: $${totalTdc}
- Meta ahorro: ${cfg.meta_ahorro_pct}%
- Deudas: ${deudas.map(d => `${d.nombre} $${d.saldo_actual} al ${d.tasa_mensual}% mensual`).join(", ")}
- TDCs: ${tdcs.map(t => `${t.nombre} saldo $${t.saldo} límite $${t.limite}`).join(", ")}`;

  const SYSTEM = `Eres Babylon, coach financiero brutal y honesto. Hablas español mexicano, directo, sin rodeos. Cabrón pero no cruel. Tu trabajo: SELLAR fugas. Cada gasto lo traduces a horas de trabajo. Máximo 4-6 líneas por respuesta. Sin saludos ni despedidas. Usa Markdown simple. Tienes acceso a los datos reales del usuario.`;

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(p => [...p, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.role === "assistant" ? m.text : m.text
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 400,
          system: SYSTEM + "\n\n" + context,
          messages: [...history, { role: "user", content: userMsg }]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Error al conectar.";
      setMessages(p => [...p, { role: "assistant", text: reply }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", text: "Sin conexión. Intenta de nuevo." }]);
    }
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  function handleKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: C.bg }}>
      {/* Header */}
      <div style={{ padding: "52px 20px 16px", flexShrink: 0, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.goldDim, border: `2px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏛️</div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Babylon</h1>
            <p style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>● online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
            {m.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.goldDim, border: `1px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginRight: 8, alignSelf: "flex-end" }}>🏛️</div>
            )}
            <div style={{
              maxWidth: "78%",
              background: m.role === "user" ? C.gold : C.surface,
              color: m.role === "user" ? "#000" : C.text,
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "12px 14px",
              fontSize: 14,
              lineHeight: 1.55,
              border: m.role === "assistant" ? `1px solid ${C.border}` : "none",
              fontFamily: "'Sora', sans-serif",
              whiteSpace: "pre-wrap",
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.goldDim, border: `1px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🏛️</div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "18px 18px 18px 4px", padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, opacity: 0.6, animation: `pulse ${0.8 + i*0.2}s ease infinite` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      <div style={{ padding: "10px 16px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
          {["¿Cómo voy?", "¿Cuándo liquido mis deudas?", "¿En qué gasto más?", "Dame un plan"].map(q => (
            <button key={q} onClick={() => { setInput(q); }} style={{ background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 100, padding: "7px 14px", color: C.textDim, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Sora',sans-serif", flexShrink: 0 }}>{q}</button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: "10px 16px 100px", flexShrink: 0, display: "flex", gap: 10, alignItems: "flex-end" }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Pregúntale a Babylon..."
          style={{ flex: 1, background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", color: C.text, fontFamily: "'Sora',sans-serif", fontSize: 15, outline: "none", WebkitAppearance: "none" }}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{ width: 44, height: 44, borderRadius: "50%", background: input.trim() ? C.gold : C.surfaceHigh, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, transition: "background .2s" }}>→</button>
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [txs, setTxs] = useState(() => loadFromStorage("fp_txs", INIT_TXS));
  const [cfg, setCfg] = useState(() => loadFromStorage("fp_cfg", INIT_CFG));
  const [accounts, setAccounts] = useState(() => loadFromStorage("fp_accounts", INIT_ACCOUNTS));
  const [cats, setCats] = useState(() => loadFromStorage("fp_cats", INIT_CATS));
  const [presupuesto, setPresupuesto] = useState(() => loadFromStorage("fp_presupuesto", INIT_PRESUPUESTO));
  const [deudas, setDeudas] = useState(() => loadFromStorage("fp_deudas", INIT_DEUDAS));
  const [tdcs, setTdcs] = useState(() => loadFromStorage("fp_tdcs", INIT_TDCS));
  const [showTx, setShowTx] = useState(false);

  // Auto-save whenever data changes
  useEffect(() => { saveToStorage("fp_txs", txs); }, [txs]);
  useEffect(() => { saveToStorage("fp_cfg", cfg); }, [cfg]);
  useEffect(() => { saveToStorage("fp_accounts", accounts); }, [accounts]);
  useEffect(() => { saveToStorage("fp_cats", cats); }, [cats]);
  useEffect(() => { saveToStorage("fp_presupuesto", presupuesto); }, [presupuesto]);
  useEffect(() => { saveToStorage("fp_deudas", deudas); }, [deudas]);
  useEffect(() => { saveToStorage("fp_tdcs", tdcs); }, [tdcs]);

  const horasReales = (cfg.horas_dia + (cfg.horas_extra || 0));
  const rate = (cfg.ingreso_quincena + (cfg.ingreso_extra || 0)) / (horasReales * cfg.dias_semana * 2);
  const totalDeudaReal = deudas.reduce((a, d) => a + d.saldo_actual, 0);
  const health = useMemo(() => healthScore(txs, cfg), [txs, cfg]);
  const totalG = txs.filter(t => t.tipo === "gasto").reduce((a, t) => a + t.monto, 0);
  const totalI = txs.filter(t => t.tipo === "ingreso").reduce((a, t) => a + t.monto, 0);
  const balance = totalI - totalG;

  const getEmoji = (catId, subId) => { const c = cats.find(x => x.id === catId); return c?.subs.find(s => s.id === subId)?.emoji || c?.emoji || "🏷️"; };
  const getName = (catId, subId) => { const c = cats.find(x => x.id === catId); return c?.subs.find(s => s.id === subId)?.nombre || c?.nombre || catId; };
  const getAccount = (id) => accounts.find(a => a.id === id);

  const grouped = groupByMonth(txs);

  return (
    <>
      <style>{FONTS}</style>
      <style>{CSS}</style>
      <div className="app">

        {/* HOME */}
        {tab === "home" && (
          <div className="scr">
            <div className="hdr">
              <p style={{ fontSize: 11, color: C.textDim, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Quincena 1 · Abril 2026</p>
              <h1 style={{ fontFamily: "'Space Mono',monospace", fontSize: 44, fontWeight: 700, lineHeight: 1, color: balance >= 0 ? C.text : C.red }}>{balance < 0 ? "−" : ""}{fmt(balance)}</h1>
              <p style={{ fontSize: 13, color: C.textDim, marginTop: 8 }}>balance · <span style={{ color: C.gold, fontFamily: "'Space Mono',monospace" }}>{toTime(Math.abs(balance), rate, cfg.horas_dia)}</span></p>
            </div>

            {/* Health card */}
            <div style={{ padding: "0 20px 16px" }}>
              <div style={{ border: `1px solid ${health.color}44`, borderRadius: 20, padding: 20, background: `${health.color}07` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <p style={{ fontSize: 10, color: health.color, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Índice de libertad</p>
                    <p style={{ fontSize: 22, fontWeight: 700, color: health.color }}>{health.icon} {health.label}</p>
                    <p style={{ fontSize: 12, color: C.textDim, marginTop: 4 }}>Basado en tus hábitos actuales</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 48, fontWeight: 700, color: health.color, lineHeight: 1 }}>{health.score}</div>
                    <div style={{ fontSize: 11, color: C.textDim }}>/ 100</div>
                  </div>
                </div>
                <div className="ptk" style={{ height: 8, marginBottom: 14 }}>
                  <div className="ptf" style={{ width: `${health.score}%`, background: `linear-gradient(90deg, ${health.color}55, ${health.color})` }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { l: "Ahorro", v: `${health.savRate.toFixed(1)}%`, meta: `≥${cfg.meta_ahorro_pct}%`, ok: health.savRate >= cfg.meta_ahorro_pct },
                    { l: "Carga deuda", v: `${health.dRate.toFixed(1)}%`, meta: `<${cfg.meta_deuda_pct}%`, ok: health.dRate <= cfg.meta_deuda_pct },
                  ].map(r => (
                    <div key={r.l} style={{ background: "#0d0d0d", borderRadius: 12, padding: "12px 14px", border: `1px solid ${C.border}` }}>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 22, color: r.ok ? C.green : C.red, fontWeight: 700 }}>{r.v}</div>
                      <div style={{ fontSize: 11, color: C.textDim, marginTop: 3 }}>{r.l}</div>
                      <div style={{ fontSize: 10, color: r.ok ? C.green : C.textDim, marginTop: 2 }}>meta {r.meta}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tarifa real */}
            {(cfg.horas_extra > 0 || cfg.ingreso_extra > 0) && (
              <div style={{ padding: "0 20px 16px" }}>
                <div className="card" style={{ background: `${C.red}08`, border: `1px solid ${C.red}33` }}>
                  <p style={{ fontSize: 10, color: C.red, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>Tarifa real de tu tiempo</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: C.textDim }}>Tarifa nominal</div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, color: C.textMid, marginTop: 3, textDecoration: "line-through" }}>{fmt(cfg.ingreso_quincena / (cfg.horas_dia * cfg.dias_semana * 2))}/h</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: C.textDim }}>Tarifa real</div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, color: C.red, marginTop: 3 }}>{fmt(rate)}/h</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: C.textDim, marginTop: 10, lineHeight: 1.6 }}>Regalas <span style={{ color: C.red, fontFamily: "'Space Mono',monospace" }}>{cfg.horas_extra}h/día</span> sin pago. Eso hace que cada hora pagada valga menos.</p>
                </div>
              </div>
            )}

            {/* Totals */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 20px 16px" }}>
              {[{ l: "Ingresos", v: fmt(totalI), c: C.green, t: toTime(totalI, rate, cfg.horas_dia) }, { l: "Gastos", v: fmt(totalG), c: C.red, t: toTime(totalG, rate, cfg.horas_dia) }].map(s => (
                <div key={s.l} className="card" style={{ textAlign: "center", padding: "16px 10px" }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 20, color: s.c, fontWeight: 700 }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: C.textDim, marginTop: 4, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>{s.l}</div>
                  <div style={{ fontSize: 11, color: C.gold, marginTop: 4, fontFamily: "'Space Mono',monospace" }}>{s.t}</div>
                </div>
              ))}
            </div>

            {/* Deudas summary */}
            {deudas.length > 0 && (() => {
              const totalDeuda = deudas.reduce((a, d) => a + d.saldo_actual, 0);
              const totalInteresMes = deudas.reduce((a, d) => a + d.saldo_actual * (d.tasa_mensual / 100), 0);
              return (
                <div style={{ padding: "0 20px 16px" }}>
                  <div style={{ border: "1px solid #E53E3E44", borderRadius: 18, padding: 18, background: "#E53E3E07" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <p style={{ fontSize: 10, color: C.red, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Deuda total</p>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 28, color: C.red, fontWeight: 700 }}>{fmt(totalDeuda)}</div>
                        <div style={{ fontSize: 12, color: C.textDim, marginTop: 4 }}>{toTime(totalDeuda, rate, cfg.horas_dia)} de tu vida</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: C.textDim }}>Interés/mes</div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 18, color: C.red, marginTop: 3 }}>{fmt(Math.round(totalInteresMes))}</div>
                        <div style={{ fontSize: 11, color: C.textDim, marginTop: 6 }}>Por día</div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, color: "#E8895A", marginTop: 3 }}>{fmt(Math.round(totalInteresMes / 30))}</div>
                      </div>
                    </div>
                    {deudas.map(d => {
                      const pct = d.saldo_inicial > 0 ? Math.min(((d.saldo_inicial - d.saldo_actual) / d.saldo_inicial) * 100, 100) : 0;
                      return (
                        <div key={d.id} style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 12 }}>{d.emoji} {d.nombre}</span>
                            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.red }}>{fmt(d.saldo_actual)}</span>
                          </div>
                          <div className="ptk" style={{ height: 5 }}>
                            <div className="ptf" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${C.green}88, ${C.green})` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Recientes */}
            <div style={{ padding: "0 20px" }}>
              <p className="sec">recientes</p>
              <div className="card" style={{ padding: "2px 16px" }}>
                {txs.slice(0, 6).map((t, i) => {
                  const acc = getAccount(t.cuentaId);
                  return (
                    <div key={t.id} className="row" style={{ borderBottom: i < 5 ? `1px solid ${C.border}` : "none" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 11, background: "#181818", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{getEmoji(t.catId, t.subId)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.nota || getName(t.catId, t.subId)}</div>
                        <div style={{ fontSize: 11, color: C.textDim }}>{acc?.emoji} {acc?.nombre} · {fmtDate(t.fecha)}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, fontWeight: 700, color: t.tipo === "ingreso" ? C.green : t.tipo === "transferencia" ? C.blue : C.text }}>{t.tipo === "ingreso" ? "+" : t.tipo === "transferencia" ? "↔" : "−"}{fmt(t.monto)}</div>
                        <div style={{ fontSize: 10, color: C.gold, marginTop: 2, fontFamily: "'Space Mono',monospace" }}>{toTime(t.monto, rate, cfg.horas_dia)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PLAN */}
        {tab === "plan" && <PlanTab presupuesto={presupuesto} setPresupuesto={setPresupuesto} cfg={cfg} rate={rate} />}
        {tab === "deudas" && <DeudasTab deudas={deudas} setDeudas={setDeudas} tdcs={tdcs} setTdcs={setTdcs} rate={rate} cfg={cfg} />}
        {tab === "babylon" && <BabylonChat txs={txs} deudas={deudas} tdcs={tdcs} presupuesto={presupuesto} cfg={cfg} rate={rate} />}

        {/* HISTORIAL */}
        {tab === "historial" && (
          <div className="scr">
            <div className="hdr">
              <h1 style={{ fontSize: 30, fontWeight: 700 }}>Historial</h1>
              <p style={{ fontSize: 13, color: C.textDim, marginTop: 4 }}>{txs.length} movimientos</p>
            </div>
            <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 24 }}>
              {grouped.map(([ym, mTxs]) => {
                const mG = mTxs.filter(t => t.tipo === "gasto").reduce((a, t) => a + t.monto, 0);
                const mI = mTxs.filter(t => t.tipo === "ingreso").reduce((a, t) => a + t.monto, 0);
                return (
                  <div key={ym}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{monthLabel(ym)}</span>
                      <div style={{ display: "flex", gap: 12 }}>
                        {mI > 0 && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.green, fontWeight: 700 }}>+{fmt(mI)}</span>}
                        {mG > 0 && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.red, fontWeight: 700 }}>−{fmt(mG)}</span>}
                      </div>
                    </div>
                    <div className="card" style={{ padding: "2px 16px" }}>
                      {mTxs.map((t, i) => {
                        const acc = getAccount(t.cuentaId);
                        return (
                          <div key={t.id} className="row" style={{ borderBottom: i < mTxs.length - 1 ? `1px solid ${C.border}` : "none" }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#181818", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{getEmoji(t.catId, t.subId)}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.nota || getName(t.catId, t.subId)}</div>
                              <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{acc?.emoji} {acc?.nombre} · {fmtDate(t.fecha)}</div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color: t.tipo === "ingreso" ? C.green : t.tipo === "transferencia" ? C.blue : C.text }}>{t.tipo === "ingreso" ? "+" : t.tipo === "transferencia" ? "↔" : "−"}{fmt(t.monto)}</div>
                              <div style={{ fontSize: 10, color: C.gold, marginTop: 2, fontFamily: "'Space Mono',monospace" }}>{toTime(t.monto, rate, cfg.horas_dia)}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ANÁLISIS */}
        {tab === "analisis" && <AnalisisTab txs={txs} cats={cats} cfg={cfg} rate={rate} />}

        {/* CONFIG */}
        {tab === "config" && (
          <div className="scr">
            <div className="hdr"><h1 style={{ fontSize: 30, fontWeight: 700 }}>Configuración</h1></div>
            <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { title: "Perfil", fields: [{ l: "Nombre", k: "nombre", t: "text" }]},
                { title: "Ingreso y tiempo", fields: [
                  { l: "Ingreso por quincena (MXN)", k: "ingreso_quincena", t: "number" },
                  { l: "Horas trabajadas por día (pagadas)", k: "horas_dia", t: "number" },
                  { l: "Horas extra NO pagadas por día", k: "horas_extra", t: "number" },
                  { l: "Días laborales por semana", k: "dias_semana", t: "number" },
                  { l: "Ingreso extra esta quincena (MXN)", k: "ingreso_extra", t: "number" },
                ]},
                { title: "Metas", fields: [
                  { l: "Meta de ahorro (%)", k: "meta_ahorro_pct", t: "number" },
                  { l: "Límite de carga de deuda (%)", k: "meta_deuda_pct", t: "number" },
                ]},
              ].map(sec => (
                <div key={sec.title}>
                  <p className="sec">{sec.title}</p>
                  <div className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {sec.fields.map(f => (
                      <div key={f.k}>
                        <label style={{ fontSize: 11, color: C.textDim, display: "block", marginBottom: 6, letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 600 }}>{f.l}</label>
                        <input type={f.t} value={cfg[f.k] ?? ""} onChange={e => setCfg(p => ({ ...p, [f.k]: f.t === "number" ? parseFloat(e.target.value) || 0 : e.target.value }))} className="inp mono" style={{ fontFamily: "'Space Mono',monospace" }} />
                      </div>
                    ))}
                    {sec.title === "Ingreso y tiempo" && (
                      <div style={{ background: "#0d0d0d", borderRadius: 12, padding: "14px", border: `1px solid ${C.border}` }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div>
                            <div style={{ fontSize: 11, color: C.textDim }}>Tarifa nominal/hora</div>
                            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 15, color: C.textMid, marginTop: 3 }}>{fmt(cfg.ingreso_quincena / (cfg.horas_dia * cfg.dias_semana * 2))}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: C.textDim }}>Tarifa real/hora</div>
                            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 15, color: cfg.horas_extra > 0 ? C.red : C.gold, marginTop: 3 }}>{fmt(rate)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Cuentas */}
              <div>
                <p className="sec">cuentas</p>
                <div className="card" style={{ padding: "2px 16px" }}>
                  {accounts.map((a, i) => (
                    <div key={a.id} className="row" style={{ borderBottom: i < accounts.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ fontSize: 22 }}>{a.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{a.nombre}</div>
                        <div style={{ fontSize: 11, color: C.textDim }}>{a.tipo}</div>
                      </div>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: a.color }} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ height: 10 }} />
            </div>
          </div>
        )}

        {/* FAB */}
        <button className="fab" onClick={() => setShowTx(true)}>+</button>

        {showTx && <TxForm cats={cats} accounts={accounts} cfg={cfg} rate={rate} onSave={tx => setTxs(p => [tx, ...p])} onClose={() => setShowTx(false)} />}

        {/* TABBAR */}
        <nav className="tabbar">
          {[["home","⬡","Inicio"],["deudas","⛓","Deudas"],["plan","▤","Plan"],["babylon","🏛","Babylon"],["config","⚙","Config"]].map(([id,icon,label]) => (
            <button key={id} className={`ti ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>
              <span className="ticon">{icon}</span>
              <span className="tlbl">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
