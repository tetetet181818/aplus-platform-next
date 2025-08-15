"use client";

import { Search, Filter, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SectionHeader from "@/components/ui/SectionHeader";

export default function DataTableSection({
  title,
  description,
  searchPlaceholder,
  columns,
  data,
  actions,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title={title} description={description} />

      {/* البحث والتصفية */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pr-10 h-12 border-0 shadow-md bg-card"
          />
        </div>
        <Button
          variant="outline"
          className="h-12 px-6 border-0 shadow-md bg-card hover:bg-muted/50"
        >
          <Filter className="ml-2 h-4 w-4" />
          تصفية
        </Button>
      </div>

      {/* جدول البيانات */}
      <Card className="border-0 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-muted/50">
              {columns.map((column) => (
                <TableHead
                  key={column.header}
                  className="font-semibold text-right"
                >
                  {column.header}
                </TableHead>
              ))}
              <TableHead className="text-right font-semibold">
                الإجراءات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={item.id}
                className="border-b border-muted/30 hover:bg-muted/30 transition-colors animate-slide-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={`${item.id}-${column.accessor}`}
                    className="text-right"
                  >
                    {column.customRender ? (
                      column.customRender(item[column.accessor])
                    ) : column.badge ? (
                      <Badge variant="outline" className="font-medium">
                        {item[column.accessor]}
                      </Badge>
                    ) : (
                      item[column.accessor]
                    )}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="border-0 shadow-lg"
                    >
                      {actions.map((action) => (
                        <DropdownMenuItem
                          key={action.label}
                          className={` space-x-3 ${
                            action.destructive ? "text-red-600" : ""
                          }`}
                        >
                          <action.icon className="ml-2 h-4 w-4" />
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
