import { memo, useMemo } from "react";

/**
 * @typedef {Object} utlis
 * @property {string} title
 * @property  {"input"|"textarea"} elementType - input style most be input or textarea
 * @property {React.HTMLAttributes<HTMLLabelElement>} labelProps
 * @property {string} errorText
 * @property {React.HTMLAttributes<HTMLParagraphElement>} helperTextProps
 * @property {React.HTMLAttributes<HTMLDivElement>} containerProps
 */

/**
 * @param {React.InputHTMLAttributes<HTMLInputElement> & utlis} props
 */
const Input = ({
  title,
  labelProps,
  errorText,
  helperTextProps,
  containerProps,
  elementType,
  ...props
}) => {
  const divContainerClassName = useMemo(() => {
    return `${errorText ? "faild-error" : ""} ${
      containerProps?.className || ""
    }`;
  }, [errorText, containerProps]);

  return (
    <div {...containerProps} className={divContainerClassName + "inp"}>
      {title && (
        <label htmlFor={props.name} {...labelProps}>
          {title}
        </label>
      )}
      {elementType === "textarea" ? (
        <textarea id={props.name} type="text" {...props}></textarea>
      ) : (
        <input id={props.name} type="text" {...props} />
      )}

      {errorText && (
        <p className="color-red" {...helperTextProps}>
          {errorText}
        </p>
      )}
    </div>
  );
};

export default memo(Input);
