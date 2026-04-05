
import { create } from "zustand";

type ModalType = "createProduct" | "editProduct" | "deleteProduct" | null;

interface DialogState {
  type: ModalType;
  data : any; // Puedes especificar un tipo más concreto según tus necesidades
  isOpen: boolean;
  openDialog: (type: ModalType) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  openDialog: (t: ModalType) => set({ isOpen: true , type: t }),
  closeDialog: () => set({ isOpen: false , type: null }),
}));

