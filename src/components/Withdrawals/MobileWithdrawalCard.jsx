import { Card, CardContent } from "@/components/ui/card";
const MobileWithdrawalCard = ({ withdrawal, columns }) => (
  <Card key={withdrawal.id} className="border-muted/30 mb-4 animate-fade-in">
    <CardContent className="p-4 space-y-3">
      {columns
        .filter((col) => col.accessor)
        .map((column) => (
          <div key={column.accessor} className="flex justify-between">
            <span className="font-medium">{column.label}:</span>
            <span className="text-muted-foreground">
              {column.customRender
                ? column.customRender(withdrawal[column.accessor], withdrawal)
                : withdrawal[column.accessor] || "غير محدد"}
            </span>
          </div>
        ))}
      <div className="pt-2">
        {columns.find((col) => !col?.accessor)?.customRender(null, withdrawal)}
      </div>
    </CardContent>
  </Card>
);

export default MobileWithdrawalCard;
