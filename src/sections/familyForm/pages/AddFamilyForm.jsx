import { useFormik } from "formik";
import Input from "src/components/inputs/Input";
import APIClient from "../../../utils/ApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SelectOptionInput from "../../../components/inputs/SelectOptionInput";
import { memo, useCallback, useMemo } from "react";
import SelectInputApi from "../../../components/inputs/SelectInputApi";
import "./family-form.css";
import { famlyFormSchema } from "../../../schemas/familyForm/familyFormSchema";
import Card from "../components/Card";
import { citiesQueryKey } from "./../../dashbordadmin/pages/addresses/Cities";
import { villageTownQueryKey } from "./../../dashbordadmin/pages/addresses/villages-towns";
import { councilsQueryKey } from "./../../dashbordadmin/pages/addresses/councils";
import { communesQueryKey } from "./../../dashbordadmin/pages/addresses/communes";
import IconButton from "./../../../components/buttons/IconButton";
import AddPersonPopUp from "../components/AddPersonPopUp";
import personSchema from "../../../schemas/familyForm/personSchema";
import { toast } from "react-hot-toast";
export const FormFamilyQueryKey = "formFamily";
const apiClient = new APIClient(`family-forms/`);
const personApiClient = new APIClient(`persons/`);
export const personQueryClient = "persons";
const AddFamilyForm = () => {
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationKey: [FormFamilyQueryKey],
    mutationFn: (data) => apiClient.addData({ data }),
    onSuccess: (data) => {
      personApiClient.addData({
        data: { ...personFormik.values, family_from: data.id },
      });
      queryClient.invalidateQueries({
        queryKey: [FormFamilyQueryKey, personQueryClient],
      });
    },
  });

  const formik = useFormik({
    initialValues: famlyFormSchema.values,
    validationSchema: famlyFormSchema.schema,
    onSubmit: async (values) => {
      const isAddPerson = await handleAddPerson();
      if (!isAddPerson) return toast.error("you have to add person first");
      const cleanedValues = transformValues(values);
      handleSubmit.mutate(cleanedValues);
    },
  });

  const transformValues = useCallback((values) => {
    const result = { ...values };
    Object.keys(result).forEach((key) => {
      const value = result[key];
      if (Array.isArray(value)) {
        result[key] = value.map((v) => (v && v.id ? v.id : v));
      } else if (value && typeof value === "object" && value.id) {
        result[key] = value.id;
      }
    });
    return result;
  }, []);

  const povertyLevelOptions = useMemo(
    () => [
      { text: "فقيرة جدا", value: "very poor" },
      { text: "فقيرة", value: "poor" },
      { text: "متوسطة", value: "Medium" },
      { text: "ميسورة", value: "Affordable" },
      { text: "بدون معيل", value: "without a breadwinner" },
    ],
    []
  );

  const residencyStatusOptions = useMemo(
    () => [
      { text: "مقيم", value: "resident" },
      { text: "نازح", value: "displaced" },
    ],
    []
  );
  const currentLocationInputs = useMemo(
    () => [
      {
        name: "city",
        label: "city",
        placeholder: "select city",
        endPoint: "cities/",
        queryKey: citiesQueryKey,
      },
      {
        name: "village_town",
        label: "town",
        placeholder: "select town",
        endPoint: "villages-towns/",
        queryKey: villageTownQueryKey,
      },
      {
        name: "council",
        label: "council",
        placeholder: "select council",
        endPoint: "councils/",
        queryKey: councilsQueryKey,
      },
      {
        name: "commune",
        label: "commune",
        placeholder: "select commune",
        endPoint: "communes/",
        queryKey: communesQueryKey,
      },
    ],
    []
  );

  const familyInformationInputs = useMemo(
    () => [
      {
        title: "Family members count",
        name: "members_count",
        placeholder: "members count",
        type: "number",
      },
      {
        title: "Phone Number",
        name: "phone_number",
        placeholder: "Phone Number",
      },
    ],
    []
  );

  const housingTypeInputs = useMemo(
    () => [
      {
        name: "housing_type",
        label: "housing type",
        placeholder: "select housing type",
        endPoint: "housing-types/",
      },
      {
        name: "ownership_status",
        label: "ownership status",
        placeholder: "select ownership status",
        endPoint: "housing-ownerships/",
      },
      {
        name: "housing_condition",
        label: "housing condition",
        placeholder: "select housing condition",
        endPoint: "housing-conditions/",
      },
    ],
    []
  );
  const previousLocationInputs = useMemo(
    () => [
      {
        name: "previous_city",
        label: "previous city",
        placeholder: "select city",
        endPoint: "cities/",
        queryKey: citiesQueryKey,
      },
      {
        name: "previous_town",
        label: "previous town",
        placeholder: "select town",
        endPoint: "villages-towns/",
        queryKey: villageTownQueryKey,
      },
      {
        name: "previous_council",
        label: "previous council",
        placeholder: "select council",
        endPoint: "councils/",
        queryKey: councilsQueryKey,
      },
      {
        name: "previous_commune",
        label: "previous commune",
        placeholder: "select commune",
        endPoint: "communes/",
        queryKey: communesQueryKey,
      },
    ],
    []
  );

  const propertiesInputs = useMemo(
    () => [
      {
        title: "real estate m2",
        name: "real_estate_m2",
        placeholder: "real estate m2",
      },
      {
        title: "rainfed land hectare",
        name: "rainfed_land_hectare",
        placeholder: "rainfed land hectare",
      },
      {
        title: "irrigated land hectare",
        name: "irrigated_land_hectare",
        placeholder: "irrigated land hectare",
      },
    ],
    []
  );

  const machineriesInputs = useMemo(
    () => [
      {
        name: "machinery",
        title: "machinery",
        placeholder: "machinery",
        type: "text",
      },
      {
        name: "buildings_count",
        title: "buildings count",
        placeholder: "buildings count",
      },
      {
        name: "trees_count",
        title: "trees count",
        placeholder: "trees count",
      },
      {
        name: "sheep_count",
        title: "sheep count",
        placeholder: "sheep count",
      },
      {
        name: "cows_count",
        title: "cows count",
        placeholder: "cows count",
      },
      {
        name: "other_assets",
        title: "other assets",
        placeholder: "other assets",
        type: "text",
      },
    ],
    []
  );

  const servicesInputs = useMemo(
    () => [
      {
        name: "electricity_sources",
        label: "electricity sources",
        placeholder: "electricity sources",
        endPoint: "electricity-sources/",
      },
      {
        name: "water_sources",
        label: "water sources",
        placeholder: "water sources",
        endPoint: "water-sources/",
      },
      {
        name: "sewage_types",
        label: "sewage types",
        placeholder: "sewage types",
        endPoint: "sewage-types/",
      },
    ],
    []
  );
  const multiFormSelect = useCallback(
    (fieldName, value) => {
      const fieldsArray = formik.values[fieldName] || [];

      const checkIsExist = fieldsArray.some((itm) => itm.id === value.id);

      if (!checkIsExist) {
        formik.setFieldValue(fieldName, [...fieldsArray, value]);
      }
    },
    [formik]
  );
  const ignoreSelect = useCallback(
    (fieldName, itm) => {
      const fieldsArray = formik.values[fieldName] || [];
      const filterdArray = fieldsArray.filter((itms) => itms.id !== itm.id);
      formik.setFieldValue(fieldName, filterdArray);
    },
    [formik]
  );

  const personFormik = useFormik({
    initialValues: personSchema.values,
    validationSchema: personSchema.schema,
    onSubmit: () => {},
  });
  const handleAddPerson = async (callBack) => {
    const errors = await personFormik.validateForm();

    if (Object.keys(errors).length > 0) {
      personFormik.setTouched(
        Object.keys(errors).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
      return false;
    }
    callBack && callBack();
    return true;
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-actions">
          <IconButton title="save" type="submit">
            <i className="fa-solid fa-floppy-disk" />
          </IconButton>
          <AddPersonPopUp
            formik={personFormik}
            handleAddPerson={handleAddPerson}
          />
        </div>
        <div className="form-container">
          <Card title="form information">
            <Input
              title="form number"
              errorText={
                formik.touched.form_number && formik.errors.form_number
              }
              onChange={formik.handleChange}
              value={formik.values.form_number}
              name="form_number"
              placeholder="form number"
            />
            <Input
              title="family code"
              errorText={
                formik.touched.family_code && formik.errors.family_code
              }
              onChange={formik.handleChange}
              value={formik.values.family_code}
              name="family_code"
              placeholder="family code"
            />
          </Card>

          <Card title="family information">
            {familyInformationInputs.map((input) => (
              <Input
                key={input.name}
                title={input.title}
                errorText={
                  formik.touched[input.name] && formik.errors[input.name]
                }
                onChange={formik.handleChange}
                value={formik.values[input.name]}
                name={input.name}
                placeholder={input.placeholder}
                type={input.type || "text"}
              />
            ))}
            <SelectInputApi
              label="ethnic components"
              placeholder="ethnic components"
              endPoint="ethnic-components/"
              queryKey="ethnic-components"
              onChange={(e) => formik.setFieldValue("ethnic_component", e)}
              value={formik.values.ethnic_component?.name}
              onIgnore={() => formik.setFieldValue("ethnic_component", null)}
              optionLabel={(e) => e.name}
              errorText={
                formik.touched.ethnic_component &&
                formik.errors.ethnic_component
              }
            />
            <SelectInputApi
              label="religion"
              placeholder="select religion"
              endPoint="religions/"
              queryKey="religion"
              onChange={(e) => formik.setFieldValue("religion", e)}
              value={formik.values.religion?.name}
              onIgnore={() => formik.setFieldValue("religion", null)}
              optionLabel={(e) => e.name}
              errorText={formik.touched.religion && formik.errors.religion}
            />
            <SelectOptionInput
              label="residence status"
              placeholder="select residence status"
              value={formik.values.residence_status}
              options={residencyStatusOptions}
              onSelectOption={(option) =>
                formik.setFieldValue("residence_status", option.value)
              }
              onIgnore={() => formik.setFieldValue("residence_status", null)}
              errorText={
                formik.touched.residence_status &&
                formik.errors.residence_status
              }
            />
          </Card>

          <Card title="current location">
            {currentLocationInputs.map((input) => (
              <SelectInputApi
                key={input.name}
                label={input.label}
                placeholder={input.placeholder}
                endPoint={input.endPoint}
                queryKey={input.queryKey}
                onChange={(e) => formik.setFieldValue(input.name, e)}
                value={formik.values[input.name]?.name}
                onIgnore={() => formik.setFieldValue(input.name, null)}
                optionLabel={(e) => e.name}
                errorText={
                  formik.touched[input.name] && formik.errors[input.name]
                }
              />
            ))}
          </Card>

          <Card title="previous Location">
            {previousLocationInputs.map((input) => (
              <SelectInputApi
                key={input.name}
                label={input.label}
                placeholder={input.placeholder}
                endPoint={input.endPoint}
                queryKey={input.queryKey}
                onChange={(e) => formik.setFieldValue([input.name], e)}
                value={formik.values[input.name]?.name}
                onIgnore={() => formik.setFieldValue([input.name], null)}
                optionLabel={(e) => e.name}
                errorText={
                  formik.touched[input.name] && formik.errors[input.name]
                }
              />
            ))}
          </Card>

          <Card title="housing situation">
            {housingTypeInputs.map((input) => (
              <SelectInputApi
                key={input.name}
                label={input.label}
                placeholder={input.placeholder}
                endPoint={input.endPoint}
                queryKey={input.endPoint}
                onChange={(e) => formik.setFieldValue(input.name, e)}
                value={formik.values[input.name]?.name}
                errorText={
                  formik.touched[input.name] && formik.errors[input.name]
                }
                onIgnore={() => formik.setFieldValue(input.name, null)}
                optionLabel={(e) => e.name}
              />
            ))}
          </Card>

          <Card title="Properties">
            {propertiesInputs.map((inp) => (
              <Input
                key={inp.name}
                title={inp.title}
                errorText={formik.touched[inp.name] && formik.errors[inp.name]}
                onChange={formik.handleChange}
                value={formik.values[inp.name]}
                name={inp.name}
                placeholder={inp.placeholder}
                type="number"
              />
            ))}
          </Card>

          <Card title="Economic situation">
            <Input
              title="annual revenue"
              errorText={
                formik.touched.annual_revenue && formik.errors.annual_revenue
              }
              onChange={formik.handleChange}
              value={formik.values.annual_revenue}
              name="annual_revenue"
              placeholder="annual income"
              type="number"
            />
            <SelectOptionInput
              label="economic status"
              placeholder="select economic status"
              value={formik.values.economic_status}
              options={povertyLevelOptions}
              onSelectOption={(option) =>
                formik.setFieldValue("economic_status", option.value)
              }
              errorText={
                formik.touched.economic_status && formik.errors.economic_status
              }
            />
            <SelectInputApi
              label="income sources"
              placeholder="select income sources"
              value={formik.values.income_sources}
              errorText={
                formik.touched.income_sources && formik.errors.income_sources
              }
              endPoint="income-sources/"
              queryKey="income-sources"
              isArray
              onChange={(option) => multiFormSelect("income_sources", option)}
              onIgnore={(e) => ignoreSelect("income_sources", e)}
              optionLabel={(e) => e?.name}
            />
          </Card>

          <Card title="Machinery and property">
            {machineriesInputs.map((inp) => (
              <Input
                key={inp.name}
                title={inp.title}
                errorText={formik.touched[inp.name] && formik.errors[inp.name]}
                onChange={formik.handleChange}
                value={formik.values[inp.name]}
                name={inp.name}
                placeholder={inp.placeholder}
                type={inp.type || "number"}
              />
            ))}
          </Card>

          <Card title="services">
            {servicesInputs.map((inp) => (
              <SelectInputApi
                key={inp.name}
                label={inp.label}
                placeholder={inp.placeholder}
                value={formik.values[inp.name]}
                errorText={formik.touched[inp.name] && formik.errors[inp.name]}
                endPoint={inp.endPoint}
                queryKey={inp.endPoint}
                isArray
                onChange={(option) => multiFormSelect(inp.name, option)}
                onIgnore={(e) => ignoreSelect(inp.name, e)}
                optionLabel={(e) => e?.name}
              />
            ))}
          </Card>
        </div>
      </form>
    </>
  );
};

export default memo(AddFamilyForm);
