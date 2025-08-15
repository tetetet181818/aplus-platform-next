"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

// Notification Store with Zustand
export const useNotificationStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    notifications: [],
    isOpen: false,
    loading: {
      adding: false,
      removing: false,
      markingAsRead: false,
      markingAllAsRead: false,
      clearing: false,
      fetching: false,
    },
    error: null,

    // Computed values
    get unreadCount() {
      return get().notifications.filter((n) => !n.isRead).length;
    },

    get toastNotifications() {
      return get().notifications.filter((n) => n.showAsToast && !n.isRead);
    },

    // Actions
    setIsOpen: (isOpen) => set({ isOpen }),

    setLoading: (operation, loading) =>
      set((state) => ({
        loading: {
          ...state.loading,
          [operation]: loading,
        },
      })),

    setError: (error) => set({ error }),

    addNotification: async (notification) => {
      const { setLoading, setError } = get();

      try {
        setLoading("adding", true);
        setError(null);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        const id = Date.now() + Math.random();
        const newNotification = {
          id,
          timestamp: new Date(),
          isRead: false,
          ...notification,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));

        // Auto remove after duration if specified
        if (notification.duration) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration);
        }

        // Auto-mark toast notifications as read after display duration
        if (notification.showAsToast) {
          setTimeout(() => {
            get().markAsRead(id);
          }, notification.duration || 5000);
        }

        return newNotification;
      } catch (error) {
        setError("فشل في إضافة الإشعار");
        throw error;
      } finally {
        setLoading("adding", false);
      }
    },

    removeNotification: async (id) => {
      const { setLoading, setError } = get();

      try {
        setLoading("removing", true);
        setError(null);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 200));

        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      } catch (error) {
        setError("فشل في حذف الإشعار");
        throw error;
      } finally {
        setLoading("removing", false);
      }
    },

    markAsRead: async (id) => {
      const { setLoading, setError } = get();

      try {
        setLoading("markingAsRead", true);
        setError(null);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 150));

        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      } catch (error) {
        setError("فشل في تحديث حالة الإشعار");
        throw error;
      } finally {
        setLoading("markingAsRead", false);
      }
    },

    markAllAsRead: async () => {
      const { setLoading, setError } = get();

      try {
        setLoading("markingAllAsRead", true);
        setError(null);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 400));

        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            isRead: true,
          })),
        }));
      } catch (error) {
        setError("فشل في تحديث جميع الإشعارات");
        throw error;
      } finally {
        setLoading("markingAllAsRead", false);
      }
    },

    clearAll: async () => {
      const { setLoading, setError } = get();

      try {
        setLoading("clearing", true);
        setError(null);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        set({ notifications: [] });
      } catch (error) {
        setError("فشل في مسح جميع الإشعارات");
        throw error;
      } finally {
        setLoading("clearing", false);
      }
    },

    fetchNotifications: async () => {
      const { setLoading, setError } = get();

      try {
        setLoading("fetching", true);
        setError(null);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data - in real app, this would come from API
        const mockNotifications = [
          {
            id: 1,
            type: "student",
            title: "طالب جديد انضم",
            message: "انضم أحمد محمد إلى دورة React المتقدمة",
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            isRead: false,
            user: { name: "أحمد محمد", email: "ahmed@example.com" },
            category: "الطلاب",
          },
          {
            id: 2,
            type: "sale",
            title: "مبيعة جديدة",
            message: "تم شراء دورة JavaScript بقيمة 299 ر.س",
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            isRead: false,
            category: "المبيعات",
          },
          {
            id: 3,
            type: "system",
            title: "تحديث النظام",
            message: "تم تحديث النظام بنجاح إلى الإصدار 2.1.0",
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            isRead: true,
            category: "النظام",
          },
        ];

        set({ notifications: mockNotifications });
      } catch (error) {
        setError("فشل في جلب الإشعارات");
        throw error;
      } finally {
        setLoading("fetching", false);
      }
    },

    // Bulk operations
    bulkMarkAsRead: async (ids) => {
      const { setLoading, setError } = get();

      try {
        setLoading("markingAsRead", true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 300));

        set((state) => ({
          notifications: state.notifications.map((n) =>
            ids.includes(n.id) ? { ...n, isRead: true } : n
          ),
        }));
      } catch (error) {
        setError("فشل في تحديث الإشعارات المحددة");
        throw error;
      } finally {
        setLoading("markingAsRead", false);
      }
    },

    bulkRemove: async (ids) => {
      const { setLoading, setError } = get();

      try {
        setLoading("removing", true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 400));

        set((state) => ({
          notifications: state.notifications.filter((n) => !ids.includes(n.id)),
        }));
      } catch (error) {
        setError("فشل في حذف الإشعارات المحددة");
        throw error;
      } finally {
        setLoading("removing", false);
      }
    },

    // Reset store
    reset: () =>
      set({
        notifications: [],
        isOpen: false,
        loading: {
          adding: false,
          removing: false,
          markingAsRead: false,
          markingAllAsRead: false,
          clearing: false,
          fetching: false,
        },
        error: null,
      }),
  }))
);

// Notification action hooks
export const useNotificationActions = () => {
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const showSuccess = async (title, message, options = {}) => {
    return await addNotification({
      type: "success",
      title,
      message,
      showAsToast: true,
      duration: 4000,
      ...options,
    });
  };

  const showError = async (title, message, options = {}) => {
    return await addNotification({
      type: "error",
      title,
      message,
      showAsToast: true,
      duration: 6000,
      ...options,
    });
  };

  const showWarning = async (title, message, options = {}) => {
    return await addNotification({
      type: "warning",
      title,
      message,
      showAsToast: true,
      duration: 5000,
      ...options,
    });
  };

  const showInfo = async (title, message, options = {}) => {
    return await addNotification({
      type: "info",
      title,
      message,
      showAsToast: true,
      duration: 4000,
      ...options,
    });
  };

  const showStudentNotification = async (
    title,
    message,
    user,
    options = {}
  ) => {
    return await addNotification({
      type: "student",
      title,
      message,
      user,
      category: "الطلاب",
      ...options,
    });
  };

  const showSaleNotification = async (title, message, options = {}) => {
    return await addNotification({
      type: "sale",
      title,
      message,
      category: "المبيعات",
      showAsToast: true,
      duration: 5000,
      ...options,
    });
  };

  const showFileNotification = async (title, message, options = {}) => {
    return await addNotification({
      type: "file",
      title,
      message,
      category: "الملفات",
      ...options,
    });
  };

  const showSystemNotification = async (title, message, options = {}) => {
    return await addNotification({
      type: "system",
      title,
      message,
      category: "النظام",
      ...options,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showStudentNotification,
    showSaleNotification,
    showFileNotification,
    showSystemNotification,
  };
};
