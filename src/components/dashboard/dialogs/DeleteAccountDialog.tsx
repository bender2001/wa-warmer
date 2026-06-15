"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUiStore } from "@/stores/ui-store";
import { useWarmer } from "@/hooks/useWarmer";

export function DeleteAccountDialog() {
  const toDelete = useUiStore((s) => s.toDelete);
  const closeDelete = useUiStore((s) => s.closeDelete);
  const { deleteAccount } = useWarmer();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    const ok = await deleteAccount(toDelete);
    setIsDeleting(false);
    if (ok) closeDelete();
  };

  return (
    <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && closeDelete()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>{toDelete?.personality?.name || toDelete?.id}</strong>? This
            will logout and remove all session data permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-danger text-on-danger hover:bg-danger/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Account"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
