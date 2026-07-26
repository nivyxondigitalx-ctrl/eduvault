export type UserRole = "admin" | "dealer" | "student";
export type MaterialStatus = "draft" | "pending" | "approved" | "rejected" | "suspended";
export type AccessMode = "free" | "ad_unlock" | "purchase" | "subscription";
export type MaterialCategory =
  | "study_material"
  | "notes"
  | "question_paper"
  | "important_questions"
  | "model_answer"
  | "answer_key";

export type LedgerEntryType =
  | "sale"
  | "refund"
  | "gateway_fee"
  | "subscription_share"
  | "adjustment"
  | "payout";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  studentProfile?: StudentProfile;
  dealerProfile?: Dealer;
}

export interface StudentProfile {
  universityId: string;
  collegeId: string;
  courseId: string;
  departmentId: string;
  regulationId: string;
  semesterId: string;
  savedMaterialIds: string[];
  unlockedMaterialIds: string[]; // for ad unlocks with expiration
  adUnlocksCountToday: number;
  lastAdUnlockDate?: string;
  isSubscribed: boolean;
  subscriptionPlanId?: string;
  subscriptionExpiresAt?: string;
}

export interface Dealer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  collegeIds: string[]; // Colleges they can provide content for
  commissionPercentage: number; // e.g. 70, 75, 80
  status: "pending" | "approved" | "suspended";
  verificationStatus: "unverified" | "pending" | "verified";
  panNumber?: string;
  gstNumber?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  upiId?: string;
  totalSales: number;
  netEarnings: number;
  availableBalance: number;
  payoutBalance: number;
  createdAt: string;
}

export interface University {
  id: string;
  name: string;
  code: string;
  status: "active" | "inactive";
}

export interface College {
  id: string;
  universityId: string;
  name: string;
  code: string;
  status: "active" | "inactive";
}

export interface Course {
  id: string;
  name: string; // e.g. B.E, B.Tech, Arts
  status: "active" | "inactive";
}

export interface Department {
  id: string;
  courseId: string;
  name: string; // e.g. Computer Science, Mechanical
  code: string;
  status: "active" | "inactive";
}

export interface Regulation {
  id: string;
  year: string; // e.g. 2017, 2021
  status: "active" | "inactive";
}

export interface Semester {
  id: string; // 1 to 8
  name: string; // e.g. Semester 1
}

export interface Subject {
  id: string;
  departmentId: string;
  semesterId: string;
  name: string;
  code: string;
  status: "active" | "inactive";
}

export interface Material {
  id: string;
  slug: string;
  title: string;
  description: string;
  universityId: string;
  collegeId: string;
  courseId: string;
  departmentId: string;
  regulationId: string;
  semesterId: string;
  subjectId: string;
  subjectCode: string;
  category: MaterialCategory;
  examType: "internal" | "model" | "practical" | "university";
  examMonth: string; // e.g. "Nov"
  examYear: string;  // e.g. "2025"
  language: string;
  pageCount: number;
  fileSize: string; // e.g. "2.4 MB"
  thumbnailStyle: string; // Tailwind class background
  previewPageCount: number;
  dealerId: string;
  dealerName: string;
  dealerVerified: boolean;
  price: number; // Gross price in INR (0 if free/ad_unlock)
  discount: number; // Discount in INR
  accessModes: AccessMode[]; // e.g. ["purchase", "ad_unlock", "subscription"]
  subscriptionEligible: boolean;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  status: MaterialStatus;
  rejectReason?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  includesAnswerKey: boolean;
  fileUrl?: string; // Mock PDF path
  filePath?: string;
}

export interface Review {
  id: string;
  materialId: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  id: string; // materialId
  title: string;
  price: number;
  discount: number;
  category: MaterialCategory;
  subjectCode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  items: OrderItem[];
  grossAmount: number;
  discountAmount: number;
  taxAmount: number;
  gatewayFee: number;
  netAmount: number;
  paymentMethod: "UPI" | "Card" | "Net Banking" | "Wallet";
  paymentStatus: "pending" | "success" | "failed";
  createdAt: string;
}

export interface OrderItem {
  materialId: string;
  title: string;
  price: number;
  discount: number;
  dealerId: string;
}

export interface PaymentSplit {
  orderId: string;
  orderNumber: string;
  materialId: string;
  materialTitle: string;
  dealerId: string;
  dealerName: string;
  grossAmount: number;
  discount: number;
  gatewayFee: number;
  tax: number;
  netDistributable: number;
  dealerPercentage: number;
  dealerEarning: number;
  adminEarning: number;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  dealerId: string;
  type: LedgerEntryType;
  amount: number; // Positive for income, negative for payouts/refunds
  referenceId: string; // OrderId or PayoutId
  description: string;
  createdAt: string;
}

export interface Payout {
  id: string;
  dealerId: string;
  dealerName: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  paymentMethod: "Bank Transfer" | "UPI";
  paymentDetails: string; // Masked bank details or UPI ID
  referenceNumber?: string;
  requestedAt: string;
  processedAt?: string;
  auditNote?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string; // Free, Plus, Exam Pass
  price: number;
  durationMonths: number;
  downloadLimit: number;
  discountPercentage: number;
  features: string[];
  activeSubscribers: number;
}

export interface AdCampaign {
  id: string;
  name: string;
  advertiser: string;
  status: "active" | "paused";
  placement: "modal" | "sidebar" | "banner";
  startDate: string;
  endDate: string;
  impressions: number;
  completions: number;
  estimatedRevenue: number;
  videoUrl?: string;
}

export interface Notification {
  id: string;
  userId: string; // "all" or specific userId
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userRole: UserRole;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  replies: {
    id: string;
    senderRole: UserRole;
    senderName: string;
    message: string;
    createdAt: string;
  }[];
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  userId: string;
  userEmail: string;
  userRole: string;
  createdAt: string;
}

