"use client";

import * as React from "react";
import { createContext, useContext } from "react";
import { GripVerticalIcon } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { cn } from "@/lib/utils";

type Orientation = "horizontal" | "vertical";

const OrientationContext = createContext<Orientation>("horizontal");

function ResizablePanelGroup({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof Group>) {
  return (
    <OrientationContext.Provider value={orientation}>
      <Group
        data-slot="resizable-panel-group"
        data-orientation={orientation}
        orientation={orientation}
        className={cn("flex h-full w-full", orientation === "vertical" && "flex-col", className)}
        {...props}
      />
    </OrientationContext.Provider>
  );
}

function ResizablePanel({ ...props }: React.ComponentProps<typeof Panel>) {
  return <Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  withHandle?: boolean;
}) {
  const orientation = useContext(OrientationContext);
  const isVertical = orientation === "vertical";

  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        "bg-neutral-200 relative flex items-center justify-center outline-none dark:bg-neutral-800",
        isVertical ? "h-1 w-full cursor-row-resize" : "h-full w-1 cursor-col-resize",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            "bg-neutral-200 z-10 flex items-center justify-center rounded-sm border dark:bg-neutral-800",
            isVertical ? "h-3 w-4 rotate-90" : "h-4 w-3"
          )}
        >
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </Separator>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
