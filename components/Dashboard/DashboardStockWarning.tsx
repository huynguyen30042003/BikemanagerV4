"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchSelect } from "@/components/ui/selectSearch";
import { useGetDanhMucChiTiet } from "@/hooks/DanhMucChiTiet/useDanhMucChiTietApi";
import {
  AlertTriangle,
  PlusCircle,
  ChevronRight,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { DashboardTongQuanDto } from "@/types/dashboard";

interface DashboardStockWarningProps {
  dashboard?: DashboardTongQuanDto | null;
}

export const DashboardStockWarning: React.FC<DashboardStockWarningProps> = ({
  dashboard,
}) => {
  // 1. Gọi API lấy danh mục chi tiết loại sản phẩm (DanhMucID = 10)
  const { data: dataCategories, isLoading: isLoadingCategories } =
    useGetDanhMucChiTiet({
      DanhMucID: 10,
      PageIndex: 1,
      PageSize: 100,
      TrangThai: true,
    });

  // 2. Chuyển đổi dữ liệu danh mục thành options cho SearchSelect
  const categoryOptions = useMemo(() => {
    const list = dataCategories?.data ?? dataCategories?.items ?? [];
    return [
      { value: "", label: "Tất cả loại sản phẩm" },
      ...list.map((c: { danhMucChiTietID: number; ten: string }) => ({
        value: c.danhMucChiTietID,
        label: c.ten,
      })),
    ];
  }, [dataCategories]);

  // Map tra cứu nhanh tên loại sản phẩm theo ID
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    const list = dataCategories?.data ?? dataCategories?.items ?? [];
    list.forEach((c: { danhMucChiTietID: number; ten: string }) => {
      map.set(c.danhMucChiTietID, c.ten);
    });
    return map;
  }, [dataCategories]);

  // 3. State lọc theo loại sản phẩm và lọc nhanh hàng hết
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [statusFilter, setStatusFilter] = useState<"all" | "out_of_stock">(
    "all",
  );

  const allWarnings = useMemo(
    () => dashboard?.canhBaoTonKho ?? [],
    [dashboard?.canhBaoTonKho],
  );

  // Đếm số lượng sản phẩm thực sự hết hàng (tồn <= 0)
  const outOfStockCount = useMemo(
    () => allWarnings.filter((i) => i.soLuong <= 0).length,
    [allWarnings],
  );

  // 4. Lọc danh sách cảnh báo theo các tiêu chí đã chọn
  const filteredWarnings = useMemo(() => {
    return allWarnings.filter((item) => {
      // Lọc theo loại sản phẩm
      if (
        selectedCategory !== "" &&
        item.loaiSanPham != null &&
        Number(item.loaiSanPham) !== Number(selectedCategory)
      ) {
        return false;
      }
      // Lọc theo trạng thái hết hàng (tồn <= 0)
      if (statusFilter === "out_of_stock" && item.soLuong > 0) {
        return false;
      }
      return true;
    });
  }, [allWarnings, selectedCategory, statusFilter]);

  const hasWarnings = allWarnings.length > 0;
  const isFiltered = selectedCategory !== "" || statusFilter !== "all";

  return (
    <Card className="p-4 sm:p-5 border border-border/70 shadow-xs">
      {/* Header & Thanh công cụ lọc loại sản phẩm / hết hàng */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-3 border-b border-border/60">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 shrink-0" />
            <span>Cảnh Báo Hàng Sắp Hết Trong Kho</span>
            {hasWarnings && (
              <Badge
                variant="outline"
                className="text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25 ml-1"
              >
                {allWarnings.length} mặt hàng
              </Badge>
            )}
          </h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
            Danh sách các phụ tùng và xe có số lượng tồn kho chạm hoặc thấp hơn
            định mức tối thiểu
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Ô SearchSelect lọc theo Loại sản phẩm */}
          <div className="w-full sm:w-[220px]">
            <SearchSelect
              options={categoryOptions}
              value={selectedCategory}
              onChange={(val) =>
                setSelectedCategory(val === "" ? "" : Number(val))
              }
              placeholder="Chọn loại sản phẩm"
              isLoading={isLoadingCategories}
              height={8}
            />
          </div>

          {/* Nút lọc nhanh: Tất cả / Hết hàng */}
          <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                statusFilter === "all"
                  ? "bg-background text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("out_of_stock")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "out_of_stock"
                  ? "bg-rose-500 text-white shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-rose-600"
              }`}
            >
              <span>Hết hàng</span>
              {outOfStockCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    statusFilter === "out_of_stock"
                      ? "bg-white/25 text-white"
                      : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {outOfStockCount}
                </span>
              )}
            </button>
          </div>

          {/* Các nút điều hướng nhanh */}
          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            <Link href="/admin/purchase-orders">
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/10 h-8 px-2.5 cursor-pointer shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Tạo đơn</span> nhập
              </Button>
            </Link>
            <Link href="/admin/inventory">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1 text-muted-foreground hover:text-foreground h-8 px-2 cursor-pointer"
              >
                Xem kho <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid danh sách các sản phẩm cảnh báo */}
      {filteredWarnings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredWarnings.map((item) => {
            const isOutOfStock = item.soLuong <= 0;
            const categoryName =
              item.loaiSanPham != null
                ? categoryMap.get(item.loaiSanPham)
                : null;

            return (
              <div
                key={item.bienTheSanPhamID}
                className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                  isOutOfStock
                    ? "border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10"
                    : "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span
                      className="font-semibold text-xs text-foreground line-clamp-1"
                      title={item.tenSanPham}
                    >
                      {item.tenSanPham}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {isOutOfStock ? (
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 bg-rose-600 text-white font-bold border-rose-600 shadow-2xs"
                        >
                          HẾT HÀNG
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 bg-amber-500/20 text-amber-700 dark:text-amber-400 font-medium border-amber-500/30"
                        >
                          SẮP HẾT
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-muted-foreground truncate">
                    <span className="truncate">
                      {item.tenBienThe} ({item.maSKU})
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1 text-[11px] text-muted-foreground mt-1">
                    <span className="truncate">
                      🏢 Kho:{" "}
                      <strong className="text-foreground">{item.tenKho}</strong>
                    </span>
                    {categoryName && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium shrink-0 max-w-[100px] truncate">
                        {categoryName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                  <span
                    className={`font-bold text-[11px] sm:text-xs ${
                      isOutOfStock
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    Tồn: {item.soLuong} / Tối thiểu {item.soLuongToiThieu}
                  </span>
                  <Link
                    href={`/admin/inventory?search=${encodeURIComponent(
                      item.maSKU,
                    )}`}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                  >
                    Thẻ kho <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : hasWarnings && isFiltered ? (
        <div className="py-8 flex flex-col items-center justify-center text-muted-foreground text-xs space-y-2">
          <AlertTriangle className="w-8 h-8 text-amber-500/70 mb-1" />
          <span>
            Không tìm thấy sản phẩm nào phù hợp với bộ lọc cảnh báo hiện tại
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory("");
              setStatusFilter("all");
            }}
            className="text-xs h-7 px-3 gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Xóa bộ lọc</span>
          </Button>
        </div>
      ) : (
        <div className="py-8 flex flex-col items-center justify-center text-muted-foreground text-xs">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-1.5" />
          <span>
            Tất cả các mặt hàng hiện đều đạt định mức an toàn trong kho
          </span>
        </div>
      )}
    </Card>
  );
};
