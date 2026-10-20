"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, ShieldCheck } from "lucide-react";
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
  XacNhanGiaiNganPayload,
} from "@/types/traGop";
import { formatCurrency } from "./InstallmentContractsKpiGrid";

export interface DisburseContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: HopDongTraGop | null;
  onSubmit: (payload: XacNhanGiaiNganPayload) => Promise<void> | void;
  isSubmitting: boolean;
}

export const DisburseContractModal: React.FC<DisburseContractModalProps> = ({
  open,
  onOpenChange,
  contract,
  onSubmit,
  isSubmitting,
}) => {
  const [disburseForm, setDisburseForm] = useState({
    soTienThucNhan: 0,
    phiHoaHong: 0,
    maChuanChi: "",
    ghiChu: "",
  });

  useEffect(() => {
    if (open && contract) {
      const loanAmount = Number(contract.soTienVay || 0);
      // Ước tính phí sàn chuyển đổi 2%
      const estimatedFee = Math.round(loanAmount * 0.02);
      setDisburseForm({
        soTienThucNhan: loanAmount - estimatedFee,
        phiHoaHong: estimatedFee,
        maChuanChi: `FT${Date.now().toString().slice(-8)}`,
        ghiChu: `Đối tác giải ngân khoản vay xe qua ngân hàng`,
      });
    }
  }, [open, contract]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const contractId = contract?.hopDongTraGopID || contract?.id;
    if (!contractId) return;

    await onSubmit({
      HopDongTraGopID: contractId,
      SoTienGiaiNganThucTe: disburseForm.soTienThucNhan,
      PhiHoaHongDoiTac: disburseForm.phiHoaHong,
      NgayGiaiNgan: new Date().toISOString(),
      MaChuanChiGiaiNgan: disburseForm.maChuanChi,
      GhiChu: disburseForm.ghiChu,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Xác Nhận Giải Ngân Về Showroom
          </DialogTitle>
          <DialogDescription>
            Hồ sơ: <span className="font-mono font-semibold text-foreground">{contract?.soHopDong || "—"}</span>
            {" · "}
            Khoản vay: <span className="font-mono font-bold text-foreground">{formatCurrency(Number(contract?.soTienVay))}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <span>
              Hệ thống sẽ tự động ghi nhận phiếu thu thanh toán cho đơn hàng tương ứng khi bạn xác nhận giải ngân thành công.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Số tiền thực chuyển về shop (đ) <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                value={disburseForm.soTienThucNhan}
                onChange={(e) =>
                  setDisburseForm((prev) => ({
                    ...prev,
                    soTienThucNhan: Number(e.target.value),
                  }))
                }
                className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Phí hoa hồng/chuyển đổi shop chịu (đ)
              </label>
              <Input
                type="number"
                value={disburseForm.phiHoaHong}
                onChange={(e) =>
                  setDisburseForm((prev) => ({
                    ...prev,
                    phiHoaHong: Number(e.target.value),
                  }))
                }
                className="text-xs font-mono text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mã giao dịch / Mã chuẩn chi ngân hàng
            </label>
            <Input
              type="text"
              placeholder="VD: FT2628890288219"
              value={disburseForm.maChuanChi}
              onChange={(e) =>
                setDisburseForm((prev) => ({
                  ...prev,
                  maChuanChi: e.target.value,
                }))
              }
              className="text-xs font-mono font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú đối soát giải ngân
            </label>
            <Input
              type="text"
              placeholder="VD: HD Saison giải ngân qua tài khoản Vietcombank showroom..."
              value={disburseForm.ghiChu}
              onChange={(e) =>
                setDisburseForm((prev) => ({
                  ...prev,
                  ghiChu: e.target.value,
                }))
              }
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
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium cursor-pointer"
            >
              {isSubmitting ? "Đang xác nhận..." : "Xác nhận tiền về shop"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
