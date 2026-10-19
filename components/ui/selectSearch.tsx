"use client";

import { Check, ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "./input";

type SelectValue = string | number;

type SelectOption = {
  value: SelectValue;
  label: string;
};

/* =========================
   Hook click outside
========================= */

function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  callback: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

/* =========================
   Search Select
========================= */

function SearchSelect({
  value,
  options,
  placeholder = "Chọn",
  onChange,
  className,
  disabled = false,
  isLoading = false,
  isClear = true,
  height = 8,
}: {
  value?: SelectValue;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: SelectValue | "") => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  isClear?: boolean;
  height?: number;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");

  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    setOpen(false);
    setQuery("");
  });

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase()),
  );

  const selectedOption = options.find((option) => option.value === value);

  function handleSelect(option: SelectOption) {
    onChange?.(option.value);
    setOpen(false);
    setQuery("");
  }

  function handleClear(event: React.MouseEvent) {
    event.stopPropagation();
    onChange?.("");
    setQuery("");
  }

  function toggleOpen() {
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Ước lượng chiều cao dropdown khoảng 250px
      if (spaceBelow < 250 && rect.top > 250) {
        setPlacement("top");
      } else {
        setPlacement("bottom");
      }
    }
    setOpen((current) => !current);
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      {/* Button */}
      <button
        type="button"
        disabled={disabled || isLoading}
        onClick={toggleOpen}
        className={`flex h-${height} w-full cursor-pointer items-center justify-between rounded-lg border border-input bg-card px-3 text-left text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50`}
        aria-expanded={open}
      >
        <span
          className={
            selectedOption ? "text-foreground" : "text-muted-foreground"
          }
        >
          {isLoading
            ? "Đang tải dữ liệu..."
            : selectedOption?.label || placeholder}
        </span>

        <div className="flex items-center gap-1">
          {selectedOption && isClear && (
            <X
              className="size-4 cursor-pointer text-muted-foreground hover:text-destructive"
              onClick={handleClear}
            />
          )}

          <ChevronDown
            aria-hidden="true"
            className={`size-4 text-muted-foreground transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute left-0 right-0 z-20 rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg ${
            placement === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {/* Search */}
          <Input
            autoFocus
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm kiếm..."
            className="mb-2 h-9 w-full rounded-md border border-input px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            aria-label="Tìm kiếm lựa chọn"
          />

          {/* Options */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? "bg-muted font-semibold text-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{option.label}</span>

                    {isSelected && (
                      <Check
                        aria-hidden="true"
                        className="size-4 text-primary"
                      />
                    )}
                  </button>
                );
              })
            ) : (
              <p className="px-2.5 py-2 text-sm text-muted-foreground">
                Không tìm thấy kết quả
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   Multi Search Select
========================= */

function MultiSearchSelect({
  value = [],
  options,
  placeholder = "Chọn",
  onChange,
}: {
  value?: SelectValue[];
  options: SelectOption[];
  placeholder?: string;
  onChange?: (values: SelectValue[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");

  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    setOpen(false);
    setQuery("");
  });

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase()),
  );

  function toggleOption(optionValue: SelectValue) {
    const nextValues = value.includes(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue];

    onChange?.(nextValues);
  }

  function getOptionLabel(optionValue: SelectValue) {
    return (
      options.find((option) => option.value === optionValue)?.label ??
      String(optionValue)
    );
  }

  function toggleOpen() {
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;

      if (spaceBelow < 250 && rect.top > 250) {
        setPlacement("top");
      } else {
        setPlacement("bottom");
      }
    }
    setOpen((current) => !current);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Button */}
      <button
        type="button"
        onClick={toggleOpen}
        className="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-3 py-2 text-left text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        aria-expanded={open}
      >
        <span
          className={
            value.length ? "flex flex-wrap gap-1" : "text-muted-foreground"
          }
        >
          {value.length > 0
            ? value.map((item) => (
                <span
                  key={item}
                  className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                >
                  {getOptionLabel(item)}
                </span>
              ))
            : placeholder}
        </span>

        <ChevronDown
          aria-hidden="true"
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute left-0 right-0 z-20 rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg ${
            placement === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {/* Search */}
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm kiếm..."
            className="mb-2 h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            aria-label="Tìm kiếm lựa chọn"
          />

          {/* Options */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleOption(option.value)}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    {/* Checkbox */}
                    <span
                      className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background"
                      }`}
                    >
                      {isSelected && (
                        <Check aria-hidden="true" className="size-3" />
                      )}
                    </span>

                    <span>{option.label}</span>
                  </button>
                );
              })
            ) : (
              <p className="px-2.5 py-2 text-sm text-muted-foreground">
                Không tìm thấy kết quả
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   Export
========================= */

export { MultiSearchSelect, SearchSelect };
export type { SelectOption, SelectValue };
