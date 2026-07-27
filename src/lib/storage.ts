import {
  UNIVERSITIES,
  COLLEGES,
  COURSES,
  DEPARTMENTS,
  REGULATIONS,
  SEMESTERS,
  SUBJECTS,
  MOCK_USERS,
  MOCK_DEALERS,
  MOCK_STUDENTS_PROFILES,
  MOCK_MATERIALS,
  MOCK_REVIEWS,
  MOCK_ORDERS,
  MOCK_LEDGER,
  MOCK_PAYOUTS,
  AD_CAMPAIGNS,
  SUBSCRIPTION_PLANS,
  MOCK_NOTIFICATIONS,
  MOCK_TICKETS,
} from "../data/mockData";

import {
  User,
  Dealer,
  Material,
  Review,
  Order,
  LedgerEntry,
  Payout,
  University,
  College,
  Course,
  Department,
  Regulation,
  Semester,
  Subject,
  SubscriptionPlan,
  AdCampaign,
  Notification,
  SupportTicket,
  CartItem,
  AuditLog,
  SyllabusItem,
  TestAttempt,
} from "../types";

const KEYS = {
  UNIVERSITIES: "ev_universities",
  COLLEGES: "ev_colleges",
  COURSES: "ev_courses",
  DEPARTMENTS: "ev_departments",
  REGULATIONS: "ev_regulations",
  SEMESTERS: "ev_semesters",
  SUBJECTS: "ev_subjects",
  USERS: "ev_users",
  DEALERS: "ev_dealers",
  STUDENT_PROFILES: "ev_student_profiles",
  MATERIALS: "ev_materials",
  REVIEWS: "ev_reviews",
  ORDERS: "ev_orders",
  LEDGER: "ev_ledger",
  PAYOUTS: "ev_payouts",
  AD_CAMPAIGNS: "ev_ad_campaigns",
  SUBSCRIPTION_PLANS: "ev_subscription_plans",
  NOTIFICATIONS: "ev_notifications",
  TICKETS: "ev_tickets",
  CURRENT_USER: "ev_current_user",
  CART: "ev_cart",
  WISHLIST: "ev_wishlist",
  AUDIT_LOGS: "ev_audit_logs",
  SYLLABUS: "ev_syllabus",
  TEST_HISTORY: "ev_test_history",
};

