import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { testHistory = [] } = await req.json();

    if (!testHistory || testHistory.length === 0) {
      return NextResponse.json({
        success: true,
        result: {
          weakTopics: ["Take practice tests first!"],
          strongTopics: [],
          recommendations: [
            "We need at least one completed quiz attempt to analyze your study patterns.",
            "Try launching the Smart Test Quiz Builder to practice a few topics."
          ]
        },
        source: "empty-state"
      });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (GEMINI_API_KEY) {
      // Build test inventory details for Gemini
      let summaryText = "";
      testHistory.forEach((attempt: any, idx: number) => {
        summaryText += `${idx + 1}. Subject: "${attempt.subject}", Topic: "${attempt.topic}", Type: "${attempt.testType}", Difficulty: "${attempt.difficulty}", Score: ${attempt.score}/${attempt.totalMarks} (${Math.round((attempt.score / attempt.totalMarks) * 100)}%), Date: ${attempt.timestamp}\n`;
      });

      const systemInstruction = `You are EduVault & EduPlus AI — an intelligent academic performance tutor.
Analyze the student's practice exam attempt history and output:
1. Weak topics (topics/subjects where they scored low or need reinforcement).
2. Strong topics (topics/subjects where they scored 80% or higher, or show high proficiency).
3. Actions and personalized recommendations (specific, encouraging guidelines such as generating cheat-sheets for their weak topics, changing quiz difficulty, or practicing essay structures).

Respond ONLY with a valid JSON object in this format (no markdown backticks, no extra text):
{
  "weakTopics": ["topic1", "topic2"],
  "strongTopics": ["topic1", "topic2"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}`;

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `Analyze this test history:\n${summaryText}` }] }],
              systemInstruction: { parts: [{ text: systemInstruction }] },
              generationConfig: { temperature: 0.5, maxOutputTokens: 1000 },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          
          // Clean JSON formatting if wrapped in code blocks
          text = text.replace(/^```json\s*/m, "").replace(/^```\s*/m, "").replace(/```$/m, "").trim();
          
          try {
            const parsed = JSON.parse(text);
            return NextResponse.json({ success: true, result: parsed, source: "gemini" });
          } catch (e) {
            console.error("Failed to parse Gemini JSON for analytics:", text);
          }
        }
      } catch (err) {
        console.error("Gemini API error during analytics generation:", err);
      }
    }

    // --- Local Rules Engine Fallback ---
    // Group attempts by topic
    const topicStats: { [key: string]: { totalScore: number; maxScore: number; count: number; subjects: Set<string>; types: Set<string> } } = {};
    
    testHistory.forEach((attempt: any) => {
      const topicKey = attempt.topic || "General";
      if (!topicStats[topicKey]) {
        topicStats[topicKey] = { totalScore: 0, maxScore: 0, count: 0, subjects: new Set(), types: new Set() };
      }
      topicStats[topicKey].totalScore += attempt.score;
      topicStats[topicKey].maxScore += attempt.totalMarks;
      topicStats[topicKey].count += 1;
      topicStats[topicKey].subjects.add(attempt.subject);
      topicStats[topicKey].types.add(attempt.testType);
    });

    const weakTopics: string[] = [];
    const strongTopics: string[] = [];
    const recommendations: string[] = [];

    // Analyze each topic
    Object.entries(topicStats).forEach(([topic, stat]) => {
      const percentage = stat.maxScore > 0 ? (stat.totalScore / stat.maxScore) * 100 : 0;
      const displayLabel = `${topic} (${Array.from(stat.subjects)[0] || ""})`;
      
      if (percentage >= 75) {
        strongTopics.push(displayLabel);
      } else {
        weakTopics.push(displayLabel);
      }
    });

    // Generate intelligent recommendations based on stats
    const averageScore = testHistory.reduce((acc: number, cur: any) => acc + (cur.totalMarks > 0 ? (cur.score / cur.totalMarks) * 100 : 0), 0) / testHistory.length;
    const testTypesUsed = Array.from(new Set(testHistory.map((h: any) => h.testType)));

    recommendations.push(
      `Your cumulative practice exam average is ${Math.round(averageScore)}% across ${testHistory.length} quiz attempt${testHistory.length > 1 ? "s" : ""}.`
    );

    if (weakTopics.length > 0) {
      const firstWeak = weakTopics[0].split(" (")[0];
      recommendations.push(
        `Generate 5-Minute AI Cheat Sheets in the AI Revision Notes room for "${firstWeak}" to strengthen your fundamentals.`
      );
      recommendations.push(
        `Create a customized 7-Day Exam Timetable for your weak subjects to structure daily study sessions.`
      );
    } else {
      recommendations.push(
        "Excellent proficiency shown! Try turning up the quiz difficulty to 'Hard' in the Smart Test room to push your boundaries."
      );
    }

    if (!testTypesUsed.includes("essay")) {
      recommendations.push(
        "Practice at least one 10-Mark Detailed Essay test to review model answers and improve your vocabulary scoring rate."
      );
    }
    
    if (testHistory.length < 3) {
      recommendations.push(
        "Complete 3 or more quizzes to unlock further advanced study recommendation models."
      );
    }

    return NextResponse.json({
      success: true,
      result: {
        weakTopics: weakTopics.length > 0 ? weakTopics : ["None detected! 🎉"],
        strongTopics: strongTopics.length > 0 ? strongTopics : ["Keep practicing to build your strong topics catalog!"],
        recommendations
      },
      source: "local-rules-engine"
    });
  } catch (err: any) {
    console.error("Analytics API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
