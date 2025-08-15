"use client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { navigationItems } from "@/constants/index";
import AppSidebar from "@/components/AppSidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Activity } from "lucide-react";

export default function DashboardLayout({ children }) {
  return (
    <div dir="rtl">
      <SidebarProvider>
        <AppSidebar navigationItems={navigationItems} />
        <div className="flex flex-col w-full overflow-x-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-muted/20 px-4 bg-gradient-to-r from-background to-muted/10">
            <div className="flex items-center space-x-2 space-x-reverse">
              <SidebarTrigger className="-mr-1 hover:bg-primary/10 rounded-lg transition-colors" />
              <Activity className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">
                لوحة تحكم المنصة التعليمية
              </span>
            </div>
            <Separator orientation="vertical" className="ml-2 h-4" />
          </header>

          <SidebarInset className={"p-10"}>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
