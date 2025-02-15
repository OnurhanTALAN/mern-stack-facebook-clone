import { useRef, useState } from "react";
import { RedWarningCircle } from "../assets/icons/RedWarning";

export const TextInput = ({
  placeholder = "",
  value = "",
  onChange,
  disabled = false,
  error = false,
  className = "",
}) => {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`flex w-full max-w-md overflow-hidden border rounded-md transition-colors ${
        error
          ? "border-red-500"
          : focused
          ? "border-blue-500"
          : "border-gray-300"
      } ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        className="w-full py-2 px-3 text-sm sm:text-base border-none focus:outline-none"
        type="text"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        spellCheck={false}
      />
      <div
        className={`flex items-center justify-center pr-2 ${
          error ? "opacity-100" : "opacity-0"
        }`}
      >
        <RedWarningCircle/>
      </div>
    </div>
  );
};
