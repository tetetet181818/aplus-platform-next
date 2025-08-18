"use client";

import { BookOpen } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

export default function AppSidebar({ navigationItems }) {
  return (
    <Sidebar className="border-0 shadow-xl" side="right">
      <SidebarHeader className="border-b mt-16 border-muted/20 bg-gradient-to-r from-primary/5 to-blue-500/5">
        <div className="flex items-center space-x-3 space-x-reverse px-4 py-4">
          <div className="p-2 bg-primary/10 rounded-xl" aria-hidden="true">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            منصة أ+
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-b from-background to-muted/20">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2">
            التنقل
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {navigationItems?.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      className="w-full justify-start px-4 py-3 rounded-xl transition-all duration-200 hover:bg-primary/10 data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:shadow-md"
                      aria-label={item.title}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
