import { memo, useMemo } from "react";
import "./inputs.css";

/**
 * @typedef utils
 * @property {array} options
 * @property {string} errorText
 * @property {string} label
 * @property {string} name
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} onChange
 * @property {any} value
 * @property {boolean} multiSelect
 * @property {string} className
 */
/**
 *
 * @param {utils} props
 */
const CheckboxInput = ({
  label,
  options,
  errorText,
  multiSelect,
  className,
  name,
  value,
  onChange,
  ...props
}) => {
  const classNameMemo = useMemo(
    () =>
      `${multiSelect ? "checkbox" : "radio"} checkbox-input ${className || ""}`,
    [multiSelect, className]
  );

  const handleKeyDown = (e, optValue, checked) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const event = {
        target: {
          name,
          value: optValue,
          type: multiSelect ? "checkbox" : "radio",
          checked: multiSelect ? !checked : true,
        },
      };
      onChange(event);
    }
  };

  return (
    <div className={classNameMemo}>
      <label className="title">{label}</label>
      <article>
        {options?.map((opt) => {
          const checked = multiSelect
            ? Array.isArray(value) && value.includes(opt.value)
            : value === opt.value;

          return (
            <label
              key={opt.value}
              role={multiSelect ? "checkbox" : "radio"}
              aria-checked={checked}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, opt.value, checked)}
            >
              <input
                type={multiSelect ? "checkbox" : "radio"}
                name={name}
                value={opt.value}
                checked={checked}
                onChange={onChange}
                {...props}
              />
              {opt.text}
            </label>
          );
        })}
      </article>

      {errorText && <p className="color-red">{errorText}</p>}
    </div>
  );
};

export default memo(CheckboxInput);
