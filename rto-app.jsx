import { useState } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const C = {
  teal: "#1A9B8A", tealDark: "#147A6D", tealLight: "#E8F7F5", tealMid: "#2DC4AE",
  navy: "#1B2E3C", navyLight: "#243647", navyMid: "#1F3547",
  gold: "#E8A93A", goldLight: "#FEF6E4",
  white: "#FFFFFF", offWhite: "#F6FAFA",
  gray100: "#EEF3F3", gray200: "#D4E2E1", gray400: "#7FA5A3", gray600: "#4A6664",
  red: "#E05C5C", redLight: "#FFF0F0",
  green: "#27AE60",
};

// ─── UTILS ───────────────────────────────────────────────────────
const fmt    = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);
const fmtPct = (v) => Math.round(v) + "%";
const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;
const parseNum = (s) => { const n = parseFloat(String(s).replace(/\./g, "").replace(",", ".")); return isNaN(n) ? 0 : n; };
const fmtNum  = (v) => Number(v).toLocaleString("pt-BR");

// ─── MODELO MORE ─────────────────────────────────────────────────
const TAXA = { 1: 0.90, 2: 0.80, 3: 0.70, 4: 0.60, 5: 0.60 };
const TAXA_LABEL = { 1: "90%", 2: "80%", 3: "70%", 4: "60%", 5: "60%" };
const TAXA_ADMIN_EXTRAS = 0.05; // 5% sobre parcelas extras

const FAIXAS = [
  { id: 1, label: "Faixa 1", rendaMin: 0,    rendaMax: 3200,  aluguelPct: 0.10, tetoPct: 0.30, vgvMax: 275000, prazos: [1,2,3,4,5], cor: "#27AE60" },
  { id: 2, label: "Faixa 2", rendaMin: 3200, rendaMax: 5000,  aluguelPct: 0.15, tetoPct: 0.40, vgvMax: 275000, prazos: [1,2,3,4,5], cor: "#378ADD" },
  { id: 3, label: "Faixa 3", rendaMin: 5000, rendaMax: 9600,  aluguelPct: 0.20, tetoPct: 0.50, vgvMax: 400000, prazos: [1,2,3,4],   cor: "#7C6FCD" },
  { id: 4, label: "Faixa 4", rendaMin: 9600, rendaMax: 99999, aluguelPct: 0.20, tetoPct: 0.50, vgvMax: 600000, prazos: [1,2,3,4],   cor: "#E8A93A" },
];
const getFaixa = (renda) => FAIXAS.find(f => renda >= f.rendaMin && renda < f.rendaMax) || FAIXAS[3];

// ─── COMPONENTES BASE ─────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.white, borderRadius: 16, padding: "20px", boxShadow: "0 2px 12px rgba(27,46,60,0.07)", border: `1px solid ${C.gray100}`, ...style }}>
    {children}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", style = {} }) => (
  <button onClick={onClick} style={{
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none",
    background: variant === "primary" ? `linear-gradient(135deg, ${C.teal}, ${C.tealDark})` : "transparent",
    color: variant === "primary" ? C.white : C.teal,
    border: variant === "secondary" ? `1.5px solid ${C.teal}` : "none",
    ...style,
  }}>{children}</button>
);

