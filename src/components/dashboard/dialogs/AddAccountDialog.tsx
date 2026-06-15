"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus,
  QrCode,
  Hash,
  Layers,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle,
  Loader2,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { useUiStore } from "@/stores/ui-store";
import { useWarmer } from "@/hooks/useWarmer";
import { useToast } from "@/hooks/use-toast";
import { wa } from "@/lib/api";
import type { AddMode, AuthMethod, ExcelUploadResult, BulkQueueStatus } from "@/types";

export function AddAccountDialog() {
  const addOpen = useUiStore((s) => s.addOpen);
  const setAddOpen = useUiStore((s) => s.setAddOpen);
  const { startSession, batchStart, uploadExcel, startBulkProcessing, fetchBulkQueue } = useWarmer();
  const { toast } = useToast();

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
    <div>
      <Label>Authentication Method</Label>
      <div className="mt-1.5 flex gap-2">
        <Button
          size="sm"
          variant={authMethod === "qr" ? "filled" : "outlined"}
          onClick={() => setAuthMethod("qr")}
          className="flex-1"
        >
          <QrCode className="mr-1 h-4 w-4" />
          QR Code
        </Button>
        <Button
          size="sm"
          variant={authMethod === "pairing" ? "filled" : "outlined"}
          onClick={() => setAuthMethod("pairing")}
          className="flex-1"
        >
          <Hash className="mr-1 h-4 w-4" />
          Pairing
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={addOpen} onOpenChange={setAddOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add WhatsApp Account
          </DialogTitle>
          <DialogDescription>Choose how to add accounts</DialogDescription>
        </DialogHeader>

        <Tabs value={addMode} onValueChange={(v) => setAddMode(v as AddMode)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="single" className="text-xs">Single</TabsTrigger>
            <TabsTrigger value="bulk" className="text-xs">Bulk Queue</TabsTrigger>
            <TabsTrigger value="excel" className="text-xs">Excel Upload</TabsTrigger>
          </TabsList>

          {/* Single Account Mode */}
          <TabsContent value="single" className="space-y-4 py-4">
            <div>
              <Label>Account ID</Label>
              <Input
                placeholder="e.g., warmer-1"
                value={newAccountId}
                onChange={(e) => setNewAccountId(e.target.value)}
                className="mt-1.5"
              />
            </div>

            {authToggle}

            {authMethod === "pairing" && (
              <div>
                <Label>Phone Number</Label>
                <Input
                  placeholder="e.g., 6281234567890"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            )}
          </TabsContent>

          {/* Bulk Queue Mode */}
          <TabsContent value="bulk" className="space-y-4 py-4">
            <div className="rounded-2xl border border-outline-variant bg-secondary-container p-4 text-on-secondary-container">
              <div className="flex items-start gap-3">
                <Layers className="mt-0.5 h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Continuous Mode</p>
                  <p className="mt-1 text-xs opacity-80">
                    Accounts will be created one by one. After each scan or connection, a new
                    QR/Pairing code appears automatically.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Total Accounts</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={bulkCount}
                  onChange={(e) => setBulkCount(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Account Prefix</Label>
                <Input
                  placeholder="warmer"
                  value={bulkPrefix}
                  onChange={(e) => setBulkPrefix(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            {authToggle}

            {authMethod === "pairing" && (
              <div className="rounded-2xl border border-outline-variant bg-warning-container p-3 text-on-warning-container">
                <p className="text-xs">
                  Pairing mode requires phone numbers. Use Excel Upload for bulk pairing codes.
                </p>
              </div>
            )}

            {bulkCount && bulkPrefix && (
              <div className="rounded-2xl bg-surface-container p-3">
                <p className="mb-2 text-xs text-on-surface-variant">Preview Account IDs:</p>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: Math.min(5, parseInt(bulkCount) || 0) }, (_, i) => (
                    <Badge key={i} variant="outline" className="text-[10px]">
                      {bulkPrefix}-{i + 1}
                    </Badge>
                  ))}
                  {(parseInt(bulkCount) || 0) > 5 && (
                    <Badge variant="outline" className="text-[10px] text-on-surface-variant">
                      +{(parseInt(bulkCount) || 0) - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Excel Upload Mode */}
          <TabsContent value="excel" className="space-y-4 py-4">
            <div className="rounded-2xl border border-outline-variant bg-success-container p-4 text-on-success-container">
              <div className="flex items-start gap-3">
                <FileSpreadsheet className="mt-0.5 h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Excel Upload</p>
                  <p className="mt-1 text-xs opacity-80">
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

            {excelUploadResult && (
              <div className="rounded-2xl bg-surface-container p-3">
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-on-surface">
                    {excelUploadResult.total} accounts parsed
                  </span>
                </div>
                <div className="max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-1">
                    {excelUploadResult.accounts?.slice(0, 10).map((acc, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">
                        {acc.accountId}
                      </Badge>
                    ))}
                    {excelUploadResult.total > 10 && (
                      <Badge variant="outline" className="text-[10px] text-on-surface-variant">
                        +{excelUploadResult.total - 10} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {bulkQueueStatus && bulkQueueStatus.total > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Queue Progress</span>
                  <span>
                    {bulkQueueStatus.completed}/{bulkQueueStatus.total}
                  </span>
                </div>
                <Progress
                  value={(bulkQueueStatus.completed / bulkQueueStatus.total) * 100}
                  className="h-2"
                />
                <div className="flex gap-4 text-xs">
                  <span className="text-success">{bulkQueueStatus.completed} done</span>
                  <span className="text-warning">{bulkQueueStatus.pending} pending</span>
                  {bulkQueueStatus.failed > 0 && (
                    <span className="text-danger">{bulkQueueStatus.failed} failed</span>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outlined" onClick={() => setAddOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddAccount} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
