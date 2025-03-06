// src/components/ui/Toast/ToastContainer.tsx
import React from "react";
import Toast from "./Toast";
import { useToast } from "../../../hooks/useToast";

export const ToastContainer: React.FC = () => {
  const { showToast, toastMessage, toastType, toastPosition, hideToast } = useToast();

  if (!showToast) return null;

  return (
    <Toast
      message={toastMessage}
      type={toastType}
      position={toastPosition}
      onClose={hideToast}
    />
  );
};