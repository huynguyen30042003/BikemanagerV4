"use client";

import React, { useMemo } from "react";
import {
  Bike,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Wrench,
  Calendar,
  Gauge,
  Hash,
  Cpu,
  BatteryCharging,
  Palette,
  LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BH_BaoHanh } from "@/types/baoHanh";
import {
  DetailTabKey,
  EnrichedCustomerVehicle,
  formatDate,
  getWarrantyTimeStatus,
} from "@/components/Customer/Detail/CustomerDetailUtils";

interface VehicleSpecItem {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  isMono?: boolean;
}

interface VehicleWarrantyCardProps {
  item: EnrichedCustomerVehicle;
  onViewClaims: () => void;
}

const VehicleWarrantyCard: React.FC<VehicleWarrantyCardProps> = React.memo(
  ({ item, onViewClaims }) => {
    const { vehicle, warranty, claims } = item;

    const timeInfo = useMemo(
      () =>
        warranty
          ? getWarrantyTimeStatus(warranty.ngayBatDau, warranty.ngayKetThuc)
          : null,
      [warranty],
    );

    const specItems: VehicleSpecItem[] = useMemo(
      () => [
        {
          id: "so-khung",
          label: "Số khung (VIN)",
          value: vehicle.soKhung || "-",
          icon: Hash,
          isMono: true,
        },
        {
          id: "so-may",
          label: "Số máy / Động cơ",
          value: vehicle.soMay || "-",
          icon: Cpu,
          isMono: true,
        },
        {
          id: "so-pin",
          label: "Mã Pin / Ắc quy",
          value: vehicle.soPin || "-",
          icon: BatteryCharging,
          isMono: true,
        },
        {
          id: "odo",
          label: "ODO hiện tại",
          value:
            vehicle.soKmHienTai != null
              ? `${vehicle.soKmHienTai.toLocaleString("vi-VN")} km`
              : "0 km",
          icon: Gauge,
          isMono: true,
        },
        {
          id: "ngay-mua",
          label: "Ngày mua xe",
          value: formatDate(vehicle.ngayMua),
          icon: Calendar,
        },
        {
          id: "mau-sac",
          label: "Màu sắc",
          value: vehicle.mauSac || "Tiêu chuẩn",
          icon: Palette,
        },
      ],
      [vehicle],
    );

    return (
      <Card className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Cột trái (7/12): Thông số Phương tiện xe của khách */}
          <div className="lg:col-span-7 p-4 sm:p-5 space-y-4 border-b lg:border-b-0 lg:border-r border-border/60">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <Bike className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {vehicle.tenThuongHieu && (
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {vehicle.tenThuongHieu}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        vehicle.trangThai
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-500/10 text-slate-600 border border-slate-500/20"
                      }`}
                    >
                      {vehicle.trangThai ? "Đang sử dụng" : "Ngừng sử dụng"}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
                    {vehicle.tenModel}
                  </h3>
                </div>
              </div>

              {/* Biển số xe nổi bật */}
              {vehicle.bienSo && (
                <div className="px-2.5 sm:px-3 py-1 rounded-lg bg-amber-500/15 border-2 border-amber-500/40 font-mono text-xs sm:text-sm font-extrabold text-amber-800 dark:text-amber-300 tracking-wider shadow-2xs shrink-0">
                  {vehicle.bienSo}
                </div>
              )}
            </div>

            {/* Lưới thông số kỹ thuật định danh xe (Render bằng .map() theo Mục 14.2) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {specItems.map((spec) => {
                const SpecIcon = spec.icon;
                return (
                  <div
                    key={spec.id}
                    className="p-2.5 rounded-lg bg-muted/40 border border-border/50 min-w-0"
                  >
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <SpecIcon className="w-3 h-3 shrink-0" />
                      <span className="truncate">{spec.label}</span>
                    </div>
                    <div
                      className={`text-xs font-bold text-foreground mt-0.5 truncate ${
                        spec.isMono ? "font-mono" : ""
                      }`}
                    >
                      {spec.value}
                    </div>
                  </div>
                );
              })}
            </div>

            {claims.length > 0 && (
              <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2 text-xs flex-wrap">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>
                    Xe này có <strong>{claims.length}</strong> lượt kiểm tra /
                    bảo hành
                  </span>
                </span>
                <button
                  type="button"
                  onClick={onViewClaims}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
                >
                  Xem chi tiết
                </button>
              </div>
            )}
          </div>

          {/* Cột phải (5/12): Thẻ Chứng Nhận Bảo Hành Điện Tử của chiếc xe đó */}
          <div className="lg:col-span-5 p-4 sm:p-5 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 flex flex-col justify-between gap-4">
            {warranty && timeInfo ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>SỔ BẢO HÀNH ĐIỆN TỬ</span>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        timeInfo.status === "active"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25"
                          : timeInfo.status === "expiring"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                            : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25"
                      }`}
                    >
                      {timeInfo.status === "active" ? (
                        <ShieldCheck className="w-3 h-3 shrink-0" />
                      ) : timeInfo.status === "expiring" ? (
                        <ShieldAlert className="w-3 h-3 shrink-0" />
                      ) : (
                        <ShieldX className="w-3 h-3 shrink-0" />
                      )}
                      <span>{timeInfo.label}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-card border border-border/70 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-muted-foreground">
                        Mã chứng nhận BH:
                      </span>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {warranty.maBaoHanh}
                      </span>
                    </div>
                    {warranty.maSerial && (
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-muted-foreground">
                          Số Serial BH:
                        </span>
                        <span className="font-mono font-semibold text-foreground">
                          {warranty.maSerial}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-muted-foreground">
                        Thời hạn bảo hành:
                      </span>
                      <span className="font-semibold text-foreground">
                        {warranty.soThangBaoHanh} tháng
                        {warranty.gioiHanKm
                          ? ` / ${warranty.gioiHanKm.toLocaleString("vi-VN")} km`
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-muted-foreground">
                        Hiệu lực từ - đến:
                      </span>
                      <span className="font-mono text-[11px] font-medium text-foreground">
                        {formatDate(warranty.ngayBatDau)} -{" "}
                        <strong>{formatDate(warranty.ngayKetThuc)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Thanh tiến trình thời gian bảo hành */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Tiến độ thời gian bảo hành</span>
                      <span className="font-mono font-semibold text-foreground">
                        {timeInfo.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          timeInfo.status === "expired"
                            ? "bg-rose-500"
                            : timeInfo.status === "expiring"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                        }`}
                        style={{ width: `${timeInfo.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {warranty.dieuKienBaoHanh && (
                  <div className="text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border/50">
                    <strong className="text-foreground">
                      Điều kiện áp dụng:{" "}
                    </strong>
                    {warranty.dieuKienBaoHanh}
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2 text-muted-foreground">
                <ShieldAlert className="w-8 h-8 text-muted-foreground/60 stroke-[1.5]" />
                <div className="text-xs font-semibold text-foreground">
                  Chưa kích hoạt sổ bảo hành điện tử
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Phương tiện này chưa có bản ghi sổ bảo hành điện tử liên kết
                  trực tiếp.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  },
);
VehicleWarrantyCard.displayName = "VehicleWarrantyCard";

const StandaloneWarrantyCard: React.FC<{ warranty: BH_BaoHanh }> = React.memo(
  ({ warranty }) => {
    const timeInfo = useMemo(
      () => getWarrantyTimeStatus(warranty.ngayBatDau, warranty.ngayKetThuc),
      [warranty.ngayBatDau, warranty.ngayKetThuc],
    );

    return (
      <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                  #{warranty.maBaoHanh}
                </span>
                <span className="text-sm font-bold text-foreground truncate">
                  {warranty.tenBienThe || "Chứng nhận bảo hành sản phẩm"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5 flex-wrap">
                {warranty.maSerial && (
                  <span className="font-mono">Serial: {warranty.maSerial}</span>
                )}
                {warranty.soKhung && (
                  <span className="font-mono">
                    Số khung: {warranty.soKhung}
                  </span>
                )}
                <span>
                  Hiệu lực: {formatDate(warranty.ngayBatDau)} -{" "}
                  {formatDate(warranty.ngayKetThuc)} ({warranty.soThangBaoHanh}{" "}
                  tháng)
                </span>
              </div>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border self-start sm:self-center shrink-0 ${
              timeInfo.status === "active"
                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/25"
                : timeInfo.status === "expiring"
                  ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
                  : "bg-rose-500/10 text-rose-700 border-rose-500/25"
            }`}
          >
            {timeInfo.label}
          </span>
        </div>
      </Card>
    );
  },
);
StandaloneWarrantyCard.displayName = "StandaloneWarrantyCard";

export interface CustomerVehiclesWarrantyTabProps {
  enrichedVehicles: EnrichedCustomerVehicle[];
  standaloneWarranties: BH_BaoHanh[];
  isLoading: boolean;
  setActiveTab: (tab: DetailTabKey) => void;
}

export const CustomerVehiclesWarrantyTab: React.FC<CustomerVehiclesWarrantyTabProps> =
  React.memo(
    ({
      enrichedVehicles,
      standaloneWarranties,
      isLoading,
      setActiveTab,
    }) => {
      if (isLoading) {
        return (
          <div className="grid grid-cols-1 gap-4">
            <Skeleton className="h-52 w-full rounded-2xl" />
            <Skeleton className="h-52 w-full rounded-2xl" />
          </div>
        );
      }

      if (enrichedVehicles.length === 0 && standaloneWarranties.length === 0) {
        return (
          <Card className="p-8 sm:p-10 rounded-2xl border border-border/80 bg-card text-center space-y-2">
            <Bike className="w-10 h-10 text-muted-foreground mx-auto stroke-[1.5]" />
            <div className="text-sm font-semibold text-foreground">
              Khách hàng chưa có phương tiện hoặc sổ bảo hành nào
            </div>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Khi khách hàng mua xe và hoàn tất bàn giao đơn hàng, thông tin xe
              và Sổ bảo hành điện tử sẽ tự động hiển thị tại đây.
            </p>
          </Card>
        );
      }

      return (
        <div className="grid grid-cols-1 gap-4">
          {enrichedVehicles.map((item) => (
            <VehicleWarrantyCard
              key={item.vehicle.id}
              item={item}
              onViewClaims={() => setActiveTab("warranty-claims")}
            />
          ))}

          {standaloneWarranties.map((warranty) => (
            <StandaloneWarrantyCard
              key={warranty.baoHanhID}
              warranty={warranty}
            />
          ))}
        </div>
      );
    },
  );

CustomerVehiclesWarrantyTab.displayName = "CustomerVehiclesWarrantyTab";

