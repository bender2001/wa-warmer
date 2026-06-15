"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, AlertTriangle, Bot, CheckCircle, Loader2, Save, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ApiError, wa } from "@/lib/api";
import { GROQ_MODELS } from "@/lib/account-meta";
import type { AiSettings as AiSettingsType, AiTestResult } from "@/types";

export function AiSettings() {
  const { toast } = useToast();
  const [aiSettings, setAiSettings] = useState<AiSettingsType>({
    provider: "groq",
    groqApiKey: "",
    groqModel: "llama-3.3-70b-versatile",
    hasGroqKey: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<AiTestResult | null>(null);

  const fetchAiSettings = useCallback(async () => {
    try {
      const data = await wa.getAiSettings();
      setAiSettings({
        provider: data.provider || "groq",
        groqApiKey: data.groqApiKey || "",
        groqModel: data.groqModel || "llama-3.3-70b-versatile",
        hasGroqKey: data.hasGroqKey || false,
        lastUpdated: data.lastUpdated,
      });
    } catch {
      // ignore: keep defaults if settings can't be loaded
    }
  }, []);

  useEffect(() => {
    fetchAiSettings();
  }, [fetchAiSettings]);

  const saveAiSettings = useCallback(async () => {
    setIsSaving(true);
    try {
      await wa.saveAiSettings({
        provider: aiSettings.provider,
        groqApiKey: aiSettings.groqApiKey,
        groqModel: aiSettings.groqModel,
      });
      toast({ title: "Success", description: "AI settings saved successfully" });
      fetchAiSettings();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof ApiError ? error.message : "Failed to save AI settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [aiSettings, fetchAiSettings, toast]);

  const testAiConnection = useCallback(async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const data = await wa.testAi();
      setTestResult({ success: data.success, response: data.response, error: data.error });
      if (data.success) {
        toast({
          title: "Success",
          description: `AI connection successful via ${data.provider}`,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: data.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to test connection";
      setTestResult({ success: false, error: message });
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsTesting(false);
    }
  }, [toast]);

  const statusRows: { label: string; value: React.ReactNode }[] = [
    {
      label: "Provider",
      value: (
        <Badge variant={aiSettings.provider === "groq" ? "assist" : "secondary"}>
          {aiSettings.provider.toUpperCase()}
        </Badge>
      ),
    },
    {
      label: "API Key Status",
      value: (
        <Badge variant={aiSettings.hasGroqKey ? "success" : "danger"}>
          {aiSettings.hasGroqKey ? "Configured" : "Not Set"}
        </Badge>
      ),
    },
    {
      label: "Model",
      value: <span className="text-sm font-medium text-on-surface">{aiSettings.groqModel}</span>,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* AI API Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Bot className="h-5 w-5 text-on-surface-variant" />
            AI API Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl bg-primary-container p-4 text-on-primary-container">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Groq API (Recommended)</p>
                <p className="mt-1 text-xs">
                  Groq offers a FREE tier with generous limits. Get your API key at{" "}
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    console.groq.com/keys
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="groqApiKey">Groq API Key</Label>
            <Input
              id="groqApiKey"
              type="password"
              placeholder="gsk_xxxxxxxxxxxxx"
              value={aiSettings.groqApiKey}
              onChange={(e) => setAiSettings({ ...aiSettings, groqApiKey: e.target.value })}
            />
            <p className="text-xs text-on-surface-variant">
              Get a free API key at console.groq.com/keys
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="groqModel">Model</Label>
            <Select
              value={aiSettings.groqModel}
              onValueChange={(v) => setAiSettings({ ...aiSettings, groqModel: v })}
            >
              <SelectTrigger id="groqModel">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {GROQ_MODELS.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveAiSettings} disabled={isSaving} className="flex-1">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
            <Button variant="outlined" size="icon" onClick={testAiConnection} disabled={isTesting}>
              {isTesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
            </Button>
          </div>

          {testResult && (
            <div
              className={`rounded-2xl p-3 ${
                testResult.success
                  ? "bg-success-container text-on-success-container"
                  : "bg-danger-container text-on-danger-container"
              }`}
            >
              <div className="flex items-start gap-2">
                {testResult.success ? (
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {testResult.success ? "Connection Successful!" : "Connection Failed"}
                  </p>
                  {testResult.response && (
                    <p className="mt-1 text-xs">Response: {testResult.response}</p>
                  )}
                  {testResult.error && <p className="mt-1 text-xs">{testResult.error}</p>}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Status Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Activity className="h-5 w-5 text-success" />
            AI Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {statusRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-2xl bg-surface-container p-3"
              >
                <span className="text-sm text-on-surface-variant">{row.label}</span>
                {row.value}
              </div>
            ))}
            {aiSettings.lastUpdated && (
              <div className="flex items-center justify-between rounded-2xl bg-surface-container p-3">
                <span className="text-sm text-on-surface-variant">Last Updated</span>
                <span className="text-xs text-on-surface-variant">
                  {new Date(aiSettings.lastUpdated).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-warning-container p-4 text-on-warning-container">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Fallback Mode</p>
                <p className="mt-1 text-xs">
                  If the AI fails, the system uses random responses from a predefined list. This
                  keeps accounts active even without API access.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
