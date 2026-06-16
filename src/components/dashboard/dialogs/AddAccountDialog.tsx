"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Plus,
  QrCode,
  Hash,
  Layers,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { TextField } from "@/components/ui/text-field";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

import { useUiStore } from "@/stores/ui-store";
import { useWarmer } from "@/hooks/useWarmer";
import { useToast } from "@/hooks/use-toast";
import { wa } from "@/lib/api";
import { spatial, effects } from "@/lib/motion";
import type { AddMode, AuthMethod, ExcelUploadResult, BulkQueueStatus } from "@/types";

export function AddAccountDialog() {
  const addOpen = useUiStore((s) => s.addOpen);
  const setAddOpen = useUiStore((s) => s.setAddOpen);
  const { startSession, batchStart, uploadExcel, startBulkProcessing, fetchBulkQueue } = useWarmer();
  const { toast } = useToast();
  const reduceMotion = useReducedMotion();

  const [addMode, setAddMode] = useState<AddMode>("single");
  const [newAccountId, setNewAccountId] = useState("");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("qr");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [bulkCount, setBulkCount] = useState("");
  const [bulkPrefix, setBulkPrefix] = useState("warmer");
  const [excelUploadResult, setExcelUploadResult] = useState<ExcelUploadResult | null>(null);
  const [bulkQueueStatus, setBulkQueueStatus] = useState<BulkQueueStatus | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setExcelUploadResult(null);
    try {
      const result = await uploadExcel(file);
      if (result) setExcelUploadResult(result);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleAddAccount = async () => {
    if (addMode === "single") {
      if (!newAccountId.trim()) {
        toast({ title: "Error", description: "Enter Account ID", variant: "destructive" });
        return;
      }
      const ok = await startSession({
        accountId: newAccountId.trim(),
        usePairingCode: authMethod === "pairing",
        phoneNumber: authMethod === "pairing" ? newPhoneNumber.trim() : undefined,
      });
      if (ok) {
        setAddOpen(false);
        setNewAccountId("");
        setNewPhoneNumber("");
      }
      return;
    }

    if (addMode === "bulk") {
      const count = parseInt(bulkCount);
      if (!count || count <= 0) {
        toast({ title: "Error", description: "Enter valid account count", variant: "destructive" });
        return;
      }
      if (!bulkPrefix.trim()) {
        toast({ title: "Error", description: "Enter account prefix", variant: "destructive" });
        return;
      }
      const accountIds = Array.from({ length: count }, (_, i) => `${bulkPrefix.trim()}-${i + 1}`);
      const ok = await batchStart({
        accountIds,
        usePairingCodes: Array(count).fill(authMethod === "pairing"),
        phoneNumbers: authMethod === "pairing" ? Array(count).fill("") : undefined,
      });
      if (ok) {
        setAddOpen(false);
        setBulkCount("");
      }
      return;
    }

    if (addMode === "excel") {
      if (!excelUploadResult) {
        toast({ title: "Error", description: "Upload Excel file first", variant: "destructive" });
        return;
      }
      const ok = await startBulkProcessing(excelUploadResult.total);
      if (ok) {
        const status = await fetchBulkQueue();
        if (status) setBulkQueueStatus(status);
        if (pollingRef.current) clearInterval(pollingRef.current);
        pollingRef.current = setInterval(async () => {
          const next = await fetchBulkQueue();
          if (next) setBulkQueueStatus(next);
        }, 3000);
      }
    }
  };

  const authToggle = (
    <div className="space-y-1.5">
      <Label className="md-label-large text-on-surface-variant">Authentication Method</Label>
      <ButtonGroup
        value={authMethod}
        onValueChange={(v) => setAuthMethod(v as AuthMethod)}
        items={[
          { value: "qr", label: "QR Code", icon: QrCode },
          { value: "pairing", label: "Pairing", icon: Hash },
        ]}
        className="w-full"
      />
    </div>
  );

  const revealMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1, transition: spatial.default },
        exit: { opacity: 0, scale: 0.98, transition: effects.fast },
      };

  return (
    <Dialog open={addOpen} onOpenChange={setAddOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="md-headline-small flex items-center gap-2">
            <span className="bg-primary-container text-on-primary-container grid size-9 place-items-center rounded-full">
              <Plus className="h-5 w-5" />
            </span>
            Add WhatsApp Account
          </DialogTitle>
          <DialogDescription className="md-body-medium">Choose how to add accounts</DialogDescription>
        </DialogHeader>

        <Tabs value={addMode} onValueChange={(v) => setAddMode(v as AddMode)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="single" className="md-label-large">Single</TabsTrigger>
            <TabsTrigger value="bulk" className="md-label-large">Bulk Queue</TabsTrigger>
            <TabsTrigger value="excel" className="md-label-large">Excel Upload</TabsTrigger>
          </TabsList>

          {/* Single Account Mode */}
          <TabsContent value="single" className="space-y-4 py-4">
            <TextField
              label="Account ID"
              placeholder="e.g., warmer-1"
              value={newAccountId}
              onChange={(e) => setNewAccountId(e.target.value)}
            />

            {authToggle}

            <AnimatePresence initial={false}>
              {authMethod === "pairing" && (
                <motion.div {...revealMotion}>
                  <TextField
                    label="Phone Number"
                    placeholder="e.g., 6281234567890"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Bulk Queue Mode */}
          <TabsContent value="bulk" className="space-y-4 py-4">
            <div className="bg-secondary-container text-on-secondary-container rounded-[var(--radius-md)] border border-outline-variant p-4">
              <div className="flex items-start gap-3">
                <span className="bg-on-secondary-container/12 grid size-9 shrink-0 place-items-center rounded-full">
                  <Layers className="h-5 w-5" />
                </span>
                <div>
                  <p className="md-title-small">Continuous Mode</p>
                  <p className="md-body-small mt-1 opacity-80">
                    Accounts will be created one by one. After each scan or connection, a new
                    QR/Pairing code appears automatically.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Total Accounts"
                type="number"
                placeholder="10"
                value={bulkCount}
                onChange={(e) => setBulkCount(e.target.value)}
              />
              <TextField
                label="Account Prefix"
                placeholder="warmer"
                value={bulkPrefix}
                onChange={(e) => setBulkPrefix(e.target.value)}
              />
            </div>

            {authToggle}

            <AnimatePresence initial={false}>
              {authMethod === "pairing" && (
                <motion.div
                  className="bg-warning-container text-on-warning-container rounded-[var(--radius-md)] border border-outline-variant p-3"
                  {...revealMotion}
                >
                  <p className="md-body-small">
                    Pairing mode requires phone numbers. Use Excel Upload for bulk pairing codes.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {bulkCount && bulkPrefix && (
                <motion.div className="bg-surface-container rounded-[var(--radius-md)] p-3" {...revealMotion}>
                  <p className="md-label-medium text-on-surface-variant mb-2">Preview Account IDs:</p>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: Math.min(5, parseInt(bulkCount) || 0) }, (_, i) => (
                      <Badge key={i} variant="outline">
                        {bulkPrefix}-{i + 1}
                      </Badge>
                    ))}
                    {(parseInt(bulkCount) || 0) > 5 && (
                      <Badge variant="outline" className="text-on-surface-variant">
                        +{(parseInt(bulkCount) || 0) - 5} more
                      </Badge>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Excel Upload Mode */}
          <TabsContent value="excel" className="space-y-4 py-4">
            <div className="bg-success-container text-on-success-container rounded-[var(--radius-md)] border border-outline-variant p-4">
              <div className="flex items-start gap-3">
                <span className="bg-on-success-container/12 grid size-9 shrink-0 place-items-center rounded-full">
                  <FileSpreadsheet className="h-5 w-5" />
                </span>
                <div>
                  <p className="md-title-small">Excel Upload</p>
                  <p className="md-body-small mt-1 opacity-80">
                    Upload an Excel file with account data. Columns: account_id, phone (optional),
                    method (qr/pairing)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outlined" size="sm" onClick={() => window.open(wa.templateUrl, "_blank")}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleExcelUpload}
                />
                <Button variant="filled" size="sm" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Excel
                  </span>
                </Button>
              </label>
            </div>

            <AnimatePresence initial={false}>
              {excelUploadResult && (
                <motion.div className="bg-surface-container rounded-[var(--radius-md)] p-3" {...revealMotion}>
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle className="text-success h-4 w-4" />
                    <span className="md-title-small text-on-surface">
                      {excelUploadResult.total} accounts parsed
                    </span>
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {excelUploadResult.accounts?.slice(0, 10).map((acc, i) => (
                        <Badge key={i} variant="outline">
                          {acc.accountId}
                        </Badge>
                      ))}
                      {excelUploadResult.total > 10 && (
                        <Badge variant="outline" className="text-on-surface-variant">
                          +{excelUploadResult.total - 10} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {bulkQueueStatus && bulkQueueStatus.total > 0 && (
                <motion.div className="space-y-2" {...revealMotion}>
                  <div className="md-label-medium text-on-surface-variant flex items-center justify-between">
                    <span>Queue Progress</span>
                    <span className="tabular-nums">
                      {bulkQueueStatus.completed}/{bulkQueueStatus.total}
                    </span>
                  </div>
                  <Progress
                    value={(bulkQueueStatus.completed / bulkQueueStatus.total) * 100}
                    className="h-2"
                  />
                  <div className="md-label-medium flex gap-4">
                    <span className="text-success">{bulkQueueStatus.completed} done</span>
                    <span className="text-on-warning-container">{bulkQueueStatus.pending} pending</span>
                    {bulkQueueStatus.failed > 0 && (
                      <span className="text-danger">{bulkQueueStatus.failed} failed</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outlined" onClick={() => setAddOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddAccount} disabled={isUploading}>
            {isUploading ? (
              <>
                <LoadingIndicator size={18} className="mr-2 text-on-primary" />
                Processing...
              </>
            ) : addMode === "single" ? (
              "Start Session"
            ) : addMode === "bulk" ? (
              <>
                <Layers className="mr-2 h-4 w-4" />
                Start Bulk Queue
              </>
            ) : excelUploadResult ? (
              "Start Processing"
            ) : (
              "Upload First"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
