"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerInputProps {
  /** Giá trị ngày (hỗ trợ 'yyyy-MM-dd', ISO string, 'dd/MM/yyyy', 'dd-MM-yyyy' hoặc Date) */
  value?: string | Date | null;
  /**
   * Callback khi ngày thay đổi:
   * - value: chuỗi chuẩn 'yyyy-MM-dd' (hoặc '' khi xóa) để truyền thẳng vào API/Model
   * - displayValue: chuỗi hiển thị ('dd/MM/yyyy' hoặc 'dd-MM-yyyy')
   * - date: đối tượng Date hoặc null
   */
  onChange?: (value: string, displayValue: string, date: Date | null) => void;
  /** Ngày tối thiểu cho phép chọn/nhập ('yyyy-MM-dd', 'dd/MM/yyyy', 'dd-MM-yyyy' hoặc Date) */
  min?: string | Date | null;
  /** Ngày tối đa cho phép chọn/nhập ('yyyy-MM-dd', 'dd/MM/yyyy', 'dd-MM-yyyy' hoặc Date) */
  max?: string | Date | null;
  /** Ký tự phân cách hiển thị mặc định khi chọn từ lịch ('/' -> dd/MM/yyyy, '-' -> dd-MM-yyyy) */
  displaySeparator?: "/" | "-";
  placeholder?: string;
  disabled?: boolean;
  isClearable?: boolean;
  className?: string;
  inputClassName?: string;
  outputFormat?: "date" | "iso" | "iso-local";
}

const WEEKDAYS_VN = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTHS_VN = [
  "Tháng 01",
  "Tháng 02",
  "Tháng 03",
  "Tháng 04",
  "Tháng 05",
  "Tháng 06",
  "Tháng 07",
  "Tháng 08",
  "Tháng 09",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

/**
 * Chuẩn hóa đối tượng Date về 00:00:00 giờ local để so sánh chính xác theo ngày
 */
function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

/**
 * Kiểm tra năm/tháng/ngày có tạo thành ngày thực tế hợp lệ không (VD: chặn 31/02)
 */
function createValidDate(
  day: number,
  month: number,
  year: number,
): Date | null {
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
 * Parse mọi chuỗi ngày ('dd/MM/yyyy', 'dd-MM-yyyy', 'yyyy-MM-dd', ISO string, 'ddMMyyyy') hoặc Date
 */
export function parseFlexibleDate(input?: string | Date | null): Date | null {
  if (!input) return null;
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : startOfLocalDay(input);
  }

  const raw = String(input).trim();
  if (!raw) return null;

  // 1. Dạng dd/MM/yyyy hoặc dd-MM-yyyy (cho phép nhập 1 hoặc 2 chữ số ngày/tháng)
  const dmyMatch = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10);
    const year = parseInt(dmyMatch[3], 10);
    return createValidDate(day, month, year);
  }

  // 2. Dạng gõ liền 8 chữ số ddMMyyyy (VD: 21102026)
  const compactMatch = raw.match(/^(\d{2})(\d{2})(\d{4})$/);
  if (compactMatch) {
    const day = parseInt(compactMatch[1], 10);
    const month = parseInt(compactMatch[2], 10);
    const year = parseInt(compactMatch[3], 10);
    return createValidDate(day, month, year);
  }

  // 3. Dạng chuẩn API / SQL: yyyy-MM-dd hoặc yyyy/MM/dd (kèm hoặc không kèm T00:00:00)
  const ymdMatch = raw.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10);
    const day = parseInt(ymdMatch[3], 10);
    return createValidDate(day, month, year);
  }

  return null;
}

/**
 * Format Date sang 'dd/MM/yyyy' hoặc 'dd-MM-yyyy'
 */
