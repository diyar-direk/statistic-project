import { memo } from "react";
import Button from "../buttons/Button";
import "./popups.css";

/**
 * @typedef {Object} divProps
 * @property {boolean} isOpen
 * @property {string} [heading]
 * @property {string} [confirmText]
 * @property {string} [cancelText]
 * @property {() => void} [onConfirm]
 * @property {() => void} [onClose]
 * @property {React.ButtonHTMLAttributes<HTMLButtonElement>} [confirmButtonProps]
 * @property {React.ButtonHTMLAttributes<HTMLButtonElement>} [closeButtonProps]
 */

/**
 * @param {divProps} props
 */
const ConfirmPopUp = ({
  isOpen = false,
  heading = "",
  confirmText = "",
  cancelText = "",
  onConfirm = () => {},
  onClose = () => {},
  confirmButtonProps = {},
  closeButtonProps = {},
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <div className="overlay" role="dialog" {...props} onClick={onClose}>
      <div className="popup">
        <h1>{heading || "Are you sure you want to do this?"}</h1>
        <div>
          <Button {...confirmButtonProps} onClick={onConfirm} type="button">
            {confirmText || "Yes"}
          </Button>
          <Button
            {...closeButtonProps}
            onClick={onClose}
            btnType="delete"
            type="button"
          >
            {cancelText || "No"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(ConfirmPopUp);
