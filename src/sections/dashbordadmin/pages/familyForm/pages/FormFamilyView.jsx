import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APIClient from "src/utils/ApiClient";
import { FormFamilyQueryKey, personQueryClient } from "./AddFamilyForm";
import { Link, useParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import Card from "../components/Card";
import { memo, useCallback, useMemo, useState } from "react";
import { formatArray } from "src/utils/spritObject";
import dateFormatter from "src/utils/dateFormatter";
import AddPersonPopUp from "../components/AddPersonPopUp";
import { useFormik } from "formik";
import personSchema from "src/schemas/familyForm/personSchema";
import { handleAddPerson } from "../components/handlePersonFormik";
import ConfirmPopUp from "src/components/popup/ConfirmPopUp";
import IconButton from "src/components/buttons/IconButton";
import { useTranslation } from "react-i18next";

const apiClient = new APIClient(`family-forms`);
const personApiClient = new APIClient(`persons/`);

const FormFamilyView = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: [FormFamilyQueryKey, id],
    queryFn: () => apiClient.getOne({ id }),
  });
  const queryClient = useQueryClient();
  const [isAddPersonPopupOpen, setIsAddPersonPopupOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [updateData, setUpdateData] = useState(null);

  const cards = useMemo(
    () => [
      {
        cardTitle: t("form_information"),
        children: [
          { title: t("form_number"), value: data?.form_number },
          { title: t("family_code"), value: data?.family_code },
          { title: t("residence_status"), value: data?.residence_status },
          { title: t("document_type"), value: data?.document_type },
          { title: t("document_number"), value: data?.document_number },
        ],
      },
      {
        cardTitle: t("family_information"),
        children: [
          { title: t("members_count"), value: data?.members_count },
          { title: t("phone_number"), value: data?.phone_number },
          { title: t("ethnic_component"), value: data?.ethnic_component?.name },
          { title: t("head_of_family"), value: data?.head_of_family?.full_name },
          { title: t("religion"), value: data?.religion?.name },
        ],
      },
      {
        cardTitle: t("members"),
        children: [
          {
            customValue: (
              <div className="members">
                {data?.members.map((person) => (
                  <div key={person.id}>
                    <Link to={`/person/${person.id}`}>{person.first_name}</Link>
                    <i
                      className="fa-solid fa-trash-can icon-delete"
                      title={t("delete")}
                      onClick={() => setSelectedPerson(person)}
                    />
                    <i
                      onClick={() => {
                        setUpdateData(person);
                        setIsAddPersonPopupOpen(true);
                      }}
                      title={t("update")}
                      className="fa-solid fa-pen-to-square update-icon"
                    />
                  </div>
                ))}
              </div>
            ),
          },
        ],
      },
      {
        cardTitle: t("current_location"),
        children: [
          { title: t("city"), value: data?.city?.name },
          { title: t("village_town"), value: data?.village_town?.name },
          { title: t("council"), value: data?.council?.name },
          { title: t("commune"), value: data?.commune?.name },
        ],
      },
      {
        cardTitle: t("previous_location"),
        children: [
          { title: t("previous_city"), value: data?.previous_city?.name },
          { title: t("previous_town"), value: data?.previous_town?.name },
          { title: t("previous_council"), value: data?.previous_council?.name },
          { title: t("previous_commune"), value: data?.previous_commune?.name },
        ],
      },
      {
        cardTitle: t("housing_situation"),
        children: [
          { title: t("housing_type"), value: data?.housing_type?.name },
          { title: t("housing_ownership"), value: data?.housing_ownership?.name },
          { title: t("housing_condition"), value: data?.housing_condition?.name },
        ],
      },
      {
        cardTitle: t("properties"),
        children: [
          { title: t("real_estate_m2"), value: data?.real_estate_m2 },
          { title: t("rainfed_land_hectare"), value: data?.rainfed_land_hectare },
          { title: t("irrigated_land_hectare"), value: data?.irrigated_land_hectare },
          { title: t("total_land_hectare"), value: data?.total_land_hectare },
        ],
      },
      {
        cardTitle: t("economic_situation"),
        children: [
          { title: t("annual_income"), value: data?.annual_income },
          { title: t("economic_status"), value: data?.economic_status },
          {
            title: t("income_sources"),
            value: data?.income_sources,
            isArray: true,
          },
        ],
      },
      {
        cardTitle: t("machinery_and_property"),
        children: [
          { title: t("machinery"), value: data?.machinery },
          { title: t("buildings_count"), value: data?.buildings_count },
          { title: t("trees_count"), value: data?.trees_count },
          { title: t("sheep_count"), value: data?.sheep_count },
          { title: t("cows_count"), value: data?.cows_count },
          { title: t("other_assets"), value: data?.other_assets },
        ],
      },
      {
        cardTitle: t("services"),
        children: [
          {
            title: t("electricity_sources"),
            value: data?.electricity_sources,
            isArray: true,
          },
          {
            title: t("water_sources"),
            value: data?.water_sources,
            isArray: true,
          },
          {
            title: t("sewage_types"),
            value: data?.sewage_types,
            isArray: true,
          },
        ],
      },
      {
        cardTitle: t("more_information"),
        children: [
          {
            title: t("created_at"),
            value: dateFormatter(data?.created_at, "fullDate"),
          },
          {
            title: t("created_by"),
            value: data?.created_by?.name,
          },
          {
            title: t("updated_at"),
            value: dateFormatter(data?.updated_at, "fullDate"),
          },
          {
            title: t("updated_by"),
            value: data?.updated_by?.name,
          },
        ],
      },
    ],
    [data, t]
  );

  const addnewPerson = useMutation({
    mutationKey: personQueryClient,
    mutationFn: (data) => personApiClient.addData({ data }),
    onSuccess: () => {
      formik.resetForm();
      queryClient.invalidateQueries({ queryKey: [FormFamilyQueryKey, id] });
      queryClient.invalidateQueries({ queryKey: [FormFamilyQueryKey] });
      queryClient.invalidateQueries({ queryKey: [personQueryClient] });
      setIsAddPersonPopupOpen(false);
    },
  });
  const updatePerson = useMutation({
    mutationKey: [personQueryClient],
    mutationFn: (data) =>
      personApiClient.updateData({ data, id: updateData.id }),
    onSuccess: () => {
      formik.resetForm();
      queryClient.invalidateQueries({ queryKey: [FormFamilyQueryKey, id] });
      queryClient.invalidateQueries({ queryKey: [personQueryClient] });
      setIsAddPersonPopupOpen(false);
      setUpdateData(null);
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: personSchema.values(updateData),
    validationSchema: personSchema.schema,
    onSubmit: async (values) => {
      const data = { ...values, family_from: id };

      await handleAddPerson(formik);

      (updateData ? updatePerson : addnewPerson).mutate(data);
    },
  });

  const deleteFn = useMutation({
    mutationKey: [personQueryClient],
    mutationFn: (id) => personApiClient.deleteOne({ id }),
    onSuccess: () => {
      setSelectedPerson(null);
      queryClient.invalidateQueries({ queryKey: [personQueryClient] });
      queryClient.invalidateQueries({ queryKey: [FormFamilyQueryKey, id] });
    },
  });

  const confirmDeletePerson = useCallback(
    () => deleteFn.mutate(selectedPerson.id),
    [deleteFn, selectedPerson]
  );

  if (isLoading)
    return (
      <div className="form-container">
        <Skeleton width="100%" height="300px" />
        <Skeleton width="100%" height="300px" />
        <Skeleton width="100%" height="300px" />
        <Skeleton width="100%" height="300px" />
      </div>
    );
  if (!data) return <h1>{t("no_data")}</h1>;

  return (
    <>
      <ConfirmPopUp
        isOpen={selectedPerson}
        heading={t("confirm_delete_person", { name: selectedPerson?.first_name })}
        onClose={() => setSelectedPerson(null)}
        onConfirm={confirmDeletePerson}
      />
      <div className="form-actions">
        <IconButton title={t("update_form_family")}>
          <Link to={`/update_family_form/${id}`}>
            <i className="fa-solid fa-pen-to-square" />
          </Link>
        </IconButton>
        <AddPersonPopUp
          formik={formik}
          setIsOpen={setIsAddPersonPopupOpen}
          isOpen={isAddPersonPopupOpen}
          onSave={formik.handleSubmit}
          isUpdate={updateData}
          setIsUpdate={setUpdateData}
        />
      </div>
      <div className="form-container">
        {cards.map((card, i) => (
          <Card key={card.cardTitle} title={card.cardTitle}>
            {card.children?.map((child) => (
              <article key={child.title || i} className="personal-info">
                {child.title && <h3 className="title">{child.title}</h3>}
                {child.customValue ? (
                  child.customValue
                ) : (
                  <p>
                    {child.isArray
                      ? child.value.length > 0
                        ? formatArray(child.value, (e) => e.name)
                        : t("no_result")
                      : child.value || t("no_result")}
                  </p>
                )}
              </article>
            ))}
          </Card>
        ))}
      </div>
    </>
  );
};

export default memo(FormFamilyView);