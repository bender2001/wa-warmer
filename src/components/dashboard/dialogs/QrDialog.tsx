"use client";

import { QrCode } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { spatial, effects } from "@/lib/motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useUiStore } from "@/stores/ui-store";

export function QrDialog() {
  const qr = useUiStore((s) => s.qr);
  const closeQr = useUiStore((s) => s.closeQr);
  const reduce = useReducedMotion();

  return (
    <Dialog open={qr.open} onOpenChange={(o) => !o && closeQr()}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Scan QR Code for {qr.accountId}</DialogTitle>
            <DialogDescription>
              Scan this QR code with WhatsApp to link the device.
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 py-2">
          {/* QR Code */}
          <div className="flex-shrink-0 flex items-center justify-center">
            {qr.qrCode ? (
              <motion.div
                key="qr"
                initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={spatial.default}
                className="p-3 sm:p-4 bg-surface-container-lowest rounded-[var(--radius-md)] md-elevation-3"
              >
                <img
                  src={qr.qrCode}
                  alt="QR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 lg:w-[400px] lg:h-[400px] rounded-[var(--radius-md)]"
                />
              </motion.div>
            ) : (
              <motion.div
                key="loading"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={effects.default}
                className="w-56 h-56 sm:w-64 sm:h-64 lg:w-[400px] lg:h-[400px] flex items-center justify-center bg-surface-container-high rounded-[var(--radius-md)]"
              >
                <LoadingIndicator size={56} />
              </motion.div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-4 sm:space-y-5 sm:py-2">
            <div>
              <h2 className="md-headline-small text-on-surface flex items-center justify-center sm:justify-start gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                Scan QR Code
              </h2>
              <p className="md-body-medium text-on-surface-variant mt-1">
                Account:{" "}
                <span className="md-label-large-emphasized text-primary">
                  {qr.accountId}
                </span>
              </p>
            </div>

            <div className="p-3 sm:p-4 bg-surface-container rounded-[var(--radius-md)]">
              <p className="md-body-small text-on-surface-variant">
                📱 Open WhatsApp → Menu → Linked Devices → Link a Device
              </p>
            </div>

            <div className="p-3 sm:p-4 bg-warning-container text-on-warning-container rounded-[var(--radius-md)]">
              <p className="md-body-small">
                ⏱️ The QR code expires in a few minutes. If it has expired, close
                and reopen.
              </p>
            </div>

            <Button
              variant="outlined"
              className="w-full sm:w-auto px-8"
              onClick={closeQr}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
