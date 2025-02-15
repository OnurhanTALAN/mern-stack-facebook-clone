import { useRef, useState } from "react";
import { PiCaretDownBold } from "react-icons/pi";

export const SelectInput = ({
  placeholder = "",
  value = "",
  onChange,
  disabled = false,
  error = false,
  className = "",
  options = [],
}) => {
  const selectRef = useRef(null);
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`relative flex w-full max-w-md overflow-hidden border rounded-md transition-colors ${
        error
          ? "border-red-500"
          : focused
          ? "border-blue-500"
          : "border-gray-300"
      } ${className}`}
    >
      <select
        ref={selectRef}
        className="w-full py-2 px-3 text-sm sm:text-base border-none focus:outline-none bg-transparent appearance-none pr-10" // Add padding for arrow space
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <PiCaretDownBold className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
};
