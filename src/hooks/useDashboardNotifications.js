"use client";

import * as React from "react";
import {
  useNotificationActions,
  useNotificationStore,
} from "@/stores/notification-store";

// Hook to integrate notifications with dashboard actions
export function useDashboardNotifications() {
  const {
    showSuccess,
    showError,
    showStudentNotification,
    showSaleNotification,
    showFileNotification,
    showSystemNotification,
  } = useNotificationActions();

  // Student-related notifications
  const notifyStudentJoined = React.useCallback(
    async (studentName, courseName) => {
      try {
        await showStudentNotification(
          "طالب جديد انضم",
          `انضم ${studentName} إلى دورة ${courseName}`,
          { name: studentName },
          {
            actions: [
              { label: "عرض الملف", variant: "default" },
              { label: "إرسال ترحيب", variant: "outline" },
            ],
          }
        );
      } catch (error) {
        console.error("Failed to notify student joined:", error);
      }
    },
    [showStudentNotification]
  );

  const notifyStudentCompleted = React.useCallback(
    async (studentName, courseName) => {
      try {
        await showSuccess(
          "إنجاز جديد",
          `أكمل ${studentName} دورة ${courseName} بنجاح`
        );
      } catch (error) {
        console.error("Failed to notify student completed:", error);
      }
    },
    [showSuccess]
  );

  // Sales notifications
  const notifyNewSale = React.useCallback(
    async (courseName, amount, studentName) => {
      try {
        await showSaleNotification(
          "مبيعة جديدة",
          `تم شراء ${courseName} بقيمة ${amount} ر.س من قبل ${studentName}`,
          {
            actions: [
              { label: "عرض التفاصيل", variant: "default" },
              { label: "إرسال شكر", variant: "outline" },
            ],
          }
        );
      } catch (error) {
        console.error("Failed to notify new sale:", error);
      }
    },
    [showSaleNotification]
  );

  const notifyPaymentReceived = React.useCallback(
    async (amount) => {
      try {
        await showSuccess(
          "تم استلام الدفعة",
          `تم استلام دفعة بقيمة ${amount} ر.س بنجاح`
        );
      } catch (error) {
        console.error("Failed to notify payment received:", error);
      }
    },
    [showSuccess]
  );

  // File notifications
  const notifyFileUploaded = React.useCallback(
    async (fileName, uploaderName) => {
      try {
        await showFileNotification(
          "ملف جديد",
          `تم رفع ملف "${fileName}" من قبل ${uploaderName}`
        );
      } catch (error) {
        console.error("Failed to notify file uploaded:", error);
      }
    },
    [showFileNotification]
  );

  const notifyFileDownloaded = React.useCallback(
    async (fileName, downloaderName) => {
      try {
        await showFileNotification(
          "تحميل ملف",
          `تم تحميل ملف "${fileName}" من قبل ${downloaderName}`
        );
      } catch (error) {
        console.error("Failed to notify file downloaded:", error);
      }
    },
    [showFileNotification]
  );

  // System notifications
  const notifySystemUpdate = React.useCallback(async () => {
    try {
      await showSystemNotification(
        "تحديث النظام",
        "تم تحديث النظام بنجاح إلى الإصدار الجديد"
      );
    } catch (error) {
      console.error("Failed to notify system update:", error);
    }
  }, [showSystemNotification]);

  const notifyMaintenanceScheduled = React.useCallback(
    async (date, time) => {
      try {
        await showSystemNotification(
          "صيانة مجدولة",
          `ستتم صيانة النظام في ${date} الساعة ${time}`
        );
      } catch (error) {
        console.error("Failed to notify maintenance:", error);
      }
    },
    [showSystemNotification]
  );

  // Error notifications
  const notifyError = React.useCallback(
    async (title, message) => {
      try {
        await showError(title, message);
      } catch (error) {
        console.error("Failed to notify error:", error);
      }
    },
    [showError]
  );

  return {
    notifyStudentJoined,
    notifyStudentCompleted,
    notifyNewSale,
    notifyPaymentReceived,
    notifyFileUploaded,
    notifyFileDownloaded,
    notifySystemUpdate,
    notifyMaintenanceScheduled,
    notifyError,
  };
}

// Auto-generate demo notifications with loading states
export function useAutoNotifications() {
  const notifications = useDashboardNotifications();
  const { loading } = useNotificationStore();

  React.useEffect(() => {
    // Don't auto-generate if any operation is in progress
    if (Object.values(loading).some(Boolean)) {
      return;
    }

    const interval = setInterval(async () => {
      const randomNotifications = [
        () => notifications.notifyStudentJoined("سارة أحمد", "React المتقدم"),
        () =>
          notifications.notifyNewSale("JavaScript الأساسي", "199", "محمد علي"),
        () => notifications.notifyFileUploaded("دليل المطور.pdf", "أستاذ أحمد"),
        () => notifications.notifyStudentCompleted("فاطمة محمد", "CSS المتقدم"),
        () => notifications.notifyPaymentReceived("299"),
      ];

      const randomIndex = Math.floor(
        Math.random() * randomNotifications.length
      );
      try {
        await randomNotifications[randomIndex]();
      } catch (error) {
        console.error("Auto notification failed:", error);
      }
    }, 20000); // Every 20 seconds

    return () => clearInterval(interval);
  }, [notifications, loading]);
}
