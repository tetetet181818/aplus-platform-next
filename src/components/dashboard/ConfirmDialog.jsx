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

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => onClose(false)} variant="outline">
              إلغاء
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                onConfirm();
                onClose(false);
              }}
              variant="destructive"
            >
              حذف
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
