"use client";

import { Sidebar, SidebarHeader, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable";
import SiteSidebarSection from "./sites/SiteSidebarSection";
import FeatureSidebarSection from "./features/FeatureSidebarSection";
import LayerSidebarSection from "./layers/LayerSidebarSection";
import { MapPinHouse } from "lucide-react";

function FloatingTrigger() {
  const { open } = useSidebar();

  return (
    <SidebarTrigger
      icon="left-open"
      variant="outline"
      aria-hidden={open}
      className={
        [
          "fixed top-2 left-2 z-20 p-4 mt-2",
          // Smooth fade + slide left when sidebar opens
          "transition-all ease-out",
          open
            ? "opacity-0 pointer-events-none duration-100 "
            : "opacity-100 delay-250 duration-400"
        ].join(" ")
      }
    />
  );
}

export default function AppSidebar() {
  return (
    <>
      <FloatingTrigger />
      <Sidebar variant="floating">
        <SidebarHeader className="flex-row items-center justify-between border-b border-gray-400/50">
          <div className="flex flex-row items-center gap-2">
            <MapPinHouse size={20} /><div className="font-semibold">Terra Logger</div>
          </div>
          <SidebarTrigger icon="left-close" />
        </SidebarHeader>

        <ResizablePanelGroup orientation="vertical">
          <SiteSidebarSection defaultSize="20%" />
          <ResizableHandle />
          <LayerSidebarSection defaultSize="30%" />
          <ResizableHandle />
          <FeatureSidebarSection />
        </ResizablePanelGroup>
      </Sidebar>
    </>
  );
}
