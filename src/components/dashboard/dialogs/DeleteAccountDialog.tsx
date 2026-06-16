"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
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
import { LoadingIndicator } from "@/components/ui/loading-indicator";
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
          <AlertDialogTitle className="md-headline-small flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-error-container text-on-error-container">
              <AlertTriangle className="size-5" />
            </span>
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="md-body-medium">
            Are you sure you want to delete{" "}
            <strong className="text-on-surface">
              {toDelete?.personality?.name || toDelete?.id}
            </strong>
            ? This will logout and remove all session data permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-danger"
          >
            {isDeleting ? (
              <>
                <LoadingIndicator size={18} />
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
