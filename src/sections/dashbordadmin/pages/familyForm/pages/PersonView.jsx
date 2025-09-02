import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import APIClient from "src/utils/ApiClient";
import { FormFamilyQueryKey, personQueryClient } from "./AddFamilyForm";
import Skeleton from "react-loading-skeleton";
import { useMemo, useState } from "react";
import dateFormatter from "src/utils/dateFormatter";
import IconButton from "../../../../../components/buttons/IconButton";
import AddPersonPopUp from "../components/AddPersonPopUp";
import { useFormik } from "formik";
import personSchema from "src/schemas/familyForm/personSchema";
import { handleAddPerson } from "../components/handlePersonFormik";
import { useTranslation } from "react-i18next";

const apiClient = new APIClient("persons");

const PersonView = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: [personQueryClient, id],
    queryFn: () => apiClient.getOne({ id }),
  });
  const personalInfo = useMemo(
    () => [
      {
        title: t("mother_name"),
        value: data?.mother_name,
      },
      {
        title: t("birth_date"),
        value: data?.birth_date,
      },
      {
        title: t("birth_place"),
        value: data?.birth_place,
      },
      {
        title: t("gender"),
        value: data?.is_male ? t("male") : t("female"),
      },
      {
        title: t("marital_status"),
        value: data?.marital_status,
      },
      {
        title: t("is_head_of_family"),
        value: data?.is_head_of_family ? t("yes") : t("no"),
      },
      {
        title: t("education_level"),
        value: data?.education_level,
      },
      {
        title: t("current_job"),
        value: data?.current_job,
      },
    ],
    [data, t]
  );

  const morePersonInfo = useMemo(
    () => [
      {
        title: t("family_code"),
        value: data?.family_code,
      },
      {
        title: t("is_migrant"),
        value: data?.is_migrant ? t("yes") : t("no"),
      },
      {
        title: t("migration_place"),
        value: data?.migration_place,
      },
      {
        title: t("special_case"),
        value: data?.special_case,
      },
      {
        title: t("special_case_place"),
        value: data?.special_case_place,
      },
      {
        title: t("chronic_diseases"),
        value: data?.chronic_diseases,
      },
      {
        title: t("disability"),
        value: data?.disability,
      },
      {
        title: t("created_by"),
        value: data?.created_by?.name,
      },
      {
        title: t("created_at"),
        value: dateFormatter(data?.created_at, "fullDate"),
      },
      {
        title: t("updated_by"),
        value: data?.updated_by?.name,
      },
      {
        title: t("updated_at"),
        value: dateFormatter(data?.updated_at, "fullDate"),
      },
    ],
    [data, t]
  );
  const queryClient = useQueryClient();
  const [isAddPersonPopupOpen, setIsAddPersonPopupOpen] = useState(false);

  const updatePerson = useMutation({
    mutationKey: [personQueryClient, id],
    mutationFn: (data) =>
      apiClient.updateData({ data, id, url: `persons/${id}/` }),
    onSuccess: () => {
      formik.resetForm();
      queryClient.invalidateQueries({ queryKey: [FormFamilyQueryKey] });
      queryClient.invalidateQueries({ queryKey: [personQueryClient, id] });
      setIsAddPersonPopupOpen(false);
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: personSchema.values(data),
    validationSchema: personSchema.schema,
    onSubmit: async (values) => {
      await handleAddPerson(formik);
      updatePerson.mutate(values);
    },
  });

  if (isLoading) return <Skeleton height="400px" />;
  if (!data) return <h1>{t("no_data")}</h1>;

  return (
    <>
      <AddPersonPopUp
        formik={formik}
        setIsOpen={setIsAddPersonPopupOpen}
        isOpen={isAddPersonPopupOpen}
        onSave={formik.handleSubmit}
        hideIcon
      />
      <h2 className="full-name">
        {data?.first_name} {data?.father_name} {data?.last_name}
      </h2>
      <div className="person-view">
        <div className="personality">
          {personalInfo.map((info) => (
            <div key={info.title} className="personal-info">
              <h3 className="title">{info.title}</h3>
              <p>{info.value || t("no_result")}</p>
            </div>
          ))}
        </div>
        <div className="more-person-info">
          {morePersonInfo.map((info) => (
            <div key={info.title} className="personal-info">
              <h3 className="title">{info.title}</h3>
              <p>{info.value || t("no_result")}</p>
            </div>
          ))}
          <IconButton
            onClick={() => setIsAddPersonPopupOpen(true)}
            title={t("update")}
            color="secondry-color"
          >
            <i className="fa-solid fa-pen-to-square update-icon" />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default PersonView;