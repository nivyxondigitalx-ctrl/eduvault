import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSessionUser } from "../../../../lib/auth";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Authenticate user and get role context
    const session = await getSessionUser(req);
    let user = null;
    let dealer = null;
    let student = null;

    if (session) {
      user = await prisma.user.findUnique({
        where: { id: session.id },
        include: {
          studentProfile: true,
          dealerProfile: true,
        },
      });

      if (user) {
        dealer = user.dealerProfile;
        student = user.studentProfile;
      }
    }

    const role = user?.role || "guest";
    const userName = user?.name || "Guest";

    // Direct command handler for deleting a material (triggered by click or chat)
    if (role === "dealer" && dealer && message.startsWith("/delete-material ")) {
      const targetId = message.substring("/delete-material ".length).trim();
      const deletionResult = await deleteMaterialHelper(targetId, dealer.id);

      // Fetch updated materials list
      const updatedMaterials = await prisma.material.findMany({
        where: { dealerId: dealer.id },
        select: { id: true, title: true, status: true, price: true, downloadCount: true },
      });

      return NextResponse.json({
        content: deletionResult.message,
        data: {
          role: "dealer",
          earnings: {
            totalSales: dealer.totalSales,
            netEarnings: dealer.netEarnings,
            availableBalance: dealer.availableBalance,
          },
          materials: updatedMaterials.slice(0, 5),
        }
      });
    }

    // 2. Fetch relevant database context based on role to ground the AI
    let dbContext = "";
    let dataPayload: any = {}; // Custom data structure to send to UI for rich rendering

    // Parse search keyword to proactively search database
    const lowercaseMessage = message.toLowerCase();
    const searchKeywords = lowercaseMessage
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter((k: string) => k.length > 2 && !["find", "search", "show", "give", "notes", "paper", "papers", "study", "for", "the", "with"].includes(k));

    if (role === "admin") {
      // Gather admin system info
      const [pendingCount, openTickets, unresolvedErrors, recentLogs] = await Promise.all([
        prisma.material.count({ where: { status: "pending" } }),
        prisma.supportTicket.findMany({
          where: { status: "open" },
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, role: true } } },
        }),
        prisma.systemError.findMany({
          where: { resolved: false },
          take: 5,
          orderBy: { createdAt: "desc" },
        }),
        prisma.auditLog.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, role: true } } },
        }),
      ]);

      dbContext = `
System Status Context (Admins Only):
- Pending Materials for Moderation: ${pendingCount}
- Active Open Support Tickets: ${openTickets.length}
- Unresolved System Errors (last 5): ${unresolvedErrors.map(e => `[${e.createdAt.toISOString()}] "${e.message}"`).join("; ")}
- Recent Activity Logs: ${recentLogs.map(l => `[${l.createdAt.toISOString()}] ${l.user.name} (${l.user.role}): ${l.action}`).join("; ")}
`;
      dataPayload = {
        role: "admin",
        pendingCount,
        openTickets: openTickets.map(t => ({ id: t.id, subject: t.subject, userName: t.user.name })),
        errors: unresolvedErrors.map(e => ({ id: e.id, message: e.message, createdAt: e.createdAt })),
      };
    } else if (role === "dealer" && dealer) {
      // Gather dealer business statistics
      const [dealerMaterials, recentPayouts] = await Promise.all([
        prisma.material.findMany({
          where: { dealerId: dealer.id },
          select: { id: true, title: true, status: true, price: true, downloadCount: true },
        }),
        prisma.payout.findMany({
          where: { dealerId: dealer.id },
          take: 5,
          orderBy: { createdAt: "desc" },
        }),
      ]);

      dbContext = `
Dealer Earnings & Uploads Context:
- Dealer Name: ${dealer.name}
- Dealer Account Status: ${dealer.status} (Verification: ${dealer.verificationStatus})
- Total Sales: $${dealer.totalSales}
- Net Earnings (70% commission): $${dealer.netEarnings}
- Available Balance to Withdraw: $${dealer.availableBalance}
- Total Uploaded Materials: ${dealerMaterials.length}
- Uploaded Materials Summary: ${dealerMaterials.map(m => `"${m.title}" (Status: ${m.status}, Downloads: ${m.downloadCount}, Price: $${m.price})`).slice(0, 5).join("; ")}
- Recent Payout Requests: ${recentPayouts.map(p => `$${p.amount} via ${p.method} (Status: ${p.status})`).join("; ")}
`;
      dataPayload = {
        role: "dealer",
        earnings: {
          totalSales: dealer.totalSales,
          netEarnings: dealer.netEarnings,
          availableBalance: dealer.availableBalance,
        },
        materials: dealerMaterials.slice(0, 5),
        payouts: recentPayouts,
      };
    } else {
      // Gather Student/Guest material listing/search context
      let searchedMaterials: any[] = [];
      if (searchKeywords.length > 0) {
        const queryConditions = searchKeywords.map(keyword => ({
          OR: [
            { title: { contains: keyword, mode: "insensitive" as const } },
            { description: { contains: keyword, mode: "insensitive" as const } },
            { subjectCode: { contains: keyword, mode: "insensitive" as const } },
            { tags: { contains: keyword, mode: "insensitive" as const } },
          ],
        }));

        searchedMaterials = await prisma.material.findMany({
          where: {
            AND: [
              { status: "approved" },
              { OR: queryConditions },
            ],
          },
          take: 5,
          select: { id: true, title: true, slug: true, price: true, pageCount: true, subjectCode: true, rating: true },
        });
      }

      const popularMaterials = await prisma.material.findMany({
        where: { status: "approved" },
        orderBy: { downloadCount: "desc" },
        take: 5,
        select: { id: true, title: true, slug: true, price: true, pageCount: true, subjectCode: true },
      });

      dbContext = `
Student/Marketplace Context:
- User is logged in: ${!!user} (Name: ${userName}, Role: ${role})
- Matching Materials searched by user keywords (${searchKeywords.join(", ")}): ${
        searchedMaterials.length > 0
          ? searchedMaterials.map(m => `"${m.title}" (Slug: ${m.slug}, Price: $${m.price}, Code: ${m.subjectCode})`).join("; ")
          : "None found directly for these keywords."
      }
- Popular Materials in Vault: ${popularMaterials.map(m => `"${m.title}" (Slug: ${m.slug}, Price: $${m.price})`).join("; ")}
`;
      dataPayload = {
        role: role === "student" ? "student" : "guest",
        materials: searchedMaterials.length > 0 ? searchedMaterials : popularMaterials,
        isSearch: searchedMaterials.length > 0,
      };
    }

    // 3. Handle Chat Completion
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (GEMINI_API_KEY) {
      // API Mode: Call Gemini
      const systemInstruction = `You are EduVault AI, a helpful and premium assistant for the EduVault marketplace.
EduVault is a portal for university & college notes, lecture material, and question papers.
User details: Name: "${userName}", Role: "${role}", Email: "${user?.email || "None"}".

${dbContext}

Guidelines:
1. Actively assist the user based on their role (${role}).
2. Use clear, friendly, and professional language.
3. Reference pages when relevant using Markdown:
   - Browse notes: [/browse](/browse)
   - Support tickets: [/student/tickets](/student/tickets) or dashboard (/student)
   - Dealer Dashboard: [/dealer](/dealer) and payouts (/dealer/payouts)
   - Admin Panel: [/admin](/admin)
   - Specific materials: [/material/SLUG](/material/SLUG)
4. Highlight real-time data provided in the context above (e.g. payout balance, pending counts, or search results) to show you are integrated.
5. If students search for materials, list matching items with direct markdown links: [Title](/material/slug) and mention details.
6. Keep responses formatting clean and readable using lists, bold text, or tables. Make it brief.
7. If the user is a dealer and asks to delete one of their uploaded PDF materials, you can trigger deletion on their behalf by outputting the exact tag \`[DELETE_MATERIAL: <id>]\` in your response (replacing <id> with the actual material ID from the context). Ensure you explain to them that the file is being deleted.`;

      // Map chat history to Gemini API formats
      const contents = history.map((h: any) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }],
      }));

      // Add the latest message
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          // Process database deletion if Gemini triggers it
          const deleteMatch = aiText.match(/\[DELETE_MATERIAL:\s*([a-zA-Z0-9-]+)\]/);
          if (deleteMatch && role === "dealer" && dealer) {
            const targetId = deleteMatch[1];
            const deletionResult = await deleteMaterialHelper(targetId, dealer.id);
            aiText = aiText.replace(deleteMatch[0], `\n\n*System Update: ${deletionResult.message}*`);
            
            // Refresh dealer materials
            const updatedMaterials = await prisma.material.findMany({
              where: { dealerId: dealer.id },
              select: { id: true, title: true, status: true, price: true, downloadCount: true },
            });
            dataPayload.materials = updatedMaterials.slice(0, 5);
          }

          return NextResponse.json({
            content: aiText,
            data: dataPayload,
          });
        }
      }
      
      console.error("Gemini API call failed, status:", response.status, await response.text());
    }

    // 4. Fallback Mode: Custom Rule-Based Assistant Engine (When API Key is not set or fails)
    let reply = "";

    const cleanMsg = lowercaseMessage.trim();

    if (role === "admin") {
      if (cleanMsg.includes("error") || cleanMsg.includes("bug") || cleanMsg.includes("fail")) {
        const errors = dataPayload.errors || [];
        if (errors.length > 0) {
          reply = `Here are the latest unresolved system errors in the system:\n\n` +
            errors.map((e: any) => `- **${e.message}** (Logged: ${new Date(e.createdAt).toLocaleDateString()})`).join("\n") +
            `\n\nYou can review and resolve all errors in the [Admin Error Log](/admin/errors).`;
        } else {
          reply = `Great news! There are currently no unresolved system errors. You can check audit logs in the [Admin Panel](/admin).`;
        }
      } else if (cleanMsg.includes("moderate") || cleanMsg.includes("pending") || cleanMsg.includes("review") || cleanMsg.includes("approve")) {
        const count = dataPayload.pendingCount || 0;
        reply = `There are currently **${count}** study materials awaiting moderation.\n\nTo review, approve, or reject these submissions, head over to the [Material Moderation Panel](/admin/moderation).`;
      } else if (cleanMsg.includes("ticket") || cleanMsg.includes("support")) {
        const tickets = dataPayload.openTickets || [];
        if (tickets.length > 0) {
          reply = `Here are the active support tickets requiring response:\n\n` +
            tickets.map((t: any) => `- **${t.subject}** submitted by *${t.userName}* ([Reply Here](/admin/tickets))`).join("\n");
        } else {
          reply = `All support tickets are currently resolved! Good job.`;
        }
      } else if (cleanMsg.includes("audit") || cleanMsg.includes("log") || cleanMsg.includes("activity")) {
        reply = `You can monitor full audit logs in the [Admin Audit Logs Page](/admin). Let me know if you need helper stats!`;
      } else {
        reply = `Hello Administrator **${userName}**! I'm your Admin Copilot. I can help you monitor system vitals. Try asking me:
- *"Show system errors"*
- *"List pending materials"*
- *"View open support tickets"*`;
      }
    } else if (role === "dealer" && dealer) {
      if (cleanMsg.includes("earn") || cleanMsg.includes("balance") || cleanMsg.includes("sale") || cleanMsg.includes("money") || cleanMsg.includes("revenue")) {
        const { totalSales, netEarnings, availableBalance } = dataPayload.earnings;
        reply = `Here is your financial overview, **${userName}**:\n\n` +
          `- **Total Gross Sales**: $${totalSales.toFixed(2)}\n` +
          `- **Net Earnings (70% Share)**: $${netEarnings.toFixed(2)}\n` +
          `- **Available Balance to Withdraw**: $${availableBalance.toFixed(2)}\n\n` +
          `You can request payouts or update payment accounts directly in the [Dealer Payout Dashboard](/dealer/payouts).`;
      } else if (cleanMsg.includes("payout") || cleanMsg.includes("withdraw") || cleanMsg.includes("transfer")) {
        const { availableBalance } = dataPayload.earnings;
        reply = `Your current available balance is **$${availableBalance.toFixed(2)}**.\n\nTo initiate a withdrawal:\n` +
          `1. Go to the [Payouts Page](/dealer/payouts).\n` +
          `2. Select your withdrawal method (Bank Transfer or UPI).\n` +
          `3. Submit the payout request. Our admin team will review it shortly.`;
      } else if (cleanMsg.includes("upload") || cleanMsg.includes("submit") || cleanMsg.includes("publish") || cleanMsg.includes("sell")) {
        reply = `To upload study material and start earning:\n` +
          `1. Go to the [Upload Study Material](/dealer/upload) section.\n` +
          `2. Fill in the syllabus details (University, College, Course, Semester, Subject).\n` +
          `3. Upload the study material PDF and set a price (or make it free).\n\n*Note: All uploads are moderated and approved by the admin team before they appear in the student search.*`;
      } else if (cleanMsg.includes("delete") || cleanMsg.includes("remove")) {
        let targetId = "";
        const dealerMaterials = await prisma.material.findMany({
          where: { dealerId: dealer.id },
        });
        
        const matchedMat = dealerMaterials.find(m => 
          cleanMsg.includes(m.title.toLowerCase()) || 
          cleanMsg.includes(m.id.toLowerCase())
        );

        if (matchedMat) {
          targetId = matchedMat.id;
        }

        if (targetId) {
          const deletionResult = await deleteMaterialHelper(targetId, dealer.id);
          reply = deletionResult.message;
          
          // Refresh list
          const updatedMaterials = await prisma.material.findMany({
            where: { dealerId: dealer.id },
            select: { id: true, title: true, status: true, price: true, downloadCount: true },
          });
          dataPayload.materials = updatedMaterials.slice(0, 5);
        } else {
          reply = `I couldn't identify which material you want to delete. Please specify the exact title of the notes you wish to delete, or click the delete trash icon next to the material in your list below.`;
        }
      } else {
        reply = `Hello **${userName}**! I am your Dealer Assistant. I can help manage your earnings and uploads. Try asking:
- *"What is my current balance?"*
- *"How do I request a payout?"*
- *"How can I upload new lecture notes?"*`;
      }
    } else {
      // Student / Guest role
      if (searchKeywords.length > 0 && dataPayload.isSearch) {
        const mats = dataPayload.materials || [];
        reply = `I found some relevant study materials matching your search in our database:\n\n` +
          mats.map((m: any) => `- **[${m.title}](/material/${m.slug})** (${m.subjectCode}) — ${m.pageCount} pages, Price: $${m.price}`).join("\n") +
          `\n\nWould you like to search more in detail? Try the [/browse](/browse) page.`;
      } else if (cleanMsg.includes("unlock") || cleanMsg.includes("ad") || cleanMsg.includes("free")) {
        reply = `On EduVault, you can unlock premium study materials in two ways:\n` +
          `1. **Watch an Ad**: Students can unlock materials for free by watching a short video sponsor ad.\n` +
          `2. **Subscribe / Purchase**: Purchase documents individually or upgrade to one of our premium [Subscription Plans](/plans) for unlimited ad-free access.`;
      } else if (cleanMsg.includes("subscribe") || cleanMsg.includes("plan") || cleanMsg.includes("membership")) {
        reply = `We offer multiple student subscription plans! Subscribing allows you to download notes instantly and ad-free. Check out the current options at our [Subscription Plans Page](/plans).`;
      } else if (cleanMsg.includes("cart") || cleanMsg.includes("buy") || cleanMsg.includes("order")) {
        reply = `You can review and purchase notes in your [Shopping Cart](/cart). We support payments via Card, Net Banking, UPI, and local wallets.`;
      } else if (cleanMsg.includes("ticket") || cleanMsg.includes("help") || cleanMsg.includes("support")) {
        reply = `If you have an issue with a purchase or syllabus resource, you can submit a support ticket in your [Support Dashboard](/student/tickets) (or login and go to Student Portal). Our team is here to assist!`;
      } else {
        reply = `Welcome to EduVault, **${userName}**! I'm your AI Study Partner. I can help you find notes, syllabus files, and previous year question papers. Try asking:
- *"Find notes for engineering mathematics"*
- *"How do I unlock papers for free?"*
- *"Show me subscription plans"*`;
      }
    }

    return NextResponse.json({
      content: reply,
      data: dataPayload,
      localFallback: true,
    });
  } catch (error: any) {
    console.error("AI Chat route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function deleteMaterialHelper(materialId: string, dealerId: string) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: materialId },
    });

    if (!material) {
      return { success: false, message: "Material not found." };
    }

    if (material.dealerId !== dealerId) {
      return { success: false, message: "Unauthorized: You do not own this material." };
    }

    // Delete the file from database & local/tmp cache
    const filename = material.filePath.replace("/uploads/", "");
    
    // 1. Delete from SystemError table (database backup)
    try {
      await prisma.systemError.deleteMany({
        where: { message: `upload:${filename}` },
      });
    } catch (e: any) {
      console.error("Failed to delete database file backup:", e.message);
    }

    // 2. Delete local files
    try {
      const localPath = path.join(process.cwd(), "public", "uploads", filename);
      await fs.unlink(localPath);
    } catch (e) {}
    try {
      const tmpPath = path.join("/tmp", "uploads", filename);
      await fs.unlink(tmpPath);
    } catch (e) {}

    // 3. Delete from Material table
    await prisma.material.delete({
      where: { id: materialId },
    });

    return { success: true, message: `Successfully deleted study material "${material.title}".` };
  } catch (err: any) {
    console.error("Deletion helper error:", err);
    return { success: false, message: `Failed to delete material: ${err.message}` };
  }
}
