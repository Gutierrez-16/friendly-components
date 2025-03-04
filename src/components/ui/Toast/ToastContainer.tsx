import React from "react";
import Toast from "./Toast";
import { useToast } from "../../../hooks/useToast";

const ToastContainer: React.FC = () => {
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

export default ToastContainer;
