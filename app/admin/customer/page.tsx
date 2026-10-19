"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { SearchSelect } from "@/components/ui/selectSearch";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { CustomerNavTabs } from "@/components/Common/CustomerNavTabs";
import { Pagination } from "@/components/Common/Pagination";
import { CreateCustomerSlideOver } from "@/components/Customer/CreateCustomerSlideOver";
import { UpdateCustomerSlideOver } from "@/components/Customer/UpdateCustomerSlideOver";
import { useKhachHang } from "@/hooks/KhachHang/useKhachHang";
import { KH_KhachHang, KhachHangKPI } from "@/types/khachHang";
import { getImageUrl } from "@/shared/constants/apiConstants";
import {
  Users,
  User,
  Building2,
  Plus,
  RefreshCw,
  Search,
  SquarePen,
  Trash2,
  FolderOpen,
  Filter,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Bike,
  Award,
  CreditCard,
  Briefcase,
  LayoutGrid,
  List,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

type ViewMode = "grid" | "table";

function CustomerContent() {
  const searchParams = useSearchParams();
  const initialTinhId = searchParams.get("tinhId") || undefined;

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const shouldReduceMotion = useReducedMotion();

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    loaiFilter,
    setLoaiFilter,
    tinhFilter,
    setTinhFilter,
    searchInput,
    handleSearch,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    // KPI data
    kpiData,
    isLoadingKPI,
    refetchKPI,

    provinceOptions,
    isLoadingTinh,
    communeOptionsAdd,
    isLoadingXaAdd,
    communeOptionsUpdate,
    isLoadingXaUpdate,

    open,
    setOpen,
    dataAdd,
    setDataAdd,
    handleModalAdd,
    handleSubmit,
    isCreating,

    openUpdate,
    setOpenUpdate,
    dataUpdate,
    setDataUpdate,
    handleOpenEdit,
    handleSubmitUpdate,
    isUpdating,

    openDelete,
    setOpenDelete,
    selectItemName,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting,

    errors,
  } = useKhachHang(initialTinhId);

  // File upload previews
  const [avatarPreviewAdd, setAvatarPreviewAdd] = useState<string | null>(null);
  const [logoPreviewAdd, setLogoPreviewAdd] = useState<string | null>(null);
  const [avatarPreviewUpdate, setAvatarPreviewUpdate] = useState<string | null>(
    null,
  );
  const [logoPreviewUpdate, setLogoPreviewUpdate] = useState<string | null>(
    null,
  );

  // Metrics (Derived KPI metrics - Ưu tiên lấy từ API GetKPI hoặc fallback lọc cục bộ)
  const individualCount = useMemo(
    () => items.filter((i) => i.loaiKhachHang === 1).length,
    [items],
  );
  const businessCount = useMemo(
    () => items.filter((i) => i.loaiKhachHang === 2).length,
    [items],
  );
  const activeCount = useMemo(
    () => items.filter((i) => i.trangThai === true).length,
    [items],
  );

  const kpi = kpiData as unknown as (KhachHangKPI & { data?: KhachHangKPI }) | undefined;

  const total_KhachHang = kpi?.data?.total_KhachHang ?? kpi?.total_KhachHang ?? totalCount;
  const total_CaNhan = kpi?.data?.total_CaNhan ?? kpi?.total_CaNhan ?? individualCount;
  const total_ToChuc = kpi?.data?.total_ToChuc ?? kpi?.total_ToChuc ?? businessCount;
  const total_HoatDong = kpi?.data?.total_HoatDong ?? kpi?.total_HoatDong ?? activeCount;

  const handleReload = () => {
    refetch();
    refetchKPI();
  };

  // Dynamic KPI Cards mapped via .map()
  const kpiCards = useMemo(
    () => [
      {
        id: "all",
        label: "Tổng số khách hàng",
        value: total_KhachHang,
        subtext: "Đăng ký trong toàn hệ thống",
        icon: Users,
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-600 dark:text-blue-400",
        valueColor: "text-foreground",
        isActive: loaiFilter === "all" && statusFilter === "all",
        onClick: () => {
          setLoaiFilter("all");
          setStatusFilter("all");
          setPage(1);
        },
        activeBorderClass:
          "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10",
        isLoading: isLoadingKPI && isLoading,
      },
      {
        id: "individual",
        label: "Khách hàng Cá nhân",
        value: total_CaNhan,
        subtext: "Người tiêu dùng cá nhân & mua lẻ",
        icon: User,
        iconBg: "bg-sky-500/10",
        iconColor: "text-sky-600 dark:text-sky-400",
        valueColor: "text-sky-600 dark:text-sky-400",
        isActive: loaiFilter === "1",
        onClick: () => {
          setLoaiFilter("1");
          setPage(1);
        },
        activeBorderClass:
          "border-sky-500/50 bg-sky-500/5 shadow-xs ring-2 ring-sky-500/10",
        isLoading: isLoadingKPI && isLoading,
      },
      {
        id: "business",
        label: "Doanh nghiệp / Tổ chức",
        value: total_ToChuc,
        subtext: "Đối tác mua sỉ, công ty & đại lý",
        icon: Building2,
        iconBg: "bg-indigo-500/10",
        iconColor: "text-indigo-600 dark:text-indigo-400",
        valueColor: "text-indigo-600 dark:text-indigo-400",
        isActive: loaiFilter === "2",
        onClick: () => {
          setLoaiFilter("2");
          setPage(1);
        },
        activeBorderClass:
          "border-indigo-500/50 bg-indigo-500/5 shadow-xs ring-2 ring-indigo-500/10",
        isLoading: isLoadingKPI && isLoading,
      },
      {
        id: "active",
        label: "Đang hoạt động",
        value: total_HoatDong,
        subtext: "Được phép tạo đơn & bảo dưỡng",
        icon: CheckCircle2,
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        valueColor: "text-emerald-600 dark:text-emerald-400",
        isActive: statusFilter === "active",
        onClick: () => {
          setStatusFilter("active");
          setPage(1);
        },
        activeBorderClass:
          "border-emerald-500/50 bg-emerald-500/5 shadow-xs ring-2 ring-emerald-500/10",
        isLoading: isLoadingKPI && isLoading,
      },
    ],
    [
      total_KhachHang,
      total_CaNhan,
      total_ToChuc,
      total_HoatDong,
      loaiFilter,
      statusFilter,
      isLoadingKPI,
      isLoading,
      setLoaiFilter,
      setStatusFilter,
      setPage,
    ],
  );


  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    toast.success(`Đã sao chép mã khách hàng: ${code}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAvatarChangeAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataAdd((prev) => ({ ...prev, anhChanDung: file }));
      setAvatarPreviewAdd(URL.createObjectURL(file));
    }
  };

  const handleLogoChangeAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataAdd((prev) => ({ ...prev, anhBieuTrung: file }));
      setLogoPreviewAdd(URL.createObjectURL(file));
    }
  };

  const handleAvatarChangeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataUpdate((prev) => ({
        ...prev,
        anhChanDung: file,
        XoaAnhChanDung: false,
      }));
      setAvatarPreviewUpdate(URL.createObjectURL(file));
    }
  };

  const handleLogoChangeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataUpdate((prev) => ({
        ...prev,
        anhBieuTrung: file,
        XoaAnhBieuTrung: false,
      }));
      setLogoPreviewUpdate(URL.createObjectURL(file));
    }
  };

  const columns: Column<KH_KhachHang>[] = [
    {
      key: "maKhachHang",
      title: "Mã KH",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <button
          type="button"
          onClick={(e) => handleCopyCode(String(v || ""), e)}
          title="Nhấn để sao chép mã khách hàng"
          className="group/btn inline-flex items-center gap-1.5 font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted/80 hover:bg-muted text-foreground border border-border/60 transition-all cursor-pointer shadow-2xs"
        >
          <span>{v || "KH—"}</span>
          {copiedId === v ? (
            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
          )}
        </button>
      ),
    },
    {
      key: "tenKhachHang",
      title: "Khách hàng & Liên hệ",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex items-center gap-3 py-1">
          {/* Avatar or Logo */}
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/20 font-bold overflow-hidden shadow-2xs">
            {(row.anhChanDung || row.anhBieuTrung) &&
            getImageUrl(row.anhChanDung || row.anhBieuTrung) ? (
              <Image
                src={getImageUrl(row.anhChanDung || row.anhBieuTrung)}
                alt={row.tenKhachHang}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : row.loaiKhachHang === 2 ? (
              <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
          </div>

          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span
                onClick={() => {
                  setAvatarPreviewUpdate(null);
                  setLogoPreviewUpdate(null);
                  handleOpenEdit(row);
                }}
                className="font-semibold text-foreground text-sm truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                {row.tenKhachHang}
              </span>
              {row.loaiKhachHang === 2 ? (
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                  Doanh nghiệp
                </span>
              ) : (
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                  Cá nhân
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <a
                href={`tel:${row.dienThoai}`}
                className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
              >
                <Phone className="w-3 h-3 shrink-0" />
                {row.dienThoai}
              </a>
              {row.hopThu && (
                <a
                  href={`mailto:${row.hopThu}`}
                  className="flex items-center gap-1 truncate max-w-[180px] hover:underline"
                >
                  <Mail className="w-3 h-3 shrink-0" />
                  {row.hopThu}
                </a>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "maDinhDanh",
      title: "CCCD / MST",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => {
        const val = row.loaiKhachHang === 2 ? row.maSoThue : row.maDinhDanh;
        return val ? (
          <div className="flex flex-col items-center">
            <span className="font-mono text-xs font-medium px-2 py-0.5 rounded bg-muted/60 border border-border/50 text-foreground">
              {val}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              {row.loaiKhachHang === 2 ? "Mã số thuế" : "Số CCCD"}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground/60 text-xs">—</span>
        );
      },
    },
    {
      key: "diaChi",
      title: "Địa chỉ liên hệ",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex items-start gap-1.5 py-0.5 text-xs text-muted-foreground max-w-xs">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0 mt-0.5" />
          <span className="line-clamp-2">
            {row.diaChi || "Chưa cập nhật địa chỉ"}
          </span>
        </div>
      ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader:
        "text-center w-28 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Hoạt động
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Đã khóa
            </span>
          </div>
        ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "text-center w-36 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Link
            href={`/admin/customer/vehicles?khachHangId=${row.khachHangID}`}
            title="Xem danh sách xe của khách"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer active:scale-95"
          >
            <Bike className="w-4 h-4" />
          </Link>

          <Link
            href={`/admin/customer/statistics`}
            title="Xem xếp hạng & công nợ"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors cursor-pointer active:scale-95"
          >
            <Award className="w-4 h-4" />
          </Link>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setAvatarPreviewUpdate(null);
              setLogoPreviewUpdate(null);
              handleOpenEdit(row);
            }}
            title="Chỉnh sửa hồ sơ"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer active:scale-95"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenDelete(row)}
            title="Xóa khách hàng"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const hasActiveFilters = Boolean(
    searchInput || statusFilter !== "all" || loaiFilter !== "all" || tinhFilter,
  );

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter("all");
    setLoaiFilter("all");
    setTinhFilter("");
    setPage(1);
  };

  return (
    <div className="p-3 sm:p-4 md:p-8 min-h-screen space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      {/* 1. Header & Navigation Hub */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-border/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
                <span>Hệ thống</span>
                <span className="text-muted-foreground/30">/</span>
                <span>Kinh doanh</span>
                <span className="text-muted-foreground/30">/</span>
                <span className="text-foreground">Khách hàng</span>
              </div>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                  <Users className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                    Hồ sơ Khách hàng
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                    Quản lý khách hàng cá nhân & tổ chức doanh nghiệp, tích hợp
                    thông tin liên hệ và định danh
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReload}
                disabled={isFetching || isLoadingKPI}
                className="h-9 px-3 flex-1 sm:flex-initial flex items-center justify-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs active:scale-95"
                title="Làm mới danh sách khách hàng và KPI"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""}`}
                />
                <span className="text-xs font-medium">Làm mới</span>
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  setAvatarPreviewAdd(null);
                  setLogoPreviewAdd(null);
                  handleModalAdd();
                }}
                className="h-9 px-3.5 sm:px-4 flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs font-medium whitespace-nowrap">Thêm khách hàng</span>
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto no-scrollbar pt-1">
            <CustomerNavTabs activeTab="customer" totalCustomer={total_KhachHang} />
          </div>
        </div>
      )}

      {/* 2. KPI Cards (Rendered dynamically via .map()) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.id}
              onClick={card.onClick}
              className={`p-3 sm:p-4 gap-0 rounded-xl border transition-all cursor-pointer ${
                card.isActive
                  ? card.activeBorderClass
                  : "border-border/80 bg-card hover:border-border hover:shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-medium text-muted-foreground truncate pr-1">
                  {card.label}
                </span>
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className={`mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold ${card.valueColor}`}>
                {card.isLoading ? (
                  <Skeleton className="h-6 sm:h-7 w-14 sm:w-16" />
                ) : (
                  card.value
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1 truncate">
                {card.subtext}
              </p>
            </Card>
          );
        })}
      </div>

      {/* 3. Toolbar: Tìm kiếm & Lọc & Chuyển chế độ xem */}
      <div className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên khách hàng, số điện thoại, CCCD / MST..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-xs sm:text-sm focus-visible:ring-blue-500/20"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-wrap">
            {/* Tỉnh thành Filter */}
            <div className="w-full sm:w-44 lg:w-48 shrink-0">
              <SearchSelect
                options={[
                  { value: "", label: "Tất cả Tỉnh/Thành" },
                  ...provinceOptions,
                ]}
                value={tinhFilter}
                onChange={(val) => {
                  setTinhFilter(val);
                  setPage(1);
                }}
                placeholder="Chọn Tỉnh/Thành"
                isLoading={isLoadingTinh}
                className="h-9.5 text-xs w-full"
              />
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {/* Phân loại Tabs */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0 max-w-full overflow-x-auto no-scrollbar">
                <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5 hidden sm:block shrink-0" />
                <button
                  type="button"
                  onClick={() => {
                    setLoaiFilter("all");
                    setPage(1);
                  }}
                  className={`px-2 sm:px-2.5 py-1.5 rounded-md font-medium text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap ${
                    loaiFilter === "all"
                      ? "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Tất cả ({total_KhachHang})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoaiFilter("1");
                    setPage(1);
                  }}
                  className={`px-2 sm:px-2.5 py-1.5 rounded-md font-medium text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap ${
                    loaiFilter === "1"
                      ? "bg-background shadow-xs text-sky-600 dark:text-sky-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Cá nhân ({total_CaNhan})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoaiFilter("2");
                    setPage(1);
                  }}
                  className={`px-2 sm:px-2.5 py-1.5 rounded-md font-medium text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap ${
                    loaiFilter === "2"
                      ? "bg-background shadow-xs text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Tổ chức ({total_ToChuc})
                </button>
              </div>

              {/* Trạng thái filter */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0 max-w-full overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("all");
                    setPage(1);
                  }}
                  className={`px-2 sm:px-2.5 py-1.5 rounded-md font-medium text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === "all"
                      ? "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("active");
                    setPage(1);
                  }}
                  className={`px-2 sm:px-2.5 py-1.5 rounded-md font-medium text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === "active"
                      ? "bg-background shadow-xs text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Hoạt động ({total_HoatDong})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("inactive");
                    setPage(1);
                  }}
                  className={`px-2 sm:px-2.5 py-1.5 rounded-md font-medium text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === "inactive"
                      ? "bg-background shadow-xs text-slate-700 dark:text-slate-300 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Khóa
                </button>
              </div>

              {/* View Mode & Reload */}
              <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shrink-0 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    title="Chế độ xem lưới thẻ (Showcase Grid)"
                    className={`flex items-center justify-center w-8 h-8 rounded-md transition-all cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-background text-foreground shadow-2xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    title="Chế độ xem bảng chi tiết (Data Table)"
                    className={`flex items-center justify-center w-8 h-8 rounded-md transition-all cursor-pointer ${
                      viewMode === "table"
                        ? "bg-background text-foreground shadow-2xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Reload Button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReload}
                  disabled={isFetching || isLoadingKPI}
                  title="Tải lại danh sách và chỉ số KPI"
                  className="h-9 w-9 shrink-0 cursor-pointer shadow-2xs active:scale-95"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-xs flex-wrap">
            <span className="text-muted-foreground font-medium">Đang lọc:</span>
            {searchInput && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Từ khóa: &quot;{searchInput}&quot;
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
            {loaiFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Loại: {loaiFilter === "1" ? "Cá nhân" : "Doanh nghiệp"}
                <button
                  type="button"
                  onClick={() => setLoaiFilter("all")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
            {tinhFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Tỉnh/Thành:{" "}
                {provinceOptions.find((p) => p.value === tinhFilter)?.label ||
                  tinhFilter}
                <button
                  type="button"
                  onClick={() => setTinhFilter("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Trạng thái:{" "}
                {statusFilter === "active" ? "Đang hoạt động" : "Đã khóa"}
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer ml-auto"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* 4. Content Area: Showcase Grid vs Data Table */}
      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Card
                key={idx}
                className="rounded-xl border border-border/70 p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <div className="pt-2 border-t border-border/40 flex justify-between gap-2">
                  <Skeleton className="h-8 flex-1 rounded-lg" />
                  <Skeleton className="h-8 flex-1 rounded-lg" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <Skeleton className="h-10 w-full mb-3" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full" />
          </Card>
        )
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-border/80 bg-card p-12 flex flex-col items-center justify-center text-center text-muted-foreground shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
            <FolderOpen className="w-7 h-7 stroke-[1.5]" />
          </div>
          <p className="font-semibold text-base text-foreground">
            Không tìm thấy khách hàng nào
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            {hasActiveFilters
              ? "Không có kết quả khớp với điều kiện lọc. Hãy điều chỉnh từ khóa hoặc xóa bớt tiêu chí lọc."
              : "Chưa có hồ sơ khách hàng trong hệ thống. Hãy thêm mới khách hàng ngay!"}
          </p>
          <div className="flex items-center gap-2 mt-4">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="cursor-pointer"
              >
                Xóa bộ lọc
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => {
                setAvatarPreviewAdd(null);
                setLogoPreviewAdd(null);
                handleModalAdd();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" /> Thêm khách hàng mới
            </Button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* SHOWCASE GRID VIEW */
        <div className="space-y-4">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {items.map((cust: KH_KhachHang) => (
              <Card
                key={cust.khachHangID}
                className="group rounded-xl border border-border/80 bg-card p-4 pb-2 shadow-2xs hover:shadow-md hover:border-border transition-all flex flex-col justify-between gap-3 relative"
              >
                <div className="space-y-3">
                  {/* Top Bar: Avatar/Logo + Customer Type + Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/20 font-bold overflow-hidden shadow-2xs">
                        {(cust.anhChanDung || cust.anhBieuTrung) &&
                        getImageUrl(cust.anhChanDung || cust.anhBieuTrung) ? (
                          <Image
                            src={getImageUrl(
                              cust.anhChanDung || cust.anhBieuTrung,
                            )}
                            alt={cust.tenKhachHang}
                            width={44}
                            height={44}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : cust.loaiKhachHang === 2 ? (
                          <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span
                          className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-semibold border truncate ${
                            cust.loaiKhachHang === 2
                              ? "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/25"
                              : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25"
                          }`}
                        >
                          {cust.loaiKhachHang === 2
                            ? "Doanh nghiệp"
                            : "Cá nhân"}
                        </span>
                      </div>
                    </div>

                    {cust.trangThai ? (
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Khóa
                      </span>
                    )}
                  </div>

                  {/* Customer Name & Code */}
                  <div>
                    <h3
                      onClick={() => {
                        setAvatarPreviewUpdate(null);
                        setLogoPreviewUpdate(null);
                        handleOpenEdit(cust);
                      }}
                      className="text-sm sm:text-base font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-1"
                      title={cust.tenKhachHang}
                    >
                      {cust.tenKhachHang}
                    </h3>

                    {/* Mã KH click-to-copy */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                      <button
                        type="button"
                        onClick={(e) =>
                          handleCopyCode(cust.maKhachHang || "", e)
                        }
                        title="Sao chép mã khách hàng"
                        className="group/code inline-flex items-center gap-1 font-mono text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-md bg-muted/70 hover:bg-muted text-foreground border border-border/60 transition-colors cursor-pointer shadow-2xs"
                      >
                        <span className="text-muted-foreground text-[10px]">
                          Mã:
                        </span>
                        <span className="font-semibold">
                          {cust.maKhachHang || "KH—"}
                        </span>
                        {copiedId === cust.maKhachHang ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 opacity-40 group-hover/code:opacity-100 transition-opacity" />
                        )}
                      </button>

                      {/* CCCD or MST Chip */}
                      {(cust.maDinhDanh || cust.maSoThue) && (
                        <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md text-[10.5px] sm:text-[11px] font-mono bg-muted/40 text-muted-foreground border border-border/40 truncate max-w-[150px] sm:max-w-none">
                          {cust.loaiKhachHang === 2 ? (
                            <>
                              <Briefcase className="w-3 h-3 text-indigo-500 shrink-0" />
                              <span className="truncate">
                                {cust.maSoThue}
                              </span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-3 h-3 text-blue-500 shrink-0" />
                              <span className="truncate">
                                {cust.maDinhDanh}
                              </span>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1 pt-1 border-t border-border/50 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <a
                        href={`tel:${cust.dienThoai}`}
                        className="font-mono text-foreground hover:text-blue-600 transition-colors truncate"
                      >
                        {cust.dienThoai}
                      </a>
                    </div>
                    {cust.hopThu && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <a
                          href={`mailto:${cust.hopThu}`}
                          className="hover:text-blue-600 transition-colors truncate"
                        >
                          {cust.hopThu}
                        </a>
                      </div>
                    )}
                    {cust.diaChi && (
                      <div className="flex items-start gap-2 pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{cust.diaChi}</span>
                      </div>
                    )}
                  </div>

                  {/* Hub Links: Xe sở hữu & Thống kê */}
                  <div className="pt-2 border-t border-border/50 grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                    <Link
                      href={`/admin/customer/vehicles?khachHangId=${cust.khachHangID}`}
                      className="flex items-center justify-between p-1.5 sm:p-2 rounded-lg bg-muted/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-border/50 hover:border-blue-500/30 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer group/link"
                      title="Xem danh sách xe của khách"
                    >
                      <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                        <Bike className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="font-medium text-[10.5px] sm:text-[11px] truncate">
                          Xe sở hữu
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all shrink-0" />
                    </Link>

                    <Link
                      href={`/admin/customer/statistics`}
                      className="flex items-center justify-between p-1.5 sm:p-2 rounded-lg bg-muted/40 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-border/50 hover:border-amber-500/30 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer group/link"
                      title="Xem xếp hạng & công nợ"
                    >
                      <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                        <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="font-medium text-[10.5px] sm:text-[11px] truncate">
                          Xếp hạng
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-2 border-t border-border/60 flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAvatarPreviewUpdate(null);
                      setLogoPreviewUpdate(null);
                      handleOpenEdit(cust);
                    }}
                    className="h-8 px-2.5 text-xs text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
                  >
                    <SquarePen className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDelete(cust)}
                    className="h-8 px-2.5 text-xs text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </Button>
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Centralized Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            itemName="khách hàng"
          />
        </div>
      ) : (
        /* DATA TABLE VIEW */
        <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="p-2 sm:p-3 flex flex-col gap-3 w-full overflow-x-auto">
            <Table<KH_KhachHang>
              data={items}
              columns={columns}
              showIndex
              startIndex={(page - 1) * pageSize}
            />


            {/* Centralized Pagination */}
            <Pagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              itemName="khách hàng"
            />
          </div>
        </div>
      )}

      {/* SlideOver: THÊM MỚI KHÁCH HÀNG */}
      <CreateCustomerSlideOver
        open={open}
        onClose={() => setOpen(false)}
        dataAdd={dataAdd}
        setDataAdd={setDataAdd}
        handleSubmit={handleSubmit}
        isCreating={isCreating}
        errors={errors}
        provinceOptions={provinceOptions}
        isLoadingTinh={isLoadingTinh}
        communeOptionsAdd={communeOptionsAdd}
        isLoadingXaAdd={isLoadingXaAdd}
        avatarPreviewAdd={avatarPreviewAdd}
        logoPreviewAdd={logoPreviewAdd}
        handleAvatarChangeAdd={handleAvatarChangeAdd}
        handleLogoChangeAdd={handleLogoChangeAdd}
      />

      {/* SlideOver: CẬP NHẬT KHÁCH HÀNG */}
      <UpdateCustomerSlideOver
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        handleSubmitUpdate={handleSubmitUpdate}
        isUpdating={isUpdating}
        errors={errors}
        provinceOptions={provinceOptions}
        isLoadingTinh={isLoadingTinh}
        communeOptionsUpdate={communeOptionsUpdate}
        isLoadingXaUpdate={isLoadingXaUpdate}
        avatarPreviewUpdate={avatarPreviewUpdate}
        logoPreviewUpdate={logoPreviewUpdate}
        handleAvatarChangeUpdate={handleAvatarChangeUpdate}
        handleLogoChangeUpdate={handleLogoChangeUpdate}
      />

      {/* Modal Xóa */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa khách hàng"
        description={
          <div>
            <p>
              Bạn có chắc chắn muốn xóa khách hàng &quot;
              <strong className="text-foreground">{selectItemName}</strong>
              &quot; không?
            </p>
            <span className="text-xs text-rose-600/90 dark:text-rose-400 mt-2 block bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              Hành động này không thể hoàn tác nếu khách hàng đang có đơn hàng,
              lịch sử sở hữu xe hoặc công nợ chưa thanh toán.
            </span>
          </div>
        }
        confirmText="Xác nhận xóa"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function CustomerPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-96" />
        </div>
      }
    >
      <CustomerContent />
    </Suspense>
  );
}
