"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  PackagePlus,
  Warehouse,
  Boxes,
  Barcode,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Info,
  Calendar,
  Tag,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect } from "@/components/ui/selectSearch";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  KHO_TonKho_NhapTonDauKy_Request,
  KHO_TonKho_NhapTonDauKy_Response,
  KHO_TonKho_SerialNhap_Item,
} from "@/types/tonKho";
import { SP_BienTheSanPham } from "@/types/bienTheSanPham";
import { useNhapTonDauKy } from "@/hooks/TonKho/useTonKhoApi";
import DatePickerInput from "../ui/DatePickerInput";

interface OpeningStockFormCardProps {
  khoOptions: Array<{ value: string; label: string; diaDiemID?: string }>;
  isLoadingKhos: boolean;
  variantList: SP_BienTheSanPham[];
  isLoadingVariants: boolean;
  selectedKhoId?: string;
  onSelectKhoId?: (khoId: string) => void;
  presetVariantId?: string;
  onSuccessNhapTon?: (res: KHO_TonKho_NhapTonDauKy_Response) => void;
}

const QUICK_LOCATIONS = [
  "Kệ A1-02",
  "Kệ B2-01",
  "Kệ Phụ Tùng 03",
  "Khu Xe Mới 01",
  "Khu Xe Điện Trưng Bày",
  "Kho Pin & Sạc",
];

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

