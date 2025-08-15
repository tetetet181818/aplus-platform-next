import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LogOut,
  PlusCircle,
  ShoppingBag,
  Settings,
  LayoutDashboard,
} from "lucide-react";

export default function UserMenu({ handleLogout, user }) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user?.full_name?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="end" forceMount>
          <DropdownMenuLabel className="font-normal py-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.full_name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="cursor-pointer w-full flex items-center py-2 text-sm space-x-2"
            >
              <Settings className="ml-2 h-4 w-4 text-muted-foreground" />
              <span>إدارة الحساب</span>
            </Link>
          </DropdownMenuItem>
          {user?.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard"
                className="cursor-pointer w-full flex items-center py-2 text-sm space-x-2"
              >
                <LayoutDashboard className="ml-2 h-4 w-4 text-muted-foreground" />
                <span>لوحة التحكم</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link
              href="/profile?tab=purchased"
              className="cursor-pointer w-full flex items-center py-2 text-sm space-x-2"
            >
              <ShoppingBag className="ml-2 h-4 w-4 text-muted-foreground" />
              <span>مشترياتي</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/add-note"
              className="cursor-pointer w-full flex items-center py-2 text-sm space-x-2"
            >
              <PlusCircle className="ml-2 h-4 w-4 text-muted-foreground" />
              <span>إضافة ملخص</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-700 focus:bg-red-50 dark:focus:text-red-300 dark:focus:bg-red-900/50 py-2 text-sm"
          >
            <LogOut className="ml-2 h-4 w-4" />
            <span>تسجيل الخروج</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
