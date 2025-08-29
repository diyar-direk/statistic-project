import { memo } from "react";
import Button from "../buttons/Button";
import "./popups.css";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="overlay" role="dialog" {...props} onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h1>{heading || t("confirm_message")}</h1>
        <div>
          <Button {...confirmButtonProps} onClick={onConfirm} type="button">
            {confirmText || t("yes")}
          </Button>
          <Button
            {...closeButtonProps}
            onClick={onClose}
            btnType="delete"
            type="button"
          >
            {cancelText || t("no")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(ConfirmPopUp);
