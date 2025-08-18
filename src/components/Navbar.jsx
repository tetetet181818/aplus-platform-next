"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { Menu, X, Award } from "lucide-react";
import DesktopNav from "@/components/navbar/DesktopNav";
import MobileMenu from "@/components/navbar/MobileMenu";
import LoginDialog from "@/components/auth/LoginDialog";
import RegisterDialog from "@/components/auth/RegisterDialog";

export default function Navbar({}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);

  const { user, logout, isAuthenticated, loading } = useAuthStore(
    (state) => state
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const switchToRegister = () => {
    setIsLoginDialogOpen(false);
    setIsRegisterDialogOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterDialogOpen(false);
    setIsLoginDialogOpen(true);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="px-10 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <Award className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            منصة أ+
          </span>
        </Link>

        <DesktopNav
          isAuthenticated={isAuthenticated}
          user={user}
          onLoginOpen={() => setIsLoginDialogOpen(true)}
          onRegisterOpen={() => setIsRegisterDialogOpen(true)}
          handleLogout={handleLogout}
          loading={loading}
        />

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        searchQuery={searchQuery}
        onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLoginOpen={() => {
          setIsLoginDialogOpen(true);
          setIsMenuOpen(false);
        }}
        onRegisterOpen={() => {
          setIsRegisterDialogOpen(true);
          setIsMenuOpen(false);
        }}
        handleLogout={handleLogout}
        loading={loading}
      />

      <LoginDialog
        isOpen={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
        onSwitchToRegister={switchToRegister}
        onClose={() => setIsLoginDialogOpen(false)}
      />

      <RegisterDialog
        isOpen={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
        onSwitchToLogin={switchToLogin}
        onClose={() => setIsRegisterDialogOpen(false)}
      />
    </header>
  );
}
