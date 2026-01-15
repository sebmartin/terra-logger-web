"use client";

import { Sidebar, SidebarHeader, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable";
import SiteSidebarSection from "./sites/SiteSidebarSection";
import FeatureSidebarSection from "./features/FeatureSidebarSection";
import LayerSidebarSection from "./layers/LayerSidebarSection";

function FloatingTrigger() {
  const { open } = useSidebar();

  if (open) return null;

  return <SidebarTrigger className="fixed top-2 left-2 z-20" />;
}

export default function AppSidebar() {
  return (
    <>
      <FloatingTrigger />
      <Sidebar variant="floating">
        <SidebarHeader className="flex-row items-center justify-between">
          <span className="font-semibold">Terra Logger</span>
          <SidebarTrigger />
        </SidebarHeader>

        <ResizablePanelGroup orientation="vertical" className="flex-1">
          <SiteSidebarSection />
          <ResizableHandle />
          <LayerSidebarSection />
          <ResizableHandle />
          <FeatureSidebarSection />
        </ResizablePanelGroup>
      </Sidebar>
    </>
  );
}
