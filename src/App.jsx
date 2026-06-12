
import { useState } from "react";

const QWEN_BASE = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";

// ── ERA DEFINITIONS ──────────────────────────────────────────────────────────
const ERAS = {
  ancient: {
    id: "ancient",
    label: "Ancient Era",
    period: "12th Century · Ile-Ife",
    icon: "🔥",
    tagline: "The queen who walked into the enemy's hands to save her people.",
    accent: "#C4622D",
    glow: "#8B3A1A",
    bg: "#0A0703",
    surface: "#160E05",
    moodPrompt: `cinematic 12th century Yoruba Nigeria, torchlight, dark raffia grass, 
ancient Ile-Ife palace, sacred Esinmirin River, warriors in bamboo-leaf cloaks, 
dramatic shadows, high-contrast, film grain, epic historical drama`,
    systemPrompt: `You are a master Nigerian screenwriter specializing in Yoruba epic historical drama.
The story: Moremi Ajasoro, Queen of Ile-Ife (12th century), allows herself to be captured 
by the mysterious Igbo warriors — terrifying figures in cloaks of dry bamboo, grass and raffia 
fiber that her people believe are spirits. Living among them, she uncovers the truth: they are 
human. She escapes, teaches her people to fight back with burning torches (Olojuwa fire). 
Ile-Ife is saved. But Moremi made a vow to the Esinmirin River goddess — whatever she demands. 
The goddess demands her only son, Oluorogbo. Moremi sacrifices him.
Write with weight, poetry, and cultural authenticity. Use Yoruba honorifics where natural.`,
  },
  modern: {
    id: "modern",
    label: "Modern Era",
    period: "Present Day · Nigeria 2026",
    icon: "🗿",
    tagline: "Her sacrifice stands 42 feet tall — the tallest statue in Nigeria.",
    accent: "#4A90D9",
    glow: "#1A4A7A",
    bg: "#050810",
    surface: "#0A0F1A",
    moodPrompt: `modern Nigeria 2026, cinematic, the 42-foot Moremi bronze statue in Ile-Ife, 
Edi Festival crowds with burning torches, Moremi Hall at University of Lagos, 
cyber-Yoruba aesthetic, golden hour, urban Nigeria meets ancient legacy`,
    systemPrompt: `You are a Nigerian documentary filmmaker and screenwriter.
The subject: Moremi Ajasoro's living legacy in modern Nigeria.
Key facts to weave in:
- In 2016, the Ooni of Ife unveiled a 42-foot bronze Moremi Statue — tallest in Nigeria, 4th tallest in Africa
- Every year, the Edi Festival in Ile-Ife reenacts her story — people light traditional torches (Olojuwa)
- The most famous female residential halls at UNILAG and OAU are named Moremi Hall
- Her story bridges 12th century sacrifice and 21st century Nigerian female empowerment
Write with cinematic power, connecting ancient sacrifice to modern Nigerian identity.`,
  },
};

const STAGES = [
  { id: "script", label: "Script", icon: "📜" },
  { id: "storyboard", label: "Storyboard", icon: "🎬" },
  { id: "video", label: "Video Shots", icon: "🎥" },
  { id: "final", label: "Final Cut", icon: "✨" },
];

// ── STYLES ────────────────────────────────────────────────────────────────────
const base = {
  app: (era) => ({
    minHeight: "100vh",
    background: era ? ERAS[era].bg : "#0A0703",
    color: "#F0E6D3",
    fontFamily: "'Georgia', serif",
    transition: "background 0.6s ease",
  }),
  hero: {
    textAlign: "center",
    padding: "48px 24px 40px",
  },
  eyebrow: (accent) => ({
    fontSize: "10px",
    letterSpacing: "0.25em",
    color: accent,
    textTransform: "uppercase",
    fontFamily: "monospace",
    marginBottom: "16px",
  }),
  title: {
    fontSize: "clamp(36px, 10vw, 64px)",
    fontWeight: "700",
    lineHeight: 1.05,
    margin: "0 0 6px",
    color: "#F0E6D3",
  },
  italic: (accent) => ({ color: accent, fontStyle: "italic" }),
  subtitle: {
    fontSize: "14px",
    color: "#7A6A58",
    maxWidth: "360px",
    margin: "0 auto",
    lineHeight: 1.6,
  },
  divider: (accent) => ({
    width: "48px",
    height: "2px",
    background: accent,
    margin: "24px auto",
    borderRadius: "2px",
  }),
};

