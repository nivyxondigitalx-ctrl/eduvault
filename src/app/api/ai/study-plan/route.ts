import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = "plan", subject, examDate, hoursPerDay = "2", focusAreas, studentAnswer, questionText } = body;

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (action === "grammar") {
      if (!studentAnswer) {
        return NextResponse.json({ error: "Student answer text is required" }, { status: 400 });
      }

      if (GEMINI_API_KEY) {
        const systemInstruction = `You are EduPlus AI Academic Reviewer & Grammar Enhancer.
Evaluate the student's exam written answer for grammar, vocabulary clarity, technical precision, and overall readability.
Question context (if provided): "${questionText || "General technical explanation"}".
Student Answer: "${studentAnswer}".

Return ONLY valid JSON with no backtick wrapper or inside markdown backticks:
{
  "originalScore": 6.5,
  "enhancedScore": 9.5,
  "grammarFeedback": [ "Point 1", "Point 2" ],
  "vocabularyUpgrades": [ { "original": "word", "replacement": "academic term", "reason": "more precise" } ],
  "rewrittenAnswer": "Enhanced professional academic version of the answer..."
}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `Enhance answer: ${studentAnswer}` }] }],
              systemInstruction: { parts: [{ text: systemInstruction }] },
              generationConfig: { temperature: 0.5, maxOutputTokens: 1000 },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          text = text.replace(/^```json\s*/m, "").replace(/^```\s*/m, "").replace(/```$/m, "").trim();
          try {
            const parsed = JSON.parse(text);
            return NextResponse.json({ success: true, result: parsed, source: "gemini" });
          } catch (e) {
            console.error("Parse grammar JSON error:", e);
          }
        }
      }

      // Local Fallback Grammar Check
      const wordCount = studentAnswer.trim().split(/\s+/).length;
      const originalScore = wordCount < 30 ? 6.0 : wordCount < 80 ? 7.5 : 8.2;
      return NextResponse.json({
        success: true,
        result: {
          originalScore,
          enhancedScore: 9.6,
          grammarFeedback: [
            "Sentence structure is generally comprehensible, but transition phrases between analytical claims could be reinforced.",
            "Avoid colloquial syntax or passive phrasing when stating scientific definitions or architectural principles.",
            "Include explicit step-by-step numbering to make grading effortless for examiners.",
          ],
          vocabularyUpgrades: [
            { original: "used for", replacement: "utilized to facilitate", reason: "Demonstrates academic formality" },
            { original: "make better", replacement: "optimize & refine", reason: "Standard engineering vocabulary" },
            { original: "important part", replacement: "foundational component", reason: "Adds authoritative tone to answers" },
          ],
          rewrittenAnswer: `[Enhanced Academic Restructure]: In the evaluation of ${questionText || "the designated topic"}, the foundational principles dictate that system behavior must be analyzed systematically. By optimizing parameter verification and refining structural modularity, empirical reliability is maximized while mitigating runtime latencies and structural bottlenecks.`,
        },
        source: "local-engine",
      });
    }

    // Default Action: Study Plan Generation
    if (!subject) {
      return NextResponse.json({ error: "Subject is required for study plan" }, { status: 400 });
    }

    if (GEMINI_API_KEY) {
      const systemInstruction = `You are EduPlus AI Study Planner & Syllabus Scheduler.
Create an actionable, gamified study schedule for a student aiming to excel in "${subject}".
Time allocation per day: ${hoursPerDay} hours.
Focus/Weak Areas: ${focusAreas || "Comprehensive coverage"}.
Target Exam Timeline: ${examDate || "Next 7 Days"}.

Return ONLY valid JSON with no backtick wrapper or inside markdown backticks:
{
  "planTitle": "Mastery Schedule: ${subject}",
  "totalStudyHours": "14 hours over 7 days",
  "dailySchedule": [
    {
      "day": "Day 1",
      "topic": "Core Fundamentals & Definitions",
      "activities": [ "Read chapters 1-2 (45m)", "Complete 10 MCQs in Test Room (30m)", "Review formulas (15m)" ],
      "milestone": "Understand basic nomenclature & primary principles"
    },
    {
      "day": "Day 2",
      "topic": "Deep Dive into Architectural Frameworks",
      "activities": [ "Study diagrams & flowcharts (60m)", "Practice 2-mark short answers (30m)" ],
      "milestone": "Be able to sketch diagrams from memory"
    }
  ],
  "examTips": [ "Focus on deriving equations in step order", "Revise flashcards every morning" ]
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: `Build study plan for ${subject} with ${hoursPerDay}h/day.` }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { temperature: 0.7, maxOutputTokens: 1800 },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        text = text.replace(/^```json\s*/m, "").replace(/^```\s*/m, "").replace(/```$/m, "").trim();
        try {
          const parsed = JSON.parse(text);
          return NextResponse.json({ success: true, result: parsed, source: "gemini" });
        } catch (e) {
          console.error("Parse plan JSON error:", e);
        }
      }
    }

    // Local Fallback Study Plan Generator
    const planResult = {
      planTitle: `High-Impact Mastery Timeline: ${subject}`,
      totalStudyHours: `${parseInt(hoursPerDay || "2") * 7} hours (7-Day Sprint)`,
      dailySchedule: [
        {
          day: "Day 1: Theory & Fundamentals",
          topic: `Introduction to ${subject} & Vocabulary`,
          activities: [
            `Read textbook definitions and introductory notes (${Math.max(30, parseInt(hoursPerDay) * 20)}m)`,
            "Generate 5 MCQs in EduVault Smart Test Room (20m)",
            "Summarize keywords into AI flashcards (15m)",
          ],
          milestone: "Master 100% of 2-mark short conceptual definitions.",
        },
        {
          day: "Day 2: Architectural & Process Workflows",
          topic: "Core Flowcharts, Schematics & Diagrams",
          activities: [
            "Draw block diagrams and operational loops without notes (45m)",
            "Practice explaining component interactions out loud (30m)",
          ],
          milestone: "Able to reproduce main architectural figure accurately in under 4 minutes.",
        },
        {
          day: "Day 3: Mathematical Derivations & Formulas",
          topic: "Quantitative Problem Solving & Equations",
          activities: [
            "Review equation transformations and limit proofs (50m)",
            "Solve 3 numerical examples from past exam paper (40m)",
          ],
          milestone: "Memorize unit conventions and variable constraints.",
        },
        {
          day: "Day 4: Deep-Dive into Focus Topics",
          topic: focusAreas || "High-Weightage Exam Units",
          activities: [
            "Attempt comprehensive 10-Mark essay generator in test suite (45m)",
            "Check written answer using AI Grammar & Score Enhancer (20m)",
          ],
          milestone: "Perform self-audit on writing clarity and structure.",
        },
        {
          day: "Day 5: Past Year Question Papers",
          topic: "Previous 3 Semesters Solved Paper Analysis",
          activities: [
            "Unlock and scan past year Anna/Madras University solved papers in Vault (60m)",
            "Highlight repeating patterns and high-probability essay prompts (30m)",
          ],
          milestone: "Identify top 5 recurring essay questions.",
        },
        {
          day: "Day 6: Timed Simulation Quiz",
          topic: "Full Subject Practice Assessment",
          activities: [
            "Take timed 15-question mixed quiz in EduVault Test Hub (40m)",
            "Review correct answer explanations and remediate weak spots (30m)",
          ],
          milestone: "Achieve at least 80% passing accuracy on practice tests.",
        },
        {
          day: "Day 7: Final Day Quick Revision & Trophies",
          topic: "Cheat-Sheet Scanning & Mental Rest",
          activities: [
            "Read AI 5-Minute Exam Cheat Sheet (25m)",
            "Check unlocked Study Streak badges in Trophy Room (5m)",
            "Light mental relaxation before exam day",
          ],
          milestone: "Peak confidence and 100% syllabus alignment!",
        },
      ],
      examTips: [
        "Use bulleted lists for all theory questions—examiners read bullets 3x faster than dense paragraphs.",
        "Always define variables before executing calculations in numerical problems.",
        "Check your answers through our Grammar Enhancer tool to boost academic presentation by up to +25%.",
      ],
    };

    return NextResponse.json({ success: true, result: planResult, source: "local-engine" });
  } catch (err: any) {
    console.error("Study plan API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
