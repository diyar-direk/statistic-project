import InputsContainer from "src/components/tableFilters/InputsContainer";
import ConfrimAndRestBtns from "src/components/tableFilters/ConfrimAndRestBtns";
import Input from "src/components/inputs/Input";
import SelectInputApi from "src/components/inputs/SelectInputApi";
import SelectOptionInput from "src/components/inputs/SelectOptionInput";
import { useFormik } from "formik";
import { useMemo } from "react";
import { citiesQueryKey } from "../../addresses/Cities";
import { villageTownQueryKey } from "../../addresses/villages-towns";
import { councilsQueryKey } from "../../addresses/councils";
import { communesQueryKey } from "../../addresses/communes";
const FamilyTableFilters = ({ filters, setFilters }) => {
  const formik = useFormik({
    initialValues: filters,
  });
  const povertyLevelOptions = useMemo(
    () => [
      { text: "all economic status", value: "" },
      { text: "فقيرة جدا", value: "very poor" },
      { text: "فقيرة", value: "poor" },
      { text: "متوسطة", value: "Medium" },
      { text: "ميسورة", value: "Affordable" },
      { text: "بدون معيل", value: "without a breadwinner" },
    ],
    []
  );
  const addressFilters = useMemo(
    () => [
      {
        name: "city",
        label: "city",
        endPoint: "cities/",
        queryKey: citiesQueryKey,
        ifEmpty: "all cities",
      },
      {
        name: "village_town",
        label: "town",
        endPoint: "villages-towns/",
        queryKey: villageTownQueryKey,
        ifEmpty: "all towns",
      },
      {
        name: "council",
        label: "council",
        endPoint: "councils/",
        queryKey: councilsQueryKey,
        ifEmpty: "all councils",
      },
      {
        name: "commune",
        label: "commune",
        endPoint: "communes/",
        queryKey: communesQueryKey,
        ifEmpty: "all communes",
      },
    ],
    []
  );

  return (
    <>
      <InputsContainer>
        {addressFilters.map((input) => (
          <SelectInputApi
            key={input.name}
            label={input.label}
            placeholder={formik.values[input.name]?.name || input.ifEmpty}
            endPoint={input.endPoint}
            queryKey={input.queryKey}
            onChange={(e) => formik.setFieldValue(input.name, e)}
            optionLabel={(e) => e.name}
            addOption={
              <h3 onClick={() => formik.setFieldValue(input.name, null)}>
                {input.ifEmpty}
              </h3>
            }
          />
        ))}
      </InputsContainer>
      <InputsContainer>
        <SelectOptionInput
          label="economic status"
          options={povertyLevelOptions}
          placeholder={formik.values.economic_status || "all economic status"}
          onSelectOption={(e) =>
            formik.setFieldValue("economic_status", e.value)
          }
        />
        <SelectInputApi
          placeholder={
            formik.values.ethnic_component?.name || "all ethnic components"
          }
          queryKey="ethnic-components"
          optionLabel={(e) => e.name}
          endPoint="ethnic-components/"
          label="ethnic components"
          addOption={
            <h3 onClick={() => formik.setFieldValue("ethnic_component", null)}>
              all ethnic components
            </h3>
          }
          onChange={(e) => formik.setFieldValue("ethnic_component", e)}
        />
      </InputsContainer>
      <InputsContainer>
        <Input
          title="members count"
          type="number"
          placeholder="0000"
          value={formik.values.members_count}
          name="members_count"
          onChange={formik.handleChange}
        />
      </InputsContainer>
      <InputsContainer>
        <SelectInputApi
          placeholder={formik.values.created_by?.username || "any user"}
          addOption={
            <h3 onClick={() => formik.setFieldValue("created_by", null)}>
              any user
            </h3>
          }
          onChange={(e) => formik.setFieldValue("created_by", e)}
          queryKey="users"
          optionLabel={(e) => e.username}
          endPoint="auth/accounts/"
          label="created by"
        />
        <SelectInputApi
          placeholder={formik.values.updated_by?.username || "any user"}
          addOption={
            <h3 onClick={() => formik.setFieldValue("updated_by", null)}>
              any user
            </h3>
          }
          onChange={(e) => formik.setFieldValue("updated_by", e)}
          queryKey="users"
          optionLabel={(e) => e.username}
          endPoint="auth/accounts/"
          label="created by"
        />
      </InputsContainer>
      <ConfrimAndRestBtns
        values={formik.values}
        resetForm={formik.resetForm}
        setFilters={setFilters}
      />
    </>
  );
};

export default FamilyTableFilters;
