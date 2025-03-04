import React, { createContext, useState } from "react";
import { ToastType, ToastPosition } from "../types/toast";

interface ToastContextType {
  showToast: boolean;
  toastMessage: string;
  toastType: ToastType;
  toastPosition: ToastPosition;
  setToast: (message: string, type: ToastType, position?: ToastPosition) => void;
  hideToast: () => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");
  const [toastPosition, setToastPosition] = useState<ToastPosition>("bottom-right");

  const setToast = (
    message: string, 
    type: ToastType, 
    position: ToastPosition = "bottom-right"
  ) => {
    setToastMessage(message);
    setToastType(type);
    setToastPosition(position);
    setShowToast(true);
  };

  const hideToast = () => setShowToast(false);

  return (
    <ToastContext.Provider 
      value={{ 
        showToast, 
        toastMessage, 
        toastType, 
        toastPosition, 
        setToast, 
        hideToast 
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};
