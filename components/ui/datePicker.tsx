"use client";

import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
  /** Giá trị ngày (hỗ trợ 'YYYY-MM-DD', ISO string, 'dd/MM/yyyy', 'dd-MM-yyyy' hoặc Date) */
  value?: string | Date | null;
  /** Callback trả về chuỗi chuẩn 'YYYY-MM-DD' (hoặc '' khi xóa) */
  onChange?: (dateString: string) => void;
  /** Ngày nhỏ nhất cho phép ('YYYY-MM-DD', 'dd/MM/yyyy', 'dd-MM-yyyy' hoặc Date) */
  min?: string | Date | null;
  /** Ngày lớn nhất cho phép ('YYYY-MM-DD', 'dd/MM/yyyy', 'dd-MM-yyyy' hoặc Date) */
  max?: string | Date | null;
  /** Định dạng hiển thị mặc định khi chọn từ lịch ('dd/MM/yyyy' hoặc 'dd-MM-yyyy') */
  displayFormat?: "dd/MM/yyyy" | "dd-MM-yyyy";
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  showQuickPresets?: boolean;
  clearable?: boolean;
}

/**
 * Đưa Date về 00:00:00 giờ local để so sánh min/max chuẩn xác theo ngày
 */
function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

/**
 * Kiểm tra ngày/tháng/năm có hợp lệ trong lịch thực tế không (chặn 31/02, 30/02...)
 */
function buildValidDate(day: number, month: number, year: number): Date | null {
  if (year < 1900 || year > 2100) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  const d = new Date(year, month - 1, day, 0, 0, 0, 0);
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return null;
  }
  return d;
}

/**
 * Parse linh hoạt cả 2 định dạng 'dd/MM/yyyy', 'dd-MM-yyyy', chuẩn ISO 'yyyy-MM-dd', 'ddMMyyyy' hoặc Date
 */
export function parseFlexibleDateString(
  rawInput?: string | Date | null,
): Date | undefined {
  if (!rawInput) return undefined;
  if (rawInput instanceof Date) {
    return isValid(rawInput) ? startOfLocalDay(rawInput) : undefined;
  }

  const raw = String(rawInput).trim();
  if (!raw) return undefined;

  // 1. Hỗ trợ cả dd/MM/yyyy và dd-MM-yyyy (cho phép gõ 1 hoặc 2 chữ số ngày/tháng)
  const dmyMatch = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10);
    const year = parseInt(dmyMatch[3], 10);
    return buildValidDate(day, month, year) ?? undefined;
  }

  // 2. Hỗ trợ gõ liền 8 số ddMMyyyy (VD: 21102026)
  const compactMatch = raw.match(/^(\d{2})(\d{2})(\d{4})$/);
  if (compactMatch) {
    const day = parseInt(compactMatch[1], 10);
    const month = parseInt(compactMatch[2], 10);
    const year = parseInt(compactMatch[3], 10);
    return buildValidDate(day, month, year) ?? undefined;
  }

  // 3. Hỗ trợ chuẩn API yyyy-MM-dd hoặc ISO string
  const ymdMatch = raw.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10);
    const day = parseInt(ymdMatch[3], 10);
    return buildValidDate(day, month, year) ?? undefined;
  }

  try {
    const d = parseISO(raw);
    return isValid(d) ? startOfLocalDay(d) : undefined;
  } catch {
    return undefined;
  }
}

