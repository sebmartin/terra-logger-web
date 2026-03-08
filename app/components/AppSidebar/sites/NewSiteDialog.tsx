"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Input } from "@/components/ui";

interface NewSiteDialogProps {
  onSave: (siteName: string) => Promise<void>;
  onCancel: () => void;
}

export default function NewSiteDialog({ onSave, onCancel }: NewSiteDialogProps) {
  const [siteName, setSiteName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!siteName.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onSave(siteName.trim());
    } catch {
      setError("Failed to save site. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Name Your Site</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <Input
            type="text"
            placeholder="Site name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!siteName.trim() || isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Site"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
