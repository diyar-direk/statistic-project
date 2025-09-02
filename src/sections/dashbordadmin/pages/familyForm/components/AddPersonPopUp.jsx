import { useMemo } from "react";
import IconButton from "src/components/buttons/IconButton";
import PopUp from "src/components/popup/PopUp";
import Input from "src/components/inputs/Input";
import Button from "src/components/buttons/Button";
import { useTranslation } from "react-i18next";

// استدعاء ملف CSS
import "./AddPersonPopUp.css";

const AddPersonPopUp = ({
  formik,
  onSave,
  setIsOpen,
  isOpen,
  isUpdate,
  setIsUpdate,
  hideIcon,
}) => {
  const { t } = useTranslation();

  const inputs = useMemo(
    () => [
      { name: "first_name", title: t("first_name"), placeholder: t("enter_first_name") },
      { name: "father_name", title: t("father_name"), placeholder: t("enter_father_name") },
      { name: "last_name", title: t("last_name"), placeholder: t("enter_last_name") },
      { name: "mother_name", title: t("mother_name"), placeholder: t("enter_mother_name") },
      { name: "birth_date", title: t("birth_date"), placeholder: t("select_birth_date"), },
      { name: "birth_place", title: t("birth_place"), placeholder: t("enter_birth_place") },
      { name: "education_level", title: t("education_level"), placeholder: t("enter_education_level") },
      { name: "current_job", title: t("current_job"), placeholder: t("enter_current_job") },
      { name: "chronic_diseases", title: t("chronic_diseases"), placeholder: t("enter_diseases") },
      { name: "special_case", title: t("special_case"), placeholder: t("enter_special_case") },
      { name: "special_case_place", title: t("case_place"), placeholder: t("enter_case_place") },
      { name: "disability", title: t("disability"), placeholder: t("enter_disability") },
      { name: "migration_place", title: t("migration_place"), placeholder: t("enter_migration_place") },
    ],
    [t]
  );

  const handleGenderChange = (value) => {
    formik.setFieldValue("is_male", value);
  };

  const handleMaritalStatusChange = (value) => {
    formik.setFieldValue("marital_status", value);
  };

  return (
    <>
      {!hideIcon && (
        <IconButton title={t("add_person")} onClick={() => setIsOpen(true)}>
          <i className="fa-solid fa-user-plus" />
        </IconButton>
      )}
      <PopUp onClose={() => setIsOpen(false)} isOpen={isOpen} className="add-person-popup">
        <div className="form">
          <h2>{isUpdate ? t("update_person") : t("add_person")}</h2>

          {/* Text Inputs */}
          <div>
            {inputs.map((inp) => (
              <Input
                key={inp.name}
                title={inp.title}
                errorText={formik?.touched[inp.name] && formik?.errors[inp.name]}
                name={inp.name}
                placeholder={inp.placeholder}
                type={inp.type || "text"}
                onChange={formik?.handleChange}
                value={formik?.values[inp.name]}
                className="focus-highlight"
              />
            ))}

            {/* Gender */}
            <div className="checkbox-group">
              <h3>{t("gender")}</h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_male"
                  checked={formik?.values?.is_male === true}
                  onChange={() => handleGenderChange(true)}
                  className="styled-checkbox"
                />
                {t("male")}
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_male"
                  checked={formik?.values?.is_male === false}
                  onChange={() => handleGenderChange(false)}
                  className="styled-checkbox"
                />
                {t("female")}
              </label>
              {formik?.touched.is_male && formik?.errors.is_male && (
                <div className="error-text">{formik.errors.is_male}</div>
              )}
            </div>

            {/* Marital Status */}
            <div className="checkbox-group">
              <h3>{t("marital_status")}</h3>
              {[
                { value: "Single", text: t("single") },
                { value: "Married", text: t("married") },
                { value: "Divorced", text: t("divorced") },
                { value: "Widowed", text: t("widowed") },
              ].map((option) => (
                <label key={option.value} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="marital_status"
                    checked={formik?.values?.marital_status === option.value}
                    onChange={() => handleMaritalStatusChange(option.value)}
                    className="styled-checkbox"
                  />
                  {option.text}
                </label>
              ))}
              {formik?.touched.marital_status && formik?.errors.marital_status && (
                <div className="error-text">{formik.errors.marital_status}</div>
              )}
            </div>

            {/* Head of family */}
            <div className="checkbox-group">
              <h3>{t("is_head_of_family")}</h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_head_of_family"
                  checked={formik?.values?.is_head_of_family}
                  onChange={formik?.handleChange}
                  className="styled-checkbox"
                />
                {t("is_head_of_family")}
              </label>
              {formik?.touched.is_head_of_family && formik?.errors.is_head_of_family && (
                <div className="error-text">{formik.errors.is_head_of_family}</div>
              )}
            </div>

            {/* Migrant */}
            <div className="checkbox-group">
              <h3>{t("is_migrant")}</h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_migrant"
                  checked={formik?.values?.is_migrant}
                  onChange={formik?.handleChange}
                  className="styled-checkbox"
                />
                {t("is_migrant")}
              </label>
              {formik?.touched.is_migrant && formik?.errors.is_migrant && (
                <div className="error-text">{formik.errors.is_migrant}</div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="btns">
            <Button btnStyleType="outlined" onClick={onSave} type="button">
              {t("save_person")}
            </Button>
            {isUpdate && (
              <Button
                btnType="cancel"
                btnStyleType="outlined"
                onClick={() => {
                  setIsOpen(false);
                  setIsUpdate(false);
                }}
                type="button"
              >
                {t("cancel_update")}
              </Button>
            )}
          </div>
        </div>
      </PopUp>
    </>
  );
};

export default AddPersonPopUp;
