import { useMemo } from "react";
import IconButton from "src/components/buttons/IconButton";
import PopUp from "src/components/popup/PopUp";
import Input from "src/components/inputs/Input";
import SelectOptionInput from "src/components/inputs/SelectOptionInput";
import Button from "src/components/buttons/Button";
import { useTranslation } from "react-i18next";

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
      {
        name: "first_name",
        title: t("first_name"),
        placeholder: t("enter_first_name"),
      },
      {
        name: "father_name",
        title: t("father_name"),
        placeholder: t("enter_father_name"),
      },
      {
        name: "last_name",
        title: t("last_name"),
        placeholder: t("enter_last_name"),
      },
      {
        name: "mother_name",
        title: t("mother_name"),
        placeholder: t("enter_mother_name"),
      },
      {
        name: "birth_date",
        title: t("birth_date"),
        placeholder: t("select_birth_date"),
        type: "date",
      },
      {
        name: "birth_place",
        title: t("birth_place"),
        placeholder: t("enter_birth_place"),
      },
      {
        name: "education_level",
        title: t("education_level"),
        placeholder: t("enter_education_level"),
      },
      {
        name: "current_job",
        title: t("current_job"),
        placeholder: t("enter_current_job"),
      },
      {
        name: "chronic_diseases",
        title: t("chronic_diseases"),
        placeholder: t("enter_diseases"),
      },
      {
        name: "special_case",
        title: t("special_case"),
        placeholder: t("enter_special_case"),
      },
      {
        name: "special_case_place",
        title: t("case_place"),
        placeholder: t("enter_case_place"),
      },
      {
        name: "disability",
        title: t("disability"),
        placeholder: t("enter_disability"),
      },
      {
        name: "migration_place",
        title: t("migration_place"),
        placeholder: t("enter_migration_place"),
      },
    ],
    [t]
  );

  const selectInputs = useMemo(
    () => [
      {
        name: "is_male",
        label: t("gender"),
        placeholder: formik?.values?.is_male ? t("male") : t("female"),
        options: [
          { text: t("male"), value: true },
          { text: t("female"), value: false },
        ],
      },
      {
        name: "is_head_of_family",
        label: t("is_head_of_family"),
        placeholder: formik?.values?.is_head_of_family ? t("yes") : t("no"),
        options: [
          { text: t("yes"), value: true },
          { text: t("no"), value: false },
        ],
      },
      {
        name: "marital_status",
        label: t("marital_status"),
        placeholder: t("select_status"),
        options: [
          { value: "Single", text: t("single") },
          { value: "Married", text: t("married") },
          { value: "Divorced", text: t("divorced") },
          { value: "Widowed", text: t("widowed") },
        ],
        value: formik?.values?.marital_status,
      },
      {
        name: "is_migrant",
        label: t("is_migrant"),
        placeholder: formik?.values?.is_migrant ? t("yes") : t("no"),
        options: [
          { text: t("yes"), value: true },
          { text: t("no"), value: false },
        ],
      },
    ],
    [formik?.values, t]
  );

  return (
    <>
      {!hideIcon && (
        <IconButton title={t("add_person")} onClick={() => setIsOpen(true)}>
          <i className="fa-solid fa-user-plus" />
        </IconButton>
      )}
      <PopUp
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        className="add-person-popup"
      >
        <div className="form">
          <h2>{isUpdate ? t("update_person") : t("add_person")}</h2>
          <div>
            {inputs.map((inp) => (
              <Input
                key={inp.name}
                title={inp.title}
                errorText={
                  formik?.touched[inp.name] && formik?.errors[inp.name]
                }
                name={inp.name}
                placeholder={inp.placeholder}
                type={inp.type || "text"}
                onChange={formik?.handleChange}
                value={formik?.values[inp.name]}
              />
            ))}
            {selectInputs.map((inp) => (
              <SelectOptionInput
                key={inp.name}
                label={inp.label}
                placeholder={inp.placeholder}
                value={inp.value}
                options={inp.options}
                onSelectOption={(option) =>
                  formik?.setFieldValue(inp.name, option.value)
                }
                onIgnore={() => formik?.setFieldValue(inp.name, null)}
                errorText={
                  formik?.touched[inp.name] && formik?.errors[inp.name]
                }
              />
            ))}
          </div>

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