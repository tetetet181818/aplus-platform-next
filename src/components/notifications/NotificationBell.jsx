"use client";
import {
  X,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Users,
  FileText,
  DollarSign,
  Settings,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNotificationsStore } from "@/stores/useNotificationsStore";
import { useAuthStore } from "../../stores/useAuthStore";
import formatArabicDate from "@/config/formateTime";
import { useEffect, useState } from "react";

const getTypeIcon = (notification) => {
  switch (notification.type) {
    case "review":
      return "⭐";
    case "withdrawal":
      return "💸";
    case "purchase":
      return "💸";
    case "student":
      return "👥";
    case "sale":
      return "📈";
    case "auth":
      return "👤";
    default:
      return "👥";
  }
};
export function NotificationBell({ className }) {
  const { isOpen, setIsOpen, loading, fetchNotifications } =
    useNotificationsStore();
  const { unread } = useAuthStore((state) => state);
  const { isMobile } = useIsMobile();
  const unreadCount = unread?.length;
  const handleToggle = async () => {
    if (!isOpen && unreadCount === 0) {
      try {
        await fetchNotifications();
        await fetchTheNumberOfUnreadNotifications();
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    }
    setIsOpen(!isOpen);
  };
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size={isMobile ? "sm" : "icon"}
        className={cn(
          "relative rounded-full hover:bg-primary/10 transition-all duration-200",
          isMobile ? "h-8 w-auto px-2" : "h-10 w-10",
          isOpen && "bg-primary/15",
          loading.fetching && "animate-pulse",
          className
        )}
        onClick={handleToggle}
        disabled={loading.fetching}
      >
        {loading.fetching ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <>
            <Bell
              className={cn(
                "transition-all duration-200 relative",
                isMobile ? "h-4 w-4 mr-1" : "h-5 w-5",
                unreadCount > 0 && "text-primary"
              )}
            />

            {isMobile && (
              <span className="text-sm hidden sm:inline">الإشعارات</span>
            )}
          </>
        )}
        {unreadCount > 0 && !loading.fetching && (
          <Badge
            variant="destructive"
            className={cn(
              "absolute rounded-full p-0 flex items-center justify-center text-xs font-bold animate-scale-in",
              isMobile ? "-top-1 -right-1 h-4 w-4" : "-top-1 -right-1 h-5 w-5"
            )}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}

export function NotificationPanel() {
  const {
    fetchNotifications,
    notifications,
    markAllAsRead,
    clearAll,
    markAsRead,
    removeNotification,
    notificationsLoading,
  } = useAuthStore();
  const { isOpen, setIsOpen, unreadCount, loading, error } =
    useNotificationsStore();
  const isMobile = useIsMobile("(max-width: 640px)");
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  const handleRefresh = async () => {
    try {
      let res = await fetchNotifications();
    } catch (error) {
      console.error("Failed to refresh notifications:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      <div
        className={cn(
          "fixed z-50 bg-background border border-border rounded-xl shadow-2xl animate-slide-in",
          isMobile
            ? "bottom-0 left-0 right-0 max-h-[70vh] rounded-b-none"
            : "top-16 right-4 w-96 max-h-[80vh]"
        )}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-t-xl">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Bell className="size-5 text-primary" />
            <h3 className="font-semibold text-base sm:text-lg">الإشعارات</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} جديد
              </Badge>
            )}
            {notificationsLoading && (
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "icon"}
              onClick={handleRefresh}
              disabled={notificationsLoading}
              title="تحديث"
            >
              <RefreshCw className={"size-5"} />
            </Button>
            {notifications.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size={isMobile ? "sm" : "sm"}
                  onClick={markAllAsRead}
                  disabled={loading.markingAllAsRead || unreadCount === 0}
                  className="text-xs hover:bg-primary/10"
                >
                  {loading.markingAllAsRead ? (
                    <Loader2 className="h-3 w-3 animate-spin ml-1" />
                  ) : null}
                  قراءة الكل
                </Button>
                <Button
                  variant="ghost"
                  size={isMobile ? "sm" : "sm"}
                  onClick={clearAll}
                  disabled={notificationsLoading}
                  className="text-xs hover:bg-destructive/10 text-destructive"
                >
                  {notificationsLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin ml-1" />
                  ) : null}
                  مسح الكل
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "icon"}
              onClick={() => setIsOpen(false)}
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-2 sm:p-3 bg-red-50 border-b border-red-200 text-red-800 text-xs sm:text-sm">
            <div className="flex items-center space-x-2 space-x-reverse">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div
          className="overflow-y-auto"
          style={{
            maxHeight: isMobile ? "calc(70vh - 60px)" : "calc(80vh - 60px)",
          }}
        >
          {notificationsLoading && notifications.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground">
                جاري تحميل الإشعارات...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <Bell className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base text-muted-foreground">
                لا توجد إشعارات
              </p>
            </div>
          ) : (
            <div className="p-1 sm:p-2">
              {notifications.map((notification, index) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRemove={() =>
                    removeNotification({ notificationId: notification.id })
                  }
                  onMarkAsRead={() =>
                    markAsRead({ notificationId: notification.id })
                  }
                  notificationsLoading={notificationsLoading}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function NotificationItem({
  notification,
  onRemove,
  onMarkAsRead,
  notificationsLoading,
  style,
  isMobile,
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove();
    } catch (error) {
      console.error("Failed to remove notification:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleMarkAsRead = async () => {
    if (notification.read) return;

    setIsMarkingAsRead(true);
    try {
      await onMarkAsRead();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    } finally {
      setIsMarkingAsRead(false);
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case "withdrawal":
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
      case "warning":
        return (
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
        );
      case "auth":
        return <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
      case "student":
        return <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />;
      case "purchase":
        return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />;
      case "sale":
        return <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
      case "system":
        return <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
      // case "review":
      //   return <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />;
      default:
        return <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />;
    }
  };

  const getTypeColor = () => {
    switch (notification.type) {
      case "withdrawal":
        return "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800";
      case "error":
        return "from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-200 dark:border-red-800";
      case "warning":
        return "from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800";
      case "auth":
        return "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800";
      case "student":
        return "from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800";
      case "purchase":
        return "from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-200 dark:border-indigo-800";
      case "sale":
        return "from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 border-green-200 dark:border-green-800";
      case "system":
        return "from-gray-5 0 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border-gray-200 dark:border-gray-800";
      default:
        return "from-primary/5 to-blue-500/5 border-primary/20";
    }
  };

  return (
    <Card
      className={cn(
        "mb-1 sm:mb-2  border transition-all duration-200 hover:shadow-md cursor-pointer animate-slide-in bg-gradient-to-r group",
        getTypeColor(),
        !notification.read &&
          "ring-1 sm:ring-2 ring-primary/20 shadow-sm sm:shadow-md",
        (isRemoving || isMarkingAsRead) && "opacity-50 pointer-events-none"
      )}
      style={style}
      onClick={handleMarkAsRead}
    >
      <CardContent className="p-2 sm:p-4">
        <div className="flex items-start space-x-2 sm:space-x-3 space-x-reverse">
          <div className="flex-shrink-0 mt-0.5">
            {isMarkingAsRead ? (
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary" />
            ) : (
              getIcon()
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4
                  className={cn(
                    "text-xs sm:text-sm font-medium text-right mx-3",
                    !notification.read && "font-semibold"
                  )}
                >
                  {notification.title}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground text-right mt-1 leading-relaxed">
                  {notification.body}
                </p>

                {notification.user && (
                  <div className="flex items-center space-x-1 sm:space-x-2 space-x-reverse mt-1 sm:mt-2">
                    <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                      <AvatarFallback className="text-[10px] sm:text-xs bg-primary/10 text-primary">
                        {notification.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                      {notification.user.name}
                    </span>
                  </div>
                )}

                {notification.actions && (
                  <div className="flex space-x-1 sm:space-x-2 space-x-reverse mt-2">
                    {notification.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant || "outline"}
                        size={isMobile ? "xs" : "sm"}
                        className="text-[10px] sm:text-xs h-6 sm:h-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick?.();
                        }}
                        disabled={isMarkingAsRead || isRemoving}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-1 space-x-reverse ml-1 sm:ml-2">
                {!notification.read && !isMarkingAsRead && (
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse" />
                )}
                <Button
                  variant="ghost"
                  size={isMobile ? "xs" : "icon"}
                  className="h-5 w-5 sm:h-6 sm:w-6 hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  disabled={isRemoving || notificationsLoading}
                >
                  {isRemoving ? (
                    <Loader2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-spin" />
                  ) : (
                    <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-1 sm:mt-2">
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                {formatArabicDate(notification?.created_at)}
              </span>
              {notification.type && (
                <Badge variant="ghost" className="text-2xl border-0">
                  {getTypeIcon(notification)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Toast() {
  const { toastNotifications, markAsRead } = useNotificationsStore();
  const isMobile = useIsMobile("(max-width: 640px)");

  return (
    <div
      className={cn(
        "fixed z-50 space-y-2",
        isMobile ? "bottom-16 left-2 right-2" : "top-4 right-4"
      )}
    >
      {toastNotifications
        .slice(0, isMobile ? 2 : 3)
        .map((notification, index) => (
          <ToastNotification
            key={notification.id}
            notification={notification}
            onMarkAsRead={() => markAsRead(notification.id)}
            style={{ animationDelay: `${index * 0.1}s` }}
            isMobile={isMobile}
          />
        ))}
    </div>
  );
}

function ToastNotification({ notification, onMarkAsRead, style, isMobile }) {
  const { removeNotification } = useNotificationsStore();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onMarkAsRead();
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onMarkAsRead, notification.duration]);

  const handleClose = async () => {
    setIsClosing(true);
    try {
      await removeNotification(notification.id);
    } catch (error) {
      console.error("Failed to close toast:", error);
    } finally {
      setIsClosing(false);
    }
  };

  const getToastStyle = () => {
    switch (notification.type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-800 dark:text-green-200";
      case "error":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-800 dark:text-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/20 dark:border-yellow-800 dark:text-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-200";
      default:
        return "bg-background border-border";
    }
  };

  return (
    <Card
      className={cn(
        "shadow-lg border-2 animate-slide-in",
        getToastStyle(),
        isMobile ? "w-full" : "w-80",
        isClosing && "opacity-50"
      )}
      style={style}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-xs sm:text-sm text-right">
              {notification.title}
            </h4>
            <p className="text-xs sm:text-sm text-right mt-1 opacity-90">
              {notification.message}
            </p>
          </div>
          <Button
            variant="ghost"
            size={isMobile ? "xs" : "icon"}
            className="h-5 w-5 sm:h-6 sm:w-6 hover:bg-black/10"
            onClick={handleClose}
            disabled={isClosing}
          >
            {isClosing ? (
              <Loader2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-spin" />
            ) : (
              <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
