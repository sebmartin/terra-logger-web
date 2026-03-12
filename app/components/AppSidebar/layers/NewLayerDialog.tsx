"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from "@/components/ui";

interface NewLayerDialogProps {
  onCreate: (layerName: string) => void;
  onCancel: () => void;
}

export default function NewLayerDialog({ onCreate, onCancel }: NewLayerDialogProps) {
  const [layerName, setLayerName] = useState("");

  const handleSubmit = () => {
    if (layerName.trim()) {
      onCreate(layerName.trim());
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>New Layer</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Layer name"
            value={layerName}
            onChange={(e) => setLayerName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!layerName.trim()}>
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
