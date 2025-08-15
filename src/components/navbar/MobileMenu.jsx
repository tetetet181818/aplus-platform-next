"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  LogOut,
  LogIn,
  UserPlus,
  BookOpen,
  PlusCircle,
  ShoppingBag,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";
import { NotificationBell } from "../notifications/NotificationBell";

const MobileMenu = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  isAuthenticated,
  onLoginOpen,
  onRegisterOpen,
  user,
  handleLogout,
}) => {
  if (!isOpen) return null;

  const handleLinkClick = (action) => {
    if (action) action();
    onClose();
  };

  return (
    <motion.nav
      className="md:hidden absolute top-full inset-x-0 bg-background shadow-lg border-t z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      aria-label="Mobile navigation menu"
    >
      <div className="container py-4 px-5 space-y-4">
        <form
          onSubmit={onSearchSubmit}
          className="relative w-full"
          role="search"
        >
          <Search
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="ابحث عن ملخصات..."
            className="w-full pr-10 pl-4 h-11"
            value={searchQuery}
            onChange={onSearchQueryChange}
            aria-label="Search for summaries"
          />
        </form>

        <div className="flex flex-col space-y-2">
          <Link href="/notes">
            <Button
              variant="ghost"
              className="w-full justify-start text-base py-3"
              onClick={() => handleLinkClick()}
            >
              <BookOpen
                className="ml-3 h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />
              تصفح الملخصات
            </Button>
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/add-note">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base py-3"
                  onClick={() => handleLinkClick()}
                >
                  <PlusCircle
                    className="ml-3 h-5 w-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  إضافة ملخص
                </Button>
              </Link>

              {user?.role === "admin" && (
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-base py-3"
                    onClick={() => handleLinkClick()}
                  >
                    <LayoutDashboard
                      className="ml-2 h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    لوحة التحكم
                  </Button>
                </Link>
              )}

              <Link href="/profile">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base py-3"
                  onClick={() => handleLinkClick()}
                >
                  <Settings
                    className="ml-3 h-5 w-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  إدارة الحساب
                </Button>
              </Link>

              <Link href="/profile?tab=purchased">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-base py-3"
                  onClick={() => handleLinkClick()}
                >
                  <ShoppingBag
                    className="ml-3 h-5 w-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  مشترياتي
                </Button>
              </Link>

              <Button
                variant="ghost"
                className="w-full justify-start text-destructive py-3"
                onClick={() => handleLinkClick(handleLogout)}
              >
                <LogOut className="ml-3 h-5 w-5" aria-hidden="true" />
                تسجيل الخروج
              </Button>

              <NotificationBell />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start text-base py-3"
                onClick={() => handleLinkClick(onLoginOpen)}
              >
                <LogIn
                  className="ml-3 h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
                تسجيل الدخول
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-base py-3"
                onClick={() => handleLinkClick(onRegisterOpen)}
              >
                <UserPlus
                  className="ml-3 h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
                إنشاء حساب
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default MobileMenu;