export function formatDisplayDate(
  date: Date | null,
  separator: "/" | "-" = "/",
): string {
  if (!date || isNaN(date.getTime())) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}${separator}${mm}${separator}${yyyy}`;
}

/**
 * Format Date sang chuỗi chuẩn theo outputFormat mong muốn
 * - 'date' (mặc định): 'yyyy-MM-dd' (chuẩn DateOnly, VD: '2026-10-21')
 * - 'iso': 'yyyy-MM-ddT00:00:00.000Z' (chuẩn ISO UTC bảo toàn ngày)
 * - 'iso-local': 'yyyy-MM-ddT00:00:00' (chuẩn ISO Local datetime)
 */
export function formatOutputDate(
  date: Date | null,
  formatType: "date" | "iso" | "iso-local" = "date",
): string {
  if (!date || isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  if (formatType === "iso") {
    // Bảo toàn đúng ngày đã chọn theo chuẩn UTC (tránh bị lệch lùi 1 ngày do GMT+7)
    return new Date(
      Date.UTC(yyyy, date.getMonth(), date.getDate(), 0, 0, 0, 0),
    ).toISOString();
  }

  if (formatType === "iso-local") {
    return `${yyyy}-${mm}-${dd}T00:00:00`;
  }

  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Format Date sang chuẩn API 'yyyy-MM-dd' (giữ tương thích ngược)
 */
export function formatIsoDate(date: Date | null): string {
  return formatOutputDate(date, "date");
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChange,
  min,
  max,
  displaySeparator = "/",
  placeholder = "dd/MM/yyyy hoặc dd-MM-yyyy",
  disabled = false,
  isClearable = true,
  outputFormat = "iso",
  className,
  inputClassName,
}) => {
  const [open, setOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<"days" | "months" | "years">(
    "days",
  );
  const [validationMsg, setValidationMsg] = useState<string>("");

  const minDate = useMemo(() => parseFlexibleDate(min), [min]);
  const maxDate = useMemo(() => parseFlexibleDate(max), [max]);
  const parsedValueDate = useMemo(() => parseFlexibleDate(value), [value]);

  // Lưu giữ ký tự phân cách người dùng vừa gõ ('/' hoặc '-')
  const separatorRef = useRef<"/" | "-">(displaySeparator);

  const [inputText, setInputText] = useState<string>(() =>
    formatDisplayDate(parsedValueDate, displaySeparator),
  );

  // Tháng/năm đang hiển thị trên Modal Lịch
  const [viewMonth, setViewMonth] = useState<number>(() =>
    parsedValueDate ? parsedValueDate.getMonth() : new Date().getMonth(),
  );
  const [viewYear, setViewYear] = useState<number>(() =>
    parsedValueDate ? parsedValueDate.getFullYear() : new Date().getFullYear(),
  );

  /**
   * Helper kích hoạt onChange đồng bộ theo định dạng outputFormat
   */
  const emitChange = (d: Date | null) => {
    if (!d) {
      onChange?.("", "", null);
      return;
    }
    const val = formatOutputDate(d, outputFormat);
    const displayVal = formatDisplayDate(d, separatorRef.current);
    onChange?.(val, displayVal, d);
  };

  // Đồng bộ khi prop `value` từ bên ngoài thay đổi
  useEffect(() => {
    const d = parseFlexibleDate(value);
    setInputText(formatDisplayDate(d, separatorRef.current));
    setValidationMsg("");
    if (d) {
      setViewMonth(d.getMonth());
      setViewYear(d.getFullYear());
    }
  }, [value]);

  /**
   * Kiểm tra 1 ngày có nằm ngoài khoảng [minDate, maxDate] hay không
   */
  const isOutOfRange = (d: Date): "below_min" | "above_max" | null => {
    const target = startOfLocalDay(d).getTime();
    if (minDate && target < minDate.getTime()) return "below_min";
    if (maxDate && target > maxDate.getTime()) return "above_max";
    return null;
  };

  /**
   * Xử lý khi người dùng gõ trực tiếp vào ô Input
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputText(raw);

    // Tự động ghi nhận dấu phân cách người dùng thích dùng ('/' hay '-')
    if (raw.includes("-")) {
      separatorRef.current = "-";
    } else if (raw.includes("/")) {
      separatorRef.current = "/";
    }

    if (!raw.trim()) {
      setValidationMsg("");
      emitChange(null);
      return;
    }

    // Chỉ parse & trigger onChange ngay khi người dùng đã gõ đủ năm 4 chữ số
    const isCompletePattern =
      /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/.test(raw.trim()) ||
      /^(\d{2})(\d{2})(\d{4})$/.test(raw.trim());

    if (isCompletePattern) {
      const parsed = parseFlexibleDate(raw);
      if (!parsed) {
        setValidationMsg("Ngày không tồn tại trong lịch");
        return;
      }

      const rangeError = isOutOfRange(parsed);
      if (rangeError === "below_min" && minDate) {
        setValidationMsg(
          `Ngày tối thiểu là ${formatDisplayDate(minDate, separatorRef.current)}`,
        );
        return;
      }
      if (rangeError === "above_max" && maxDate) {
        setValidationMsg(
          `Ngày tối đa là ${formatDisplayDate(maxDate, separatorRef.current)}`,
        );
        return;
      }

      setValidationMsg("");
      setViewMonth(parsed.getMonth());
      setViewYear(parsed.getFullYear());
      emitChange(parsed);
    } else {
      setValidationMsg("");
    }
  };

  /**
   * Khi rời khỏi ô Input (onBlur): Chuẩn hóa lại chuỗi hiển thị (VD: 5-9-2026 -> 05-09-2026)
   * hoặc cảnh báo nếu sai định dạng / vượt min-max
   */
  const handleInputBlur = () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      setValidationMsg("");
      return;
    }

    const parsed = parseFlexibleDate(trimmed);
    if (!parsed) {
      setValidationMsg("Sai định dạng (nhập dd/MM/yyyy hoặc dd-MM-yyyy)");
      return;
    }

    const rangeError = isOutOfRange(parsed);
    if (rangeError === "below_min" && minDate) {
      setValidationMsg(
        `Không được nhỏ hơn ${formatDisplayDate(minDate, separatorRef.current)}`,
      );
      return;
    }
    if (rangeError === "above_max" && maxDate) {
      setValidationMsg(
        `Không được lớn hơn ${formatDisplayDate(maxDate, separatorRef.current)}`,
      );
      return;
    }

    setValidationMsg("");
    const formatted = formatDisplayDate(parsed, separatorRef.current);
    setInputText(formatted);
    emitChange(parsed);
  };

  /**
   * Chọn 1 ngày từ Modal Lịch
   */
  const handleSelectDate = (d: Date) => {
    if (isOutOfRange(d)) return;
    const formatted = formatDisplayDate(d, separatorRef.current);
    setInputText(formatted);
    setValidationMsg("");
    setViewMonth(d.getMonth());
    setViewYear(d.getFullYear());
    emitChange(d);
    setOpen(false);
  };

  /**
   * Xóa trắng ngày
   */
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputText("");
    setValidationMsg("");
    emitChange(null);
  };

  /**
   * Tạo mảng 42 ô ngày (6 tuần x 7 cột, bắt đầu từ Thứ 2) cho tháng đang xem
   */
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    // Chuyển Chủ Nhật (0) -> 6, Thứ Hai (1) -> 0
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
    const startDate = new Date(viewYear, viewMonth, 1 - startOffset);

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      isDisabled: boolean;
    }> = [];

    const todayTime = startOfLocalDay(new Date()).getTime();
    const selectedTime = parsedValueDate ? parsedValueDate.getTime() : null;

    for (let i = 0; i < 42; i++) {
      const current = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + i,
      );
      const currentTime = startOfLocalDay(current).getTime();

      days.push({
        date: current,
        isCurrentMonth: current.getMonth() === viewMonth,
        isToday: currentTime === todayTime,
        isSelected: selectedTime !== null && currentTime === selectedTime,
        isDisabled: isOutOfRange(current) !== null,
      });
    }

    return days;
  }, [viewYear, viewMonth, parsedValueDate, minDate, maxDate]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Danh sách 20 năm xung quanh viewYear để chọn nhanh Năm
  const yearGrid = useMemo(() => {
    const baseYear = Math.floor(viewYear / 12) * 12;
    return Array.from({ length: 12 }, (_, idx) => baseYear + idx);
  }, [viewYear]);

  const todayDate = startOfLocalDay(new Date());
  const isTodayAllowed = isOutOfRange(todayDate) === null;

  return (
    <div className={cn("w-full space-y-1", className)}>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          if (disabled) return;
          setOpen(nextOpen);
          if (nextOpen) {
            setPickerMode("days");
            const current = parseFlexibleDate(inputText) || parsedValueDate;
            if (current) {
              setViewMonth(current.getMonth());
              setViewYear(current.getFullYear());
            }
          }
        }}
      >
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
            aria-invalid={Boolean(validationMsg)}
            className={cn(
              "pr-14 font-mono text-xs",
              validationMsg &&
                "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500/20",
              inputClassName,
            )}
          />

          <div className="absolute right-1.5 flex items-center gap-0.5">
            {isClearable && inputText && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                title="Xóa ngày"
                className="p-1 rounded-md text-muted-foreground hover:text-rose-500 hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                title="Chọn ngày từ lịch"
                className={cn(
                  "p-1.5 rounded-md text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-muted transition-colors cursor-pointer",
                  open && "text-blue-600 dark:text-blue-400 bg-blue-500/10",
                  disabled && "opacity-50 pointer-events-none",
                )}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
              </button>
            </PopoverTrigger>
          </div>
        </div>

        <PopoverContent
          align="end"
          sideOffset={6}
          className="w-76 p-3 rounded-xl border border-border/80 bg-popover shadow-xl space-y-2.5 select-none"
        >
          {/* 1. Header điều hướng Tháng / Năm */}
          <div className="flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={() => {
                if (pickerMode === "years") {
                  setViewYear((y) => y - 12);
                } else if (pickerMode === "months") {
                  setViewYear((y) => y - 1);
                } else {
                  handlePrevMonth();
                }
              }}
              className="h-7 w-7 rounded-lg flex items-center justify-center border border-border/60 hover:bg-muted text-foreground cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setPickerMode((m) => (m === "months" ? "days" : "months"))
                }
                className={cn(
                  "px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer",
                  pickerMode === "months"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-muted text-foreground",
                )}
              >
                {MONTHS_VN[viewMonth]}
              </button>

              <button
                type="button"
                onClick={() =>
                  setPickerMode((m) => (m === "years" ? "days" : "years"))
                }
                className={cn(
                  "px-2 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer",
                  pickerMode === "years"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-muted text-foreground",
                )}
              >
                {viewYear}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (pickerMode === "years") {
                  setViewYear((y) => y + 12);
                } else if (pickerMode === "months") {
                  setViewYear((y) => y + 1);
                } else {
                  handleNextMonth();
                }
              }}
              className="h-7 w-7 rounded-lg flex items-center justify-center border border-border/60 hover:bg-muted text-foreground cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Chế độ chọn nhanh Tháng */}
          {pickerMode === "months" && (
            <div className="grid grid-cols-3 gap-1.5 py-1">
              {MONTHS_VN.map((label, idx) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setViewMonth(idx);
                    setPickerMode("days");
                  }}
                  className={cn(
                    "py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                    idx === viewMonth
                      ? "bg-blue-600 text-white font-semibold"
                      : "hover:bg-muted text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* 3. Chế độ chọn nhanh Năm */}
          {pickerMode === "years" && (
            <div className="grid grid-cols-3 gap-1.5 py-1">
              {yearGrid.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => {
                    setViewYear(yr);
                    setPickerMode("months");
                  }}
                  className={cn(
                    "py-2 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer",
                    yr === viewYear
                      ? "bg-blue-600 text-white font-bold"
                      : "hover:bg-muted text-foreground",
                  )}
                >
                  {yr}
                </button>
              ))}
            </div>
          )}

          {/* 4. Bảng Lịch Ngày (Days Grid) */}
          {pickerMode === "days" && (
            <div className="space-y-1">
              <div className="grid grid-cols-7 gap-0.5 text-center">
                {WEEKDAYS_VN.map((dayName) => (
                  <span
                    key={dayName}
                    className="text-[10px] font-semibold text-muted-foreground py-1"
                  >
                    {dayName}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5">
                {calendarDays.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={item.isDisabled}
                    onClick={() => handleSelectDate(item.date)}
                    className={cn(
                      "h-8 w-full rounded-lg text-xs font-mono transition-colors flex items-center justify-center cursor-pointer",
                      !item.isCurrentMonth && "text-muted-foreground/45",
                      item.isCurrentMonth &&
                        !item.isSelected &&
                        "text-foreground hover:bg-muted",
                      item.isToday &&
                        !item.isSelected &&
                        "border border-blue-500/50 text-blue-600 dark:text-blue-400 font-bold",
                      item.isSelected &&
                        "bg-blue-600 text-white font-bold shadow-xs",
                      item.isDisabled &&
                        "opacity-25 pointer-events-none cursor-not-allowed line-through",
                    )}
                  >
                    {item.date.getDate()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. Footer hiển thị giới hạn Min/Max & Nút chọn Hôm nay */}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2 text-[11px]">
            <div className="text-muted-foreground truncate">
              {minDate || maxDate ? (
                <span>
                  {minDate ? `Từ ${formatDisplayDate(minDate, "/")}` : ""}
                  {minDate && maxDate ? " - " : ""}
                  {maxDate ? `Đến ${formatDisplayDate(maxDate, "/")}` : ""}
                </span>
              ) : (
                <span>Hỗ trợ gõ dd/MM/yyyy, dd-MM-yyyy</span>
              )}
            </div>

            {isTodayAllowed && (
              <button
                type="button"
                onClick={() => handleSelectDate(todayDate)}
                className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 font-semibold cursor-pointer shrink-0 transition-colors"
              >
                Hôm nay
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Thông báo lỗi nếu nhập sai định dạng hoặc vượt quá min / max */}
      {validationMsg && (
        <p className="text-[11px] text-rose-500 font-medium">{validationMsg}</p>
      )}
    </div>
  );
};

export default DatePickerInput;
