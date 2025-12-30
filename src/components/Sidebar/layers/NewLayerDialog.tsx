import { useState } from "react";
import Modal from "../Modal";
import { Button } from "../../common";

interface NewLayerDialogProps {
  onCreate: (layerName: string) => void;
  onCancel: () => void;
}

export default function NewLayerDialog({
  onCreate,
  onCancel,
}: NewLayerDialogProps) {
  const [layerName, setLayerName] = useState("");

  const handleSubmit = () => {
    if (layerName.trim()) {
      onCreate(layerName.trim());
    }
  };

  return (
    <Modal title="New Layer" onClose={onCancel}>
      <input
        type="text"
        placeholder="Layer name"
        value={layerName}
        onChange={(e) => setLayerName(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        autoFocus
      />
      <div className="modal-actions">
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!layerName.trim()}
        >
          Create
        </Button>
      </div>
    </Modal>
  );
}
