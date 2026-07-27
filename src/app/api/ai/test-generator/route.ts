import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { topic, subject, testType = "mcq", count = 5, difficulty = "medium", contentContext = "" } = await req.json();

    if (!topic && !subject) {
      return NextResponse.json({ error: "Topic or subject is required" }, { status: 400 });
    }

    const targetTopic = topic || subject;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (GEMINI_API_KEY) {
      const systemInstruction = `You are an expert academic professor and test generator from EduVault & EduPlus AI system.
Generate a structured ${testType.toUpperCase()} practice test on the topic: "${targetTopic}".
Difficulty Level: ${difficulty}.
Number of questions requested: ${count}.
Additional syllabus context: ${contentContext || "Standard university syllabus"}.

Return ONLY valid JSON with no markdown wrapping or formatting backticks if possible, or cleanly formatted JSON inside backticks with the structure:
{
  "testTitle": "Practice Test: [Topic Name]",
  "subject": "[Subject]",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "question": "Question text...",
      "type": "${testType}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation for why the answer is correct.",
      "marks": 2
    }
  ]
}
Note: For short answer (2-marks) or essay (10-marks) testTypes, provide an empty array for "options", set "correctAnswer": 0, and put the model answer in "explanation".`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: `Generate ${count} questions on ${targetTopic}` }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
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
          return NextResponse.json({ success: true, data: parsed, source: "gemini" });
        } catch (e) {
          console.error("Failed to parse Gemini JSON output for test:", text);
        }
      }
    }

    // Fallback Mock Test Engine adapted from EduPlus TestService
    const mockQuestions = [];
    const baseTopics = [
      { q: `What is the primary operational principle of ${targetTopic}?`, opts: ["Linear superposition & modular state optimization", "Randomized execution scheduling", "Single-threaded recursive blocking", "Unsynchronized buffer cycling"], ans: 0, exp: `In ${targetTopic}, linear superposition and structured modular optimization ensure consistent state transitions without memory deadlocks.` },
      { q: `Which formula or paradigm governs foundational design in ${targetTopic}?`, opts: ["Ohm's & Kirchoff's Matrix Synthesis", "Euler-Lagrange Variational Equation", "Shannon-Weaver Entropy Information Rate", "Standard Algorithmic Time-Complexity Bound O(n log n)"], ans: 3, exp: "Efficiency in complex systems requires predictable upper-bound execution time, commonly governed by O(n log n) convergence." },
      { q: `During practical testing of ${targetTopic}, which common failure mode should be avoided?`, opts: ["Over-parameterization without validation data", "Using redundant index caches", "High-frequency signal damping", "Synchronous logging in debug mode"], ans: 0, exp: "Over-parameterization without independent test validation leads to catastrophic overfitting and runtime divergence." },
      { q: `How does modern industry adapt ${targetTopic} for large-scale university syllabus requirements?`, opts: ["By modularizing architecture into decoupled services & REST layers", "By eliminating database indexing", "By using uncompiled scripting solely", "By restricting concurrent accesses to 1 thread"], ans: 0, exp: "Decoupled micro-architectures and RESTful boundaries ensure scalability across academic environments." },
      { q: `Which verification method offers highest assurance when validating results from ${targetTopic}?`, opts: ["Automated regression suites & empirical cross-validation", "Manual inspection of hex dumps", "Anecdotal user survey estimations", "Single-run heuristic approximations"], ans: 0, exp: "Automated test regression combined with empirical cross-validation guarantees robust reproducibility." },
    ];

    const actualCount = Math.min(count, 5);
    for (let i = 0; i < actualCount; i++) {
      const item = baseTopics[i % baseTopics.length];
      if (testType === "mcq") {
        mockQuestions.push({
          id: i + 1,
          question: item.q,
          type: "mcq",
          options: item.opts,
          correctAnswer: item.ans,
          explanation: item.exp,
          marks: 2,
        });
      } else {
        mockQuestions.push({
          id: i + 1,
          question: testType === "short" ? `Define and explain the significance of ${targetTopic} in modern engineering applications.` : `Provide a comprehensive 10-mark analysis of ${targetTopic}, detailing architectural components, derivation models, and practical implementations.`,
          type: testType,
          options: [],
          correctAnswer: 0,
          explanation: `Model Evaluation Answer:\n1. Core Definition: ${targetTopic} represents a fundamental component in curriculum analytics.\n2. Architectural Workflow: Involves sequential staging, parameter evaluation, and verification.\n3. Conclusion & Best Practices: Ensure strict type checking and adherence to published regulatory standards.`,
          marks: testType === "short" ? 2 : 10,
        });
      }
    }

    const result = {
      testTitle: `${testType === "mcq" ? "MCQ Quiz" : testType === "short" ? "2-Mark Short Answers" : "10-Mark Comprehensive Essay"}: ${targetTopic}`,
      subject: targetTopic,
      difficulty: difficulty.toUpperCase(),
      questions: mockQuestions,
    };

    return NextResponse.json({ success: true, data: result, source: "local-engine" });
  } catch (err: any) {
    console.error("Test generator API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