const eraSelect = {
  prompt: {
    fontSize: "12px",
    fontFamily: "monospace",
    letterSpacing: "0.15em",
    color: "#7A6A58",
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    maxWidth: "440px",
    margin: "0 auto",
  },
  card: (era, selected) => ({
    background: selected ? ERAS[era].surface : "transparent",
    border: `1px solid ${selected ? ERAS[era].accent : "#2A1E10"}`,
    borderRadius: "12px",
    padding: "20px 16px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.25s ease",
    transform: selected ? "scale(1.02)" : "scale(1)",
  }),
  cardIcon: { fontSize: "28px", marginBottom: "8px" },
  cardLabel: (era, selected) => ({
    fontSize: "14px",
    fontWeight: "700",
    color: selected ? ERAS[era].accent : "#7A6A58",
    marginBottom: "4px",
  }),
  cardPeriod: {
    fontSize: "11px",
    fontFamily: "monospace",
    color: "#5A4A38",
  },
};

const form = {
  wrap: {
    maxWidth: "480px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  apiInput: (accent) => ({
    background: "#0D0A07",
    border: `1px solid #2A1E10`,
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#F0E6D3",
    fontSize: "13px",
    fontFamily: "monospace",
    outline: "none",
    width: "100%",
  }),
  btn: (accent, disabled) => ({
    background: disabled
      ? "#1A1208"
      : `linear-gradient(135deg, ${accent}, ${accent}99)`,
    border: `1px solid ${disabled ? "#2A1E10" : accent}`,
    borderRadius: "8px",
    padding: "16px 24px",
    color: disabled ? "#5A4A38" : "#F0E6D3",
    fontSize: "15px",
    fontWeight: "700",
    cursor: disabled ? "not-allowed" : "pointer",
    letterSpacing: "0.05em",
    transition: "opacity 0.2s",
    fontFamily: "'Georgia', serif",
  }),
};

