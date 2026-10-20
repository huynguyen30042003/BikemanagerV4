"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  BadgeCheck,
  Clock,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  HopDongTraGop,
  ChuyenTrangThaiHopDongPayload,
} from "@/types/traGop";
import { TRANG_THAI_HOP_DONG } from "@/hooks/TraGop/useTraGop";

export interface ApproveContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: HopDongTraGop | null;
  onSubmit: (payload: ChuyenTrangThaiHopDongPayload) => Promise<void> | void;
  isSubmitting: boolean;
}

interface StatusOption {
  statusId: number;
  label: string;
  icon: LucideIcon;
  activeClass: string;
  iconColor: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    statusId: TRANG_THAI_HOP_DONG.DA_DUYET,
    label: "Đã duyệt khoản vay (111)",
    icon: CheckCircle2,
    activeClass:
      "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    iconColor: "text-emerald-500",
  },
  {
    statusId: TRANG_THAI_HOP_DONG.TU_CHOI,
    label: "Từ chối hồ sơ (112)",
    icon: AlertTriangle,
    activeClass:
      "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    iconColor: "text-rose-500",
  },
  {
    statusId: TRANG_THAI_HOP_DONG.DA_KY_HD,
    label: "Đã ký hợp đồng (113)",
    icon: BadgeCheck,
    activeClass:
      "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300",
    iconColor: "text-blue-500",
  },
  {
    statusId: TRANG_THAI_HOP_DONG.DANG_TRA_GOP,
    label: "Đang trả góp (114)",
    icon: Clock,
    activeClass:
      "border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    iconColor: "text-indigo-500",
  },
];

export const ApproveContractModal: React.FC<ApproveContractModalProps> = ({
  open,
  onOpenChange,
  contract,
  onSubmit,
  isSubmitting,
}) => {
  const [targetStatus, setTargetStatus] = useState<number>(
    TRANG_THAI_HOP_DONG.DA_DUYET
  );
  const [statusNote, setStatusNote] = useState("");

  useEffect(() => {
    if (open) {
      setTargetStatus(
        contract?.trangThaiHopDongID === TRANG_THAI_HOP_DONG.CHO_DUYET
          ? TRANG_THAI_HOP_DONG.DA_DUYET
          : contract?.trangThaiHopDongID || TRANG_THAI_HOP_DONG.DA_DUYET
      );
      setStatusNote("");
    }
  }, [open, contract]);

  const handleSubmit = async () => {
    const contractId = contract?.hopDongTraGopID || contract?.id;
    if (!contractId) return;

    await onSubmit({
      HopDongTraGopID: contractId,
      TrangThaiHopDongID: targetStatus,
      NgayPheDuyet: new Date().toISOString(),
      GhiChu: statusNote,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập Nhật Tiến Độ Thẩm Định Hồ Sơ</DialogTitle>
          <DialogDescription>
            Hợp đồng số: {contract?.soHopDong || "—"}
            {contract?.donViTraGopTen ? ` · Đối tác: ${contract.donViTraGopTen}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Chọn trạng thái phê duyệt từ đối tác tài chính
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = targetStatus === opt.statusId;
                return (
                  <button
                    key={opt.statusId}
                    type="button"
                    onClick={() => setTargetStatus(opt.statusId)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-start gap-2 cursor-pointer transition active:scale-98 ${
                      isSelected
                        ? opt.activeClass
                        : "border-border text-muted-foreground hover:bg-muted/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${opt.iconColor}`} />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú phản hồi từ bên tài chính
            </label>
            <Input
              type="text"
              placeholder="VD: Đối tác duyệt khoản vay 22.340.000đ, cho phép bàn giao xe"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer font-medium"
            >
              {isSubmitting ? "Đang xử lý..." : "Cập nhật tiến độ"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
