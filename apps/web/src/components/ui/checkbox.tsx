import React, { forwardRef, useState } from "react";
import { Check } from "lucide-react";

interface CustomCheckboxProps {
  id?: string;
  name?: string;
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const CustomCheckbox = forwardRef<HTMLDivElement, CustomCheckboxProps>(
  ({ id, name, className = "", checked = false, disabled = false, label, onCheckedChange }, ref) => {
    const [isChecked, setIsChecked] = useState(checked);

    const handleChange = () => {
      if (disabled) return;
      
      const newCheckedState = !isChecked;
      setIsChecked(newCheckedState);
      
      if (onCheckedChange) {
        onCheckedChange(newCheckedState);
      }
    };

    return (
      <div className="flex items-center space-x-2">
        <div
          ref={ref}
          id={id}
          data-name={name}
          role="checkbox"
          aria-checked={isChecked}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          className={`
            relative flex h-5 w-5 items-center justify-center rounded-md
            ${disabled 
              ? "cursor-not-allowed opacity-50 bg-neutral-100" 
              : "cursor-pointer hover:bg-green-50 active:bg-green-100"}
            ${isChecked 
              ? "bg-blue-700 border border-blue-800" 
              : "bg-white border border-blue-700"}
            ${className}
          `}
          onClick={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleChange();
            }
          }}
        >
          {isChecked && (
            <Check className="h-3.5 w-3.5 text-white" />
          )}
        </div>
        {label && (
          <label 
            htmlFor={id} 
            className={`text-sm ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            onClick={handleChange}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

CustomCheckbox.displayName = "CustomCheckbox";

export { CustomCheckbox };