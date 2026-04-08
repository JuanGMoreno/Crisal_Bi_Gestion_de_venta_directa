
import { create } from "zustand";

type ModalType = "createProduct" | "editProduct" | "deleteProduct" | "detailsProduct" | null;
type DialogData = {
  id?: string;
  [key: string]: unknown;
};

interface DialogState {
  type: ModalType;
  data: DialogData | null;
  isOpen: boolean;
  openDialog: (type: ModalType, data?: DialogData) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  type: null,
  data: null,
  isOpen: false,
  openDialog: (t: ModalType, d?: DialogData) => set({ isOpen: true, type: t, data: d ?? null }),
  closeDialog: () => set({ isOpen: false, type: null, data: null }),
}));

