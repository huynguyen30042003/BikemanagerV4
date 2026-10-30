import { create } from "zustand";
import { KH_KhachHang } from "@/types/khachHang";

interface CustomerModalState {
  isOpenCreate: boolean;
  editingCustomer: KH_KhachHang | null;
  openCreate: () => void;
  closeCreate: () => void;
  openEdit: (customer: KH_KhachHang) => void;
  closeEdit: () => void;
}

export const useCustomerModalStore = create<CustomerModalState>((set) => ({
  isOpenCreate: false,
  editingCustomer: null,
  openCreate: () => set({ isOpenCreate: true }),
  closeCreate: () => set({ isOpenCreate: false }),
  openEdit: (customer) => set({ editingCustomer: customer }),
  closeEdit: () => set({ editingCustomer: null }),
}));