export const OpeningStockFormCard: React.FC<OpeningStockFormCardProps> = ({
  khoOptions,
  isLoadingKhos,
  variantList,
  isLoadingVariants,
  selectedKhoId,
  onSelectKhoId,
  presetVariantId,
  onSuccessNhapTon,
}) => {
  // Form state
  const [khoId, setKhoId] = useState<string>(selectedKhoId || "");
  const [bienTheId, setBienTheId] = useState<string>(presetVariantId || "");
  const [soLuong, setSoLuong] = useState<number>(1);
  const [donGiaVon, setDonGiaVon] = useState<number>(0);
  const [soLuongToiThieu, setSoLuongToiThieu] = useState<number>(5);
  const [viTriLuuTru, setViTriLuuTru] = useState<string>("");
  const [ghiChu, setGhiChu] = useState<string>("");
  const [trangThaiSerialId] = useState<number>(59); // Mặc định 59: Trong kho / Tồn kho
  const [serials, setSerials] = useState<KHO_TonKho_SerialNhap_Item[]>([]);

  // Bulk paste modal / popup state
  const [showBulkPasteModal, setShowBulkPasteModal] = useState<boolean>(false);
  const [bulkPasteText, setBulkPasteText] = useState<string>("");

  // Confirmation modal
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);

  // Result alert after successful submit
  const [lastResult, setLastResult] =
    useState<KHO_TonKho_NhapTonDauKy_Response | null>(null);

  const nhapTonMutation = useNhapTonDauKy();

  // Sync external presetVariantId or selectedKhoId
  useEffect(() => {
    if (selectedKhoId) setKhoId(selectedKhoId);
  }, [selectedKhoId]);

  useEffect(() => {
    if (presetVariantId) setBienTheId(presetVariantId);
  }, [presetVariantId]);

  // Selected variant object
  const selectedVariant = useMemo(() => {
    return variantList.find((v) => v.bienTheSanPhamID === bienTheId) || null;
  }, [variantList, bienTheId]);

  const isSerialManaged = Boolean(selectedVariant?.quanLyTheoSerial);

  // When variant changes, update pricing, notes, and serial list accordingly
  useEffect(() => {
    if (selectedVariant) {
      if (selectedVariant.giaNhap && donGiaVon === 0) {
        setDonGiaVon(selectedVariant.giaNhap);
      }
      if (!ghiChu) {
        setGhiChu(
          selectedVariant.quanLyTheoSerial
            ? `Nhập tồn kho đầu kỳ cho ${selectedVariant.tenBienThe}`
            : `Nhập tồn kho phụ tùng / hàng rời đầu kỳ`,
        );
      }

      if (selectedVariant.quanLyTheoSerial) {
        // Ensure serial rows match soLuong
        setSerials((prev) => {
          if (prev.length === soLuong) return prev;
          const updated = [...prev];
          while (updated.length < soLuong) {
            updated.push({
              MaSerial: "",
              SoKhung: "",
              SoMay: "",
              SoPin: "",
              NgaySanXuat: new Date().toISOString().split("T")[0],
              ViTriLuuTru: viTriLuuTru || "",
            });
          }
          return updated.slice(0, soLuong);
        });
      } else {
        setSerials([]);
      }
    }
  }, [selectedVariant]);

  // Handle changes in SoLuong for serial-managed item
  const handleSoLuongChange = (newCount: number) => {
    const validCount = Math.max(1, newCount);
    setSoLuong(validCount);

    if (isSerialManaged) {
      setSerials((prev) => {
        const updated = [...prev];
        while (updated.length < validCount) {
          updated.push({
            MaSerial: "",
            SoKhung: "",
            SoMay: "",
            SoPin: "",
            NgaySanXuat: new Date().toISOString().split("T")[0],
            ViTriLuuTru: viTriLuuTru || "",
          });
        }
        return updated.slice(0, validCount);
      });
    }
  };

  // Add individual serial row
  const handleAddSerialRow = () => {
    setSerials((prev) => [
      ...prev,
      {
        MaSerial: "",
        SoKhung: "",
        SoMay: "",
        SoPin: "",
        NgaySanXuat: new Date().toISOString().split("T")[0],
        ViTriLuuTru: viTriLuuTru || "",
      },
    ]);
    setSoLuong((prev) => prev + 1);
  };

  // Remove individual serial row
  const handleRemoveSerialRow = (index: number) => {
    if (serials.length <= 1) {
      toast.error(
        "Phải có ít nhất 1 dòng Serial khi nhập sản phẩm quản lý Serial!",
      );
      return;
    }
    setSerials((prev) => prev.filter((_, i) => i !== index));
    setSoLuong((prev) => Math.max(1, prev - 1));
  };

  // Update field in serial row
  const handleUpdateSerialField = (
    index: number,
    field: keyof KHO_TonKho_SerialNhap_Item,
    value: string,
  ) => {
    setSerials((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  // Auto-generate sample serials
  const handleAutoGenerateSerials = () => {
    if (!selectedVariant) return;
    const prefix = selectedVariant.maSKU
      ? selectedVariant.maSKU.replace(/[^a-zA-Z0-9]/g, "")
      : "SN";
    const timestamp = Date.now().toString().slice(-4);

    setSerials((prev) =>
      prev.map((s, idx) => ({
        ...s,
        MaSerial:
          s.MaSerial ||
          `${prefix}-${timestamp}-${String(idx + 1).padStart(4, "0")}`,
        SoKhung:
          s.SoKhung || `KHUNG-${prefix}-${String(idx + 1).padStart(4, "0")}`,
        SoMay: s.SoMay || `MAY-${prefix}-${String(idx + 1).padStart(4, "0")}`,
        ViTriLuuTru: s.ViTriLuuTru || viTriLuuTru || "Kệ A1-02",
      })),
    );
    toast.success("Đã sinh mã Serial / Số khung mẫu tự động!");
  };

  // Bulk paste serials from text/Excel
  const handleApplyBulkPaste = () => {
    if (!bulkPasteText.trim()) {
      setShowBulkPasteModal(false);
      return;
    }

    const lines = bulkPasteText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      toast.error("Không tìm thấy dòng dữ liệu nào!");
      return;
    }

    const parsedSerials: KHO_TonKho_SerialNhap_Item[] = lines.map((line) => {
      // Split by tab or comma
      const parts = line.split(/[,\t]+/).map((p) => p.trim());
      return {
        MaSerial: parts[0] || "",
        SoKhung: parts[1] || "",
        SoMay: parts[2] || "",
        SoPin: parts[3] || "",
        NgaySanXuat: new Date().toISOString().split("T")[0],
        ViTriLuuTru: parts[4] || viTriLuuTru || "",
      };
    });

    setSerials(parsedSerials);
    setSoLuong(parsedSerials.length);
    setShowBulkPasteModal(false);
    setBulkPasteText("");
    toast.success(
      `Đã nạp thành công ${parsedSerials.length} mã Serial từ dữ liệu dán!`,
    );
  };

  // Validation before opening confirm modal
  const handleValidateAndPrompt = (e: React.FormEvent) => {
    e.preventDefault();

    if (!khoId) {
      toast.error("Vui lòng chọn Kho hàng tiếp nhận tồn!");
      return;
    }

    if (!bienTheId) {
      toast.error("Vui lòng chọn Biến thể sản phẩm cần nhập!");
      return;
    }

    if (soLuong <= 0) {
      toast.error("Số lượng bổ sung vào kho phải lớn hơn 0!");
      return;
    }

    if (isSerialManaged) {
      if (serials.length !== soLuong) {
        toast.error(
          `Số lượng mã Serial (${serials.length}) không khớp với số lượng nhập kho (${soLuong})!`,
        );
        return;
      }

      const emptySerial = serials.some((s) => !s.MaSerial.trim());
      if (emptySerial) {
        toast.error("Tất cả các dòng Serial bắt buộc phải có Mã Serial!");
        return;
      }

      // Check duplicate within the list
      const serialSet = new Set<string>();
      for (const s of serials) {
        const trimmed = s.MaSerial.trim().toUpperCase();
        if (serialSet.has(trimmed)) {
          toast.error(
            `Mã Serial [${trimmed}] bị trùng lặp trong danh sách nhập!`,
          );
          return;
        }
        serialSet.add(trimmed);
      }
    }

    setShowConfirmSubmit(true);
  };

  // Execute API submit
  const handleExecuteSubmit = async () => {
    const payload: KHO_TonKho_NhapTonDauKy_Request = {
      KhoID: khoId,
      BienTheSanPhamID: bienTheId,
      SoLuong: soLuong,
      DonGiaVon: donGiaVon > 0 ? donGiaVon : null,
      SoLuongToiThieu: soLuongToiThieu,
      ViTriLuuTru: viTriLuuTru || null,
      TrangThaiSerialID: trangThaiSerialId,
      GhiChu: ghiChu || null,
      Serials: isSerialManaged ? serials : null,
    };

    try {
      const res = await nhapTonMutation.mutateAsync(payload);
      setLastResult(res);
      setShowConfirmSubmit(false);
      if (onSuccessNhapTon) onSuccessNhapTon(res);

      // Reset form partially for the next item
      setBienTheId("");
      setSoLuong(1);
      setDonGiaVon(0);
      setGhiChu("");
      setSerials([]);
    } catch {
      // Error toast is handled by mutation
    }
  };

  // Options for variant SearchSelect
  const variantOptions = useMemo(() => {
    return variantList.map((v) => ({
      value: v.bienTheSanPhamID,
      label: `${v.tenBienThe} [SKU: ${v.maSKU}] ${v.quanLyTheoSerial ? "• (Serial)" : ""}`,
    }));
  }, [variantList]);

  return (
    <>
      <Card className="p-4 sm:p-6 rounded-xl border border-border/80 bg-card shadow-xs space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Biểu Mẫu Khởi Tạo Tồn Kho Đầu Kỳ
              </h2>
              <p className="text-xs text-muted-foreground">
                Khởi tạo số lượng tồn thực tế, giá vốn và danh sách số
                Serial/Khung cho kho hàng
              </p>
            </div>
          </div>

          {selectedVariant && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                  isSerialManaged
                    ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20"
                    : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                }`}
              >
                {isSerialManaged ? (
                  <>
                    <Barcode className="w-3.5 h-3.5" />
                    Quản lý theo Serial (Xe điện / Pin)
                  </>
                ) : (
                  <>
                    <Boxes className="w-3.5 h-3.5" />
                    Hàng rời / Phụ tùng (Không Serial)
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Success Banner from Previous Submit */}
        {lastResult && (
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold">Vừa nhập thành công: </span>
                <span>
                  Bổ sung +{lastResult.soLuongBoSung} đơn vị. Tồn mới:{" "}
                  <strong>{lastResult.soLuongSau}</strong> (Khả dụng:{" "}
                  <strong>{lastResult.soLuongKhaDung}</strong>) • Đơn giá vốn:{" "}
                  <strong>{formatCurrency(lastResult.donGiaVon)}</strong>
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setLastResult(null)}
              className="h-6 text-[11px] text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 px-2 cursor-pointer"
            >
              Đóng
            </Button>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleValidateAndPrompt} className="space-y-4">
          {/* Row 1: Kho hàng & Biến thể sản phẩm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Kho tiếp nhận tồn kho <span className="text-rose-500">*</span>
              </label>
              <SearchSelect
                placeholder="Chọn kho hàng..."
                options={khoOptions}
                value={khoId}
                onChange={(val) => {
                  const id = String(val || "");
                  setKhoId(id);
                  if (onSelectKhoId) onSelectKhoId(id);
                }}
                isLoading={isLoadingKhos}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Sản phẩm / Biến thể xe <span className="text-rose-500">*</span>
              </label>
              <SearchSelect
                placeholder="Chọn sản phẩm / biến thể xe..."
                options={variantOptions}
                value={bienTheId}
                onChange={(val) => setBienTheId(String(val || ""))}
                isLoading={isLoadingVariants}
                className="text-xs"
              />
            </div>
          </div>

          {/* Row 2: Số lượng, Đơn giá vốn, Định mức tối thiểu, Vị trí lưu trữ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Số lượng bổ sung <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                min={1}
                value={soLuong}
                onChange={(e) =>
                  handleSoLuongChange(parseInt(e.target.value) || 1)
                }
                className="text-xs font-mono font-bold h-9 bg-background"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Đơn giá vốn (₫)
              </label>
              <Input
                type="number"
                min={0}
                step={1000}
                placeholder="Tự động lấy giá nhập nếu để 0"
                value={donGiaVon || ""}
                onChange={(e) => setDonGiaVon(parseFloat(e.target.value) || 0)}
                className="text-xs font-mono h-9 bg-background"
              />
              {donGiaVon > 0 && (
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">
                  {formatCurrency(donGiaVon)}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Định mức tồn tối thiểu
              </label>
              <Input
                type="number"
                min={0}
                placeholder="Mặc định: 5"
                value={soLuongToiThieu}
                onChange={(e) =>
                  setSoLuongToiThieu(parseInt(e.target.value) || 0)
                }
                className="text-xs font-mono h-9 bg-background"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Vị trí lưu trữ (Kệ / Bãi)
              </label>
              <Input
                type="text"
                placeholder="Ví dụ: Kệ A1-02, Bãi xe 01"
                value={viTriLuuTru}
                onChange={(e) => setViTriLuuTru(e.target.value)}
                className="text-xs h-9 bg-background"
              />
            </div>
          </div>

          {/* Quick Location Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-muted-foreground">
              Gợi ý vị trí:
            </span>
            {QUICK_LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setViTriLuuTru(loc)}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                  viTriLuuTru === loc
                    ? "bg-blue-500/10 text-blue-600 border-blue-500/30 font-medium"
                    : "bg-muted/50 text-muted-foreground border-border/60 hover:text-foreground"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú nghiệp vụ
            </label>
            <Input
              type="text"
              placeholder="Ví dụ: Nhập tồn kho xe máy điện đầu kỳ hoặc nhập bổ sung đợt 1..."
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              className="text-xs h-9 bg-background"
            />
          </div>

          {/* Serial Management Section (Only visible when isSerialManaged === true) */}
          {isSerialManaged && (
            <div className="space-y-3 pt-3 border-t border-border/80">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-blue-500/5 dark:bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-2">
                  <Barcode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h3 className="text-xs font-bold text-foreground">
                      Khai báo danh sách Mã Serial & Số Khung / Máy (
                      {serials.length} xe)
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Yêu cầu nhập đầy đủ mã Serial duy nhất tương ứng với số
                      lượng {soLuong} chiếc
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBulkPasteModal(true)}
                    className="h-7 text-xs border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 mr-1" />
                    Dán nhanh từ Excel
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAutoGenerateSerials}
                    className="h-7 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Tự động sinh mã Serial & Khung mẫu"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    Sinh mã mẫu
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSerialRow}
                    className="h-7 text-xs bg-card hover:bg-muted text-foreground cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Thêm xe
                  </Button>
                </div>
              </div>

              {/* Serials Table */}
              <div className="rounded-xl border border-border/80 overflow-hidden shadow-2xs max-h-[360px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/60 border-b border-border/80 sticky top-0 z-10 text-muted-foreground">
                    <tr>
                      <th className="p-2.5 text-center font-semibold w-12">
                        #
                      </th>
                      <th className="p-2.5 text-left font-semibold min-w-[160px]">
                        Mã Serial <span className="text-rose-500">*</span>
                      </th>
                      <th className="p-2.5 text-left font-semibold min-w-[140px]">
                        Số Khung
                      </th>
                      <th className="p-2.5 text-left font-semibold min-w-[140px]">
                        Số Máy
                      </th>
                      <th className="p-2.5 text-left font-semibold min-w-[130px]">
                        Số Pin
                      </th>
                      <th className="p-2.5 text-left font-semibold w-40">
                        Ngày sản xuất
                      </th>
                      <th className="p-2.5 text-left font-semibold w-32">
                        Vị trí kệ
                      </th>
                      <th className="p-2.5 text-center font-semibold w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 bg-card">
                    {serials.map((s, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-2 text-center font-mono text-muted-foreground text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="p-1.5">
                          <Input
                            placeholder="Mã Serial xe..."
                            value={s.MaSerial}
                            onChange={(e) =>
                              handleUpdateSerialField(
                                idx,
                                "MaSerial",
                                e.target.value.toUpperCase(),
                              )
                            }
                            className="h-8 text-xs font-mono uppercase bg-background"
                          />
                        </td>
                        <td className="p-1.5">
                          <Input
                            placeholder="Số khung..."
                            value={s.SoKhung || ""}
                            onChange={(e) =>
                              handleUpdateSerialField(
                                idx,
                                "SoKhung",
                                e.target.value.toUpperCase(),
                              )
                            }
                            className="h-8 text-xs font-mono uppercase bg-background"
                          />
                        </td>
                        <td className="p-1.5">
                          <Input
                            placeholder="Số máy..."
                            value={s.SoMay || ""}
                            onChange={(e) =>
                              handleUpdateSerialField(
                                idx,
                                "SoMay",
                                e.target.value.toUpperCase(),
                              )
                            }
                            className="h-8 text-xs font-mono uppercase bg-background"
                          />
                        </td>
                        <td className="p-1.5">
                          <Input
                            placeholder="Mã/Số Pin..."
                            value={s.SoPin || ""}
                            onChange={(e) =>
                              handleUpdateSerialField(
                                idx,
                                "SoPin",
                                e.target.value.toUpperCase(),
                              )
                            }
                            className="h-8 text-xs font-mono uppercase bg-background"
                          />
                        </td>
                        <td className="p-1.5">
                          <DatePickerInput
                            value={s.NgaySanXuat || ""}
                            onChange={(val) =>
                              handleUpdateSerialField(idx, "NgaySanXuat", val)
                            }
                            max={new Date()}
                            placeholder="dd/MM/yyyy"
                          />
                        </td>
                        <td className="p-1.5">
                          <Input
                            placeholder="Kệ A1-02..."
                            value={s.ViTriLuuTru || ""}
                            onChange={(e) =>
                              handleUpdateSerialField(
                                idx,
                                "ViTriLuuTru",
                                e.target.value,
                              )
                            }
                            className="h-8 text-xs bg-background"
                          />
                        </td>
                        <td className="p-1.5 text-center">
                          {serials.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleRemoveSerialRow(idx)}
                              className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 h-7 w-7 cursor-pointer"
                              title="Xóa xe này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-3 border-t border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <span>
                Tổng giá trị vốn đợt nhập:{" "}
                <strong className="text-foreground font-mono">
                  {formatCurrency((donGiaVon || 0) * soLuong)}
                </strong>{" "}
                ({soLuong} đơn vị)
              </span>
            </div>

            <Button
              type="submit"
              disabled={nhapTonMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer text-xs font-semibold h-9 px-5 rounded-lg w-full sm:w-auto"
            >
              {nhapTonMutation.isPending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Đang ghi nhận tồn...
                </>
              ) : (
                <>
                  <PackagePlus className="w-4 h-4 mr-1.5" />
                  Xác nhận nhập tồn kho đầu kỳ
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={showConfirmSubmit}
        onClose={() => setShowConfirmSubmit(false)}
        onConfirm={handleExecuteSubmit}
        title="Xác nhận nhập tồn kho đầu kỳ?"
        description={
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              Bạn đang thực hiện ghi nhận số lượng tồn kho đầu kỳ vào hệ thống:
            </p>
            <div className="p-3 rounded-lg bg-muted/60 space-y-1 font-mono text-foreground">
              <div>
                • Kho: {khoOptions.find((k) => k.value === khoId)?.label}
              </div>
              <div>• Mặt hàng: {selectedVariant?.tenBienThe}</div>
              <div>• Số lượng: +{soLuong} chiếc / kiện</div>
              <div>• Đơn giá vốn: {formatCurrency(donGiaVon)}</div>
              <div>• Tổng vốn: {formatCurrency(donGiaVon * soLuong)}</div>
              {isSerialManaged && (
                <div className="text-blue-600 dark:text-blue-400 font-semibold">
                  • Số lượng Serial kèm theo: {serials.length} mã
                </div>
              )}
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400">
              Thao tác này sẽ trực tiếp cập nhật số dư khả dụng và ghi thẻ kho
              ban đầu.
            </p>
          </div>
        }
        confirmText="Xác nhận nhập kho"
        isLoading={nhapTonMutation.isPending}
        variant="info"
      />

      {/* Bulk Paste Modal */}
      {showBulkPasteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-xl shadow-xl max-w-lg w-full p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-border/70">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <span>Dán danh sách Serial từ Excel / Clipboard</span>
              </div>
              <button
                type="button"
                onClick={() => setShowBulkPasteModal(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Mỗi dòng tương ứng với 1 xe. Các cột phân tách bằng dấu phẩy hoặc
              Tab (Copy trực tiếp từ Excel):
              <br />
              <code className="text-[11px] font-mono text-foreground bg-muted px-1.5 py-0.5 rounded mt-1 inline-block">
                MaSerial, SoKhung, SoMay, SoPin, ViTri
              </code>
            </p>

            <textarea
              rows={8}
              placeholder={`VF-FELIZ-0001, KHUNG-0001, MAY-0001, PIN-0001, Kệ A1-02\nVF-FELIZ-0002, KHUNG-0002, MAY-0002, PIN-0002, Kệ A1-02`}
              value={bulkPasteText}
              onChange={(e) => setBulkPasteText(e.target.value)}
              className="w-full rounded-lg border border-input bg-background p-3 text-xs font-mono shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowBulkPasteModal(false)}
                className="text-xs"
              >
                Hủy bỏ
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleApplyBulkPaste}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                Nạp danh sách Serial
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
