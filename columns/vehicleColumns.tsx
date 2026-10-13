import { Button } from "@/components/ui/button";
import { Column } from "@/components/ui/Table";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const getVehicleColumns = (
  router: AppRouterInstance,
): Column<any>[] => [
  {
    key: "sku",
    title: "Mã sản phẩm",
    classNameHeader: "text-left",
  },
  {
    key: "color",
    title: "Màu sắc",
    classNameHeader: "text-left",
  },
  {
    key: "product.name",
    accessor: (row) => row.product.name,
    title: "Tên sản phẩm",
    classNameHeader: "text-left",
  },
  {
    key: "product.brand.name",
    accessor: (row) => row.product.brand.name,
    title: "Thương hiệu",
    classNameHeader: "text-left",
  },
  {
    key: "sellingPrice",
    title: "Giá bán",
    classNameHeader: "text-right",
    classNameItem: "text-right",
  },
  {
    key: "stockQuantity",
    title: "Số Lượng",
    classNameHeader: "text-right",
    classNameItem: "text-right",
  },
  {
    key: "warrantyMonths",
    title: "Bảo hành (tháng)",
    classNameHeader: "text-right",
    classNameItem: "text-right",
  },
  {
    key: "battery",
    title: "Pin",
    classNameHeader: "text-left",
  },
  {
    key: "motorPower",
    title: "Động cơ",
    classNameHeader: "text-left",
  },
  {
    key: "actions",
    title: "Action",
    classNameItem: "text-center",
    render: (_value, row) => (
      <div className="flex justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(`/admin/products/${row.productId}`)}
        >
          View
        </Button>
      </div>
    ),
  },
];