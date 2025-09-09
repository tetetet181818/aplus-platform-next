import { create } from "zustand";
import supabase from "@/utils/Supabase-client.js";
export const useAuthStore = create((set, get) => ({
  user: null,
  seller: null,
  users: [],
  loading: false,
  error: null,
  loadingWithGoogle: false,
  loadingForgetPassword: false,
  resetPasswordLoading: false,
  likeLoading: false,
  likedListLoading: false,
  isAuthenticated: false,
  totalUsers: 0,
  growthRate: 0,
  currentPage: 1,
  itemsPerPage: 10,
  likedNotes: [],
  notifications: [],
  notificationsLoading: false,
  unread: [],
  handleError: (error, customMessage = null) => {
    console.log(error?.message);
    const message = customMessage || error.message || "حدث خطأ غير متوقع";
    set({ loading: false, error: message });
    return null;
  },

  getUser: async () => {
    try {
      set({ loading: true });

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) throw authError || new Error("User not found");

      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({ full_name: user.user_metadata?.name })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      set({
        user: updatedUser,
        loading: false,
        isAuthenticated: true,
      });

      return updatedUser;
    } catch (error) {
      console.error("getUser error:", error);
      set({
        loading: false,
        isAuthenticated: false,
        user: null,
      });
      return null;
    }
  },

  login: async ({ email, password }) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: userData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError) throw profileError;

      set({
        user: userData,
        loading: false,
        isAuthenticated: true,
      });

      await supabase.from("notifications").insert({
        user_id: userData.id,
        title: "تم تسجيل الدخول بنجاح",
        body: `مرحباً ${userData.full_name || ""}`,
        type: "auth",
      });

      return userData;
    } catch (error) {
      return get().handleError(error, "برجاء التحقق من بيانات الدخول");
    }
  },

  register: async ({ email, password, full_name, university }) => {
    try {
      set({ loading: true, error: null });

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            university,
          },
        },
      });

      if (authError) {
        const errorMessages = {
          "User already registered": "هذا البريد الإلكتروني مسجل بالفعل",
          "rate limit": "لقد حاولت التسجيل مرات كثيرة، يرجى الانتظار قليلاً",
          password: "كلمة المرور غير صالحة",
          email: "البريد الإلكتروني غير صالح",
        };

        const friendlyMessage =
          Object.entries(errorMessages).find(([key]) =>
            authError.message.toLowerCase().includes(key.toLowerCase())
          )?.[1] || authError.message;

        throw new Error(friendlyMessage);
      }

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .update([
          {
            id: authData.user.id,
            email,
            full_name,
            university,
            created_at: new Date().toISOString(),
          },
        ])
        .eq("id", authData.user.id)
        .select()
        .single();

      if (profileError) {
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (deleteError) {
          console.error("Failed to cleanup user:", deleteError);
        }
        throw profileError;
      }

      await supabase.from("notifications").insert({
        user_id: authData.user.id,
        title: "تم التسجيل بنجاح",
        body: "تم إنشاء حسابك بنجاح. يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب",
        type: "auth",
      });

      if (!authData.user?.email_confirmed_at) {
        set({
          user: null,
          loading: false,
          isAuthenticated: false,
        });
        return {
          needsVerification: true,
          userId: authData.user.id,
        };
      }
    } catch (error) {
      return get().handleError(error);
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      let { error } = await supabase.auth.signOut();

      if (error) throw error;
      set({
        user: null,
        loading: false,
        isAuthenticated: false,
        error: null,
      });
      window.location.reload();
    } catch (error) {
      return get().handleError(error);
    }
  },

  forgetPassword: async ({ email }) => {
    try {
      set({ loadingForgetPassword: true });
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) throw error;

      await supabase.from("notifications").insert({
        user_id: data.user.id,
        title: "تم إرسال رابط إعادة التعيين",
        body: "تم إرسال رابط لإعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
        type: "auth",
      });

      return data;
    } catch (error) {
      return get().handleError(error, "فشل في إرسال رابط إعادة التعيين");
    } finally {
      set({ loadingForgetPassword: false });
    }
  },

  resetPassword: async ({ password }) => {
    try {
      set({ resetPasswordLoading: true });
      const { data, error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      await supabase.from("notifications").insert({
        user_id: data.user.id,
        title: "تم تغيير كلمة المرور بنجاح",
        body: "تم تغيير كلمة المرور الخاصة بحسابك بنجاح",
        type: "auth",
      });
      window.location.href = "/";
      return data;
    } catch (error) {
      return get().handleError(error, "فشل في تغيير كلمة المرور");
    } finally {
      set({ resetPasswordLoading: false });
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ loadingWithGoogle: true });
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `https://aplusplatformsa.com`,
        },
      });

      if (error) throw error;
    } catch (error) {
      return get().handleError(error, "فشل في تسجيل الدخول باستخدام جوجل");
    } finally {
      set({ loadingWithGoogle: false });
    }
  },

  deleteAccount: async () => {
    try {
      set({ loading: true });

      const { user } = get();
      if (!user) throw new Error("المستخدم غير مسجل الدخول");

      const { error: profileError } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);

      if (profileError) throw profileError;

      const { error: authError } = await supabase.auth.admin.deleteUser(
        user.id
      );
      if (authError) throw authError;

      if (user.avatar) {
        const avatarPath = user.avatar.split("/").pop();
        await supabase.storage.from("avatars").remove([avatarPath]);
      }

      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "تم حذف الحساب",
        body: "تم حذف حسابك بنجاح",
        type: "auth",
      });

      set({
        user: null,
        loading: false,
        isAuthenticated: false,
      });

      return true;
    } catch (error) {
      return get().handleError(error, "فشل في حذف الحساب");
    }
  },

  getUserById: async ({ id }) => {
    try {
      set({ loading: true });

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id);

      if (error) throw error;

      set({
        seller: data[0],
        loading: false,
      });

      return data[0];
    } catch (error) {
      return get().handleError(error, "فشل في جلب بيانات المستخدم");
    }
  },
  getAllUsers: async ({
    page = 1,
    itemsPerPage = 10,
    date = null,
    university = null,
  } = {}) => {
    try {
      set({ loading: true });

      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from("users")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        query = query
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString());
      }

      if (university) {
        query = query.eq("university", university);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      set({
        users: data || [],
        totalUsers: count || 0,
        currentPage: page,
        itemsPerPage,
        loading: false,
      });

      return {
        data,
        totalItems: count,
        totalPages: Math.ceil(count / itemsPerPage),
      };
    } catch (error) {
      return get().handleError(error, "فشل في جلب قائمة المستخدمين");
    }
  },

  getUniversities: async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("university")
        .not("university", "is", null)
        .order("university", { ascending: true });

      if (error) throw error;

      const uniqueUniversities = [
        ...new Set(data.map((item) => item.university)),
      ];
      return uniqueUniversities;
    } catch (error) {
      return get().handleError(error, "فشل في جلب قائمة الجامعات");
    }
  },

  getUsersCount: async () => {
    try {
      set({ loading: true });
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      if (error) throw error;

      set({ loading: false, totalUsers: count || 0 });
      return count || 0;
    } catch (error) {
      return get().handleError(error, "فشل في جلب عدد المستخدمين");
    }
  },

  getUsersMonthlyGrowth: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.rpc("get_users_monthly_growth");

      if (error) throw error;

      const growthRate = data?.growth_rate || 0;
      set({ growthRate, loading: false });
      return growthRate;
    } catch (error) {
      return get().handleError(error, "فشل في حساب معدل النمو");
    }
  },

  deleteUserById: async ({ id }) => {
    try {
      set({ loading: true });

      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) throw authError;

      const { error } = await supabase.from("users").delete().eq("id", id);
      if (error) throw error;

      await get().getAllUsers(get().currentPage, get().itemsPerPage);

      await supabase.from("notifications").insert({
        user_id: id,
        title: "تم حذف المستخدم",
        body: "تم حذف حسابك من قبل الإدارة",
        type: "system",
      });

      return true;
    } catch (error) {
      return get().handleError(error, "فشل في حذف المستخدم");
    }
  },

  updateUserInfo: async ({ full_name, email, university, id }) => {
    try {
      set({ loading: true });

      const { data, error } = await supabase
        .from("users")
        .update({
          full_name,
          email,
          university,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      await supabase.from("notifications").insert({
        user_id: id,
        title: "تم تحديث المعلومات",
        body: "تم تحديث معلومات حسابك بنجاح",
        type: "profile",
      });

      set({
        user: data,
        loading: false,
      });

      return data;
    } catch (error) {
      return get().handleError(error, "فشل في تحديث المعلومات");
    }
  },

  searchAboutUser: async ({ query, page = 1, itemsPerPage = 10 }) => {
    try {
      set({ loading: true });

      const { count, error: countError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .ilike("full_name", `%${query}%`);

      if (countError) throw countError;

      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .ilike("full_name", `%${query}%`)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        data,
        totalItems: count,
        totalPages: Math.ceil(count / itemsPerPage),
      };
    } catch (error) {
      return get().handleError(error, "فشل في البحث عن المستخدمين");
    } finally {
      set({ loading: false });
    }
  },

  addNoteToLikeList: async ({ noteId }) => {
    try {
      set({ likeLoading: true, error: null });

      const user = get().user;
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      if (user.likes_list?.includes(noteId)) {
        throw new Error("Note already in favorites");
      }

      const updatedLikes = [...(user.likes_list || []), noteId];

      const { data, error } = await supabase
        .from("users")
        .update({
          likes_list: updatedLikes,
        })
        .eq("id", user.id)
        .select();

      if (error) {
        set({ likeLoading: false, error: error.message });
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        set({ likeLoading: false });
        throw new Error("Failed to update favorites");
      }

      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "تمت إضافة ملخص إلى المفضلة",
        body: "تمت إضافة ملخص جديد إلى قائمة المفضلة لديك",
        type: "favorite",
      });

      set({
        user: {
          ...user,
          likes_list: updatedLikes,
        },
        loading: false,
      });
      set({ likeLoading: false });
      return data[0];
    } catch (error) {
      console.error("Error adding note to favorites:", error);
      set({
        likeLoading: false,
        error: error.message || "Failed to add to favorites",
      });
      throw error;
    }
  },

  removeNoteFromLikeList: async ({ noteId }) => {
    try {
      set({ likeLoading: true, error: null });

      const user = await get().user;

      if (!user.likes_list?.includes(noteId)) {
        throw new Error("Note not found in favorites");
      }

      const updatedLikes = (user.likes_list || []).filter(
        (id) => id !== noteId
      );

      const { data, error } = await supabase
        .from("users")
        .update({
          likes_list: updatedLikes,
        })
        .eq("id", user.id)
        .select();

      if (error) {
        set({ likeLoading: false, error: error.message });
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        set({ likeLoading: false });
        throw new Error("Failed to update favorites");
      }

      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "تمت إزالة ملخص من المفضلة",
        body: "تمت إزالة ملخص من قائمة المفضلة لديك",
        type: "favorite",
      });

      set({
        user: {
          ...user,
          likes_list: updatedLikes,
        },
        likeLoading: false,
      });

      return data[0];
    } catch (error) {
      console.error("Error removing note from favorites:", error);
      set({
        likeLoading: false,
        error: error.message || "Failed to remove from favorites",
      });
      throw error;
    }
  },

  getNotesLiked: async () => {
    set({ likedListLoading: true, error: null });
    const user = await get().user;
    const liked_list = user?.likes_list || [];
    try {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .in("id", liked_list);

      if (error) {
        set({ likedListLoading: false, error: error.message });
        throw new Error(error.message);
      }
      set({ likedListLoading: false, likedNotes: data });
      return data;
    } catch (error) {
      set({ likedListLoading: false, error: error.message });
      console.error(error.message);
    }
  },

  fetchNotifications: async () => {
    set({ notificationsLoading: true, error: null });
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw authError || new Error("User not found");
      const userId = await user?.id;
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        set({ notificationsLoading: false });
        throw new Error(error.message);
      }
      set({ notifications: data || [], notificationsLoading: false });
      return data;
    } catch (error) {
      set({ notificationsLoading: false });
    }
  },

  markAllAsRead: async () => {
    set({ notificationsLoading: true, error: null });
    try {
      const user = await get().user;
      const userId = await user?.id;
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);

      if (error) throw error;
      set({ notificationsLoading: false });
    } catch (error) {
      set({ error: error.message, notificationsLoading: false });
      throw error;
    }
  },

  clearAll: async () => {
    set({ notificationsLoading: true, error: null });
    try {
      const user = await get().user;
      const userId = await user?.id;
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;
      set({ notifications: [], notificationsLoading: false });
    } catch (error) {
      set({ error: error.message, notificationsLoading: false });
      throw error;
    }
  },
  fetchTheNumberOfUnreadNotifications: async () => {
    set({ notificationsLoading: true, error: null });
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw authError || new Error("User not found");
      const userId = await user?.id;
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .eq("read", false)
        .order("created_at", { ascending: false });

      if (error) {
        set({ notificationsLoading: false });
        throw new Error(error.message);
      }
      set({ unread: data || [], notificationsLoading: false });
      return data;
    } catch (error) {
      set({ notificationsLoading: false });
    }
  },
  markAsRead: async ({ notificationId }) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;
      set({ loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  removeNotification: async ({ notificationId }) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;
      set({ loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  clearError: () => set({ error: null }),
}));