const Field = ({ label, value, onChange, hint }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <label style={{ fontWeight: 600, fontSize: 13, color: C.gray600 }}>{label}</label>
      {hint && <span style={{ fontSize: 11, color: C.teal, fontWeight: 700 }}>{hint}</span>}
    </div>
    <input type="text" value={fmtNum(value)} onChange={e => onChange(parseNum(e.target.value))}
      style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.gray200}`, fontSize: 14, boxSizing: "border-box", outline: "none" }} />
  </div>
);

const StatusBar = ({ ok, label, sub }) => (
  <div style={{ borderRadius: 12, padding: "12px 16px", marginBottom: 14, background: ok ? C.tealLight : C.redLight, border: `1.5px solid ${ok ? C.teal : C.red}`, display: "flex", alignItems: "flex-start", gap: 10 }}>
    <span style={{ fontSize: 16 }}>{ok ? "✅" : "⚠️"}</span>
    <div>
      <div style={{ fontWeight: 700, fontSize: 13, color: ok ? C.teal : C.red }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: C.gray600, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════
function Landing({ onComprador, onProprietario }) {
  const mob = isMobile();
  return (
    <div style={{ minHeight: "100vh", background: C.navy, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: mob ? "24px 16px" : "48px 24px" }}>
      
      {/* Logo */}
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: C.white, letterSpacing: "-1px" }}>
          <span style={{ color: C.tealMid }}>MORE</span>
        </div>
        <div style={{ fontSize: 13, color: C.gray400, marginTop: 4, fontWeight: 500, letterSpacing: "0.12em" }}>ALUGAR PARA COMPRAR</div>
      </div>

      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontSize: mob ? 26 : 36, fontWeight: 900, color: C.white, margin: "0 0 12px", lineHeight: 1.15 }}>
          O que você quer simular?
        </h1>
        <p style={{ color: C.gray400, fontSize: 15, margin: 0 }}>
          Escolha o seu perfil para começar
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20, maxWidth: 700, width: "100%" }}>
        
        {/* Card Comprador */}
        <div onClick={onComprador} style={{ background: "rgba(255,255,255,0.04)", border: `1.5px solid rgba(255,255,255,0.1)`, borderRadius: 20, padding: "32px 28px", cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(26,155,138,0.12)"; e.currentTarget.style.borderColor = C.teal; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.white, marginBottom: 8 }}>Quero comprar um imóvel</div>
          <div style={{ fontSize: 13, color: C.gray400, lineHeight: 1.6, marginBottom: 20 }}>
            Simule como construir sua entrada morando no imóvel — sem precisar ter o dinheiro agora.
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`, color: C.white, fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 10 }}>
            Simular aquisição →
          </div>
        </div>

        {/* Card Proprietário */}
        <div onClick={onProprietario} style={{ background: "rgba(255,255,255,0.04)", border: `1.5px solid rgba(255,255,255,0.1)`, borderRadius: 20, padding: "32px 28px", cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(232,169,58,0.12)"; e.currentTarget.style.borderColor = C.gold; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔑</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.white, marginBottom: 8 }}>Quero vender um imóvel</div>
          <div style={{ fontSize: 13, color: C.gray400, lineHeight: 1.6, marginBottom: 20 }}>
            Simule quanto você recebe ao colocar seu imóvel parado no programa MORE — com renda mensal garantida.
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `linear-gradient(135deg, ${C.gold}, #C8891A)`, color: C.white, fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 10 }}>
            Simular venda →
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40, fontSize: 12, color: C.gray400, textAlign: "center" }}>
        Simulador educativo · Não representa aprovação de crédito
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SIMULADOR COMPRADOR
// ═══════════════════════════════════════════════════════════════════
function SimuladorComprador({ onBack }) {
  const [imovel, setImovel]   = useState(270000);
  const [renda, setRenda]     = useState(0);
  const [entrada, setEntrada] = useState(0);
  const [prazo, setPrazo]     = useState(2);
  const [extras, setExtras]   = useState("nenhuma");
  const [metaPct, setMetaPct] = useState(20);
  const [result, setResult]   = useState(null);
  const mob = isMobile();

  const faixa = getFaixa(renda);
  const prazoValido = faixa.prazos.includes(prazo) ? prazo : faixa.prazos[Math.min(1, faixa.prazos.length - 1)];

  const calcular = () => {
    const pct   = Math.max(20, Math.min(metaPct, 100));
    const meses = prazoValido * 12;
    const taxa  = TAXA[prazoValido];
    const teto  = renda * faixa.tetoPct;

    // ── Valorização: imóvel futuro na data da compra ──
    const imovelFuturo         = imovel * Math.pow(1.04, prazoValido);
    const valorizacaoTotal     = imovelFuturo - imovel;
    const financiamentoBancario = imovelFuturo * (1 - pct / 100);

    // ── Meta de entrada = % do valor FUTURO ──
    const meta = imovelFuturo * (pct / 100);

    // ── Despesas mensais (1,5% a.a. ÷ 12) ──
    const despesaMensal = imovel * 0.015 / 12;
    const despesaTotal  = despesaMensal * meses;

    // ── Aluguel pago pelo comprador → vai ao proprietário (bruto) ──
    const aluguel                    = renda * faixa.aluguelPct;
    const aluguelLiquidoProprietario = Math.max(0, aluguel - despesaMensal);
    const receitaLiquidaProprietario = aluguelLiquidoProprietario * meses;

    // ── Parcelas extras: 95% → poupança, 5% → taxa MORE ──
    let totalExtras = 0, qExtras = 0, valorExtra = 0;
    let poupancaExtras = 0, taxaAdminExtras = 0;
    if (extras === "semestrais") {
      qExtras     = prazoValido * 2;
      valorExtra  = renda * 0.8;
      totalExtras = qExtras * valorExtra;
    }
    if (extras === "anuais") {
      qExtras     = prazoValido;
      valorExtra  = renda * 1.5;
      totalExtras = qExtras * valorExtra;
    }
    poupancaExtras  = totalExtras * (1 - TAXA_ADMIN_EXTRAS); // 95% vai para poupança
    taxaAdminExtras = totalExtras * TAXA_ADMIN_EXTRAS;        // 5% é taxa MORE

    // ── Aporte mensal necessário (só ele converte em poupança) ──
    // Poupança necessária = meta - entrada inicial - poupança das extras
    const restante        = Math.max(0, meta - entrada - poupancaExtras);
    // Aporte bruto necessário para atingir restante via conversão
    const aporteMensal    = restante > 0 ? (restante / meses) / taxa : 0;
    // Pagamento mensal total = aluguel + aporte
    const pgtoMensal      = Math.max(aluguel, aluguel + aporteMensal);
    const aporteReal      = pgtoMensal - aluguel;

    // ── Conversão: só o aporte converte em poupança ──
    const poupancaAporte  = aporteReal * meses * taxa;          // poupança do aporte mensal
    const taxaAdminAporte = aporteReal * meses * (1 - taxa);    // taxa MORE do aporte
    const poupancaTotal   = entrada + poupancaAporte + poupancaExtras; // total acumulado
    const taxaAdminTotal  = taxaAdminAporte + taxaAdminExtras;

    const totalPago       = pgtoMensal * meses + totalExtras;
    const viavel          = pgtoMensal <= teto;
    const vgvOk           = imovelFuturo <= faixa.vgvMax * 1.15;
    const metaAtingida    = poupancaTotal >= meta;

    setResult({
      meta, pct, aluguel, teto,
      aporteReal, pgtoMensal,
      totalExtras, valorExtra, qExtras, poupancaExtras, taxaAdminExtras,
      totalPago, poupancaAporte, poupancaTotal, taxaAdminAporte, taxaAdminTotal,
      viavel, vgvOk, metaAtingida, taxa, meses, prazoValido,
      imovelFuturo, valorizacaoTotal, financiamentoBancario,
      despesaMensal, despesaTotal,
      aluguelLiquidoProprietario, receitaLiquidaProprietario,
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.offWhite, padding: mob ? "16px 14px 40px" : "32px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div onClick={onBack} style={{ cursor: "pointer", color: C.teal, fontWeight: 700, fontSize: 13 }}>← Voltar</div>
          <div style={{ width: 1, height: 16, background: C.gray200 }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>🏠 Simulador de Aquisição</div>
          {renda > 0 && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: faixa.cor + "18", border: `1.5px solid ${faixa.cor}44`, borderRadius: 20, padding: "3px 12px" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: faixa.cor }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: faixa.cor }}>{faixa.label} MCMV</span>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20 }}>

          {/* INPUTS */}
          <Card>
            <h3 style={{ marginTop: 0, marginBottom: 20, fontSize: 15, fontWeight: 800, color: C.navy }}>Dados da simulação</h3>

            <Field label="Valor do Imóvel (R$)" value={imovel} onChange={setImovel} hint="Sugestão MORE" />
            <Field label="Renda Familiar Mensal (R$)" value={renda} onChange={setRenda} />
            <Field label="Entrada Inicial Disponível (R$)" value={entrada} onChange={setEntrada} />

            {renda > 0 && imovel > faixa.vgvMax && (
              <div style={{ background: C.redLight, border: `1.5px solid ${C.red}`, borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: C.red, fontSize: 13 }}>⚠️ Imóvel acima do limite da {faixa.label}</div>
                <div style={{ color: C.gray600, fontSize: 12, marginTop: 2 }}>VGV máximo: {fmt(faixa.vgvMax)}</div>
              </div>
            )}

            {/* Meta */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontWeight: 600, fontSize: 13, color: C.gray600 }}>Meta de entrada (% do imóvel)</label>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.teal }}>{metaPct}%</span>
              </div>
              <input type="range" min={20} max={50} step={5} value={metaPct} onChange={e => setMetaPct(Number(e.target.value))} style={{ width: "100%" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.gray400, marginTop: 2 }}>
                <span>20% (mínimo)</span><span>50%</span>
              </div>
            </div>

            {/* Prazo */}
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.gray600, marginBottom: 10 }}>Prazo</label>
            <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
              {faixa.prazos.map(p => (
                <button key={p} onClick={() => setPrazo(p)} style={{
                  flex: "1 1 auto", padding: "10px 4px", borderRadius: 10,
                  border: `2px solid ${prazo === p ? C.teal : C.gray200}`,
                  background: prazo === p ? C.tealLight : C.white,
                  color: prazo === p ? C.teal : C.gray600,
                  fontWeight: 700, cursor: "pointer", fontSize: 12,
                }}>
                  {p}a<br />
                  <span style={{ fontSize: 10, fontWeight: 500 }}>{TAXA_LABEL[p]}</span>
                </button>
              ))}
            </div>

            {/* Extras */}
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.gray600, marginBottom: 10 }}>Parcelas extras?</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
              {[
                { val: "nenhuma",    label: "Nenhuma",    sub: "Sem parcelas extras" },
                { val: "semestrais", label: "Semestrais", sub: "2×/ano · 80% da renda · 13º + férias" },
                { val: "anuais",     label: "Anuais",     sub: "1×/ano · 1,5× a renda · bônus anual" },
              ].map(o => (
                <div key={o.val} onClick={() => setExtras(o.val)} style={{ padding: "11px 14px", borderRadius: 10, cursor: "pointer", border: `2px solid ${extras === o.val ? C.teal : C.gray200}`, background: extras === o.val ? C.tealLight : C.white }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: extras === o.val ? C.teal : C.navy }}>{o.label}</div>
                  <div style={{ fontSize: 12, color: C.gray400 }}>{o.sub}</div>
                </div>
              ))}
            </div>

            <Btn onClick={calcular} style={{ width: "100%", padding: "14px 0", fontSize: 15 }}>Simular →</Btn>

            <div style={{ marginTop: 14, padding: "10px 12px", background: C.gray100, borderRadius: 10, fontSize: 11, color: C.gray600, lineHeight: 1.6 }}>
              <strong>Taxa de administração MORE:</strong> gestão do contrato, custódia da poupança, intermediação e suporte até a compra. Tudo declarado, sem surpresas.
            </div>
          </Card>

          {/* RESULTADO */}
          <div>
            {!result ? (
              <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 360 }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🏡</div>
                <p style={{ color: C.gray400, textAlign: "center", fontSize: 14 }}>Preencha os dados e clique em Simular</p>
              </Card>
            ) : (
              <>
                <StatusBar
                  ok={result.viavel && result.vgvOk}
                  label={result.viavel && result.vgvOk
                    ? `${faixa.label} · ${result.prazoValido}a · ${TAXA_LABEL[result.prazoValido]} convertido em entrada`
                    : !result.vgvOk ? `Imóvel acima do limite da ${faixa.label}` : `Parcela acima do teto de ${fmtPct(faixa.tetoPct * 100)}`}
                  sub={`${faixa.label} · aluguel ${fmtPct(faixa.aluguelPct * 100)} da renda · teto ${fmtPct(faixa.tetoPct * 100)} da renda`}
                />

                {/* Card de valorização — TRANSPARÊNCIA TOTAL */}
                <div style={{ background: C.navy, borderRadius: 14, padding: 16, marginBottom: 14, border: `1.5px solid ${C.teal}44` }}>
                  <div style={{ color: C.tealMid, fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: "0.07em" }}>📋 O QUE VOCÊ ASSINA HOJE</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[
                      { label: "Imóvel hoje", value: fmt(imovel), sub: "valor atual", dim: true },
                      { label: `Imóvel em ${result.prazoValido}a`, value: fmt(result.imovelFuturo), sub: `+4% a.a. · +${fmt(result.valorizacaoTotal)}`, bright: true },
                      { label: "Financiamento bancário", value: fmt(result.financiamentoBancario), sub: `${100 - result.pct}% do valor futuro`, dim: true },
                    ].map(i => (
                      <div key={i.label} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 10px" }}>
                        <div style={{ color: C.gray400, fontSize: 10, marginBottom: 3 }}>{i.label}</div>
                        <div style={{ color: i.bright ? C.tealMid : C.white, fontWeight: 800, fontSize: 13 }}>{i.value}</div>
                        <div style={{ color: C.gray400, fontSize: 10, marginTop: 2 }}>{i.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 8, fontSize: 11, color: C.gray400, lineHeight: 1.5 }}>
                    O imóvel se valoriza 4% ao ano. O valor que você vai financiar no banco é o valor futuro — você já sabe esse número hoje, sem surpresas.
                  </div>
                </div>

                {/* Pagamento mensal com lógica correta */}
                <Card style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.gray400, marginBottom: 14, letterSpacing: "0.06em" }}>COMPOSIÇÃO DO PAGAMENTO MENSAL</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    {[
                      { label: "Aluguel (bruto)", value: fmt(result.aluguel), sub: `${fmtPct(faixa.aluguelPct * 100)} da renda → proprietário`, color: C.navy },
                      { label: "Aporte poupança", value: fmt(result.aporteReal), sub: `${TAXA_LABEL[result.prazoValido]} vira entrada`, color: C.teal },
                      { label: "Despesas (descontadas)", value: fmt(result.despesaMensal), sub: "IPTU + cond. 1,5% a.a. — do aluguel bruto", color: C.gold },
                      { label: "Total mensal", value: fmt(result.pgtoMensal), sub: `${Math.round((result.pgtoMensal / renda) * 100)}% da renda`, color: C.navy, big: true },
                    ].map(i => (
                      <div key={i.label} style={{ background: C.offWhite, borderRadius: 10, padding: "10px 12px" }}>
                        <div style={{ color: C.gray400, fontSize: 10, marginBottom: 3 }}>{i.label}</div>
                        <div style={{ fontWeight: 800, fontSize: i.big ? 15 : 13, color: i.color }}>{i.value}</div>
                        <div style={{ fontSize: 10, color: C.gray400, marginTop: 2 }}>{i.sub}</div>
                      </div>
                    ))}
                  </div>
                  {/* Barra de decomposição */}
                  <div style={{ fontSize: 11, color: C.gray600, marginBottom: 6 }}>Decomposição do pagamento mensal</div>
                  <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 6 }}>
                    <div style={{ width: `${(result.aluguel / result.pgtoMensal) * 100}%`, background: C.navy }} />
                    <div style={{ width: `${(result.aporteReal / result.pgtoMensal) * 100}%`, background: C.teal }} />
                  </div>
                  <div style={{ display: "flex", gap: 14, fontSize: 10, color: C.gray600 }}>
                    <span style={{ color: C.navy }}>● Aluguel ao prop.</span>
                    <span style={{ color: C.teal }}>● Aporte poupança</span>
                  </div>
                  {/* Comprometimento */}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.gray600, marginBottom: 4 }}>
                      <span>Comprometimento da renda</span>
                      <span style={{ fontWeight: 700, color: result.viavel ? C.teal : C.red }}>
                        {Math.round((result.pgtoMensal / renda) * 100)}% / teto {fmtPct(faixa.tetoPct * 100)}
                      </span>
                    </div>
                    <div style={{ height: 8, background: C.gray100, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 4, width: `${Math.min((result.pgtoMensal / renda) * 100, 100)}%`, background: result.viavel ? C.teal : C.red }} />
                    </div>
                  </div>
                </Card>

                {/* Extras */}
                {extras !== "nenhuma" && (
                  <Card style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.gray400, marginBottom: 10, letterSpacing: "0.06em" }}>PARCELAS EXTRAS 🚀</div>
                    <div style={{ background: C.tealLight, borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: C.teal, fontWeight: 600 }}>
                      Parcelas extras aceleram sua entrada! 95% vai direto para a poupança.
                    </div>
                    {[
                      { label: "Valor de cada extra", value: fmt(result.valorExtra) },
                      { label: `Quantidade total`, value: `${result.qExtras}x` },
                      { label: "Total das extras", value: fmt(result.totalExtras) },
                      { label: "↳ Poupança (95%)", value: fmt(result.poupancaExtras), color: C.teal },
                      { label: "↳ Taxa MORE (5%)", value: fmt(result.taxaAdminExtras), sub: true },
                    ].map(r => (
                      <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.gray100}` }}>
                        <span style={{ color: r.sub ? C.gray400 : C.gray600, fontSize: r.sub ? 12 : 13, fontStyle: r.sub ? "italic" : "normal" }}>{r.label}</span>
                        <span style={{ fontWeight: 700, fontSize: 13, color: r.color || (r.sub ? C.gray400 : C.navy) }}>{r.value}</span>
                      </div>
                    ))}
                  </Card>
                )}

                {/* Resumo correto */}
                <Card style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.gray400, marginBottom: 12, letterSpacing: "0.06em" }}>FORMAÇÃO DA ENTRADA</div>
                  {[
                    { label: "Total pago no período", value: fmt(result.totalPago), color: C.gray600 },
                    { label: "Entrada inicial disponível", value: fmt(entrada) },
                    { label: `Aporte mensal × ${result.meses} meses × ${TAXA_LABEL[result.prazoValido]}`, value: fmt(result.poupancaAporte), color: C.teal },
                    extras !== "nenhuma" && { label: "Poupança das extras (95%)", value: fmt(result.poupancaExtras), color: C.teal },
                    { label: "Poupança total acumulada", value: fmt(result.poupancaTotal), highlight: true },
                    { label: `Meta (${result.pct}% de ${fmt(result.imovelFuturo)})`, value: fmt(result.meta) },
                  ].filter(Boolean).map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.gray100}` }}>
                      <span style={{ color: C.gray600, fontSize: 13 }}>{r.label}</span>
                      <span style={{ fontWeight: r.highlight ? 800 : 600, fontSize: r.highlight ? 16 : 13, color: r.color || (r.highlight ? C.teal : C.navy) }}>{r.value}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 10, padding: 12, borderRadius: 10, background: result.metaAtingida ? C.tealLight : C.goldLight, border: `1px solid ${result.metaAtingida ? C.teal : C.gold}` }}>
                    <div style={{ fontWeight: 700, color: result.metaAtingida ? C.teal : C.gold, fontSize: 13 }}>
                      {result.metaAtingida ? "✅ Meta de entrada atingida!" : "⚠️ Considere prazo maior, % de meta menor, ou parcelas extras"}
                    </div>
                  </div>
                </Card>

                {/* Transparência total — o que cada real faz */}
                <Card style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.gray400, marginBottom: 12, letterSpacing: "0.06em" }}>DESTINO DE CADA REAL PAGO</div>
                  {[
                    { label: "Proprietário recebe (líquido)", value: fmt(result.aluguelLiquidoProprietario * result.meses), sub: `${fmt(result.aluguelLiquidoProprietario)}/mês após despesas` },
                    { label: "Despesas cobertas (IPTU + cond.)", value: fmt(result.despesaTotal), sub: "descontado do aluguel bruto pela MORE" },
                    { label: "Poupança acumulada pelo comprador", value: fmt(result.poupancaTotal - entrada), sub: "100% pertence ao comprador" },
                    { label: "Taxa de administração MORE", value: fmt(result.taxaAdminTotal), sub: "aporte × (1 − taxa conv.) + 5% das extras" },
                  ].map(r => (
                    <div key={r.label} style={{ padding: "8px 0", borderBottom: `1px solid ${C.gray100}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: C.gray600, fontSize: 13 }}>{r.label}</span>
                        <span style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>{r.value}</span>
                      </div>
                      <div style={{ fontSize: 11, color: C.gray400, marginTop: 2, fontStyle: "italic" }}>{r.sub}</div>
                    </div>
                  ))}
                  <div style={{ marginTop: 10, padding: "8px 12px", background: C.gray100, borderRadius: 8, fontSize: 11, color: C.gray600, lineHeight: 1.6 }}>
                    Soma: proprietário + despesas + poupança + MORE = total pago pelo comprador. Sem dupla contagem, sem surpresa.
                  </div>
                </Card>

                {/* Comparação entre prazos */}
                <Card style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.gray400, marginBottom: 12, letterSpacing: "0.06em" }}>COMPARAÇÃO ENTRE PRAZOS</div>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${faixa.prazos.length}, 1fr)`, gap: 6 }}>
                    {faixa.prazos.map(p => {
                      const t        = TAXA[p];
                      const m        = p * 12;
                      const al       = renda * faixa.aluguelPct;
                      const imovFut  = imovel * Math.pow(1.04, p);
                      const metaC    = imovFut * (metaPct / 100);
                      // poupança das extras já simuladas
                      let poupExtras = 0;
                      if (extras === "semestrais") poupExtras = (p * 2) * (renda * 0.8) * (1 - TAXA_ADMIN_EXTRAS);
                      if (extras === "anuais")     poupExtras = p * (renda * 1.5) * (1 - TAXA_ADMIN_EXTRAS);
                      const rest     = Math.max(0, metaC - entrada - poupExtras);
                      const aporte   = rest > 0 ? (rest / m) / t : 0;
                      const pgto     = al + aporte;
                      const admAporte = aporte * m * (1 - t);
                      const ok       = pgto <= renda * faixa.tetoPct;
                      const atingeMeta = (aporte * m * t) + entrada + poupExtras >= metaC;
                      return (
                        <div key={p} onClick={() => setPrazo(p)} style={{ padding: "8px 4px", borderRadius: 10, textAlign: "center", cursor: "pointer", border: `2px solid ${p === prazo ? C.teal : C.gray200}`, background: p === prazo ? C.tealLight : C.white }}>
                          <div style={{ fontWeight: 700, color: p === prazo ? C.teal : C.navy, fontSize: 12 }}>{p}a</div>
                          <div style={{ fontSize: 10, color: C.gray400 }}>{TAXA_LABEL[p]}</div>
                          <div style={{ fontSize: 10, color: C.gray400, marginTop: 1 }}>{fmt(imovFut)}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: ok ? C.navy : C.red, marginTop: 2 }}>{fmt(pgto)}/mês</div>
                          <div style={{ fontSize: 9, color: C.gray400 }}>adm {fmt(admAporte)}</div>
                          {!ok && <div style={{ fontSize: 9, color: C.red }}>↑ teto</div>}
                          {ok && !atingeMeta && <div style={{ fontSize: 9, color: C.gold }}>⚠ meta</div>}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: C.gray400 }}>
                    Clique em um prazo para selecionar e simular. Valores recalculados com seus dados atuais.
                  </div>
                </Card>

                {/* CTA */}
                {result.viavel && result.vgvOk && result.metaAtingida && (
                  <div style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navyLight})`, borderRadius: 20, padding: 24, border: `2px solid ${C.teal}`, boxShadow: `0 8px 32px ${C.teal}22` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🔑</div>
                      <div>
                        <div style={{ color: C.tealMid, fontSize: 12, fontWeight: 700 }}>SIMULAÇÃO VIÁVEL · {faixa.label}</div>
                        <div style={{ color: C.white, fontWeight: 800, fontSize: 17 }}>Seu plano de compra está pronto</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
                      {[
                        { label: "Imóvel (valor futuro)", value: fmt(result.imovelFuturo) },
                        { label: "Prazo", value: `${result.prazoValido} ano${result.prazoValido > 1 ? "s" : ""}` },
                        { label: "Mensalidade", value: fmt(result.pgtoMensal) },
                        { label: "Entrada acumulada", value: fmt(result.poupancaTotal) },
                      ].map(i => (
                        <div key={i.label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
                          <div style={{ color: C.gray400, fontSize: 11 }}>{i.label}</div>
                          <div style={{ color: C.white, fontWeight: 800, fontSize: 15, marginTop: 2 }}>{i.value}</div>
                        </div>
                      ))}
                    </div>
                    <button style={{ width: "100%", padding: "15px 0", borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`, color: C.white, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                      🏠 Quero iniciar meu Alugar para Comprar
                    </button>
                  </div>
                )}

                <p style={{ color: C.gray400, fontSize: 11, textAlign: "center", marginTop: 14 }}>Simulador educativo · Não representa aprovação de crédito</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SIMULADOR PROPRIETÁRIO — INDEPENDENTE
// ═══════════════════════════════════════════════════════════════════
function SimuladorProprietario({ onBack }) {
  const [imovel, setImovel]   = useState(270000);
  const [renda, setRenda]     = useState(0);
  const [prazo, setPrazo]     = useState(2);
  const [metaPct, setMetaPct] = useState(20);
  const [result, setResult]   = useState(null);
  const mob = isMobile();

  // No simulador do proprietário os prazos são sempre 1 a 5 anos
  const PRAZOS_PROP = [1, 2, 3, 4, 5];
  const prazoValido = PRAZOS_PROP.includes(prazo) ? prazo : 2;
  // Faixa para exibição no JSX (baseada na renda do comprador alvo)
  const faixaJSX = getFaixa(renda);

  const calcular = () => {
    const pct    = Math.max(20, Math.min(metaPct, 100));
    const meses  = prazoValido * 12;

    // ── Faixa baseada na renda do comprador alvo (ou fallback) ──
    const faixaLocal = getFaixa(renda);

    // ── Valorização: imóvel valerá mais na venda ──
    const imovelFinal      = imovel * Math.pow(1.04, prazoValido);
    const valorizacao      = imovelFinal - imovel;

    // ── Comissão MORE na venda — 4% do VGV futuro, paga pelo vendedor ──
    const comissaoMore     = imovelFinal * 0.04;
    const liquidoVenda     = imovelFinal - comissaoMore;

    // ── Financiamento e entrada: sobre o valor FUTURO ──
    const financiamento    = imovelFinal * (1 - pct / 100);
    const entradaComprador = imovelFinal * (pct / 100);

    // ── Aluguel bruto (% da renda do comprador alvo, ou 0,4% do imóvel) ──
    const aluguelBruto  = renda > 0 ? renda * faixaLocal.aluguelPct : imovel * 0.004;

    // ── Despesas mensais (1,5% a.a. ÷ 12) — MORE desconta e repassa líquido ──
    const despesaMensal = imovel * 0.015 / 12;
    const despesaTotal  = despesaMensal * meses;

    // ── Proprietário recebe o líquido mensal ──
    const aluguelLiquido = Math.max(0, aluguelBruto - despesaMensal);
    const receitaLocacao = aluguelLiquido * meses;

    // ── Despesas que proprietário teria com imóvel parado ──
    const despesasParado = despesaTotal;

    // ── Totais ──
    // Parado: usa valor ATUAL (imóvel ocioso não valoriza na prática), menos despesas acumuladas
    const totalComMore   = receitaLocacao + liquidoVenda;
    const totalParado    = imovel - despesasParado;
    const ganhoAdicional = totalComMore - totalParado;
    const yieldAnual     = imovel > 0 ? (aluguelLiquido * 12) / imovel * 100 : 0;
    const retornoTotal   = imovel > 0 ? (totalComMore / imovel - 1) * 100 : 0;

    setResult({
      pct, meses, prazoValido,
      imovelFinal, valorizacao, comissaoMore, liquidoVenda,
      financiamento, entradaComprador,
      aluguelBruto, despesaMensal, despesaTotal, aluguelLiquido, receitaLocacao,
      despesasParado, totalComMore, totalParado, ganhoAdicional,
      yieldAnual, retornoTotal, faixaLocal,
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.offWhite, padding: mob ? "16px 14px 40px" : "32px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div onClick={onBack} style={{ cursor: "pointer", color: C.gold, fontWeight: 700, fontSize: 13 }}>← Voltar</div>
          <div style={{ width: 1, height: 16, background: C.gray200 }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>🔑 Simulador de Venda</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20 }}>

          {/* INPUTS */}
          <Card>
            <h3 style={{ marginTop: 0, marginBottom: 6, fontSize: 15, fontWeight: 800, color: C.navy }}>Dados do imóvel</h3>
            <p style={{ fontSize: 13, color: C.gray400, marginBottom: 20 }}>Simule quanto você recebe ao participar do programa MORE</p>

            <Field label="Valor do Imóvel (R$)" value={imovel} onChange={setImovel} />
            <Field label="Renda do comprador alvo (R$)" value={renda} onChange={setRenda} hint="Opcional — define o aluguel mensal" />

            {renda > 0 && (
              <div style={{ background: faixaJSX.cor + "12", border: `1.5px solid ${faixaJSX.cor}33`, borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: faixaJSX.cor }}>{faixaJSX.label} · aluguel estimado: {fmt(renda * faixaJSX.aluguelPct)}/mês</div>
              </div>
            )}
            {renda === 0 && (
              <div style={{ background: C.goldLight, border: `1.5px solid ${C.gold}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: C.gray600 }}>Sem renda informada, estimamos 0,4% do imóvel/mês como aluguel.</div>
              </div>
            )}

            {/* Meta */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontWeight: 600, fontSize: 13, color: C.gray600 }}>Entrada do comprador (% do imóvel)</label>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.gold }}>{metaPct}%</span>
              </div>
              <input type="range" min={20} max={50} step={5} value={metaPct} onChange={e => setMetaPct(Number(e.target.value))} style={{ width: "100%", accentColor: C.gold }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.gray400, marginTop: 2 }}>
                <span>20% (mínimo)</span><span>50%</span>
              </div>
            </div>

            {/* Prazo */}
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.gray600, marginBottom: 10 }}>Prazo do contrato</label>
            <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
              {PRAZOS_PROP.map(p => (
                <button key={p} onClick={() => setPrazo(p)} style={{
                  flex: "1 1 auto", padding: "10px 4px", borderRadius: 10,
                  border: `2px solid ${prazo === p ? C.gold : C.gray200}`,
                  background: prazo === p ? C.goldLight : C.white,
                  color: prazo === p ? C.gold : C.gray600,
                  fontWeight: 700, cursor: "pointer", fontSize: 12,
                }}>
                  {p}a
                </button>
              ))}
            </div>

            <button onClick={calcular} style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${C.gold}, #C8891A)`, color: C.white, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
              Simular →
            </button>
          </Card>

          {/* RESULTADO */}
          <div>
            {!result ? (
              <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🔑</div>
                <p style={{ color: C.gray400, textAlign: "center", fontSize: 14 }}>Preencha os dados e clique em Simular</p>
              </Card>
            ) : (
              <>
                {/* Card principal — o que o proprietário recebe */}
                <div style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navyMid})`, borderRadius: 16, padding: 20, marginBottom: 14, border: `1.5px solid ${C.gold}44` }}>
                  <div style={{ color: C.gold, fontSize: 11, fontWeight: 700, marginBottom: 12, letterSpacing: "0.08em" }}>O QUE VOCÊ RECEBE</div>

                  {/* Composição do aluguel — transparência total */}
                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
                    <div style={{ color: C.gray400, fontSize: 10, marginBottom: 8 }}>COMPOSIÇÃO DO ALUGUEL MENSAL</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: C.white, fontSize: 13 }}>Aluguel bruto (pago pelo comprador)</span>
                      <span style={{ color: C.white, fontWeight: 700, fontSize: 13 }}>{fmt(result.aluguelBruto)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ color: C.gold, fontSize: 12 }}>↳ Despesas (IPTU + cond.) descontadas pela MORE</span>
                      <span style={{ color: C.gold, fontWeight: 700, fontSize: 12 }}>−{fmt(result.despesaMensal)}</span>
                    </div>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: C.tealMid, fontSize: 13, fontWeight: 700 }}>Você recebe líquido</span>
                      <span style={{ color: C.tealMid, fontSize: 18, fontWeight: 900 }}>{fmt(result.aluguelLiquido)}/mês</span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    {[
                      { label: "Total líquido recebido", value: fmt(result.receitaLocacao), sub: `${result.meses} parcelas · ${result.prazoValido}a` },
                      { label: "Despesas cobertas", value: fmt(result.despesaTotal), sub: "IPTU + cond. · não sai do seu bolso" },
                      { label: "Entrada do comprador*", value: fmt(result.entradaComprador), sub: `${metaPct}% do valor do imóvel` },
                      { label: "Financiamento bancário*", value: fmt(result.financiamento), sub: `${100 - metaPct}% via banco na venda` },
                    ].map(i => (
                      <div key={i.label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
                        <div style={{ color: C.gray400, fontSize: 10, marginBottom: 3 }}>{i.label}</div>
                        <div style={{ color: C.white, fontWeight: 800, fontSize: 13 }}>{i.value}</div>
                        <div style={{ color: C.gray400, fontSize: 10, marginTop: 2 }}>{i.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12 }}>
                    <div style={{ color: C.gray400, fontSize: 11, marginBottom: 8 }}>RECEBIMENTO NA VENDA</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: C.white, fontSize: 13 }}>Valor do imóvel (com valorização 4% a.a.)</span>
                      <span style={{ color: C.white, fontWeight: 600, fontSize: 13 }}>{fmt(result.imovelFinal)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ color: C.gold, fontSize: 12 }}>↳ Comissão MORE 4% (corretagem na venda)</span>
                      <span style={{ color: C.gold, fontWeight: 600, fontSize: 12 }}>−{fmt(result.comissaoMore)}</span>
                    </div>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8, marginBottom: 4 }}>
                      <div style={{ color: C.gray400, fontSize: 11, marginBottom: 4 }}>TOTAL RECEBIDO AO FINAL DO CONTRATO</div>
                      <div style={{ color: C.gold, fontSize: 28, fontWeight: 900 }}>{fmt(result.totalComMore)}</div>
                      <div style={{ color: C.gray400, fontSize: 11, marginTop: 4 }}>
                        Locação líquida {fmt(result.receitaLocacao)} + Venda líquida {fmt(result.liquidoVenda)} (imóvel {fmt(result.imovelFinal)} − comissão {fmt(result.comissaoMore)})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nota transparência */}
                <div style={{ background: C.goldLight, border: `1px solid ${C.gold}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 11, color: C.gray600, lineHeight: 1.6 }}>
                  * <strong>Entrada:</strong> acumulada pelo comprador durante o contrato, paga na compra. <strong>Financiamento:</strong> contratado pelo comprador com o banco — você recebe o valor integral do imóvel na data da venda. <strong>Comissão MORE 4%:</strong> cobrada sobre o valor do imóvel na transferência, paga pelo vendedor. <strong>Despesas</strong> (IPTU + condomínio estimado em 1,5% a.a.) são descontadas pela MORE do aluguel antes do repasse.
                </div>

                {/* Fluxo de recebimento */}
                <Card style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.gray400, marginBottom: 14, letterSpacing: "0.06em" }}>FLUXO DE RECEBIMENTO</div>
                  <div style={{ position: "relative", paddingLeft: 22 }}>
                    <div style={{ position: "absolute", left: 8, top: 8, bottom: 8, width: 2, background: C.gray200, borderRadius: 2 }} />
                    {[
                      { fase: "Hoje", desc: "Contrato assinado — imóvel ocupado, zero vacância. Despesas cobertas pelo contrato.", valor: null, cor: C.teal },
                      { fase: `Mês a mês (${result.meses}×)`, desc: `Comprador paga ${fmt(result.aluguelBruto)} → MORE desconta despesas (${fmt(result.despesaMensal)}) → você recebe`, valor: fmt(result.aluguelLiquido) + "/mês líquido", cor: C.teal },
                      { fase: `Ano ${result.prazoValido} — exercício da compra`, desc: "Comprador usa entrada acumulada + financiamento bancário para comprar o imóvel", valor: null, cor: C.navy },
                      { fase: "Recebimento final — valor líquido da venda", desc: `Imóvel ${fmt(result.imovelFinal)} − comissão MORE 4% (${fmt(result.comissaoMore)}) = líquido ao proprietário`, valor: fmt(result.liquidoVenda), cor: C.gold },
                    ].map((e, i) => (
                      <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", background: e.cor, flexShrink: 0, marginTop: 2, border: `2px solid ${C.white}`, boxSizing: "border-box" }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: e.cor, marginBottom: 2 }}>{e.fase}</div>
                          <div style={{ fontSize: 12, color: C.gray600 }}>{e.desc}</div>
                          {e.valor && <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginTop: 3 }}>{e.valor}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Parado vs MORE */}
                <Card style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.gray400, marginBottom: 4, letterSpacing: "0.06em" }}>IMÓVEL PARADO vs. COM MORE</div>
                  <div style={{ fontSize: 11, color: C.gray400, marginBottom: 14 }}>Comparativo em {result.prazoValido} ano{result.prazoValido > 1 ? "s" : ""}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    <div style={{ background: "#FFF0F0", borderRadius: 12, padding: "14px", border: `1px solid ${C.red}22` }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.red, marginBottom: 10 }}>● PARADO</div>
                      {[
                        { label: "Locação recebida", value: "R$ 0,00" },
                        { label: "Despesas (IPTU+cond.)", value: `−${fmt(result.despesasParado)}`, neg: true },
                        { label: "Valor do imóvel hoje*", value: fmt(imovel) },
                      ].map(r => (
                        <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.red}11` }}>
                          <span style={{ color: C.gray600, fontSize: 11 }}>{r.label}</span>
                          <span style={{ fontWeight: 700, fontSize: 11, color: r.neg ? C.red : C.navy }}>{r.value}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.red}22` }}>
                        <div style={{ fontSize: 10, color: C.gray400 }}>Resultado líquido</div>
                        <div style={{ fontSize: 17, fontWeight: 900, color: C.red }}>{fmt(result.totalParado)}</div>
                      </div>
                      <div style={{ marginTop: 8, fontSize: 10, color: C.gray400, fontStyle: "italic", lineHeight: 1.5 }}>
                        * Imóvel parado tende a não valorizar — usado valor atual como referência conservadora
                      </div>
                    </div>
                    <div style={{ background: C.tealLight, borderRadius: 12, padding: "14px", border: `1px solid ${C.teal}33` }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.teal, marginBottom: 10 }}>● COM MORE</div>
                      {[
                        { label: "Locação líquida total", value: fmt(result.receitaLocacao) },
                        { label: "Despesas (cobertas)", value: "R$ 0,00 do seu bolso" },
                        { label: "Venda bruta do imóvel", value: fmt(result.imovelFinal) },
                        { label: "↳ Comissão MORE 4%", value: `−${fmt(result.comissaoMore)}`, neg: true },
                        { label: "Venda líquida", value: fmt(result.liquidoVenda), destaque: true },
                      ].map(r => (
                        <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.teal}22` }}>
                          <span style={{ color: r.destaque ? C.teal : C.gray600, fontSize: 11, fontWeight: r.destaque ? 700 : 400 }}>{r.label}</span>
                          <span style={{ fontWeight: 700, fontSize: 11, color: r.neg ? C.gold : r.destaque ? C.teal : C.teal }}>{r.value}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.teal}33` }}>
                        <div style={{ fontSize: 10, color: C.gray400 }}>Resultado líquido</div>
                        <div style={{ fontSize: 17, fontWeight: 900, color: C.teal }}>{fmt(result.totalComMore)}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: C.navy, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: C.gray400, fontSize: 11 }}>Ganho adicional com MORE</div>
                      <div style={{ color: C.white, fontSize: 11, marginTop: 2 }}>locação líquida + despesas não pagas vs. imóvel parado</div>
                    </div>
                    <div style={{ color: C.gold, fontSize: 22, fontWeight: 900 }}>+{fmt(result.ganhoAdicional)}</div>
                  </div>
                </Card>

                {/* Indicadores */}
                <Card style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.gray400, marginBottom: 12, letterSpacing: "0.06em" }}>INDICADORES DE RENTABILIDADE</div>
                  {[
                    { label: "Yield anual líquido", value: fmtPct(result.yieldAnual), sub: "locação líquida anualizada / valor do imóvel" },
                    { label: `Retorno total em ${result.prazoValido}a`, value: fmtPct(result.retornoTotal), sub: "locação + valorização + venda vs. valor inicial" },
                    { label: "Comprador comprometido", value: "Sim", sub: "poupança pertence a ele — vínculo real" },
                    { label: "Titular da propriedade", value: "Sim", sub: "você segue proprietário durante todo o período" },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 0", borderBottom: `1px solid ${C.gray100}` }}>
                      <div>
                        <div style={{ color: C.gray600, fontSize: 13 }}>{r.label}</div>
                        <div style={{ color: C.gray400, fontSize: 11, marginTop: 1 }}>{r.sub}</div>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: 14, color: C.gold, marginLeft: 12, whiteSpace: "nowrap" }}>{r.value}</span>
                    </div>
                  ))}
                </Card>

                {/* CTA */}
                <div style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navyLight})`, borderRadius: 20, padding: 24, border: `2px solid ${C.gold}66`, boxShadow: `0 8px 32px ${C.gold}22` }}>
                  <div style={{ color: C.gold, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>🔑 Seu imóvel pode gerar mais</div>
                  <div style={{ color: C.white, fontSize: 15, fontWeight: 700, marginBottom: 16, lineHeight: 1.4 }}>
                    Em vez de parado, gerando <span style={{ color: C.gold }}>{fmt(result.aluguelLiquido)}/mês líquido</span> e vendendo com líquido de <span style={{ color: C.gold }}>{fmt(result.liquidoVenda)}</span> ao final.
                  </div>
                  <button style={{ width: "100%", padding: "15px 0", borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${C.gold}, #C8891A)`, color: C.white, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                    Quero colocar meu imóvel no programa MORE
                  </button>
                </div>

                <p style={{ color: C.gray400, fontSize: 11, textAlign: "center", marginTop: 14 }}>Simulador educativo · Valores estimados · Não representa contrato</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [tela, setTela] = useState("landing"); // "landing" | "comprador" | "proprietario"

  if (tela === "comprador")    return <SimuladorComprador    onBack={() => setTela("landing")} />;
  if (tela === "proprietario") return <SimuladorProprietario onBack={() => setTela("landing")} />;
  return <Landing onComprador={() => setTela("comprador")} onProprietario={() => setTela("proprietario")} />;
}
