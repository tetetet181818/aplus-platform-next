import { create } from "zustand";
import supabase from "@/utils/Supabase-client.js";
import { toast } from "@/components/ui/use-toast";

export const useSalesStore = create((set, get) => ({
  loading: false,
  error: null,
  sales: [],
  totalSales: 0,
  currentPage: 1,
  itemsPerPage: 10,
  totalAmount: 0,
  platformProfit: 0,
  growthRate: 0,
  monthlySales: [],
  singleSale: null,
  setLoading: (loading) => set(() => ({ loading })),

  setCurrentPage: (page) => set(() => ({ currentPage: page })),

  setItemsPerPage: (itemsPerPage) => set(() => ({ itemsPerPage })),

  handleError: (error, customMessage = null) => {
    const message = customMessage || error?.message || "حدث خطأ غير متوقع";
    console.error(message, error);
    toast({
      title: "خطأ",
      description: message,
      variant: "destructive",
    });
    set({ loading: false, error: message });
    return null;
  },

  getSales: async (
    page = 1,
    itemsPerPage = 10,
    filters = {},
    sortConfig = { key: "created_at", direction: "desc" }
  ) => {
    set({ loading: true, error: null });
    try {
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase.from("sales").select("*", { count: "exact" });

      query = query.order(sortConfig.key, {
        ascending: sortConfig.direction === "asc",
      });

      if (filters.id) {
        query = query.eq("id", filters.id);
      }

      if (filters.invoice_id) {
        query = query.eq("invoice_id", filters.invoice_id);
      }

      if (filters.user_name) {
        query = query.ilike("user_name", `%${filters.user_name}%`);
      }

      if (filters.note_title) {
        query = query.ilike("note_title", `%${filters.note_title}%`);
      }

      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters.date) {
        const startOfDay = new Date(filters.date);
        const endOfDay = new Date(filters.date);
        endOfDay.setHours(23, 59, 59, 999);

        query = query
          .gte("created_at", startOfDay.toISOString())
          .lte("created_at", endOfDay.toISOString());
      }

      const { data, count, error } = await query.range(from, to);
      if (error) throw error;

      set({
        sales: data || [],
        totalSales: count || 0,
        currentPage: page,
        itemsPerPage,
        loading: false,
        error: null,
      });

      return {
        data,
        totalItems: count,
        totalPages: Math.ceil(count / itemsPerPage),
      };
    } catch (error) {
      const errorMessage = error.message || "خطأ غير معروف";
      set({
        loading: false,
        error: errorMessage,
        sales: [],
        totalSales: 0,
      });

      // Also show toast notification
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        data: [],
        totalItems: 0,
        totalPages: 0,
      };
    }
  },
  getTotalSalesAmount: async () => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from("sales")
        .select("amount")
        .eq("status", "completed");

      if (error) throw error;

      const totalAmount = data.reduce((acc, sale) => acc + sale.amount, 0);
      const platformProfit = totalAmount * 0.15;

      set({ totalAmount, platformProfit, loading: false });
      return { totalAmount, platformProfit };
    } catch (error) {
      return get().handleError(error, "فشل في جلب إجمالي المبيعات");
    }
  },

  getMonthlyGrowthRate: async () => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase.rpc("get_sales_growth_rate");
      if (error) throw error;

      const growthRate = data?.[0]?.growth_rate || 0;
      set({ growthRate, loading: false });
      return growthRate;
    } catch (error) {
      return get().handleError(error, "فشل في جلب معدل النمو الشهري");
    }
  },

  getMonthlySales: async () => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase.rpc("get_monthly_sales");
      if (error) throw error;

      set({ monthlySales: data || [], loading: false });
      return data;
    } catch (error) {
      return get().handleError(error, "فشل في جلب توزيع المبيعات الشهرية");
    }
  },

  getSalesStatistics: async () => {
    try {
      set({ loading: true, error: null });

      const [totalAmountResult, growthRateResult, monthlySalesResult] =
        await Promise.all([
          get().getTotalSalesAmount(),
          get().getMonthlyGrowthRate(),
          get().getMonthlySales(),
        ]);

      set({ loading: false });

      return {
        totalAmount: totalAmountResult?.totalAmount || 0,
        platformProfit: totalAmountResult?.platformProfit || 0,
        growthRate: growthRateResult || 0,
        monthlySales: monthlySalesResult || [],
      };
    } catch (error) {
      return get().handleError(error, "فشل في جلب إحصائيات المبيعات");
    }
  },

  getUserSales: async (userId) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from("sales")
        .select("*, files:note_id(title)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({ sales: data || [], loading: false });
      return data;
    } catch (error) {
      return get().handleError(error, "فشل في جلب مبيعات المستخدم");
    }
  },

  getNoteSales: async (noteId) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from("sales")
        .select("*, users:user_id(full_name)")
        .eq("note_id", noteId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({ sales: data || [], loading: false });
      return data;
    } catch (error) {
      return get().handleError(error, "فشل في جلب مبيعات الدورة");
    }
  },

  createSale: async (saleData) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from("sales")
        .insert([saleData])
        .select();

      if (error) throw error;

      await get().getSalesStatistics();

      await supabase.from("notifications").insert({
        user_id: saleData.user_id,
        title: "تم تسجيل عملية بيع جديدة",
        body: `تم تسجيل عملية بيع جديدة للملخص "${saleData.note_title}"`,
        type: "sale",
      });

      toast({
        title: "تم تسجيل البيع بنجاح",
        variant: "success",
      });

      set({ loading: false });
      return data?.[0];
    } catch (error) {
      return get().handleError(error, "فشل في إنشاء سجل بيع جديد");
    }
  },

  updateSaleStatus: async (saleId, status) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from("sales")
        .update({ status })
        .eq("id", saleId)
        .select();

      if (error) throw error;

      await get().getSales(get().currentPage, get().itemsPerPage);

      await supabase.from("notifications").insert({
        user_id: data?.[0]?.user_id,
        title: "تم تحديث حالة البيع",
        body: `تم تحديث حالة بيع الملخص "${data?.[0]?.note_title}" إلى ${status}`,
        type: "sale",
      });

      toast({
        title: "تم تحديث حالة البيع",
        variant: "success",
      });

      set({ loading: false });
      return data?.[0];
    } catch (error) {
      return get().handleError(error, "فشل في تحديث حالة البيع");
    }
  },
  getDetailsOfSales: async ({ salesId }) => {
    try {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .eq("id", salesId)
        .single();
      if (error) throw new Error(error.message);
      set({ singleSale: data });
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  },
  clearError: () => set({ error: null }),
}));
