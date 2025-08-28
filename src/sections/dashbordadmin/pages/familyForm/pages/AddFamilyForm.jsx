import { useFormik } from "formik";
import Input from "src/components/inputs/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo, useCallback, useMemo, useState } from "react";
import "./family-form.css";
import Card from "../components/Card";
import { toast } from "react-hot-toast";
import APIClient from "src/utils/ApiClient";
import { famlyFormSchema } from "src/schemas/familyForm/familyFormSchema";
import { citiesQueryKey } from "../../addresses/Cities";
import { villageTownQueryKey } from "../../addresses/villages-towns";
import { councilsQueryKey } from "../../addresses/councils";
import { communesQueryKey } from "../../addresses/communes";
import personSchema from "src/schemas/familyForm/personSchema";
import IconButton from "../../../../../components/buttons/IconButton";
import SelectInputApi from "../../../../../components/inputs/SelectInputApi";
import SelectOptionInput from "../../../../../components/inputs/SelectOptionInput";
import AddPersonPopUp from "../components/AddPersonPopUp";
import { handleAddPerson } from "../components/handlePersonFormik.js";
import { useTranslation } from "react-i18next";

export const FormFamilyQueryKey = "formFamily";
const apiClient = new APIClient(`family-forms/`);
const personApiClient = new APIClient(`persons/`);
export const personQueryClient = "persons";

