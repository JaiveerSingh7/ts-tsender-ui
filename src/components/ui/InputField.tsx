// components/InputField.tsx
import React from "react";

type InputFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  /** HTML input type, e.g. "text", "email", "number" (ignored when large=true) */
  type?: React.HTMLInputTypeAttribute;
  /** Renders a textarea when true */
  large?: boolean;
  /** Standard React onChange handler for input/textarea */
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void ;
  /** Optional id to link label and input (auto-generated if omitted) */
  id?: string;
  /** Optional disabled state */
  disabled?: boolean;
  /** Optional required marker */
  required?: boolean;
  /** Optional helper text under the field */
  helperText?: string;
  /** Optional className passthrough for the outer wrapper */
  className?: string;
};

const InputField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputFieldProps
>(function InputField(
  {
    label,
    placeholder,
    value,
    type = "text",
    large = false,
    onChange,
    id,
    disabled,
    required,
    helperText,
    className = "",
  },
  ref
) {
  const inputId = id ?? React.useId();

  const baseClasses =
    "block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-gray-400 focus:ring-2 focus:ring-black/10 dark:border-white/15 dark:bg-neutral-900 dark:text-gray-100 dark:focus:ring-white/10";

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>

      {large ? (
        <textarea
          id={inputId}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          rows={5}
          className={`${baseClasses} resize-y min-h-[120px]`}
        />
      ) : (
        <input
          id={inputId}
          ref={ref as React.Ref<HTMLInputElement>}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={baseClasses}
        />
      )}

      {helperText ? (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      ) : null}
    </div>
  );
});

export default InputField;