export const initDb = (force = false) => {
  if (typeof window === "undefined") return;

  const dbVersion = localStorage.getItem("ev_db_version");
  const currentTargetVersion = "v6";
  if (dbVersion !== currentTargetVersion) {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    localStorage.setItem("ev_db_version", currentTargetVersion);
    force = true;
  }

  const checkAndSeed = <T>(key: string, data: T) => {
    if (force || !localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  checkAndSeed(KEYS.UNIVERSITIES, UNIVERSITIES);
  checkAndSeed(KEYS.COLLEGES, COLLEGES);
  checkAndSeed(KEYS.COURSES, COURSES);
  checkAndSeed(KEYS.DEPARTMENTS, DEPARTMENTS);
  checkAndSeed(KEYS.REGULATIONS, REGULATIONS);
  checkAndSeed(KEYS.SEMESTERS, SEMESTERS);
  checkAndSeed(KEYS.SUBJECTS, SUBJECTS);
  checkAndSeed(KEYS.USERS, MOCK_USERS);
  checkAndSeed(KEYS.DEALERS, MOCK_DEALERS);
  checkAndSeed(KEYS.STUDENT_PROFILES, MOCK_STUDENTS_PROFILES);
  checkAndSeed(KEYS.MATERIALS, []);
  checkAndSeed(KEYS.REVIEWS, []);
  checkAndSeed(KEYS.ORDERS, []);
  checkAndSeed(KEYS.LEDGER, []);
  checkAndSeed(KEYS.PAYOUTS, []);
  checkAndSeed(KEYS.AD_CAMPAIGNS, AD_CAMPAIGNS);
  checkAndSeed(KEYS.SUBSCRIPTION_PLANS, SUBSCRIPTION_PLANS);
  checkAndSeed(KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
  checkAndSeed(KEYS.TICKETS, MOCK_TICKETS);
  checkAndSeed(KEYS.AUDIT_LOGS, [
    {
      id: "log-1",
      action: "system_init",
      details: "Demo database initialized and initial mock records seeded",
      userId: "system",
      userEmail: "system@eduvault.com",
      userRole: "admin",
      createdAt: new Date().toISOString(),
    }
  ]);

  const mockSyllabus: SyllabusItem[] = [
    {
      id: "syl-1",
      subject: "CS3351 Digital Principles and Computer Organisation",
      unit: "Unit I - Combinational Logic",
      topic: "Design of Logic Gates and Arithmetic Circuits",
      content: "Combinational Circuits: Analysis and design procedures, Half Adder, Full Adder, Half Subtractor, Full Subtractor, Binary Ripple Carry Adder, carry look-ahead adder, BCD Adder, Decoders, Encoders, Multiplexers, Demultiplexers. Synthesis using logic gates. Design of basic digital arithmetic logic unit (ALU). Minimization of boolean logic expressions using Karnaugh Maps (K-Maps) and Quine-McCluskey tabular reduction.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "syl-2",
      subject: "CS3491 Artificial Intelligence and Machine Learning",
      unit: "Unit II - Search Strategies",
      topic: "Uninformed and Informed Search Heuristics",
      content: "Problem-solving agents, formulation of search problems, search spaces. Uninformed Search Strategies: Breadth-First Search (BFS), Depth-First Search (DFS), Uniform Cost Search (UCS), Depth-Limited Search, Iterative Deepening DFS. Informed Search Strategies: Greedy Best-First Search, A* Search algorithm, admissibility and consistency of heuristics, heuristic function design, hill-climbing optimization, simulated annealing.",
      createdAt: new Date().toISOString(),
    }
  ];
  checkAndSeed(KEYS.SYLLABUS, mockSyllabus);
  checkAndSeed(KEYS.TEST_HISTORY, []);

  if (force) {
    localStorage.removeItem(KEYS.CURRENT_USER);
    localStorage.removeItem(KEYS.CART);
    localStorage.removeItem(KEYS.WISHLIST);
    // Seed default current user as student for demo ease
    const studentUser = MOCK_USERS.find(u => u.id === "usr-student-1");
    if (studentUser) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(studentUser));
    }
  } else if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    const studentUser = MOCK_USERS.find(u => u.id === "usr-student-1");
    if (studentUser) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(studentUser));
    }
  }
};

// Generic getters/setters
const get = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : fallback;
};

const set = <T>(key: string, data: T): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
};

// Entities
export const getUniversities = (): University[] => get(KEYS.UNIVERSITIES, []);
export const saveUniversities = (data: University[]) => set(KEYS.UNIVERSITIES, data);

export const getColleges = (): College[] => get(KEYS.COLLEGES, []);
export const saveColleges = (data: College[]) => set(KEYS.COLLEGES, data);

export const getCourses = (): Course[] => get(KEYS.COURSES, []);
export const saveCourses = (data: Course[]) => set(KEYS.COURSES, data);

export const getDepartments = (): Department[] => get(KEYS.DEPARTMENTS, []);
export const saveDepartments = (data: Department[]) => set(KEYS.DEPARTMENTS, data);

export const getRegulations = (): Regulation[] => get(KEYS.REGULATIONS, []);
export const saveRegulations = (data: Regulation[]) => set(KEYS.REGULATIONS, data);

export const getSemesters = (): Semester[] => get(KEYS.SEMESTERS, []);
export const getSubjects = (): Subject[] => get(KEYS.SUBJECTS, []);
export const saveSubjects = (data: Subject[]) => set(KEYS.SUBJECTS, data);

export const getUsers = (): User[] => get(KEYS.USERS, []);
export const saveUsers = (data: User[]) => set(KEYS.USERS, data);

export const getDealers = (): Dealer[] => get(KEYS.DEALERS, []);
export const saveDealers = (data: Dealer[]) => set(KEYS.DEALERS, data);

