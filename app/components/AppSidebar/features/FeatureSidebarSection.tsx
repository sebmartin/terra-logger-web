import { VectorSquare } from "lucide-react";
import ResizableSection from "../common/ResizableSection";
import FeatureList from "./FeatureList";

export default function FeatureSidebarSection() {
  return (
    <ResizableSection
      header={
        <>
          <VectorSquare size={14} />
          <span>Features</span>
        </>
      }
      onAdd={() => {
        console.log("Add feature");
      }}
    >
      <FeatureList />
    </ResizableSection>
  );
}
