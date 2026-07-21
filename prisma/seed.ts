import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import {
  UNIVERSITIES,
  COLLEGES,
  COURSES,
  DEPARTMENTS,
  REGULATIONS,
  SEMESTERS,
  SUBJECTS,
  SUBSCRIPTION_PLANS,
  AD_CAMPAIGNS,
  MOCK_USERS,
  MOCK_DEALERS,
  MOCK_STUDENTS_PROFILES,
  MOCK_MATERIALS,
  MOCK_REVIEWS,
  MOCK_ORDERS,
  MOCK_LEDGER,
  MOCK_PAYOUTS,
  MOCK_NOTIFICATIONS,
  MOCK_TICKETS,
} from "../src/data/mockData";

async function main() {
  console.log("Starting database seeding...");

  // 1. Clean existing records
  await prisma.auditLog.deleteMany();
  await prisma.supportTicketReply.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.ledgerEntry.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.material.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.regulation.deleteMany();
  await prisma.department.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.university.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.dealer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.adCampaign.deleteMany();

  console.log("Cleaned existing records.");

  // 2. Seed Subscription Plans
  for (const plan of SUBSCRIPTION_PLANS) {
    await prisma.subscriptionPlan.create({
      data: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        durationMonths: plan.durationMonths,
        downloadLimit: plan.downloadLimit,
        discountPercentage: plan.discountPercentage,
        features: JSON.stringify(plan.features),
        activeSubscribers: plan.activeSubscribers,
      },
    });
  }
  console.log("Seeded subscription plans.");

  // 3. Seed Ad Campaigns
  for (const ad of AD_CAMPAIGNS) {
    await prisma.adCampaign.create({
      data: {
        id: ad.id,
        name: ad.name,
        advertiser: ad.advertiser,
        status: ad.status,
        placement: ad.placement,
        startDate: ad.startDate,
        endDate: ad.endDate,
        impressions: ad.impressions,
        completions: ad.completions,
        estimatedRevenue: ad.estimatedRevenue,
      },
    });
  }
  console.log("Seeded ad campaigns.");

  // 4. Seed Taxonomy
  for (const u of UNIVERSITIES) {
    await prisma.university.create({ data: u });
  }
  for (const c of COLLEGES) {
    await prisma.college.create({ data: c });
  }
  for (const c of COURSES) {
    await prisma.course.create({ data: c });
  }
  for (const d of DEPARTMENTS) {
    await prisma.department.create({ data: d });
  }
  for (const r of REGULATIONS) {
    await prisma.regulation.create({ data: r });
  }
  for (const s of SEMESTERS) {
    await prisma.semester.create({ data: s });
  }
  for (const s of SUBJECTS) {
    await prisma.subject.create({ data: s });
  }
  console.log("Seeded academic taxonomy.");

  // 5. Seed Users & Profiles
  // Map password text to hash. Default password is "password123" for all demo accounts.
  const defaultPasswordHash = await bcrypt.hash("password123", 10);
  for (const u of MOCK_USERS) {
    await prisma.user.create({
      data: {
        id: u.id,
        email: u.email,
        passwordHash: defaultPasswordHash,
        name: u.name,
        role: u.role,
        avatarUrl: u.avatarUrl,
        createdAt: new Date(u.createdAt),
      },
    });
  }
  console.log("Seeded base users.");

  // Seed Student Profiles
  for (const [userId, profile] of Object.entries(MOCK_STUDENTS_PROFILES)) {
    await prisma.studentProfile.create({
      data: {
        userId: userId,
        universityId: profile.universityId,
        collegeId: profile.collegeId,
        courseId: profile.courseId,
        departmentId: profile.departmentId,
        regulationId: profile.regulationId,
        semesterId: profile.semesterId,
        savedMaterialIds: JSON.stringify(profile.savedMaterialIds || []),
        unlockedMaterialIds: JSON.stringify(profile.unlockedMaterialIds || []),
        adUnlocksCountToday: profile.adUnlocksCountToday || 0,
        lastAdUnlockDate: profile.lastAdUnlockDate,
        isSubscribed: profile.isSubscribed || false,
        subscriptionPlanId: profile.subscriptionPlanId,
        subscriptionExpiresAt: profile.subscriptionExpiresAt,
      },
    });
  }
  console.log("Seeded student profiles.");

  // Seed Dealers
  for (const d of MOCK_DEALERS) {
    await prisma.dealer.create({
      data: {
        id: d.id,
        userId: d.userId,
        name: d.name,
        email: d.email,
        phone: d.phone,
        collegeIds: JSON.stringify(d.collegeIds),
        commissionPercentage: d.commissionPercentage,
        status: d.status,
        verificationStatus: d.verificationStatus,
        panNumber: d.panNumber,
        gstNumber: d.gstNumber,
        bankAccountName: d.bankAccountName,
        bankAccountNumber: d.bankAccountNumber,
        bankIfsc: d.bankIfsc,
        upiId: d.upiId,
        totalSales: d.totalSales,
        netEarnings: d.netEarnings,
        availableBalance: d.availableBalance,
        payoutBalance: d.payoutBalance,
        createdAt: new Date(d.createdAt),
      },
    });
  }
  console.log("Seeded dealer profiles.");

  // 6. Seed Materials
  for (const m of MOCK_MATERIALS) {
    await prisma.material.create({
      data: {
        id: m.id,
        slug: m.slug,
        title: m.title,
        description: m.description,
        universityId: m.universityId,
        collegeId: m.collegeId,
        courseId: m.courseId,
        departmentId: m.departmentId,
        regulationId: m.regulationId,
        semesterId: m.semesterId,
        subjectId: m.subjectId,
        subjectCode: m.subjectCode,
        category: m.category,
        examType: m.examType,
        examMonth: m.examMonth,
        examYear: m.examYear,
        language: m.language,
        pageCount: m.pageCount,
        fileSize: m.fileSize,
        filePath: "/uploads/sample.pdf",
        thumbnailStyle: m.thumbnailStyle,
        previewPageCount: m.previewPageCount,
        price: m.price,
        discount: m.discount,
        accessModes: JSON.stringify(m.accessModes),
        subscriptionEligible: m.subscriptionEligible,
        rating: m.rating,
        reviewCount: m.reviewCount,
        downloadCount: m.downloadCount,
        status: m.status,
        dealerId: m.dealerId,
        createdAt: new Date(m.createdAt),
        tags: JSON.stringify(m.tags),
        includesAnswerKey: m.includesAnswerKey,
      },
    });
  }
  console.log("Seeded materials.");

  // 7. Seed Reviews
  for (const r of MOCK_REVIEWS) {
    await prisma.review.create({
      data: {
        id: r.id,
        materialId: r.materialId,
        userId: r.studentId, // Map studentId to userId
        rating: r.rating,
        comment: r.comment,
        createdAt: new Date(r.createdAt),
      },
    });
  }
  console.log("Seeded reviews.");

  // 8. Seed Orders
  for (const o of MOCK_ORDERS) {
    const order = await prisma.order.create({
      data: {
        id: o.id,
        userId: o.studentId, // Map studentId to userId
        orderNumber: o.orderNumber,
        subtotal: o.grossAmount,     // Map grossAmount to subtotal
        tax: o.taxAmount,           // Map taxAmount to tax
        discount: o.discountAmount,   // Map discountAmount to discount
        total: o.netAmount,          // Map netAmount to total
        paymentStatus: o.paymentStatus === "success" ? "completed" : o.paymentStatus,
        paymentMethod: o.paymentMethod,
        createdAt: new Date(o.createdAt),
      },
    });

    for (const item of o.items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          materialId: item.materialId,
          price: item.price,
          discount: item.discount,
        },
      });
    }
  }
  console.log("Seeded orders & items.");

  // 9. Seed Ledger Entries
  for (const l of MOCK_LEDGER) {
    await prisma.ledgerEntry.create({
      data: {
        id: l.id,
        orderId: l.referenceId && l.referenceId.startsWith("ord-") ? l.referenceId : null,
        dealerId: l.dealerId,
        amount: l.amount,
        type: l.type,
        description: l.description,
        createdAt: new Date(l.createdAt),
      },
    });
  }
  console.log("Seeded ledger entries.");

  // 10. Seed Payouts
  for (const p of MOCK_PAYOUTS) {
    await prisma.payout.create({
      data: {
        id: p.id,
        dealerId: p.dealerId,
        amount: p.amount,
        method: p.paymentMethod, // Map paymentMethod to method
        paymentDetails: p.paymentDetails,
        status: p.status,
        processedAt: p.processedAt ? new Date(p.processedAt) : null,
        createdAt: new Date(p.requestedAt), // Map requestedAt to createdAt
      },
    });
  }
  console.log("Seeded payouts.");

  // 11. Seed Notifications
  for (const n of MOCK_NOTIFICATIONS) {
    await prisma.notification.create({
      data: {
        id: n.id,
        userId: n.userId,
        title: n.title,
        message: n.message,
        read: n.read,
        type: (n as any).type || "system",
        createdAt: new Date(n.createdAt),
      },
    });
  }
  console.log("Seeded notifications.");

  // 12. Seed Support Tickets
  for (const t of MOCK_TICKETS) {
    const ticket = await prisma.supportTicket.create({
      data: {
        id: t.id,
        userId: t.userId,
        subject: t.subject,
        status: t.status,
        createdAt: new Date(t.createdAt),
      },
    });

    for (const r of t.replies) {
      await prisma.supportTicketReply.create({
        data: {
          id: r.id,
          ticketId: ticket.id,
          userId: r.senderRole === "admin" ? "usr-admin" : t.userId, // Map senderRole to a valid user ID
          message: r.message,
          createdAt: new Date(r.createdAt),
        },
      });
    }
  }
  console.log("Seeded support tickets.");

  // 13. Seed Audit Log init
  await prisma.auditLog.create({
    data: {
      action: "system_init",
      details: "Database initialized and seeded via Prisma script",
      userId: "usr-admin", // Seed user admin
    },
  });

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
