import { useRef, useState } from "react";
import {
  PiEyeBold,
  PiEyeSlashBold,
} from "react-icons/pi";
import { RedWarningCircle } from "../assets/icons/RedWarning";

export const PasswordInput = ({
  placeholder = "Password",
  value = "",
  onChange,
  disabled = false,
  error = false,
  className = "",
}) => {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  return (
    <div
      className={`flex w-full max-w-md border rounded-md overflow-hidden transition-colors ${
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
        className="flex-1 py-2 px-3 text-sm sm:text-base border-none focus:outline-none"
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        spellCheck={false}
      />
      <div
        className={`p-2 grid place-items-center ${!error && "cursor-pointer"}`}
      >
        {error ? (
            <RedWarningCircle />
            ) : (
                <div
                    className="rounded-full p-1 transition-colors hover:bg-gray-200"
                    onClick={() => setShow(prev => !prev)}
                >
                    {show ? (
                        <PiEyeBold className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                        <PiEyeSlashBold className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                </div>
            )}
      </div>
    </div>
  );
};

