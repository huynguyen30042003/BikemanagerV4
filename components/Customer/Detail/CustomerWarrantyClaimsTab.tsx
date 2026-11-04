"use client";

import React, { useMemo } from "react";
import { Wrench, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BH_PhieuBaoHanh } from "@/types/baoHanh";
import {
  formatCurrency,
  formatDate,
} from "@/components/Customer/Detail/CustomerDetailUtils";

interface ClaimInfoBlock {
  id: string;
  label: string;
  primaryText: React.ReactNode;
  secondaryText?: React.ReactNode;
}

const WarrantyClaimCard: React.FC<{ claim: BH_PhieuBaoHanh }> = React.memo(
  ({ claim }) => {
    const infoBlocks: ClaimInfoBlock[] = useMemo(
      () => [
        {
          id: "vehicle-serial",
          label: "Phương tiện / Số Serial",
          primaryText: (
            <span className="font-mono font-semibold text-foreground">
              {claim.soKhung || claim.maSerial || "-"}
            </span>
          ),
          secondaryText:
            claim.soKmHienTai != null
              ? `ODO lúc nhận: ${claim.soKmHienTai.toLocaleString("vi-VN")} km`
              : undefined,
        },
        {
          id: "issue-description",
          label: "Mô tả tình trạng / Lỗi",
          primaryText: (
            <span className="text-foreground font-medium">
              {claim.moTaLoi || "Kiểm tra định kỳ"}
            </span>
          ),
        },
        {
          id: "inspection-result",
          label: "Kết quả kiểm tra & Chi phí",
          primaryText: (
            <span className="text-foreground">
              {claim.ketQuaKiemTra || "Đang cập nhật kết quả"}
            </span>
          ),
          secondaryText: (
            <div className="flex items-center gap-2.5 flex-wrap text-[11px]">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Hãng hỗ trợ: {formatCurrency(claim.chiPhiHangHoTro)}
              </span>
              <span>•</span>
              <span className="text-foreground font-semibold">
                Khách trả: {formatCurrency(claim.chiPhiKhachTra)}
              </span>
            </div>
          ),
        },
      ],
      [claim],
    );

    return (
      <Card className="p-4 rounded-xl border border-border/80 bg-card space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
              #{claim.maPhieuBaoHanh}
            </span>
            {claim.tenTrangThai && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                {claim.tenTrangThai}
              </span>
            )}
            {claim.tenHuongXuLy && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                {claim.tenHuongXuLy}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Tiếp nhận: {formatDate(claim.ngayTiepNhan)}</span>
            </span>
            {claim.ngayTraThucTe && (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                • Hoàn tất: {formatDate(claim.ngayTraThucTe)}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {infoBlocks.map((block) => (
            <div
              key={block.id}
              className="p-2.5 rounded-lg bg-muted/40 border border-border/50"
            >
              <div className="text-[11px] text-muted-foreground font-medium">
                {block.label}
              </div>
              <div className="mt-0.5">{block.primaryText}</div>
              {block.secondaryText && (
                <div className="text-[11px] text-muted-foreground mt-1">
                  {block.secondaryText}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    );
  },
);
WarrantyClaimCard.displayName = "WarrantyClaimCard";

export interface CustomerWarrantyClaimsTabProps {
  warrantyClaims: BH_PhieuBaoHanh[];
  isLoading: boolean;
}

export const CustomerWarrantyClaimsTab: React.FC<CustomerWarrantyClaimsTabProps> =
  React.memo(({ warrantyClaims, isLoading }) => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      );
    }

    if (warrantyClaims.length === 0) {
      return (
        <Card className="p-8 sm:p-10 rounded-2xl border border-border/80 bg-card text-center space-y-2">
          <Wrench className="w-10 h-10 text-muted-foreground mx-auto stroke-[1.5]" />
          <div className="text-sm font-semibold text-foreground">
            Chưa phát sinh phiếu tiếp nhận bảo hành nào
          </div>
          <p className="text-xs text-muted-foreground">
            Các phương tiện của khách hàng hiện vận hành ổn định, chưa có lịch
            sử yêu cầu bảo hành.
          </p>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {warrantyClaims.map((claim) => (
          <WarrantyClaimCard key={claim.phieuBaoHanhID} claim={claim} />
        ))}
      </div>
    );
  });

CustomerWarrantyClaimsTab.displayName = "CustomerWarrantyClaimsTab";

