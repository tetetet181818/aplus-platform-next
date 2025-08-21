import { create } from "zustand";
import supabase from "@/utils/Supabase-client";
import { toast } from "@/components/ui/use-toast";

export const useWithdrawalsStore = create((set, get) => ({
  loading: false,
  error: null,
  withdrawals: [],
  page: 1,
  pageSize: 10,
  totalPages: 1,
  totalCount: 0,
  totalCountPaid: 0,
  totalCountPending: 0,
  totalCountFailed: 0,
  singleWithdrawal: null,
  filters: {},

  // Set page and trigger data fetch
  setPage: async (page) => {
    const { getWithdrawals, filters } = get();
    const newPage = Math.max(1, parseInt(page) || 1);
    set({ page: newPage });
    await getWithdrawals(filters, newPage);
  },

  // Set filters and reset to page 1
  setFilters: async (newFilters) => {
    const { getWithdrawals } = get();
    set({ filters: newFilters, page: 1 });
    await getWithdrawals(newFilters, 1);
  },

  // Clear filters
  clearFilters: async () => {
    const { getWithdrawals } = get();
    set({ filters: {}, page: 1 });
    await getWithdrawals({}, 1);
  },

  clearError: () => set({ error: null }),

  createWithdrawalOrder: async (userData) => {
    try {
      if (!userData?.id) {
        throw new Error("User data is invalid");
      }

      set({ loading: true, error: null });

      const { data: withdrawalData, error: withdrawalError } = await supabase
        .from("withdrawals")
        .insert({
          user_id: userData.id,
          amount: userData.withdrawalAmount,
          status: "pending",
          bank_name: userData.bankName,
          iban: userData.iban,
          account_name: userData.accountHolderName,
        })
        .select()
        .single();

      if (withdrawalError) {
        throw new Error(
          `Withdrawal creation failed: ${withdrawalError.message}`
        );
      }

      const { data, error: userUpdateError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userData.id);
      const updatedWithdrawalCount = data[0].withdrawal_times - 1;
      const { error: updateUserError } = await supabase
        .from("users")
        .update({ withdrawal_times: updatedWithdrawalCount })
        .eq("id", userData.id);

      if (updateUserError) {
        throw new Error(`User update failed: ${updateUserError.message}`);
      }
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: userData.id,
          title: "تم انشاء طلب سحب",
          body: "تم انشاء طلب سحبك بنجاح وسوف يتم مراجعته من قبل الإدارة",
          type: "withdrawal",
        });

      if (notificationError) {
        console.error("Notification creation failed:", notificationError);
      }

      toast({
        title: "تم انشاء طلب سحبك بنجاح",
        variant: "success",
      });

      await get().getWithdrawals();

      return withdrawalData;
    } catch (error) {
      set({ loading: false, error: error.message });
      toast({
        title: "فشل في إنشاء طلب السحب",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteWithdrawalOrder: async ({ id }) => {
    set({ loading: true, error: null });
    try {
      const { data: withdrawal, error: fetchError } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from("withdrawals")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await supabase.from("notifications").insert({
        user_id: withdrawal.user_id,
        title: "تم حذف طلب سحب",
        body: "تم حذف طلب السحب الخاص بك",
        type: "withdrawal",
      });

      await get().getWithdrawals();
      set({ loading: false });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },

  acceptedWithdrawalOrder: async ({ id }) => {
    set({ loading: true, error: null });

    try {
      const { data: updatedWithdrawal, error: withdrawalError } = await supabase
        .from("withdrawals")
        .update({ status: "accepted" })
        .eq("id", id)
        .select("*")
        .single();

      if (withdrawalError) throw withdrawalError;

      const { data: notification, error: notificationError } = await supabase
        .from("notifications")
        .insert([
          {
            user_id: updatedWithdrawal.user_id,
            title: "طلب سحب مقبول",
            body: `تم قبول طلب سحبك بمبلغ ${updatedWithdrawal.amount} ريال`,
            type: "withdrawal",
          },
        ]);

      if (notificationError) {
        set({ loading: false });
        throw new Error(notificationError);
      }

      const { data, error } = await supabase.rpc("process_withdrawal", {
        p_withdrawal_id: id,
        p_status: "approved",
        p_admin_notes: "",
      });

      if (error) {
        set({ loading: false });
        throw new Error(error);
      }

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", updatedWithdrawal.user_id)
        .single();

      if (userError) {
        set({ loading: false });
        throw userError;
      }

      const updatedBalance = user.balance - updatedWithdrawal.amount;

      const { error: balanceUpdateError } = await supabase
        .from("users")
        .update({
          balance: updatedBalance,
          withdrawal_times: user.withdrawal_times - 1,
        })
        .eq("id", user.id);

      if (balanceUpdateError) throw balanceUpdateError;

      await get().getWithdrawals();

      set({ loading: false });
      return updatedWithdrawal;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      set({ loading: false, error: errorMessage });
      console.error("Error accepting withdrawal:", error);
      return null;
    }
  },

  rejectedWithdrawalOrder: async ({ id }) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("withdrawals")
        .update({ status: "rejected" })
        .eq("id", id)
        .select();

      if (error) throw error;

      const { data: withdrawal, error: fetchError } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      await supabase.from("notifications").insert({
        user_id: withdrawal.user_id,
        title: "طلب سحب مرفوض",
        body: "تم رفض طلب السحب الخاص بك",
        type: "withdrawal",
      });

      const { data: rejectedWithdrawal, error: rejectedWithdrawalError } =
        await supabase.rpc("process_withdrawal", {
          p_withdrawal_id: id,
          p_status: "rejected",
          p_admin_notes: "",
        });

      if (rejectedWithdrawalError) {
        throw new Error(rejectedWithdrawalError);
      }

      await get().getWithdrawals();
      set({ loading: false });
      return data;
    } catch (error) {
      set({ loading: false, error: error.message });
      return null;
    }
  },

  getWithdrawals: async (filters = {}, pageOverride = null) => {
    const { page: currentPage = 1, pageSize = 10 } = get();

    // Use override page if provided, otherwise use current state page
    const targetPage = pageOverride !== null ? pageOverride : currentPage;

    set({ loading: true, error: null });

    try {
      // Validate inputs
      const page = Math.max(1, parseInt(targetPage) || 1);
      const itemsPerPage = Math.max(1, parseInt(pageSize) || 10);
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // Base query for counting total filtered records
      let countQuery = supabase
        .from("withdrawals")
        .select("id", { count: "exact", head: true });

      // Base query for fetching paginated data
      let dataQuery = supabase
        .from("withdrawals")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

      // Apply filters to both queries
      if (filters.search && typeof filters.search === "string") {
        const searchTerm = filters.search.trim();
        if (searchTerm) {
          const searchFilter = `account_name.ilike.%${searchTerm}%,bank_name.ilike.%${searchTerm}%,iban.ilike.%${searchTerm}%`;
          countQuery = countQuery.or(searchFilter);
          dataQuery = dataQuery.or(searchFilter);
        }
      }

      if (filters.status && typeof filters.status === "string") {
        countQuery = countQuery.eq("status", filters.status);
        dataQuery = dataQuery.eq("status", filters.status);
      }

      if (filters.date_from && typeof filters.date_from === "string") {
        try {
          new Date(filters.date_from); // Validate date
          countQuery = countQuery.gte("created_at", filters.date_from);
          dataQuery = dataQuery.gte("created_at", filters.date_from);
        } catch {
          console.warn("Invalid date_from format");
        }
      }

      if (filters.date_to && typeof filters.date_to === "string") {
        try {
          const endDate = new Date(filters.date_to);
          if (!isNaN(endDate)) {
            endDate.setHours(23, 59, 59, 999);
            countQuery = countQuery.lte("created_at", endDate.toISOString());
            dataQuery = dataQuery.lte("created_at", endDate.toISOString());
          }
        } catch {
          console.warn("Invalid date_to format");
        }
      }

      // Execute queries in parallel
      const [{ count, error: countError }, { data, error: dataError }] =
        await Promise.all([countQuery, dataQuery]);

      if (countError)
        throw new Error(`Count query error: ${countError.message}`);
      if (dataError) throw new Error(`Data query error: ${dataError.message}`);

      // Get status counts
      const getStatusCount = async (status) => {
        let statusQuery = supabase
          .from("withdrawals")
          .select("id", { count: "exact", head: true })
          .eq("status", status);

        if (filters.search && typeof filters.search === "string") {
          const searchTerm = filters.search.trim();
          if (searchTerm) {
            statusQuery = statusQuery.or(
              `account_name.ilike.%${searchTerm}%,bank_name.ilike.%${searchTerm}%,iban.ilike.%${searchTerm}%`
            );
          }
        }

        if (filters.date_from && typeof filters.date_from === "string") {
          try {
            new Date(filters.date_from);
            statusQuery = statusQuery.gte("created_at", filters.date_from);
          } catch {
            console.warn("Invalid date_from format in status count");
          }
        }

        if (filters.date_to && typeof filters.date_to === "string") {
          try {
            const endDate = new Date(filters.date_to);
            if (!isNaN(endDate)) {
              endDate.setHours(23, 59, 59, 999);
              statusQuery = statusQuery.lte(
                "created_at",
                endDate.toISOString()
              );
            }
          } catch {
            console.warn("Invalid date_to format in status count");
          }
        }

        const { count, error } = await statusQuery;
        if (error) throw new Error(`Status count error: ${error.message}`);
        return count || 0;
      };

      const [acceptedCount, pendingCount, rejectedCount] = await Promise.all([
        getStatusCount("accepted").catch((err) => {
          console.warn(`Failed to get accepted count: ${err.message}`);
          return 0;
        }),
        getStatusCount("pending").catch((err) => {
          console.warn(`Failed to get pending count: ${err.message}`);
          return 0;
        }),
        getStatusCount("rejected").catch((err) => {
          console.warn(`Failed to get rejected count: ${err.message}`);
          return 0;
        }),
      ]);

      // Calculate total pages based on filtered count
      const totalPages = Math.ceil((count || 0) / itemsPerPage);

      // Ensure page doesn't exceed total pages
      const adjustedPage = Math.min(page, Math.max(1, totalPages));

      set({
        loading: false,
        withdrawals: data || [],
        totalPages,
        totalCount: count || 0,
        totalCountPaid: acceptedCount,
        totalCountPending: pendingCount,
        totalCountFailed: rejectedCount,
        page: adjustedPage,
        pageSize: itemsPerPage,
        filters: filters,
      });

      return data || [];
    } catch (error) {
      console.error("Error in getWithdrawals:", error.message);
      set({
        loading: false,
        error: error.message,
        withdrawals: [],
        totalPages: 0,
        totalCount: 0,
        totalCountPaid: 0,
        totalCountPending: 0,
        totalCountFailed: 0,
        page: 1,
      });
      return [];
    }
  },

  updateWithdrawalNotes: async (payload) => {
    try {
      set({ loading: true });

      const { data, error } = await supabase
        .from("withdrawals")
        .update({ admin_notes: payload.admin_notes })
        .eq("id", payload.id)
        .select();

      if (error) throw error;

      set((state) => ({
        withdrawals: state.withdrawals.map((w) =>
          w.id === payload.id ? { ...w, admin_notes: payload.admin_notes } : w
        ),
        loading: false,
      }));

      return data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  getWithdrawalById: async ({ userId }) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      set({ loading: false });
      return data;
    } catch (error) {
      set({ loading: false, error: error.message });
      return null;
    }
  },
  resetWithdrawalTimes: async ({ userId }) => {
    const { data, error } = await supabase
      .from("users")
      .update({ withdrawal_times: 2 })
      .eq("id", userId);
    if (error) throw error;
  },
  addRoutingDetails: async ({ withdrawalId, routing_number, routing_date }) => {
    const { data, error } = await supabase
      .from("withdrawals")
      .update({ routing_number, routing_date })
      .eq("id", withdrawalId);
    if (error) throw error;
    await get().getWithdrawals();
    return data;
  },
  getWithdrawalStats: async () => {
    set({ loading: true, statsError: null });
    try {
      // Queries
      const { count: totalCount, error: countError } = await supabase
        .from("withdrawals")
        .select("*", { count: "exact", head: true });
      if (countError) throw countError;

      const { count: totalPaid, error: totalPaidError } = await supabase
        .from("withdrawals")
        .select("*", { count: "exact", head: true })
        .eq("status", "accepted");
      if (totalPaidError) throw totalPaidError;

      const { count: totalPending, error: totalPendingError } = await supabase
        .from("withdrawals")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      if (totalPendingError) throw totalPendingError;

      const { count: totalRejected, error: totalRejectedError } = await supabase
        .from("withdrawals")
        .select("*", { count: "exact", head: true })
        .eq("status", "rejected");
      if (totalRejectedError) throw totalRejectedError;

      set({
        totalCount: totalCount || 0,
        totalCountPaid: totalPaid || 0,
        totalCountPending: totalPending || 0,
        totalCountFailed: totalRejected || 0,
        loading: false,
      });

      return {
        totalCount: totalCount || 0,
        totalCountPaid: totalPaid || 0,
        totalCountPending: totalPending || 0,
        totalCountFailed: totalRejected || 0,
      };
    } catch (error) {
      console.error("Error fetching stats:", error.message);
      set({ loading: false, statsError: error.message });
      return null;
    }
  },
  getSingleWithdrawal: async ({ id }) => {
    set({ loading: true, error: null });
    try {
      // Get withdrawal by ID
      const { data: withdrawal, error: withdrawalError } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("id", id)
        .single();

      if (withdrawalError) throw withdrawalError;

      // Get related user
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", withdrawal.user_id)
        .single();

      if (userError) throw userError;

      const result = {
        ...withdrawal,
        user,
      };

      set({ loading: false, singleWithdrawal: result });

      return result;
    } catch (error) {
      console.error("Error in getSingleWithdrawal:", error.message);
      set({ loading: false, error: error.message });
      return null;
    }
  },
  getUserWithdrawalsHistory: async ({ userId }) => {
    try {
      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
}));
