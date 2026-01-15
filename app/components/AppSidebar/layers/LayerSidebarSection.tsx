import { Layers } from "lucide-react";
import ResizableSection from "../common/ResizableSection";
import LayerList from "./LayerList";

export default function LayerSidebarSection() {
  return (
    <ResizableSection
      header={
        <>
          <Layers size={14} /> <span>Layers</span>
        </>
      }
      onAdd={() => {
        console.log("Add layer");
      }}
    >
      <LayerList />
    </ResizableSection>
  );
}
