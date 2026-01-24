import { ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type SelectOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  containerClassName?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      containerClassName,
      children,
      value,
      defaultValue,
      onChange,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(
      defaultValue?.toString() ?? "",
    );
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

    const rootRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const optionRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

    const options = React.useMemo<SelectOption[]>(() => {
      return React.Children.toArray(children)
        .filter(
          (
            child,
          ): child is React.ReactElement<
            React.OptionHTMLAttributes<HTMLOptionElement>
          > => React.isValidElement(child) && child.type === "option",
        )
        .map((child) => {
          const optionValue =
            child.props.value?.toString() ??
            (typeof child.props.children === "string"
              ? child.props.children
              : "");
          return {
            value: optionValue,
            label: child.props.children,
            disabled: Boolean(child.props.disabled),
          };
        });
    }, [children]);

    const currentValue = value?.toString() ?? internalValue;
    const selectedIndex = options.findIndex(
      (option) => option.value === currentValue,
    );
    const selectedOption =
      options[selectedIndex] ??
      options.find((option) => option.disabled) ??
      options[0];

    const updateValue = (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }
      if (onChange) {
        onChange({
          target: { value: nextValue },
        } as React.ChangeEvent<HTMLSelectElement>);
      }
    };

    const closeMenu = React.useCallback(() => setOpen(false), []);

    const handleSelect = (option: SelectOption) => {
      if (option.disabled || disabled) return;
      updateValue(option.value);
      closeMenu();
      buttonRef.current?.focus();
    };

    const moveActive = (direction: 1 | -1) => {
      if (!options.length) return;
      let idx = activeIndex ?? selectedIndex;
      if (idx < 0) idx = 0;
      let next = idx;
      for (let i = 0; i < options.length; i += 1) {
        next = (next + direction + options.length) % options.length;
        if (!options[next]?.disabled) break;
      }
      setActiveIndex(next);
    };

    React.useEffect(() => {
      if (!open) return;
      const target =
        selectedIndex >= 0
          ? selectedIndex
          : options.findIndex((o) => !o.disabled);
      setActiveIndex(target >= 0 ? target : null);
    }, [open, selectedIndex, options]);

    React.useEffect(() => {
      if (activeIndex === null) return;
      optionRefs.current[activeIndex]?.focus();
    }, [activeIndex]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (!rootRef.current?.contains(event.target as Node)) {
          closeMenu();
        }
      };
      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [open, closeMenu]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!open) {
          setOpen(true);
        }
        moveActive(1);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!open) {
          setOpen(true);
        }
        moveActive(-1);
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        if (activeIndex !== null && options[activeIndex]) {
          handleSelect(options[activeIndex]);
        }
      }
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
      }
    };

    return (
      <div ref={rootRef} className={cn("relative", containerClassName)}>
        <select
          ref={ref}
          id={id}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          value={currentValue}
          onChange={onChange}
          disabled={disabled}
          {...props}
        >
          {children}
        </select>

        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "flex h-10 w-full items-center justify-between gap-2 rounded-2xl border-2 border-[#0f172a] bg-white px-4 py-2 text-left text-sm font-semibold text-[#0f172a] shadow-neo-sm focus:outline-none",
            disabled && "cursor-not-allowed opacity-60",
            className,
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : "Select"}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[#0f172a]/70 transition",
              open && "rotate-180",
            )}
          />
        </button>

        {open && !disabled ? (
          <div
            role="listbox"
            className="absolute left-0 right-0 z-50 mt-2 rounded-2xl border-2 border-[#0f172a] bg-white p-2 shadow-neo-sm"
          >
            <div className="max-h-56 overflow-y-auto">
              {options.map((option, index) => {
                const isSelected = option.value === currentValue;
                return (
                  <button
                    key={`${option.value}-${index}`}
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={option.disabled}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold uppercase text-[#0f172a]",
                      option.disabled && "cursor-not-allowed opacity-50",
                      isSelected ? "bg-[#a3e635]" : "hover:bg-[#ecfccb]",
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select };
