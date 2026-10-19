"use client";

import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { ServiceNavTabs } from "@/components/Common/ServiceNavTabs";
import { usePhieuBaoHanhHook } from "@/hooks/BaoHanh/useBaoHanh";
import { BH_PhieuBaoHanh } from "@/types/baoHanh";
import {
  FileText,
  Plus,
  RefreshCw,
  Search,
  FolderOpen,
  Calendar,
  AlertTriangle,
  User,
  Wrench,
  Trash2,
  CheckCircle2,
  Eye,
} from "lucide-react";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function WarrantyClaimsContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    actionFilter,
    setActionFilter,
    claimStatusOptions,
    getClaimStatusBadge,
    isLoadingClaimStatuses,
    actionOptions,
    getActionBadge,
    isLoadingActions,
    diaDiemOptions,
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
    openAdd,
    setOpenAdd,
    openDetail,
    setOpenDetail,
    selectedItem,
    handleOpenDetail,
    formData,
    setFormData,
    handleOpenAdd,
    handleSubmitAdd,
    handleDelete,
    isSubmitting,
  } = usePhieuBaoHanhHook();

  const columns: Column<BH_PhieuBaoHanh>[] = [
    {
      key: "maPhieuBaoHanh",
      title: "Mã Phiếu BH",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          {String(v || "—")}
        </span>
      ),
    },
    {
      key: "khachHang",
      title: "Khách hàng & Xe",
      classNameHeader: "min-w-[180px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-xs flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {row.tenKhachHang || "Khách hàng"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            SĐT: {row.dienThoaiKhachHang || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "moTaLoi",
      title: "Triệu chứng lỗi & Hiện tượng",
      classNameHeader: "min-w-[220px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (v) => (
        <span className="text-xs text-foreground line-clamp-2">
          {String(v || "—")}
        </span>
      ),
    },
    {
      key: "huongXuLyID",
      title: "Hướng xử lý",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => {
        const badge = getActionBadge(Number(v));
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.className}`}
          >
            {badge.label}
          </span>
        );
      },
    },
    {
      key: "trangThaiID",
      title: "Trạng thái phiếu",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => {
        const badge = getClaimStatusBadge(Number(v));
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.className}`}
          >
            {badge.label}
          </span>
        );
      },
    },
    {
      key: "ngayTiepNhan",
      title: "Ngày nhận / Hẹn",
      classNameHeader: "w-36 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          <span>Nhận: {formatDate(row.ngayTiepNhan)}</span>
          {row.ngayHenTra && <span>Hẹn: {formatDate(row.ngayHenTra)}</span>}
        </div>
      ),
    },
    {
      key: "actions",
      title: "Thao tác",
      classNameHeader: "w-24 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleOpenDetail(row)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
            title="Xem chi tiết phiếu & linh kiện BH"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleDelete(row)}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
            title="Xóa phiếu"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Phiếu Tiếp Nhận & Xử Lý Bảo Hành
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Quy trình tiếp nhận xe lỗi, chẩn đoán, đổi mới pin/linh kiện hoặc bảo hành hãng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
              />
              <span className="text-xs font-medium">Làm mới</span>
            </Button>

            <Button
              size="sm"
              onClick={handleOpenAdd}
              className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs">Lập phiếu tiếp nhận</span>
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <ServiceNavTabs activeTab="claims" totalClaims={totalCount} />
        </div>
      </div>

      {/* Filter */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo mã phiếu, tên khách, mô tả lỗi..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-full sm:w-48">
              <SearchSelect
                placeholder="Trạng thái phiếu..."
                options={[{ value: "", label: "Tất cả trạng thái" }, ...claimStatusOptions]}
                value={statusFilter !== null ? String(statusFilter) : ""}
                onChange={(val) => setStatusFilter(val ? Number(val) : null)}
                isLoading={isLoadingClaimStatuses}
              />
            </div>

            <div className="w-full sm:w-48">
              <SearchSelect
                placeholder="Hướng xử lý..."
                options={[{ value: "", label: "Tất cả hướng xử lý" }, ...actionOptions]}
                value={actionFilter !== null ? String(actionFilter) : ""}
                onChange={(val) => setActionFilter(val ? Number(val) : null)}
                isLoading={isLoadingActions}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full" />
        </Card>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="p-3 flex flex-col gap-3 w-full">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <FolderOpen className="w-10 h-10 mb-2 stroke-[1.5]" />
                <p className="font-semibold text-foreground">Không có yêu cầu bảo hành nào</p>
                <Button
                  size="sm"
                  onClick={handleOpenAdd}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" /> Lập phiếu tiếp nhận mới
                </Button>
              </div>
            ) : (
              <>
                <Table<BH_PhieuBaoHanh>
                  data={items}
                  columns={columns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                <div className="flex justify-between items-center pt-3 border-t border-border/70 text-xs text-muted-foreground">
                  <span>Tổng {totalCount} phiếu bảo hành</span>
                  <div className="flex gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="h-8 px-2.5 text-xs"
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="h-8 px-2.5 text-xs"
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* SlideOver Tiếp nhận */}
      <SlideOver
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Tiếp Nhận Xe / Thiết Bị Bảo Hành"
        maxWidth="md"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Trạm bảo hành / Showroom tiếp nhận
            </label>
            <SearchSelect
              options={diaDiemOptions}
              value={formData.DiaDiemID}
              onChange={(val) => setFormData((prev) => ({ ...prev, DiaDiemID: String(val) }))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mô tả triệu chứng hư hỏng <span className="text-rose-500">*</span>
            </label>
            <Textarea
              placeholder="VD: Xe không nhận sạc pin, chập chờn đồng hồ hiển thị..."
              rows={3}
              value={formData.MoTaLoi}
              onChange={(e) => setFormData((prev) => ({ ...prev, MoTaLoi: e.target.value }))}
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Kết quả chẩn đoán kỹ thuật
            </label>
            <Textarea
              placeholder="VD: Hỏng mạch BMS của khối pin cell #3..."
              rows={2}
              value={formData.KetQuaKiemTra || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, KetQuaKiemTra: e.target.value }))
              }
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Hướng xử lý (Từ DM chi tiết)
              </label>
              <SearchSelect
                options={actionOptions}
                value={String(formData.HuongXuLyID)}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, HuongXuLyID: Number(val) }))
                }
                isLoading={isLoadingActions}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Trạng thái phiếu
              </label>
              <SearchSelect
                options={claimStatusOptions}
                value={String(formData.TrangThaiID)}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, TrangThaiID: Number(val) }))
                }
                isLoading={isLoadingClaimStatuses}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpenAdd(false)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              {isSubmitting ? "Đang lưu..." : "Lập phiếu"}
            </Button>
          </div>
        </form>
      </SlideOver>

      {/* SlideOver Chi tiết phiếu & Linh kiện bảo hành (BH_ChiTietBaoHanh) */}
      <SlideOver
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        title={`Chi Tiết Phiếu Tiếp Nhận ${selectedItem?.maPhieuBaoHanh || ""}`}
        description="Thông tin sự cố, kết quả chẩn đoán và linh kiện/pin thay thế bảo hành"
        maxWidth="xl"
      >
        {selectedItem && (
          <div className="space-y-4 py-2 text-xs">
            <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                  {selectedItem.maPhieuBaoHanh}
                </span>
                <div className="flex items-center gap-1.5">
                  {(() => {
                    const badge = getClaimStatusBadge(selectedItem.trangThaiID);
                    return (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${badge.className}`}>
                        {badge.label}
                      </span>
                    );
                  })()}
                  {(() => {
                    const badge = getActionBadge(selectedItem.huongXuLyID);
                    return (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${badge.className}`}>
                        {badge.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-muted-foreground block">Khách hàng:</span>
                  <strong className="text-foreground">{selectedItem.tenKhachHang || "Khách hàng"}</strong>
                  {selectedItem.dienThoaiKhachHang && (
                    <span className="block font-mono text-muted-foreground">
                      SĐT: {selectedItem.dienThoaiKhachHang}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground block">Trạm tiếp nhận:</span>
                  <span className="text-foreground">{selectedItem.tenDiaDiem || "Showroom chính"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                <span>Tiếp nhận: {formatDate(selectedItem.ngayTiepNhan)}</span>
                <span>Hẹn trả: {formatDate(selectedItem.ngayHenTra)}</span>
                <span>Số KM xe: {selectedItem.soKmHienTai ? `${selectedItem.soKmHienTai} km` : "—"}</span>
                <span>Số khung: {selectedItem.soKhung || "—"}</span>
              </div>
            </div>

            {/* Chẩn đoán lỗi */}
            <div className="p-3 rounded-lg border border-border bg-card/60 space-y-1.5">
              <div>
                <span className="text-muted-foreground text-[11px] block font-medium">Mô tả triệu chứng hư hỏng</span>
                <p className="text-foreground text-xs">{selectedItem.moTaLoi}</p>
              </div>
              {selectedItem.ketQuaKiemTra && (
                <div className="pt-1.5 border-t border-border/50">
                  <span className="text-muted-foreground text-[11px] block font-medium">Kết quả chẩn đoán kỹ thuật</span>
                  <p className="text-foreground text-xs">{selectedItem.ketQuaKiemTra}</p>
                </div>
              )}
            </div>

            {/* Chi tiết linh kiện xử lý bảo hành (BH_ChiTietBaoHanh) */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Danh mục linh kiện / phụ tùng bảo hành ({selectedItem.chiTiets?.length || 0})</span>
              </span>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="p-2 text-left font-medium">Hạng mục / Linh kiện</th>
                      <th className="p-2 text-center font-medium w-16">Loại xử lý</th>
                      <th className="p-2 text-right font-medium w-24">Hãng hỗ trợ</th>
                      <th className="p-2 text-right font-medium w-24">Khách trả</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {selectedItem.chiTiets && selectedItem.chiTiets.length > 0 ? (
                      selectedItem.chiTiets.map((ct, idx) => (
                        <tr key={idx} className="hover:bg-muted/30">
                          <td className="p-2 text-foreground font-medium">
                            {ct.tenBienThe || "Linh kiện"}
                            {ct.soSerialCuMa && (
                              <div className="text-[10px] font-mono text-rose-600">
                                Thu hồi cũ: {ct.soSerialCuMa}
                              </div>
                            )}
                            {ct.soSerialMoiMa && (
                              <div className="text-[10px] font-mono text-emerald-600">
                                Đổi mới sang: {ct.soSerialMoiMa}
                              </div>
                            )}
                          </td>
                          <td className="p-2 text-center">
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-muted">
                              {ct.loaiXuLy === 2 ? "Đổi mới" : "Sửa chữa"}
                            </span>
                          </td>
                          <td className="p-2 text-right font-mono font-medium text-emerald-600">
                            {formatCurrency(ct.chiPhiHangHoTro)}
                          </td>
                          <td className="p-2 text-right font-mono font-medium text-foreground">
                            {formatCurrency(ct.chiPhiKhachTra)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                          Không có linh kiện thay thế hoặc chi phí phát sinh.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chi phí tổng kết */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-border/80 bg-muted/30">
              <div>
                <span className="text-[11px] text-muted-foreground block">Hãng bảo hành hỗ trợ</span>
                <strong className="text-emerald-600 font-mono text-xs">
                  {formatCurrency(selectedItem.chiPhiHangHoTro)}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-muted-foreground block">Khách hàng chi trả</span>
                <strong className="text-foreground font-mono text-xs">
                  {formatCurrency(selectedItem.chiPhiKhachTra)}
                </strong>
              </div>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}

export default function WarrantyClaimsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-4 max-w-[1600px] mx-auto">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <WarrantyClaimsContent />
    </Suspense>
  );
}
