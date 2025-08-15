import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Search } from "lucide-react";

const PurchasedItemsDisplay = ({ onNavigate }) => {
  return (
    <Card className="p-8 text-center border-dashed border-gray-300 dark:border-gray-600">
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full">
          <ShoppingCart className="h-10 w-10 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
        لا توجد مشتريات بعد
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        لم تقم بشراء أي ملخصات حتى الآن. استكشف الملخصات المتاحة وابدأ رحلتك
        التعليمية!
      </p>
      <Button
        onClick={() => onNavigate("/notes")}
        className="bg-primary hover:bg-primary/90 text-white"
      >
        <Search className="ml-2 h-4 w-4" /> تصفح الملخصات
      </Button>
    </Card>
  );
};

export default PurchasedItemsDisplay;
