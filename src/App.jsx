import { useState } from "react";

const QWEN_BASE = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";

const ERAS = {
  ancient: {
    id: "ancient",
    label: "Ancient Era",
    period: "12th Century \u00b7 Ile-Ife",
    icon: "\ud83d\udd25",
    tagline: "The queen who walked into the enemy's hands to save her people.",
    accent: "#C4622D",
    bg: "#0A0703",
    surface: "#160E05",
    moodPrompt: `cinematic 12th century Yoruba Nigeria, torchlight, dark raffia grass, ancient Ile-Ife palace, sacred Esinmirin River, warriors in bamboo-leaf cloaks, dramatic shadows, high-contrast, film grain, epic historical drama`,
    systemPrompt: `You are a master Nigerian screenwriter specializing in Yoruba epic historical drama.
The story: Moremi Ajasoro, Queen of Ile-Ife (12th century), allows herself to be captured 
by the mysterious Igbo warriors \u2014 terrifying figures in cloaks of dry bamboo, grass and raffia 
fiber that her people believe are spirits. Living among them, she uncovers the truth: they are 
human. She escapes, teaches her people to fight back with burning torches (Olojuwa fire). 
Ile-Ife is saved. But Moremi made a vow to the Esinmirin River goddess \u2014 whatever she demands. 
The goddess demands her only son, Oluorogbo. Moremi sacrifices him.
Write with weight, poetry, and cultural authenticity. Use Yoruba honorifics where natural.`,
  },
  modern: {
    id: "modern",
    label: "Modern Era",
    period: "Present Day \u00b7 Nigeria 2026",
    icon: "\ud83d\uddff",
    tagline: "Her sacrifice stands 42 feet tall \u2014 the tallest statue in Nigeria.",
    accent: "#4A90D9",
    bg: "#050810",
    surface: "#0A0F1A",
    moodPrompt: `modern Nigeria 2026, cinematic, the 42-foot Moremi bronze statue in Ile-Ife, Edi Festival crowds with burning torches, Moremi Hall at University of Lagos, cyber-Yoruba aesthetic, golden hour, urban Nigeria meets ancient legacy`,
    systemPrompt: `You are a Nigerian documentary filmmaker and screenwriter.
The subject: Moremi Ajasoro's living legacy in modern Nigeria.
Key facts to weave in:
- In 2016, the Ooni of Ife unveiled a 42-foot bronze Moremi Statue \u2014 tallest in Nigeria, 4th tallest in Africa
- Every year, the Edi Festival in Ile-Ife reenacts her story \u2014 people light traditional torches (Olojuwa)
- The most famous female residential halls at UNILAG and OAU are named Moremi Hall
- Her story bridges 12th century sacrifice and 21st century Nigerian female empowerment
Write with cinematic power, connecting ancient sacrifice to modern Nigerian identity.`,
  },
};

const STAGES = [
  { id: "script", label: "Script", icon: "\ud83d\udcdc" },
  { id: "storyboard", label: "Storyboard", icon: "\ud83c\udfac" },
  { id: "video", label: "Video Shots", icon: "\ud83c\udfa5" },
  { id: "final", label: "Final Cut", icon: "\u2728" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

async function createVideoTask(apiKey, prompt) {
  const res = await fetch("/api/video", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (data.error) throw new Error(JSON.stringify(data.error));
  return data?.output?.task_id;
}

async function pollVideoTask(apiKey, taskId, maxAttempts = 24) {
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(8000);
    const res = await fetch(`/api/video?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await res.json();
    const status = data?.output?.task_status;
    if (status === "SUCCEEDED") {
      return (
        data?.output?.video_url ||
        data?.output?.results?.[0]?.url ||
        data?.output?.results?.[0]?.video_url ||
        null
      );
    }
    if (status === "FAILED") throw new Error("Video task failed");
  }
  return null;
}

const S = {
  app: (era) => ({
    minHeight: "100vh",
    background: era ? ERAS[era].bg : "#0A0703",
    color: "#F0E6D3",
    fontFamily: "'Georgia', serif",
    transition: "background 0.6s ease",
  }),
  hero: { textAlign: "center", padding: "48px 24px 40px" },
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
  eraPrompt: {
    fontSize: "11px",
    fontFamily: "monospace",
    letterSpacing: "0.15em",
    color: "#5A4A38",
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  eraGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    maxWidth: "440px",
    margin: "0 auto 24px",
  },
  eraCard: (eraId, selected) => ({
    background: selected ? ERAS[eraId].surface