import * as React from "react";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  position?: "top" | "center" | "bottom";
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  size = "md",
  position = "center",
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm max-h-sm", // 300px
    md: "max-w-md max-h-md", // 500px (default)
    lg: "max-w-lg max-w-lg", // 700px
  };

  const positionClasses = {
    top: "top-10",
    center: "top-1/2 -translate-y-1/2",
    bottom: "bottom-10",
  };

  return (
    <div className="fixed inset-0 flex justify-center items-start z-50">
      {/* Fondo del modal */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Contenedor del modal */}
      <div
        className={`absolute ${positionClasses[position]} bg-white rounded-lg shadow-lg w-full ${sizeClasses[size]} p-4 max-h-[400px] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogHeader: React.FC<{ title: string; onClose: () => void }> = ({
  title,
  onClose,
}) => (
  <div className="flex justify-between items-center border-b border-b-primary-light pb-2">
    <h2 className="text-lg font-semibold">{title}</h2>
    <button onClick={onClose} className="text-primary-light hover:text-primary">
      <X className="h-5 w-5" />
    </button>
  </div>
);

const DialogContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="py-2 text-sm flex-1 overflow-auto scroll-hidden">
    {children}
  </div>
);

const DialogFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="flex justify-end space-x-2">{children}</div>;

export { Dialog, DialogHeader, DialogContent, DialogFooter };
