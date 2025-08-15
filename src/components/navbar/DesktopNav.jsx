import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import UserMenu from "./UserMenu";
import { NotificationBell } from "../notifications/NotificationBell";

const DesktopNav = ({
  isAuthenticated,
  user,
  onLoginOpen,
  onRegisterOpen,
  handleLogout,
  loading,
}) => {
  return (
    <nav className="hidden md:flex items-center gap-3">
      <Link href={"/notes"}>
        <Button variant="outline" className="text-base hover:bg-primary/10">
          تصفح الملخصات
        </Button>
      </Link>

      {loading ? null : isAuthenticated && user ? (
        <>
          <Link href="/add-note">
            <Button className="text-base bg-primary hover:bg-primary/90">
              <PlusCircle size={18} className="ml-2" />
              إضافة ملخص
            </Button>
          </Link>
          <UserMenu handleLogout={handleLogout} user={user} />
          <NotificationBell />
        </>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={onLoginOpen}
            className="text-base border-primary text-primary hover:bg-primary/10 hover:text-primary"
            aria-label="تسجيل الدخول"
          >
            تسجيل الدخول
          </Button>
          <Button
            onClick={onRegisterOpen}
            className="text-base bg-primary hover:bg-primary/90"
            aria-label="إنشاء حساب"
          >
            إنشاء حساب
          </Button>
        </>
      )}
    </nav>
  );
};

export default DesktopNav;
