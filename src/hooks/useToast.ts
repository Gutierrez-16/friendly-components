// src/hooks/useToast.ts
import { useContext } from "react";
import { ToastContext, ToastContextType } from "../components/ui/Toast/providers/ToastProvider";

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};