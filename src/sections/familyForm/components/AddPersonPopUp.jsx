import { useMemo, useState } from "react";
import IconButton from "../../../components/buttons/IconButton";
import PopUp from "../../../components/popup/PopUp";
import Input from "src/components/inputs/Input";
import SelectOptionInput from "../../../components/inputs/SelectOptionInput";
import Button from "../../../components/buttons/Button";
const AddPersonPopUp = ({ formik, handleAddPerson }) => {
  const inputs = useMemo(
    () => [
      {
        name: "first_name",
        title: "First Name",
        placeholder: "Enter first name",
      },
      {
        name: "father_name",
        title: "Father Name",
        placeholder: "Enter father name",
      },
      { name: "last_name", title: "Last Name", placeholder: "Enter last name" },
      {
        name: "mother_name",
        title: "Mother Name",
        placeholder: "Enter mother name",
      },
      {
        name: "birth_date",
        title: "Birth Date",
        placeholder: "Select birth date",
        type: "date",
      },
      {
        name: "birth_place",
        title: "Birth Place",
        placeholder: "Enter birth place",
      },
      {
        name: "education_level",
        title: "Education Level",
        placeholder: "Enter education level",
      },
      {
        name: "current_job",
        title: "Current Job",
        placeholder: "Enter current job",
      },
      {
        name: "chronic_diseases",
        title: "Chronic Diseases",
        placeholder: "Enter diseases",
      },
      {
        name: "special_case",
        title: "Special Case",
        placeholder: "Enter special case",
      },
      {
        name: "special_case_place",
        title: "Case Place",
        placeholder: "Enter case place",
      },
      {
        name: "disability",
        title: "Disability",
        placeholder: "Enter disability",
      },
      {
        name: "migration_place",
        title: "Migration Place",
        placeholder: "Enter migration place",
      },
    ],
    []
  );

  const selectInputs = useMemo(
    () => [
      {
        name: "is_male",
        label: "Gender",
        placeholder: formik.values.is_male ? "Male" : "Female",
        options: [
          { text: "Male", value: true },
          { text: "Female", value: false },
        ],
      },
      {
        name: "marital_status",
        label: "Marital Status",
        placeholder: "Select status",
        options: [
          { value: "Single", text: "single" },
          { value: "Married", text: "married" },
          { value: "Divorced", text: "divorced" },
          { value: "Widowed", text: "widowed" },
        ],
        value: formik.values.marital_status,
      },
      {
        name: "is_migrant",
        label: "Migrant",
        placeholder: formik.values.is_migrant ? "Yes" : "No",
        options: [
          { text: "Yes", value: true },
          { text: "No", value: false },
        ],
      },
    ],
    [formik.values]
  );

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton title="add person" onClick={() => setIsOpen(true)}>
        <i className="fa-solid fa-user-plus" />
      </IconButton>
      <PopUp
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        className="add-person-popup"
      >
        <div className="form">
          <h2>add person</h2>
          <div>
            {inputs.map((inp) => (
              <Input
                key={inp.name}
                title={inp.title}
                errorText={formik.touched[inp.name] && formik.errors[inp.name]}
                name={inp.name}
                placeholder={inp.placeholder}
                type={inp.type || "text"}
                onChange={formik.handleChange}
                value={formik.values[inp.name]}
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
                  formik.setFieldValue(inp.name, option.value)
                }
                onIgnore={() => formik.setFieldValue(inp.name, null)}
                errorText={formik.touched[inp.name] && formik.errors[inp.name]}
              />
            ))}
          </div>

          <Button
            btnStyleType="outlined"
            onClick={() => handleAddPerson(() => setIsOpen(false))}
            type="button"
          >
            Save Person
          </Button>
        </div>
      </PopUp>
    </>
  );
};

export default AddPersonPopUp;
