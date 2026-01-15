import { MapPinned } from "lucide-react";
import ResizableSection from "../common/ResizableSection";
import SiteList from "./SiteList";

export default function SiteSidebarSection() {
  return (
    <ResizableSection
      header={
        <>
          <MapPinned size={14} /> <span>Sites</span>
        </>
      }
      onAdd={() => {
        console.log("Add Site");
      }}
    >
      <SiteList />
    </ResizableSection>
  );
}
