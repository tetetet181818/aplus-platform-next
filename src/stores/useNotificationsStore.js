// useNotificationsStore.js
import { create } from "zustand";
import supabase from "@/utils/Supabase-client.js";

export const useNotificationsStore = create((set, get) => ({
  notifications: [],
  isOpen: false,
  loading: false,
  error: null,
  user: null,

  setUser: (user) => set({ user }),
  setIsOpen: (isOpen) => set({ isOpen }),

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
}));
