import { useRef, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Input({
  idInput,
  textLabel,
  typeInput = "text",
  placeholderInput = "",
  maxLengthInput,
  minLengthInput,
  valueInput,
  setValue,
  icon: Icon,
  errorMessage,
  required = false,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = typeInput === "password";
  const inputType = isPassword && showPassword ? "text" : typeInput;

  const handleChange = (e) => {
    setValue?.(e.target.value);
  };

  const inputClasses = `
    w-full pl-10 pr-10 py-2 rounded-md border
    ${errorMessage
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700"}
    text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
    focus:outline-none focus:ring-2 transition duration-150 ease-in-out
  `;

  return (
    <div className="w-full mb-4">
      {textLabel && (
        <label
          htmlFor={idInput}
          className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
        >
          {textLabel}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <Icon className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" />
        )}

        <input
          type={inputType}
          id={idInput}
          placeholder={placeholderInput}
          maxLength={maxLengthInput}
          minLength={minLengthInput}
          value={valueInput ?? ""}
          ref={inputRef}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${idInput}-error` : undefined}
          className={inputClasses}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {errorMessage && (
        <p
          id={`${idInput}-error`}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