export function DatePicker({
  value,
  onChange,
  min,
  max,
  displayFormat = "dd/MM/yyyy",
  placeholder = "dd/MM/yyyy hoặc dd-MM-yyyy",
  disabled = false,
  className,
  inputClassName,
  iconClassName = "text-amber-500",
  showQuickPresets = true,
  clearable = true,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  // Ghi nhớ định dạng dấu phân cách người dùng đang gõ ('dd/MM/yyyy' hoặc 'dd-MM-yyyy')
  const activeFormatRef = React.useRef<"dd/MM/yyyy" | "dd-MM-yyyy">(
    displayFormat,
  );

  const minDate = React.useMemo(() => parseFlexibleDateString(min), [min]);
  const maxDate = React.useMemo(() => parseFlexibleDateString(max), [max]);
  const parsedDate = React.useMemo(
    () => parseFlexibleDateString(value),
    [value],
  );

  const [inputText, setInputText] = React.useState<string>(() =>
    parsedDate ? format(parsedDate, displayFormat, { locale: vi }) : "",
  );

  const [monthView, setMonthView] = React.useState<Date>(() =>
    parsedDate || new Date(),
  );

  // Đồng bộ khi prop `value` từ bên ngoài thay đổi
  React.useEffect(() => {
    const d = parseFlexibleDateString(value);
    setInputText(
      d ? format(d, activeFormatRef.current, { locale: vi }) : "",
    );
    setErrorMsg("");
    if (d) {
      setMonthView(d);
    }
  }, [value]);

  // Kiểm tra ngày có vi phạm min / max không
  const checkMinMax = React.useCallback(
    (d: Date): string | null => {
      const time = startOfLocalDay(d).getTime();
      if (minDate && time < minDate.getTime()) {
        return `Từ ${format(minDate, activeFormatRef.current)} trở đi`;
      }
      if (maxDate && time > maxDate.getTime()) {
        return `Tối đa đến ${format(maxDate, activeFormatRef.current)}`;
      }
      return null;
    },
    [minDate, maxDate],
  );

  const isDateDisabled = React.useCallback(
    (d: Date): boolean => {
      const time = startOfLocalDay(d).getTime();
      if (minDate && time < minDate.getTime()) return true;
      if (maxDate && time > maxDate.getTime()) return true;
      return false;
    },
    [minDate, maxDate],
  );

  // Xử lý khi người dùng gõ trực tiếp dd/MM/yyyy hoặc dd-MM-yyyy
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputText(raw);

    if (raw.includes("-")) {
      activeFormatRef.current = "dd-MM-yyyy";
    } else if (raw.includes("/")) {
      activeFormatRef.current = "dd/MM/yyyy";
    }

    if (!raw.trim()) {
      setErrorMsg("");
      onChange?.("");
      return;
    }

    // Khi người dùng đã gõ đủ năm 4 chữ số (dd/MM/yyyy, dd-MM-yyyy hoặc 8 số ddMMyyyy)
    const isFullDateTyped =
      /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/.test(raw.trim()) ||
      /^(\d{2})(\d{2})(\d{4})$/.test(raw.trim());

    if (isFullDateTyped) {
      const d = parseFlexibleDateString(raw);
      if (!d) {
        setErrorMsg("Ngày không hợp lệ");
        return;
      }

      const rangeErr = checkMinMax(d);
      if (rangeErr) {
        setErrorMsg(rangeErr);
        return;
      }

      setErrorMsg("");
      setMonthView(d);
      onChange?.(format(d, "yyyy-MM-dd"));
    } else {
      setErrorMsg("");
    }
  };

  // Chuẩn hóa lại chuỗi hiển thị khi rời ô input (onBlur)
  const handleInputBlur = () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      setErrorMsg("");
      return;
    }

    const d = parseFlexibleDateString(trimmed);
    if (!d) {
      setErrorMsg("Nhập theo dạng dd/MM/yyyy hoặc dd-MM-yyyy");
      return;
    }

    const rangeErr = checkMinMax(d);
    if (rangeErr) {
      setErrorMsg(rangeErr);
      return;
    }

    setErrorMsg("");
    setInputText(format(d, activeFormatRef.current, { locale: vi }));
    setMonthView(d);
    onChange?.(format(d, "yyyy-MM-dd"));
  };

  // Chọn ngày từ lịch trong Popover/Modal
  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      if (clearable && onChange) {
        setInputText("");
        setErrorMsg("");
        onChange("");
      }
      return;
    }

    if (isDateDisabled(selectedDate)) return;

    const normalized = startOfLocalDay(selectedDate);
    setInputText(format(normalized, activeFormatRef.current, { locale: vi }));
    setErrorMsg("");
    setMonthView(normalized);
    onChange?.(format(normalized, "yyyy-MM-dd"));
    setOpen(false);
  };

  const setPresetToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = startOfLocalDay(new Date());
    if (!isDateDisabled(today)) {
      handleSelect(today);
    }
  };

  const setPresetYesterday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const yesterday = startOfLocalDay(new Date());
    yesterday.setDate(yesterday.getDate() - 1);
    if (!isDateDisabled(yesterday)) {
      handleSelect(yesterday);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputText("");
    setErrorMsg("");
    onChange?.("");
  };

  const todayDisabled = isDateDisabled(new Date());
  const yesterdayDate = React.useMemo(() => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return y;
  }, []);
  const yesterdayDisabled = isDateDisabled(yesterdayDate);

  return (
    <div className={cn("w-full space-y-1", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative flex items-center w-full">
          <Input
            type="text"
            inputMode="numeric"
            disabled={disabled}
            value={inputText}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleInputBlur();
                setOpen(false);
              }
            }}
            placeholder={placeholder}
            aria-invalid={Boolean(errorMsg)}
            className={cn(
              "h-9.5 pr-14 font-mono text-xs bg-background border-border/80 shadow-2xs",
              errorMsg &&
                "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500/20",
              inputClassName,
            )}
          />

          <div className="absolute right-1.5 flex items-center gap-0.5">
            {clearable && inputText && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                title="Xóa ngày"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                className={cn(
                  "p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer",
                  open && "bg-muted",
                  disabled && "opacity-50 pointer-events-none",
                )}
                title="Chọn ngày từ lịch"
              >
                <CalendarIcon
                  className={cn("w-3.5 h-3.5 shrink-0", iconClassName)}
                />
              </button>
            </PopoverTrigger>
          </div>
        </div>

        <PopoverContent
          className="w-auto p-0 rounded-xl shadow-lg border border-border/80 bg-card overflow-hidden"
          align="end"
        >
          {/* Quick presets & Min/Max info */}
          {(showQuickPresets || minDate || maxDate) && (
            <div className="flex items-center justify-between gap-2 p-2 border-b border-border/70 bg-muted/40 text-[11px]">
              {showQuickPresets ? (
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground font-medium px-1">
                    Nhanh:
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={todayDisabled}
                    onClick={setPresetToday}
                    className="h-6 px-2 text-[11px] rounded-md hover:bg-background font-medium cursor-pointer"
                  >
                    Hôm nay
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={yesterdayDisabled}
                    onClick={setPresetYesterday}
                    className="h-6 px-2 text-[11px] rounded-md hover:bg-background font-medium cursor-pointer"
                  >
                    Hôm qua
                  </Button>
                </div>
              ) : (
                <span />
              )}

              {(minDate || maxDate) && (
                <span className="text-[10px] font-mono text-muted-foreground px-1">
                  {minDate ? `>=${format(minDate, "dd/MM/yyyy")}` : ""}
                  {minDate && maxDate ? " " : ""}
                  {maxDate ? `<=${format(maxDate, "dd/MM/yyyy")}` : ""}
                </span>
              )}
            </div>
          )}

          <Calendar
            mode="single"
            month={monthView}
            onMonthChange={setMonthView}
            selected={parsedDate}
            onSelect={handleSelect}
            disabled={isDateDisabled}
            locale={vi}
            className="rounded-b-xl"
          />
        </PopoverContent>
      </Popover>

      {errorMsg && (
        <p className="text-[11px] text-rose-500 font-medium leading-tight">
          {errorMsg}
        </p>
      )}
    </div>
  );
}

export default DatePicker;