const pipeline = {
  wrap: {
    maxWidth: "580px",
    margin: "0 auto",
    padding: "0 16px 40px",
  },
  stagesRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    margin: "32px 0 24px",
  },
  dot: (status, accent) => ({
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    flexShrink: 0,
    background:
      status === "done" ? "#2A5C3A" : status === "active" ? accent + "33" : "#0D0A07",
    border: `1.5px solid ${
      status === "done" ? "#4CAF7D" : status === "active" ? accent : "#2A1E10"
    }`,
    animation: status === "active" ? "pulse 1.4s ease-in-out infinite" : "none",
  }),
  dotLabel: (status, accent) => ({
    fontSize: "10px",
    fontFamily: "monospace",
    color:
      status === "done" ? "#4CAF7D" : status === "active" ? accent : "#4A3A28",
    marginTop: "4px",
    textAlign: "center",
  }),
  scroll: (accent) => ({
    background: "#0D0A07",
    border: `1px solid #2A1E10`,
    borderLeft: `3px solid ${accent}`,
    borderRadius: "10px",
    padding: "18px 16px",
    marginBottom: "12px",
  }),
  scrollTitle: (accent) => ({
    fontSize: "10px",
    fontFamily: "monospace",
    letterSpacing: "0.18em",
    color: accent,
    textTransform: "uppercase",
    marginBottom: "12px",
  }),
  scrollContent: {
    fontSize: "14px",
    lineHeight: 1.85,
    color: "#D4C4B0",
    whiteSpace: "pre-wrap",
  },
  shotGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "12px",
  },
  shotCard: {
    background: "#0D0A07",
    border: "1px solid #2A1E10",
    borderRadius: "10px",
    overflow: "hidden",
  },
  shotThumb: (accent) => ({
    width: "100%",
    aspectRatio: "16/9",
    background: `linear-gradient(135deg, ${accent}22, #0A0703)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  }),
  shotMeta: {
    padding: "8px 10px",
    fontSize: "11px",
    fontFamily: "monospace",
    color: "#5A4A38",
    lineHeight: 1.5,
  },
  finalCard: (accent) => ({
    background: `linear-gradient(135deg, ${accent}18, #0A0703)`,
    border: `1px solid ${accent}`,
    borderRadius: "14px",
    padding: "28px 20px",
    textAlign: "center",
  }),
  finalTitle: (accent) => ({
    fontSize: "22px",
    fontWeight: "700",
    color: accent,
    marginBottom: "12px",
    fontStyle: "italic",
  }),
  finalText: {
    fontSize: "15px",
    lineHeight: 1.8,
    color: "#F0E6D3",
    margin: "0 0 20px",
  },
  badge: {
    display: "inline-block",
    padding: "8px 16px",
    background: "#0D0A07",
    border: "1px solid #2A1E10",
    borderRadius: "6px",
    fontSize: "11px",
    fontFamily: "monospace",
    color: "#5A4A38",
  },
  errorBox: {
    background: "#120505",
    border: "1px solid #6B1A1A",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#FF7070",
    fontFamily: "monospace",
    marginTop: "12px",
    maxWidth: "480px",
    marginLeft: "auto",
    marginRight: "auto",
  },
};