export const getStudentProfiles = (): Record<string, any> => get(KEYS.STUDENT_PROFILES, {});
export const saveStudentProfiles = (data: Record<string, any>) => set(KEYS.STUDENT_PROFILES, data);

export const getMaterials = (): Material[] => get(KEYS.MATERIALS, []);
export const saveMaterials = (data: Material[]) => set(KEYS.MATERIALS, data);

export const getReviews = (): Review[] => get(KEYS.REVIEWS, []);
export const saveReviews = (data: Review[]) => set(KEYS.REVIEWS, data);

export const getOrders = (): Order[] => get(KEYS.ORDERS, []);
export const saveOrders = (data: Order[]) => set(KEYS.ORDERS, data);

export const getLedger = (): LedgerEntry[] => get(KEYS.LEDGER, []);
export const saveLedger = (data: LedgerEntry[]) => set(KEYS.LEDGER, data);

export const getPayouts = (): Payout[] => get(KEYS.PAYOUTS, []);
export const savePayouts = (data: Payout[]) => set(KEYS.PAYOUTS, data);

export const getSubscriptionPlans = (): SubscriptionPlan[] => get(KEYS.SUBSCRIPTION_PLANS, []);
export const saveSubscriptionPlans = (data: SubscriptionPlan[]) => set(KEYS.SUBSCRIPTION_PLANS, data);

export const getAdCampaigns = (): AdCampaign[] => get(KEYS.AD_CAMPAIGNS, []);
export const saveAdCampaigns = (data: AdCampaign[]) => set(KEYS.AD_CAMPAIGNS, data);

export const getNotifications = (): Notification[] => get(KEYS.NOTIFICATIONS, []);
export const saveNotifications = (data: Notification[]) => set(KEYS.NOTIFICATIONS, data);

export const getTickets = (): SupportTicket[] => get(KEYS.TICKETS, []);
export const saveTickets = (data: SupportTicket[]) => set(KEYS.TICKETS, data);

// Active Session
export const getCurrentUser = (): User | null => get(KEYS.CURRENT_USER, null);
export const setCurrentUser = (user: User | null) => set(KEYS.CURRENT_USER, user);

// Cart
export const getCart = (): CartItem[] => get(KEYS.CART, []);
export const addToCart = (item: CartItem) => {
  const cart = getCart();
  if (!cart.find(c => c.id === item.id)) {
    cart.push(item);
    set(KEYS.CART, cart);
  }
};
export const removeFromCart = (id: string) => {
  const cart = getCart();
  const updated = cart.filter(c => c.id !== id);
  set(KEYS.CART, updated);
};
export const clearCart = () => set(KEYS.CART, []);

// Wishlist
export const getWishlist = (): string[] => get(KEYS.WISHLIST, []);
export const toggleWishlist = (id: string) => {
  const list = getWishlist();
  const index = list.indexOf(id);
  if (index > -1) {
    list.splice(index, 1);
  } else {
    list.push(id);
  }
  set(KEYS.WISHLIST, list);
};

export const getAuditLogs = (): AuditLog[] => get(KEYS.AUDIT_LOGS, []);
export const saveAuditLogs = (data: AuditLog[]) => set(KEYS.AUDIT_LOGS, data);

// Syllabus & Test History
export const getSyllabus = (): SyllabusItem[] => get(KEYS.SYLLABUS, []);
export const saveSyllabus = (data: SyllabusItem[]) => set(KEYS.SYLLABUS, data);
export const addSyllabus = (item: SyllabusItem) => {
  const list = getSyllabus();
  list.push(item);
  saveSyllabus(list);
};
export const deleteSyllabus = (id: string) => {
  const list = getSyllabus();
  const updated = list.filter(s => s.id !== id);
  saveSyllabus(updated);
};

export const getTestHistory = (): TestAttempt[] => get(KEYS.TEST_HISTORY, []);
export const saveTestHistory = (data: TestAttempt[]) => set(KEYS.TEST_HISTORY, data);
export const addTestAttempt = (item: TestAttempt) => {
  const list = getTestHistory();
  list.unshift(item); // Add newest first
  saveTestHistory(list);
};

// Utilities
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};
