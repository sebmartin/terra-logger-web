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
    <div className={`sidebar-section ${isOpen ? "expanded" : "collapsed"}`}>
      <div
        className="section-header collapsible"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <h3>{title}</h3>
        </div>
        {headerActions && (
          <div onClick={(e) => e.stopPropagation()}>{headerActions}</div>
        )}
      </div>
      {isOpen && children}
    </div>
  );
}
