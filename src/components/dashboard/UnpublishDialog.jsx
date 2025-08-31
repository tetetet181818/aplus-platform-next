import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";

export default function UnpublishDialog({ open, onClose, onConfirm, loading }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حذف الملاحظة</DialogTitle>
          <DialogDescription>
            هل أنت متأكد من الغاء نشر هذه الملاحظة؟
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">إلغاء</Button>
          </DialogClose>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={loading}
          >
            {loading ? "جاري الغاء نشر..." : "الغاء نشر"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
