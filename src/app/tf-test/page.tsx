"use client";

import { Search } from "lucide-react";
import { TextField } from "@/components/ui/text-field";

export default function TfTest() {
  return (
    <div className="min-h-screen bg-surface p-10">
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 rounded-[var(--radius-lg)] bg-surface-container-low p-8">
        <div>
          <p className="md-label-small text-on-surface-variant mb-2">outlined · empty (resting)</p>
          <TextField label="Account ID" placeholder="e.g., warmer-1" />
        </div>
        <div>
          <p className="md-label-small text-on-surface-variant mb-2">outlined · filled value (floated)</p>
          <TextField label="Account ID" defaultValue="warmer-1" />
        </div>
        <div>
          <p className="md-label-small text-on-surface-variant mb-2">outlined · leading icon + value</p>
          <TextField label="Search" leadingIcon={<Search />} defaultValue="hello" />
        </div>
        <div>
          <p className="md-label-small text-on-surface-variant mb-2">outlined · supporting + empty</p>
          <TextField label="Groq API Key" supportingText="Get a free key at console.groq.com/keys" />
        </div>
        <div>
          <p className="md-label-small text-on-surface-variant mb-2">outlined · error</p>
          <TextField label="Phone Number" defaultValue="abc" error supportingText="Invalid number" />
        </div>
        <div>
          <p className="md-label-small text-on-surface-variant mb-2">filled · value</p>
          <TextField variant="filled" label="Account Prefix" defaultValue="warmer" />
        </div>
        <div>
          <p className="md-label-small text-on-surface-variant mb-2">filled · empty (resting)</p>
          <TextField variant="filled" label="Account Prefix" />
        </div>
        <div>
          <p className="md-label-small text-on-surface-variant mb-2">multiline · value</p>
          <TextField label="Notes" multiline defaultValue={"line one\nline two"} />
        </div>
      </div>
    </div>
  );
}
