import { MapPinned, Plus } from "lucide-react";
import ResizableSection from "../common/ResizableSection";
import SiteList from "./SiteList";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelProps } from "react-resizable-panels";

export default function SiteSidebarSection({ ...props }: PanelProps) {
  const { setOpen: setSidebarOpen } = useSidebar();

  const handleAddSite = () => {
    setSidebarOpen(false);
  }

  return (
    <ResizableSection
      header={
        <>
          <MapPinned size={14} /> <span>Sites</span>
        </>
      }
      icons={[
        { icon: Plus, onClick: handleAddSite, tooltip: "Add a new Site" },
      ]}
      {...props}
    >
      <SiteList />
    </ResizableSection>
  );
}
