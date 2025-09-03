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
import AddPersonPopUp from "../components/AddPersonPopUp";
import { handleAddPerson } from "../components/handlePersonFormik.js";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router";
import CheckBox from "../../../../../components/inputs/CheckBox.jsx";
export const FormFamilyQueryKey = "formFamily";
const apiClient = new APIClient(`family-forms/`);
const personApiClient = new APIClient(`persons/`);
export const personQueryClient = "persons";

const AddFamilyForm = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [isAddPersonPopupOpen, setIsAddPersonPopupOpen] = useState(false);
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationKey: [FormFamilyQueryKey],
    mutationFn: (data) => apiClient.addData({ data }),
    onSuccess: (response) => {
      personApiClient.addData({
        data: { ...personFormik.values, family_from: response.id },
      });
      queryClient.invalidateQueries([personQueryClient]);
      queryClient.invalidateQueries({
        queryKey: [FormFamilyQueryKey],
        exact: false,
      });
      setIsAddPersonPopupOpen(false);
      nav(-1);
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

  const personFormik = useFormik({
    initialValues: personSchema.values(),
    validationSchema: personSchema.schema,
  });

  const onSave = useCallback(() => {
    handleAddPerson(personFormik, () => setIsAddPersonPopupOpen(false));
  }, [personFormik]);

  const cards = useMemo(
    () => [
      {
        title: "current_location",
        children: [
          {
            inputType: "input",
            props: {
              name: "form_number",
            },
          },
          {
            props: {
              name: "city",
              placeholder: "select_city",
              endPoint: "cities/",
              queryKey: citiesQueryKey,
            },
          },
          {
            props: {
              name: "village_town",
              label: "town",
              placeholder: "select_town",
              endPoint: "villages-towns/",
              queryKey: villageTownQueryKey,
            },
          },
          {
            props: {
              name: "council",
              label: "council",
              placeholder: "select_council",
              endPoint: "councils/",
              queryKey: councilsQueryKey,
            },
          },
          {
            props: {
              name: "commune",
              label: "commune",
              placeholder: "select_commune",
              endPoint: "communes/",
              queryKey: communesQueryKey,
            },
          },
          {
            inputType: "input",
            props: {
              name: "family_code",
            },
          },
        ],
      },
      {
        title: "family_information",
        children: [
          {
            inputType: "input",
            props: {
              name: "members_count",
              title: "family_members_count",
              type: "number",
            },
          },
          {
            inputType: "input",
            props: {
              name: "phone_number",
            },
          },
          {
            props: {
              name: "ethnic_components",
              endPoint: "ethnic-components/",
            },
          },
          {
            props: {
              name: "religion",
              endPoint: "religions/",
              placeholder: "select_religion",
            },
          },
        ],
      },
      {
        title: "housing_situation",
        children: [
          {
            props: {
              name: "housing_type",
              placeholder: "select_housing_type",
              endPoint: "housing-types/",
            },
          },
          {
            props: {
              name: "housing_ownership",
              label: "ownership_status",
              placeholder: "select_ownership_status",
              endPoint: "housing-ownerships/",
            },
          },
          {
            props: {
              name: "housing_condition",
              placeholder: "select_housing_condition",
              endPoint: "housing-conditions/",
            },
          },
        ],
      },
      {
        title: "form_information",
        children: [
          {
            inputType: "checkbox",
            props: {
              options: residencyStatusOptions,
              label: "residence_status",
            },
          },
          {
            inputType: "input",
            props: { name: "document_type" },
          },
          {
            inputType: "input",
            props: { name: "document_number" },
          },
        ],
      },
      {
        title: "previous_location",
        children: [
          {
            props: {
              name: "previous_city",
              placeholder: "select_city",
              endPoint: "cities/",
              queryKey: citiesQueryKey,
            },
          },
          {
            props: {
              name: "previous_town",
              placeholder: "select_town",
              endPoint: "villages-towns/",
              queryKey: villageTownQueryKey,
            },
          },
          {
            props: {
              name: "previous_council",
              placeholder: "select_council",
              endPoint: "councils/",
              queryKey: councilsQueryKey,
            },
          },
          {
            props: {
              name: "previous_commune",
              placeholder: "select_commune",
              endPoint: "communes/",
              queryKey: communesQueryKey,
            },
          },
        ],
      },
      {
        title: "properties",
        children: [
          {
            inputType: "input",
            props: { name: "real_estate_m2", type: "number" },
          },
          {
            inputType: "input",
            props: { name: "rainfed_land_hectare", type: "number" },
          },
          {
            inputType: "input",
            props: { name: "irrigated_land_hectare", type: "number" },
          },
        ],
      },
      {
        title: "economic_situation",
        children: [
          {
            props: {
              name: "income_sources",
              placeholder: "select_income_sources",
              endPoint: "income-sources/",
              isArray: true,
            },
          },
          {
            inputType: "checkbox",
            props: { name: "economic_status", options: povertyLevelOptions },
          },
          {
            inputType: "input",
            props: { name: "annual_income", type: "number" },
          },
        ],
      },
      {
        title: "services",
        children: [
          {
            props: {
              name: "electricity_sources",
              endPoint: "electricity-sources/",
              isArray: true,
            },
          },
          {
            props: {
              name: "water_sources",
              endPoint: "water-sources/",
              isArray: true,
            },
          },
          {
            props: {
              name: "sewage_types",
              endPoint: "sewage-types/",
              isArray: true,
            },
          },
        ],
      },
      {
        title: "machinery_and_property",
        children: [
          {
            inputType: "input",
            props: {
              name: "machinery",
            },
          },
          {
            inputType: "input",
            props: {
              name: "buildings_count",
            },
          },
          {
            inputType: "input",
            props: {
              name: "sheep_count",
              type: "number",
            },
          },
          {
            inputType: "input",
            props: {
              name: "cows_count",
              type: "number",
            },
          },
          {
            inputType: "input",
            props: {
              name: "other_assets",
            },
          },
        ],
      },
    ],
    [residencyStatusOptions, povertyLevelOptions]
  );

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
          {cards.map((card) => (
            <Card key={card.title} title={t(card.title)}>
              {card.children.map((inp) => (
                <Inputs
                  formik={formik}
                  key={inp.name}
                  inputType={inp.inputType}
                  t={t}
                  {...inp.props}
                />
              ))}
            </Card>
          ))}
        </div>
      </form>
    </>
  );
};

export default memo(AddFamilyForm);

const Inputs = ({ inputType, name, formik, t, ...props }) => {
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
  if (inputType === "input")
    return (
      <Input
        {...props}
        errorText={formik.touched[name] && formik.errors[name]}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        title={t(props.title || name)}
        placeholder={t(props.placeholder || name)}
      />
    );
  else if (inputType === "checkbox")
    return (
      <CheckBox
        errorText={formik.touched[name] && formik.errors[name]}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        title={t(props.title || name)}
        {...props}
      />
    );
  return (
    <SelectInputApi
      {...props}
      label={t(props.label || name)}
      placeholder={t(props.placeholder || name)}
      errorText={formik.touched[name] && formik.errors[name]}
      name={name}
      value={formik.values[name]}
      onChange={(e) =>
        props.isArray ? multiFormSelect(name, e) : formik.setFieldValue(name, e)
      }
      onIgnore={(e) =>
        props.isArray ? ignoreSelect(name, e) : formik.setFieldValue(name, null)
      }
      optionLabel={(e) => (props.optionLabel ? props.optionLabel(e) : e.name)}
      queryKey={props.queryKey || props.endPoint}
    />
  );
};
