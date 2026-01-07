'use client';

import { ReactNode, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`flex flex-col overflow-hidden border-b border-gray-200 ${isOpen ? "flex-1" : "flex-none"}`}>
      <div
        className="px-5 py-4 flex items-center justify-between bg-gray-50 border-b border-gray-200 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <h3 className="m-0 text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</h3>
        </div>
        {headerActions && (
          <div onClick={(e) => e.stopPropagation()}>{headerActions}</div>
        )}
      </div>
      {isOpen && children}
    </div>
  );
}
