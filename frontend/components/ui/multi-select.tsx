"use client";

import * as React from "react";
import { X, ChevronDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";

export type Option = Record<"value" | "label", string>;

export interface MultiSelectProps
    extends Omit<
        React.HTMLAttributes<HTMLDivElement>,
        "onChange" | "defaultValue"
    > {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const MultiSelect = React.forwardRef<HTMLInputElement, MultiSelectProps>(
    (
        {
            options,
            selected,
            onChange,
            placeholder = "Select options...",
            className,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const inputRef = React.useRef<HTMLInputElement>(null);
        const [open, setOpen] = React.useState(false);
        const [inputValue, setInputValue] = React.useState("");

        React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        const handleUnselect = React.useCallback(
            (value: string) => {
                if (disabled) return;
                onChange(selected.filter((s) => s !== value));
            },
            [onChange, selected, disabled]
        );

        const handleKeyDown = React.useCallback(
            (e: React.KeyboardEvent<HTMLDivElement>) => {
                const input = inputRef.current;
                if (input) {
                    if (e.key === "Delete" || e.key === "Backspace") {
                        if (input.value === "" && selected.length > 0) {
                            onChange(selected.slice(0, -1));
                        }
                    }
                    if (e.key === "Escape") {
                        input.blur();
                    }
                }
            },
            [onChange, selected]
        );

        const selectables = options.filter(
            (option) => !selected.includes(option.value)
        );

        return (
            <Command
                onKeyDown={handleKeyDown}
                className={cn("overflow-visible bg-transparent", className)}
                {...props}
            >
                <div
                    onClick={() => {
                        if (!disabled) {
                            inputRef.current?.focus();
                        }
                    }}
                    className={cn(
                        // EXPLICIT MATCH: Copied your exact SelectTrigger classes + flex-wrap + focus-within instead of focus-visible
                        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-9 flex-wrap",
                        // Focus states (handled via focus-within so the inner input triggers it)
                        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
                        disabled ? "cursor-not-allowed opacity-50" : "cursor-text"
                    )}
                >
                    <div className="flex flex-1 flex-wrap gap-1 items-center">
                        {selected.map((val) => {
                            const option = options.find((o) => o.value === val);
                            if (!option) return null;

                            return (
                                <Badge key={option.value} variant="secondary" className="h-6">
                                    {option.label}
                                    <button
                                        type="button"
                                        disabled={disabled}
                                        className={cn(
                                            "ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                            disabled ? "cursor-not-allowed" : "cursor-pointer"
                                        )}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleUnselect(option.value);
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onClick={() => handleUnselect(option.value)}
                                    >
                                        <X className="size-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </Badge>
                            );
                        })}
                        <CommandPrimitive.Input
                            ref={inputRef}
                            value={inputValue}
                            disabled={disabled}
                            onValueChange={setInputValue}
                            onBlur={() => setOpen(false)}
                            onFocus={() => setOpen(true)}
                            placeholder={selected.length === 0 ? placeholder : undefined}
                            className="ml-1 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed min-w-[80px]"
                        />
                    </div>
                    <div className="flex items-center shrink-0">
                        <ChevronDownIcon className="size-4 opacity-50 pointer-events-none" />
                    </div>
                </div>

                <div className="relative mt-2">
                    {open && selectables.length > 0 ? (
                        <div
                            className={cn(
                                // EXPLICIT MATCH: Copied your exact SelectContent classes
                                "bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 absolute top-0 z-50 min-w-[8rem] w-full overflow-hidden rounded-md border shadow-md"
                            )}
                        >
                            <CommandList>
                                <CommandGroup className="h-full overflow-auto max-h-60 p-1">
                                    {selectables.map((option) => {
                                        return (
                                            <CommandItem
                                                key={option.value}
                                                value={option.value}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                onSelect={() => {
                                                    setInputValue("");
                                                    onChange([...selected, option.value]);
                                                    setTimeout(() => inputRef.current?.focus(), 0);
                                                }}
                                                className={cn(
                                                    // EXPLICIT MATCH: Copied your exact SelectItem classes + cmdk selection state
                                                    "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 px-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                )}
                                            >
                                                {option.label}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </div>
                    ) : null}
                </div>
            </Command>
        );
    }
);

MultiSelect.displayName = "MultiSelect";