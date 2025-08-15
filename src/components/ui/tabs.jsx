"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      className={cn(
        "bg-muted text-muted-foreground flex flex-wrap gap-2 justify-center rounded-lg p-2",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, children, ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-2">{children}</span>
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      className={cn("mt-4 w-full", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
