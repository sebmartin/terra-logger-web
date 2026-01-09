'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";

interface NewSiteDialogProps {
  onNext: (siteName: string) => void;
  onCancel: () => void;
}

export default function NewSiteDialog({
  onNext,
  onCancel,
}: NewSiteDialogProps) {
  const [siteName, setSiteName] = useState("");

  const handleSubmit = () => {
    if (siteName.trim()) {
      onNext(siteName.trim());
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>New Site</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Site name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-600 mt-2">
            Next, you&apos;ll position the map to capture the site area.
          </p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!siteName.trim()}>
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
