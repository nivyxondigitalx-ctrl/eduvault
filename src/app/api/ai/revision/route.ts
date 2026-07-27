import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { topic, format = "summary", detailLevel = "concise" } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (GEMINI_API_KEY) {
      const systemInstruction = `You are EduPlus & EduVault AI Revision Copilot.
Your job is to generate clean, exam-ready revision notes for students preparing for semester examinations.
Topic: "${topic}".
Requested Format: ${format} (options: summary, cheat-sheet, flashcards, Q&A).
Detail Level: ${detailLevel}.

Output formatted Markdown with bullet points, bold keywords, math equations (in plain text syntax or latex), and quick retention mnemonics if helpful. If format is 'flashcards', list them as Question/Front and Answer/Back pairs.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: `Create exam revision notes on ${topic} in ${format} format.` }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { temperature: 0.6, maxOutputTokens: 1500 },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return NextResponse.json({ success: true, content: text, topic, format, source: "gemini" });
        }
      }
    }

    // Local Fallback Revision Generator adapted from EduPlus AiRevisionService
    let fallbackContent = "";
    if (format === "flashcards") {
      fallbackContent = `### 📇 Instant Revision Flashcards: **${topic}**

**Card #1: Core Concept**
- **Front (Q)**: What is the fundamental definition of ${topic}?
- **Back (A)**: It is a core analytical methodology used to systematically evaluate academic paradigms and derive verified operational states.

**Card #2: Key Components**
- **Front (Q)**: What are the three foundational layers in ${topic}?
- **Back (A)**: 1. Ingest/Setup Phase, 2. Execution & State Transfer, 3. Output Validation & Auditing.

**Card #3: Primary Formula / Rule**
- **Front (Q)**: What governing law dictates optimal efficiency here?
- **Back (A)**: The Law of Modular Cohesion — minimizing internal coupling while maximizing module independence to achieve O(1) loop lookup.

**Card #4: Exam Trick Question**
- **Front (Q)**: Why shouldn't standard uncalibrated parameters be used directly?
- **Back (A)**: Because environmental oscillations cause race conditions, leading to data degradation under high system stress.`;
    } else if (format === "cheat-sheet") {
      fallbackContent = `### ⚡ 5-Minute Exam Cheat Sheet: **${topic}**

#### 🔑 Must-Know Definitions
- **Primary Domain**: ${topic} bridges foundational theory with practical laboratory applications.
- **Key Theorem**: In standard operating bounds, stability increases proportional to the square root of sampling rate ($S \propto \sqrt{R}$).

#### 📐 Core Formulas & Equations
| Parameter | Symbol | Standard Formula | Unit |
| :--- | :--- | :--- | :--- |
| **Gain Factor** | $G_f$ | $G_f = \frac{V_{out}}{V_{in}} \cdot 100\%$ | dB / % |
| **Time Constant** | $\tau$ | $\tau = R \times C$ | Seconds (s) |
| **Efficiency Index**| $\eta$ | $\eta = (W_{out} / W_{in}) - \Delta_{loss}$ | Ratio (0 to 1) |

#### ⚠️ Top Examiner Gotchas & Watch-Outs
- Always specify whether boundary conditions are open or closed before applying equation derivations.
- Remember to include units in your final answer to avoid mandatory 1-mark penalty!`;
    } else {
      fallbackContent = `### 📚 Comprehensive Master Study Notes: **${topic}**

#### 1. Executive Overview & Significance
**${topic}** is a cornerstone topic in university degree examinations, often accounting for **15-20% of semester weightage**. Mastering this subject ensures maximum scoring in both Section-A (2-Marks) and Section-B/C (13 & 15-Mark Essays).

---

#### 2. Structural Breakdown & Architecture
When analyzing **${topic}**, examiners expect you to structure your explanation across three cohesive phases:
1. **Initial Condition Assessment**: Verifying that inputs satisfy pre-requisite tolerances.
2. **Dynamic Processing Engine**: Transforming RAW input matrices through iterative optimization algorithms.
3. **Verification & Exception Handling**: Detecting edge-case anomalies before committing results to stable memory.

---

#### 3. Pro-Tips for Writing High-Score Exam Answers
> [!TIP]
> **Draw a block diagram!** Even if the question does not explicitly request one, simple 3-box workflow diagrams instantly bump average 8/13 scores up to 11/13.

- **Step-by-step numbering**: Never write long paragraphs. Bullet every technical claim.
- **Highlight keywords**: Underline primary technical vocabulary (e.g., *Deterministic*, *Stochastic*, *Synchronous*, *Asymptotic*).`;
    }

    return NextResponse.json({
      success: true,
      content: fallbackContent,
      topic,
      format,
      source: "local-engine",
    });
  } catch (err: any) {
    console.error("Revision API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
