import * as React from "react";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  validate?: (data: Record<string, any>) => Record<string, string>;
  defaultValues?: Record<string, any>;
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ children, onSubmit, validate, defaultValues = {}, ...props }, ref) => {
    const formRef = React.useRef<HTMLFormElement>(null);

    React.useImperativeHandle(ref, () => formRef.current as HTMLFormElement);

    React.useEffect(() => {
      if (formRef.current && defaultValues) {
        for (const [key, value] of Object.entries(defaultValues)) {
          const field = formRef.current.elements.namedItem(key) as HTMLInputElement | null;
          if (field) {
            field.value = value as string;
          }
        }
      }
    }, [defaultValues]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      if (validate) {
        const errors = validate(data);
        if (Object.keys(errors).length > 0) {
          console.error("Errores de validación:", errors);
          return;
        }
      }
      await onSubmit(data);
      form.reset();
    };

    return (
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        {...props}
        className={`w-full  mx-auto p-4 ${props.className || ""}`}
      >
        {children}
      </form>
    );
  }
);