const AddFamilyForm = () => {
  const { t } = useTranslation();
  const [isAddPersonPopupOpen, setIsAddPersonPopupOpen] = useState(false);
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationKey: [FormFamilyQueryKey],
    mutationFn: (data) => apiClient.addData({ data }),
    onSuccess: (response) => {
      personApiClient.addData({
        data: { ...personFormik.values, family_from: response.id },
      });
      queryClient.invalidateQueries({
        queryKey: [FormFamilyQueryKey, personQueryClient],
      });
      setIsAddPersonPopupOpen(false);
    },
  });

  const formik = useFormik({
    initialValues: famlyFormSchema.values(),
    validationSchema: famlyFormSchema.schema,
    onSubmit: async (values) => {
      const isAddPerson = await handleAddPerson(personFormik);
      if (!isAddPerson) return toast.error(t("add_person_first"));
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
      { text: t("very_poor"), value: "very poor" },
      { text: t("poor"), value: "poor" },
      { text: t("medium"), value: "Medium" },
      { text: t("affordable"), value: "Affordable" },
      { text: t("without_breadwinner"), value: "without a breadwinner" },
    ],
    [t]
  );

  const residencyStatusOptions = useMemo(
    () => [
      { text: t("resident"), value: "resident" },
      { text: t("displaced"), value: "displaced" },
    ],
    [t]
  );

  const currentLocationInputs = useMemo(
    () => [
      {
        name: "city",
        label: t("city"),
        placeholder: t("select_city"),
        endPoint: "cities/",
        queryKey: citiesQueryKey,
      },
      {
        name: "village_town",
        label: t("town"),
        placeholder: t("select_town"),
        endPoint: "villages-towns/",
        queryKey: villageTownQueryKey,
      },
      {
        name: "council",
        label: t("council"),
        placeholder: t("select_council"),
        endPoint: "councils/",
        queryKey: councilsQueryKey,
      },
      {
        name: "commune",
        label: t("commune"),
        placeholder: t("select_commune"),
        endPoint: "communes/",
        queryKey: communesQueryKey,
      },
    ],
    [t]
  );

  const familyInformationInputs = useMemo(
    () => [
      {
        title: t("family_members_count"),
        name: "members_count",
        placeholder: t("members_count"),
        type: "number",
      },
      {
        title: t("phone_number"),
        name: "phone_number",
        placeholder: t("phone_number"),
      },
    ],
    [t]
  );

  const housingTypeInputs = useMemo(
    () => [
      {
        name: "housing_type",
        label: t("housing_type"),
        placeholder: t("select_housing_type"),
        endPoint: "housing-types/",
      },
      {
        name: "housing_ownership",
        label: t("ownership_status"),
        placeholder: t("select_ownership_status"),
        endPoint: "housing-ownerships/",
      },
      {
        name: "housing_condition",
        label: t("housing_condition"),
        placeholder: t("select_housing_condition"),
        endPoint: "housing-conditions/",
      },
    ],
    [t]
  );

  const previousLocationInputs = useMemo(
    () => [
      {
        name: "previous_city",
        label: t("previous_city"),
        placeholder: t("select_city"),
        endPoint: "cities/",
        queryKey: citiesQueryKey,
      },
      {
        name: "previous_town",
        label: t("previous_town"),
        placeholder: t("select_town"),
        endPoint: "villages-towns/",
        queryKey: villageTownQueryKey,
      },
      {
        name: "previous_council",
        label: t("previous_council"),
        placeholder: t("select_council"),
        endPoint: "councils/",
        queryKey: councilsQueryKey,
      },
      {
        name: "previous_commune",
        label: t("previous_commune"),
        placeholder: t("select_commune"),
        endPoint: "communes/",
        queryKey: communesQueryKey,
      },
    ],
    [t]
  );

  const propertiesInputs = useMemo(
    () => [
      {
        title: t("real_estate_m2"),
        name: "real_estate_m2",
        placeholder: t("real_estate_m2"),
      },
      {
        title: t("rainfed_land_hectare"),
        name: "rainfed_land_hectare",
        placeholder: t("rainfed_land_hectare"),
      },
      {
        title: t("irrigated_land_hectare"),
        name: "irrigated_land_hectare",
        placeholder: t("irrigated_land_hectare"),
      },
    ],
    [t]
  );

  const machineriesInputs = useMemo(
    () => [
      {
        name: "machinery",
        title: t("machinery"),
        placeholder: t("machinery"),
        type: "text",
      },
      {
        name: "buildings_count",
        title: t("buildings_count"),
        placeholder: t("buildings_count"),
      },
      {
        name: "trees_count",
        title: t("trees_count"),
        placeholder: t("trees_count"),
      },
      {
        name: "sheep_count",
        title: t("sheep_count"),
        placeholder: t("sheep_count"),
      },
      {
        name: "cows_count",
        title: t("cows_count"),
        placeholder: t("cows_count"),
      },
      {
        name: "other_assets",
        title: t("other_assets"),
        placeholder: t("other_assets"),
        type: "text",
      },
    ],
    [t]
  );

  const servicesInputs = useMemo(
    () => [
      {
        name: "electricity_sources",
        label: t("electricity_sources"),
        placeholder: t("electricity_sources"),
        endPoint: "electricity-sources/",
      },
      {
        name: "water_sources",
        label: t("water_sources"),
        placeholder: t("water_sources"),
        endPoint: "water-sources/",
      },
      {
        name: "sewage_types",
        label: t("sewage_types"),
        placeholder: t("sewage_types"),
        endPoint: "sewage-types/",
      },
    ],
    [t]
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
    initialValues: personSchema.values(),
    validationSchema: personSchema.schema,
  });

  const onSave = useCallback(() => {
    handleAddPerson(personFormik, () => setIsAddPersonPopupOpen(false));
  }, [personFormik]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-actions">
          <IconButton title={t("save")} type="submit">
            <i className="fa-solid fa-floppy-disk" />
          </IconButton>
          <AddPersonPopUp
            formik={personFormik}
            onSave={onSave}
            isOpen={isAddPersonPopupOpen}
            setIsOpen={setIsAddPersonPopupOpen}
          />
        </div>
        <div className="form-container">
          <Card title={t("form_information")}>
            <Input
              title={t("form_number")}
              errorText={
                formik.touched.form_number && formik.errors.form_number
              }
              onChange={formik.handleChange}
              value={formik.values.form_number}
              name="form_number"
              placeholder={t("form_number")}
            />
            <Input
              title={t("family_code")}
              errorText={
                formik.touched.family_code && formik.errors.family_code
              }
              onChange={formik.handleChange}
              value={formik.values.family_code}
              name="family_code"
              placeholder={t("family_code")}
            />
            <SelectOptionInput
              label={t("residence_status")}
              placeholder={t("select_residence_status")}
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
            <Input
              title={t("document_type")}
              errorText={
                formik.touched.document_type && formik.errors.document_type
              }
              onChange={formik.handleChange}
              value={formik.values.document_type}
              name="document_type"
              placeholder={t("document_type")}
            />
            <Input
              title={t("document_number")}
              errorText={
                formik.touched.document_number && formik.errors.document_number
              }
              onChange={formik.handleChange}
              value={formik.values.document_number}
              name="document_number"
              placeholder={t("document_number")}
            />
          </Card>

          <Card title={t("family_information")}>
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
              label={t("ethnic_components")}
              placeholder={t("ethnic_components")}
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
              label={t("religion")}
              placeholder={t("select_religion")}
              endPoint="religions/"
              queryKey="religion"
              onChange={(e) => formik.setFieldValue("religion", e)}
              value={formik.values.religion?.name}
              onIgnore={() => formik.setFieldValue("religion", null)}
              optionLabel={(e) => e.name}
              errorText={formik.touched.religion && formik.errors.religion}
            />
          </Card>

          <Card title={t("current_location")}>
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

          <Card title={t("previous_location")}>
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

          <Card title={t("housing_situation")}>
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

          <Card title={t("properties")}>
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

          <Card title={t("economic_situation")}>
            <Input
              title={t("annual_income")}
              errorText={
                formik.touched.annual_income && formik.errors.annual_income
              }
              onChange={formik.handleChange}
              value={formik.values.annual_income}
              name="annual_income"
              placeholder={t("annual_income")}
              type="number"
            />
            <SelectOptionInput
              label={t("economic_status")}
              placeholder={t("select_economic_status")}
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
              label={t("income_sources")}
              placeholder={t("select_income_sources")}
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

          <Card title={t("machinery_and_property")}>
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

          <Card title={t("services")}>
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