'use client';

import { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ScrollArea } from "../ui/scroll-area";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  headerActions?: ReactNode;
}

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  headerActions,
}: CollapsibleSectionProps) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className="flex flex-col overflow-hidden bg-white border-b border-slate-200 transition-all duration-300 ease-in-out data-[state=open]:flex-1 data-[state=closed]:flex-none"
    >
      <div className="px-4 py-3.5 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-all duration-200 border-b border-slate-200">
        <CollapsibleTrigger className="flex items-center gap-2.5 flex-1 group">
          <div className="w-6 h-6 rounded-md bg-white group-hover:bg-slate-200 flex items-center justify-center transition-colors shadow-sm border border-slate-200">
            <ChevronDown size={13} className="text-slate-700 transition-transform duration-200 group-data-[state=closed]:-rotate-90" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">{title}</h3>
        </CollapsibleTrigger>
        {headerActions && (
          <div className="flex items-center gap-2 h-8">{headerActions}</div>
        )}
      </div>
      <CollapsibleContent className="flex-1 overflow-hidden bg-white">
        <ScrollArea className="h-full">
          <div className="py-1">
            {children}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}
