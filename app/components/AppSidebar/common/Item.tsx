interface ItemProps extends React.PropsWithChildren {
  text: string;
  isSelected?: boolean;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export function Item({ text, isSelected, onClick, onContextMenu, children }: ItemProps) {
  return (
    <div
      className={`mx-2 my-1 px-2 py-1 rounded-sm flex items-center gap-0 cursor-pointer transition-all duration-200 ${isSelected
        ? "bg-gradient-to-r from-green-50 to-indigo-50 border-l-4 border-l-green-300 shadow-sm"
        : "hover:bg-slate-50 hover:shadow-sm"
        }`}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e);
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-slate-800 truncate">{text}</div>
      </div>
      {children}
    </div>
  );
}