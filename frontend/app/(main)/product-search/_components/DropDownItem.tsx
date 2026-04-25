interface DropdownItemProps {
    icon: React.ReactNode
    label: React.ReactNode
    onClick: () => void
    onMouseDown: (e: React.MouseEvent) => void
    rightIcon?: React.ReactNode
}

export const DropdownItem = ({ icon, label, onClick, onMouseDown, rightIcon }: DropdownItemProps) => {
    return (
        <div
            role="option"
            aria-selected="false"
            className="relative flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors duration-100 group"
            onMouseDown={onMouseDown}
            onClick={onClick}
        >
            <span className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                {icon}
            </span>
            <span className="min-w-0 flex-1 truncate">{label}</span>
            {rightIcon && (
                <span className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
                    {rightIcon}
                </span>
            )}
        </div>
    )
}