// ── API HELPERS ───────────────────────────────────────────────────────────────
async function callQwen(apiKey, systemPrompt, userPrompt) {
  const res = await fetch(`${QWEN_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "qwen-max",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 2000,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
}

async function generateVideoShot(apiKey, prompt) {
  const res = await fetch(`${QWEN_BASE}/video/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "happyhorse-1.0-t2v",
      prompt,
      size: "1280*720",
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function MoremiShowrunner() {
  const [selectedEra, setSelectedEra] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [stage, setStage] = useState(null);
  const [results, setResults] = useState({});
  const [shots, setShots] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const era = selectedEra ? ERAS[selectedEra] : null;
  const accent = era?.accent || "#C4622D";

  const getStageStatus = (id) => {
    const order = ["script", "storyboard", "video", "final"];
    if (stage === "done") return "done";
    const cur = order.indexOf(stage);
    const idx = order.indexOf(id);
    if (idx < cur) return "done";
    if (idx === cur) return "active";
    return "idle";
  };

  async function runAgent() {
    if (!apiKey.trim()) return setError("Paste your QwenCloud API key.");
    if (!selectedEra) return setError("Choose an era first.");
    setError("");
    setLoading(true);
    setResults({});
    setShots([]);

    const E = ERAS[selectedEra];

    try {
      // STEP 1 — Script
      setStage("script");
      const script = await callQwen(
        apiKey,
        E.systemPrompt,
        `Write a powerful 3-scene short drama script for the ${E.label} of Moremi's story.
Use the key story beats provided. Each scene should be vivid and cinematic.
Format strictly as:
SCENE 1: [Title]
[Content]

SCENE 2: [Title]
[Content]

SCENE 3: [Title]
[Content]`
      );
      setResults((r) => ({ ...r, script }));

      // STEP 2 — Storyboard
      setStage("storyboard");
      const storyboard = await callQwen(
        apiKey,
        `You are a storyboard artist for Nigerian epic cinema. 
Convert scripts into AI video generation prompts.
Visual style for ${E.label}: ${E.moodPrompt}
Each shot must include: camera angle, lighting, character description, setting detail.`,
        `Break this script into exactly 4 video generation prompts.
Each prompt will be sent directly to an AI video model.
Format strictly as:
SHOT 1: [one detailed sentence — camera, lighting, characters, setting, mood]
SHOT 2: [...]
SHOT 3: [...]
SHOT 4: [...]

Script:
${script}`
      );
      setResults((r) => ({ ...r, storyboard }));

      // Parse shot lines
      const shotLines = storyboard
        .split("\n")
        .filter((l) => /^SHOT \d+:/i.test(l.trim()))
        .map((l) => l.replace(/^SHOT \d+:\s*/i, "").trim())
        .slice(0, 4);
      setShots(shotLines);

      // STEP 3 — Video generation
      setStage("video");
      const videoResults = [];
      for (let i = 0; i < shotLines.length; i++) {
        const fullPrompt = `${E.moodPrompt}. ${shotLines[i]}`;
        try {
          const vid = await generateVideoShot(apiKey, fullPrompt);
          videoResults.push({ prompt: shotLines[i], data: vid, status: "generated" });
        } catch (e) {
          videoResults.push({
            prompt: shotLines[i],
            data: null,
            status: "queued",
            note: e.message?.slice(0, 60) || "Queued — check QwenCloud dashboard",
          });
        }
        setResults((r) => ({ ...r, videoResults: [...videoResults] }));
      }

      // STEP 4 — Final synopsis
      setStage("final");
      const synopsis = await callQwen(
        apiKey,
        `You write poetic, cinematic film descriptions for Nigerian streaming platforms.`,
        `Write a 2–3 sentence synopsis for this ${E.label} Moremi drama 
as if it's appearing on Netflix Nigeria. Make it powerful and poetic.`
      );
      setResults((r) => ({ ...r, synopsis }));
      setStage("done");
    } catch (e) {
      setError(e.message);
      setStage(null);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStage(null);
    setResults({});
    setShots([]);
    setError("");
    setLoading(false);
  }

  return (
    <div style={base.app(selectedEra)}>
      <style>{`
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(0.9); }
        }
        * { box-sizing:border-box; }
        input::placeholder { color:#3A2E22; }
        button:active { opacity:0.8; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#0A0703; }
        ::-webkit-scrollbar-thumb { background:#3A2E22; border-radius:2px; }
      `}</style>

      {/* ── HERO ── */}
      <div style={base.hero}>
        <div style={base.eyebrow(accent)}>
          AI Showrunner · QwenCloud Hackathon 2026
        </div>
        <h1 style={base.title}>
          Moremi<br />
          <span style={base.italic(accent)}>Ajasoro</span>
        </h1>
        <p style={base.subtitle}>
          {era ? era.tagline : "Queen of Ile-Ife. Spy. Sacrifice. Eternal."}
        </p>
        <div style={base.divider(accent)} />

        {/* ── ERA SELECTOR ── */}
        {!stage && (
          <div style={{ marginBottom: "28px" }}>
            <div style={eraSelect.prompt}>Choose your era</div>
            <div style={eraSelect.grid}>
              {Object.values(ERAS).map((e) => (
                <div
                  key={e.id}
                  style={eraSelect.card(e.id, selectedEra === e.id)}
                  onClick={() => { setSelectedEra(e.id); setError(""); }}
                >
                  <div style={eraSelect.cardIcon}>{e.icon}</div>
                  <div style={eraSelect.cardLabel(e.id, selectedEra === e.id)}>
                    {e.label}
                  </div>
                  <div style={eraSelect.cardPeriod}>{e.period}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ERA BADGE (while running) ── */}
        {stage && era && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: era.surface, border: `1px solid ${accent}44`,
            borderRadius: "20px", padding: "6px 16px", marginBottom: "8px",
          }}>
            <span>{era.icon}</span>
            <span style={{ fontSize: "12px", fontFamily: "monospace", color: accent }}>
              {era.label} · {era.period}
            </span>
          </div>
        )}

        {/* ── FORM ── */}
        {!stage && (
          <div style={form.wrap}>
            <input
              style={form.apiInput(accent)}
              type="password"
              placeholder="QwenCloud API key  (sk-ws-...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button
              style={form.btn(accent, loading || !selectedEra)}
              onClick={runAgent}
              disabled={loading || !selectedEra}
            >
              {loading ? "Agent running…" : `▶ Generate ${era?.label || "Drama"}`}
            </button>
          </div>
        )}

        {error && <div style={pipeline.errorBox}>⚠ {error}</div>}
      </div>

      {/* ── PIPELINE ── */}
      {stage && (
        <div style={pipeline.wrap}>

          {/* Stage dots */}
          <div style={pipeline.stagesRow}>
            {STAGES.map((s) => {
              const status = getStageStatus(s.id);
              return (
                <div key={s.id} style={{ textAlign: "center" }}>
                  <div style={pipeline.dot(status, accent)}>{s.icon}</div>
                  <div style={pipeline.dotLabel(status, accent)}>{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Script */}
          {results.script && (
            <div style={pipeline.scroll(accent)}>
              <div style={pipeline.scrollTitle(accent)}>📜 Script</div>
              <div style={pipeline.scrollContent}>{results.script}</div>
            </div>
          )}

          {/* Storyboard */}
          {results.storyboard && (
            <div style={pipeline.scroll("#D4A017")}>
              <div style={pipeline.scrollTitle("#D4A017")}>🎬 Storyboard</div>
              <div style={pipeline.scrollContent}>{results.storyboard}</div>
            </div>
          )}

          {/* Video shots */}
          {shots.length > 0 && (
            <>
              <div style={{
                fontSize: "10px", fontFamily: "monospace", letterSpacing: "0.18em",
                color: accent, textTransform: "uppercase", marginBottom: "10px",
              }}>
                🎥 Video Generation
              </div>
              <div style={pipeline.shotGrid}>
                {shots.map((shot, i) => {
                  const v = results.videoResults?.[i];
                  return (
                    <div key={i} style={pipeline.shotCard}>
                      <div style={pipeline.shotThumb(accent)}>
                        {v?.status === "generated" ? "🎞" : v ? "⏳" : "🔄"}
                      </div>
                      <div style={pipeline.shotMeta}>
                        <div style={{ color: accent, marginBottom: "2px" }}>
                          Shot {i + 1}
                        </div>
                        <div style={{ fontSize: "10px", color: "#3A2E22" }}>
                          {shot.slice(0, 55)}…
                        </div>
                        {v?.data?.id && (
                          <div style={{ color: "#4CAF7D", marginTop: "2px" }}>
                            ✓ {v.data.id.slice(0, 10)}…
                          </div>
                        )}
                        {v?.note && (
                          <div style={{ color: "#D4A017", marginTop: "2px" }}>
                            {v.note.slice(0, 50)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Final */}
          {results.synopsis && (
            <div style={pipeline.finalCard(accent)}>
              <div style={pipeline.finalTitle(accent)}>
                {era?.icon} Moremi Ajasoro — {era?.label}
              </div>
              <p style={pipeline.finalText}>{results.synopsis}</p>
              <div style={pipeline.badge}>
                Script ✓ · Storyboard ✓ · {shots.length} shots · Synopsis ✓
              </div>
              <div style={{ marginTop: "20px" }}>
                <button
                  style={{
                    background: "transparent",
                    border: `1px solid ${accent}55`,
                    borderRadius: "6px",
                    padding: "10px 20px",
                    color: accent,
                    fontSize: "13px",
                    cursor: "pointer",
                    fontFamily: "monospace",
                  }}
                  onClick={reset}
                >
                  ↩ Generate another era
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
