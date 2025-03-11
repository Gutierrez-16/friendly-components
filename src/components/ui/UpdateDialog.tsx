import React, { useState } from "react";
import { Dialog, DialogHeader, DialogContent, DialogFooter } from "./Dialog";
import { Input } from "./input/Input";
import { Dropdown } from "./Dropdown";
import { Calendar } from "./calendar/Calendar";
import { Button } from "./Button";

interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "dropdown" | "calendar";
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface UpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
  fields: Field[];
  initialValues: Record<string, any>;
  title?: string;
}

export const UpdateDialog: React.FC<UpdateDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fields,
  initialValues,
  title,
}) => {
  const [formData, setFormData] = useState(initialValues);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="md">
      {title && <DialogHeader title={title} onClose={onClose} />}
      <DialogContent>
        <form className="flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.name}>
              {field.type === "text" || field.type === "number" ? (
                <Input
                  type={field.type}
                  label={field.label}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                />
              ) : field.type === "dropdown" ? (
                <Dropdown
                  label={field.label}
                  options={field.options || []}
                  value={formData[field.name] || ""}
                  onChange={(value: string | number) => handleChange(field.name, value)}
                />
              ) : field.type === "calendar" ? (
                <Calendar
                  label={field.label}
                  value={formData[field.name] ? new Date(formData[field.name]) : null}
                  onChange={(value) => handleChange(field.name, value?.toISOString().split("T")[0])}
                />
              ) : null}
            </div>
          ))}
        </form>
      </DialogContent>
      <DialogFooter>
        <Button color="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>Guardar</Button>
      </DialogFooter>
    </Dialog>
  );
};
