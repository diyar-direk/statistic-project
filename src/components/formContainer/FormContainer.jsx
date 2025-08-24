import Button from "../buttons/Button";
import "./form-container.css";
/**
 *
 * @typedef formProps
 * @property {string} header
 * @property {boolean} isUpdate
 * @property {()=> void} oncancel
 * @property {React.ButtonHTMLAttributes<HTMLButtonElement>} buttonProps
 * @param {formProps & React.FormHTMLAttributes<HTMLFormElement>} props
 */

const FormContainer = ({
  header,
  buttonProps,
  children,
  isUpdate,
  oncancel,
  ...props
}) => {
  return (
    <form {...props}>
      {header && <h2>{header}</h2>}
      {children}
      <div className="form-actions">
        <Button
          btnType="main"
          btnStyleType="contained"
          type="submit"
          {...buttonProps}
        >
          save
        </Button>
        {isUpdate && (
          <Button
            type="button"
            btnType="cancel"
            btnStyleType="outlined"
            onClick={oncancel}
          >
            cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default FormContainer;
