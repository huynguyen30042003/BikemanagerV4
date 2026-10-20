"use client";

import React, { useState, useEffect } from "react";
import { Award, RefreshCw, Percent, Sparkles, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlideOver } from "@/components/ui/SlideOver";
import { SearchSelect } from "@/components/ui/selectSearch";
import { KH_ThongKeKhachHang, UpdateThongKeKhachHangPayload } from "@/types/thongKeKhachHang";
import { useUpdateThongKeKhachHang } from "@/hooks/ThongKeKhachHang/useThongKeKhachHangApi";

const TIER_OPTIONS = [
  { value: "BinhThuong", label: "Hạng Chuẩn (Bình thường)" },
  { value: "Bac", label: "Hạng Bạc (Silver)" },
  { value: "Vang", label: "Hạng Vàng (Gold)" },
  { value: "KimCuong", label: "Hạng Kim Cương (Diamond)" },
];

interface UpdateCustomerStatisticsSlideOverProps {
  open: boolean;
  onClose: () => void;
  data: KH_ThongKeKhachHang | null;
  onSuccess?: () => void;
}

export const UpdateCustomerStatisticsSlideOver: React.FC<UpdateCustomerStatisticsSlideOverProps> = ({
  open,
  onClose,
  data,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<UpdateThongKeKhachHangPayload>({
    KhachHangID: "",
    HangKhachHang: "BinhThuong",
    TyLeGiamGia: 0,
    DiemTichLuy: 0,
    CongNoHienTai: 0,
  });

  const updateMutation = useUpdateThongKeKhachHang();

  useEffect(() => {
    if (data) {
      setFormData({
        KhachHangID: data.khachHangID,
        HangKhachHang: data.hangKhachHang || "BinhThuong",
        TyLeGiamGia: data.tyLeGiamGia || 0,
        DiemTichLuy: data.diemTichLuy || 0,
        CongNoHienTai: data.congNoHienTai || 0,
      });
    }
  }, [data]);

  const handleSubmit = async () => {
    try {
      await updateMutation.mutateAsync(formData);
      onSuccess?.();
      onClose();
    } catch {
      // Error handled by mutation toast
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Điều chỉnh Hạng Thẻ & Công Nợ"
      description={`Cập nhật đặc quyền và kiểm soát dư nợ cho ${data?.tenKhachHang || "khách hàng"}`}
      icon={Award}
      footer={
        <>
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Lưu thay đổi
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
          Khách hàng: <strong>{data?.tenKhachHang}</strong> (Mã:{" "}
          {data?.maKhachHang || "—"})
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Hạng thẻ thành viên
            </label>
            <SearchSelect
              options={TIER_OPTIONS}
              value={formData.HangKhachHang}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  HangKhachHang: String(val),
                }))
              }
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-emerald-500" />
              Tỷ lệ giảm giá (%)
            </label>
            <Input
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={formData.TyLeGiamGia}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  TyLeGiamGia: parseFloat(e.target.value) || 0,
                }))
              }
              className="font-mono rounded-lg"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Điểm tích lũy (pts)
            </label>
            <Input
              type="number"
              min={0}
              value={formData.DiemTichLuy}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  DiemTichLuy: parseInt(e.target.value) || 0,
                }))
              }
              className="font-mono rounded-lg"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-rose-500" />
              Công nợ hiện tại (VNĐ)
            </label>
            <Input
              type="number"
              min={0}
              value={formData.CongNoHienTai}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  CongNoHienTai: parseFloat(e.target.value) || 0,
                }))
              }
              className="font-mono rounded-lg"
              placeholder="Nhập số tiền nợ..."
            />
            <p className="text-[11px] text-muted-foreground">
              Được cập nhật tự động khi khách hàng mua hàng nợ hoặc trả tiền.
            </p>
          </div>
        </div>
      </div>
    </SlideOver>
  );
};
