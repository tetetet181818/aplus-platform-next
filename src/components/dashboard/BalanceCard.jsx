import { DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function BalanceCard({ netEarnings, platformFeePercentage }) {
  return (
    <Card className="shadow-xl border-transparent bg-gradient-to-br from-green-500 to-emerald-600 text-white overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <DollarSign className="h-7 w-7" />
          الرصيد المتاح للسحب
        </CardTitle>
        <CardDescription className="text-green-100">
          هذا هو المبلغ الذي يمكنك سحبه حاليًا بعد خصم الرسوم.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-5xl font-extrabold tracking-tight">
          {netEarnings.toFixed(2)}{" "}
          <span className="text-2xl font-normal">ريال</span>
        </p>
        <p className="text-sm text-green-200 mt-1">
          يتم احتساب الرصيد بعد خصم رسوم المنصة ({platformFeePercentage * 100}
          %).
        </p>
      </CardContent>
    </Card>
  );
}
