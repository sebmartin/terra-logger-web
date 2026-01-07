'use client';

import { useState } from "react";
import Modal from "../Modal";
import { Button } from "../../common";

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
    <Modal title="New Site" onClose={onCancel}>
      <input
        type="text"
        placeholder="Site name"
        value={siteName}
        onChange={(e) => setSiteName(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        autoFocus
      />
      <p className="modal-hint">
        Next, you&apos;ll position the map to capture the site area.
      </p>
      <div className="modal-actions">
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!siteName.trim()}
        >
          Next
        </Button>
      </div>
    </Modal>
  );
}
