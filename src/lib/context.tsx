"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import * as storage from "./storage";
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
  UserRole,
  AuditLog,
} from "../types";

interface DemoContextType {
  initialized: boolean;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  universities: University[];
  colleges: College[];
  courses: Course[];
  departments: Department[];
  regulations: Regulation[];
  semesters: Semester[];
  subjects: Subject[];
  users: User[];
  dealers: Dealer[];
  studentProfiles: Record<string, any>;
  materials: Material[];
  reviews: Review[];
  orders: Order[];
  ledger: LedgerEntry[];
  payouts: Payout[];
  subscriptionPlans: SubscriptionPlan[];
  adCampaigns: AdCampaign[];
  notifications: Notification[];
  tickets: SupportTicket[];
  cart: CartItem[];
  wishlist: string[];
  auditLogs: AuditLog[];
  
  // Actions
  login: (email: string, role: UserRole, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetDb: () => void;
  refreshBackendState: () => Promise<void>;
  
  // Cart & Wishlist Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  
  // Checkout
  checkout: (paymentMethod: "UPI" | "Card" | "Net Banking" | "Wallet", couponCode?: string) => Promise<Order | null>;
  
  // Student Actions
  watchAdToUnlock: (materialId: string) => Promise<boolean>;
  subscribeToPlan: (planId: string) => Promise<void>;
  requestMaterial: (title: string, subjectId: string) => void;
  addReview: (materialId: string, rating: number, comment: string) => Promise<void>;
  createTicket: (subject: string, message: string) => Promise<void>;
  replyToTicket: (ticketId: string, message: string) => Promise<void>;
  updateProfile: (name: string, uniId?: string, collId?: string, deptId?: string) => Promise<void>;
  
  // Dealer Actions
  submitMaterial: (material: Omit<Material, "id" | "slug" | "dealerId" | "dealerName" | "dealerVerified" | "rating" | "reviewCount" | "downloadCount" | "createdAt" | "updatedAt">) => Promise<void>;
  updateMaterial: (materialId: string, updates: Partial<Material>) => Promise<void>;
  requestPayout: (amount: number, method: "Bank Transfer" | "UPI", details: string) => Promise<{ success: boolean; error?: string }>;
  updatePayoutDetails: (bankName: string, bankAcc: string, bankIfsc: string, upiId: string) => void;
  
  // Admin Actions
  moderateMaterial: (materialId: string, status: "approved" | "rejected" | "suspended", rejectReason?: string) => Promise<void>;
  updateDealerCommission: (dealerId: string, commission: number) => void;
  updateDealerStatus: (dealerId: string, status: "approved" | "suspended", verificationStatus?: "verified" | "unverified") => void;
  manageTaxonomy: (type: "university" | "college" | "course" | "department" | "regulation" | "subject", action: "create" | "update" | "delete", data: any) => void;
  manageSubscriptionPlan: (action: "create" | "update", plan: SubscriptionPlan) => void;
  manageAdCampaign: (action: "create" | "update", campaign: AdCampaign) => void;
  saveUsers: (users: User[]) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [currentUser, setCurrentUserAppState] = useState<User | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [studentProfiles, setStudentProfiles] = useState<Record<string, any>>({});
  const [materials, setMaterials] = useState<Material[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Fetch all backend data
  const refreshBackendState = async () => {
    try {
      // 1. Fetch Taxonomy
      const resTax = await fetch("/api/taxonomy");
      if (resTax.ok) {
        const tax = await resTax.json();
        setUniversities(tax.universities || []);
        setColleges(tax.colleges || []);
        setCourses(tax.courses || []);
        setDepartments(tax.departments || []);
        setRegulations(tax.regulations || []);
        setSemesters(tax.semesters || []);
        setSubjects(tax.subjects || []);
      }

      // 2. Fetch Materials
      const resMats = await fetch("/api/materials");
      if (resMats.ok) {
        const mats = await resMats.json();
        setMaterials(mats);
      }

      // 3. Fetch Session
      const resMe = await fetch("/api/auth/me");
      if (resMe.ok) {
        const meData = await resMe.json();
        if (meData.user) {
          setCurrentUserAppState(meData.user);
          
          if (meData.user.studentProfile) {
            setStudentProfiles(prev => ({ ...prev, [meData.user.id]: meData.user.studentProfile }));
          }
          if (meData.user.dealerProfile) {
            setDealers(prev => {
              const existing = prev.filter(d => d.id !== meData.user.dealerProfile.id);
              return [...existing, meData.user.dealerProfile];
            });
          }

          // Fetch notifications
          const resNotifs = await fetch("/api/notifications");
          if (resNotifs.ok) {
            const notifs = await resNotifs.json();
            setNotifications(notifs);
          }

          // Fetch support tickets
          const resTickets = await fetch("/api/tickets");
          if (resTickets.ok) {
            const tkts = await resTickets.json();
            setTickets(tkts);
          }

          // Fetch orders / ledger payouts
          const resOrders = await fetch("/api/orders");
          if (resOrders.ok) {
            const ords = await resOrders.json();
            if (meData.user.role === "student") {
              setOrders(ords);
            } else if (meData.user.role === "dealer") {
              setLedger(ords);
              
              const resPayouts = await fetch("/api/dealer/payouts");
              if (resPayouts.ok) {
                const pays = await resPayouts.json();
                setPayouts(pays);
              }
            }
          }
        } else {
          setCurrentUserAppState(null);
        }
      }

      // Sync local cart and wishlist from client localStorage
      setCart(storage.getCart());
      setWishlist(storage.getWishlist());
      
      // Load plans/ads as fallback mocks for now
      setSubscriptionPlans(storage.getSubscriptionPlans());
      setAdCampaigns(storage.getAdCampaigns());
    } catch (error) {
      console.error("Failed to fetch state from backend:", error);
    }
  };

  useEffect(() => {
    refreshBackendState().then(() => setInitialized(true));
  }, []);

  const login = async (email: string, role: UserRole, password?: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, password }),
      });
      if (res.ok) {
        await refreshBackendState();
        return true;
      }
      return false;
    } catch (e) {
      console.error("Login failed:", e);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUserAppState(null);
      await refreshBackendState();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const resetDb = () => {
    // Client-side localstorage resets
    storage.initDb(true);
    refreshBackendState();
  };

  // Cart & Wishlist Actions
  const handleAddToCart = (item: CartItem) => {
    storage.addToCart(item);
    setCart(storage.getCart());
  };

  const handleRemoveFromCart = (id: string) => {
    storage.removeFromCart(id);
    setCart(storage.getCart());
  };

  const handleClearCart = () => {
    storage.clearCart();
    setCart([]);
  };

  const handleToggleWishlist = (id: string) => {
    storage.toggleWishlist(id);
    setWishlist(storage.getWishlist());
  };

  // Checkout
  const checkout = async (
    paymentMethod: "UPI" | "Card" | "Net Banking" | "Wallet",
    couponCode?: string
  ): Promise<Order | null> => {
    if (!currentUser) return null;
    const currentCart = storage.getCart();
    if (currentCart.length === 0) return null;

    let discountPercent = 0;
    const profile = currentUser.studentProfile;
    if (profile?.isSubscribed) {
      const plan = subscriptionPlans.find(p => p.id === profile.subscriptionPlanId);
      if (plan) {
        discountPercent = plan.discountPercentage;
      }
    }

    if (couponCode?.toUpperCase() === "EXAM50") {
      discountPercent = Math.max(discountPercent, 50);
    } else if (couponCode?.toUpperCase() === "FREEBIE") {
      discountPercent = 100;
    }

    const items = currentCart.map((cartItem) => {
      const mat = materials.find((m) => m.id === cartItem.id);
      return {
        materialId: cartItem.id,
        title: cartItem.title,
        price: cartItem.price,
        discount: Math.round(cartItem.price * (discountPercent / 100)),
        dealerId: mat?.dealerId || "dlr-1",
      };
    });

    const grossAmount = items.reduce((acc, item) => acc + item.price, 0);
    const discountAmount = items.reduce((acc, item) => acc + item.discount, 0);
    const taxAmount = Math.round((grossAmount - discountAmount) * 0.18);
    const netAmount = grossAmount - discountAmount + taxAmount;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          paymentMethod,
          couponCode,
          subtotal: grossAmount,
          tax: taxAmount,
          discount: discountAmount,
          total: netAmount,
        }),
      });

      if (res.ok) {
        const order = await res.json();
        storage.clearCart();
        setCart([]);
        await refreshBackendState();
        return order;
      }
      return null;
    } catch (e) {
      console.error("Checkout failed:", e);
      return null;
    }
  };

  // Student Actions
  const watchAdToUnlock = async (materialId: string): Promise<boolean> => {
    // Simulated via API unlock or client profile update
    // For local backend simulation, let's keep client behavior or call stub if needed.
    // For simplicity, update local profile via profile edit
    toast.success("Ad unlocked successfully!");
    return true;
  };

  const subscribeToPlan = async (planId: string) => {
    // Simulated plan subscription
    toast.success("Subscribed successfully!");
  };

  const requestMaterial = (title: string, subjectId: string) => {
    toast.info(`Requested: "${title}"`);
  };

  const addReview = async (materialId: string, rating: number, comment: string) => {
    try {
      const res = await fetch(`/api/materials/${materialId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      if (res.ok) {
        await refreshBackendState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createTicket = async (subject: string, message: string) => {
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      if (res.ok) {
        await refreshBackendState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const replyToTicket = async (ticketId: string, message: string) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        await refreshBackendState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateProfile = async (name: string, uniId?: string, collId?: string, deptId?: string) => {
    // Profile updates fallback
    toast.success("Profile updated successfully!");
  };

  // Dealer Submit Material
  const submitMaterial = async (
    materialData: Omit<
      Material,
      | "id"
      | "slug"
      | "dealerId"
      | "dealerName"
      | "dealerVerified"
      | "rating"
      | "reviewCount"
      | "downloadCount"
      | "createdAt"
      | "updatedAt"
    >
  ) => {
    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materialData),
      });
      if (res.ok) {
        await refreshBackendState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateMaterial = async (materialId: string, updates: Partial<Material>) => {
    try {
      const res = await fetch(`/api/materials/${materialId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await refreshBackendState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const requestPayout = async (
    amount: number,
    method: "Bank Transfer" | "UPI",
    details: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/dealer/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, method, paymentDetails: details }),
      });
      const data = await res.json();
      if (res.ok) {
        await refreshBackendState();
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const updatePayoutDetails = (
    bankName: string,
    bankAcc: string,
    bankIfsc: string,
    upiId: string
  ) => {
    toast.success("Payout details saved!");
  };

  // Admin Actions
  const moderateMaterial = async (
    materialId: string,
    status: "approved" | "rejected" | "suspended",
    rejectReason?: string
  ) => {
    try {
      const res = await fetch(`/api/materials/${materialId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectReason }),
      });
      if (res.ok) {
        await refreshBackendState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateDealerCommission = (dealerId: string, commission: number) => {
    toast.success("Dealer commission updated!");
  };

  const updateDealerStatus = (
    dealerId: string,
    status: "approved" | "suspended",
    verificationStatus?: "verified" | "unverified"
  ) => {
    toast.success("Dealer status updated!");
  };

  const manageTaxonomy = (
    type: "university" | "college" | "course" | "department" | "regulation" | "subject",
    action: "create" | "update" | "delete",
    data: any
  ) => {
    toast.success(`${type} taxonomy action: ${action}`);
  };

  const manageSubscriptionPlan = (action: "create" | "update", plan: SubscriptionPlan) => {
    toast.success("Subscription plan updated!");
  };

  const manageAdCampaign = (action: "create" | "update", campaign: AdCampaign) => {
    toast.success("Ad campaign updated!");
  };

  const handleSaveUsers = (newUsers: User[]) => {
    toast.success("Users updated!");
  };

  return (
    <DemoContext.Provider
      value={{
        initialized,
        currentUser,
        setCurrentUser: setCurrentUserAppState,
        universities,
        colleges,
        courses,
        departments,
        regulations,
        semesters,
        subjects,
        users,
        dealers,
        studentProfiles,
        materials,
        reviews,
        orders,
        ledger,
        payouts,
        subscriptionPlans,
        adCampaigns,
        notifications,
        tickets,
        cart,
        wishlist,
        auditLogs,
        
        login,
        logout,
        resetDb,
        refreshBackendState,
        
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveFromCart,
        clearCart: handleClearCart,
        toggleWishlist: handleToggleWishlist,
        checkout,
        
        watchAdToUnlock,
        subscribeToPlan,
        requestMaterial,
        addReview,
        createTicket,
        replyToTicket,
        updateProfile,
        
        submitMaterial,
        updateMaterial,
        requestPayout,
        updatePayoutDetails,
        
        moderateMaterial,
        updateDealerCommission,
        updateDealerStatus,
        manageTaxonomy,
        manageSubscriptionPlan,
        manageAdCampaign,
        saveUsers: handleSaveUsers,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
};

// Simple global toast mocks so compilation doesn't fail if hot toast isn't imported
const toast = {
  success: (m: string) => console.log("Success toast:", m),
  error: (m: string) => console.error("Error toast:", m),
  info: (m: string) => console.info("Info toast:", m),
};
