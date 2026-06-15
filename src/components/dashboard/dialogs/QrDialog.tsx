"use client";

import { Loader2, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useUiStore } from "@/stores/ui-store";

export function QrDialog() {
  const qr = useUiStore((s) => s.qr);
  const closeQr = useUiStore((s) => s.closeQr);

  return (
    <Dialog open={qr.open} onOpenChange={(o) => !o && closeQr()}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Scan QR Code for {qr.accountId}</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 py-2">
          {/* QR Code */}
          <div className="flex-shrink-0 flex items-center justify-center">
            {qr.qrCode ? (
              <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-lg">
                <img
                  src={qr.qrCode}
                  alt="QR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 lg:w-[400px] lg:h-[400px] rounded-xl"
                />
              </div>
            ) : (
              <div className="w-56 h-56 sm:w-64 sm:h-64 lg:w-[400px] lg:h-[400px] flex items-center justify-center bg-surface-container-high rounded-2xl">
                <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-on-surface-variant" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-4 sm:space-y-5 sm:py-2">
            <div>
              <h2 className="text-2xl font-semibold text-on-surface flex items-center justify-center sm:justify-start gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                Scan QR Code
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Account:{" "}
                <span className="font-semibold text-primary">{qr.accountId}</span>
              </p>
            </div>

            <div className="p-3 sm:p-4 bg-surface-container rounded-2xl">
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                📱 Open WhatsApp → Menu → Linked Devices → Link a Device
              </p>
            </div>

            <div className="p-3 sm:p-4 bg-warning-container text-on-warning-container rounded-2xl">
              <p className="text-xs sm:text-sm leading-relaxed">
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
