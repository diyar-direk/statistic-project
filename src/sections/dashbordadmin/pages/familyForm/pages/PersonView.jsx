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

const apiClient = new APIClient("persons");
const PersonView = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: [personQueryClient, id],
    queryFn: () => apiClient.getOne({ id }),
  });
  const personalInfo = useMemo(
    () => [
      {
        title: "name",
        value: `${data?.first_name} ${data?.father_name} ${data?.last_name}`,
      },
      {
        title: "mother_name",
        value: data?.mother_name,
      },
      {
        title: "birth_date",
        value: dateFormatter(data?.birth_date),
      },
      {
        title: "birth_place",
        value: data?.birth_place,
      },
      {
        title: "gender",
        value: data?.is_male ? "male" : "femal",
      },
      {
        title: "marital_status",
        value: data?.marital_status,
      },
      {
        title: "is_head_of_family",
        value: data?.is_head_of_family ? "yes" : "no",
      },
      {
        title: "education_level",
        value: data?.education_level,
      },
      {
        title: "current_job",
        value: data?.current_job,
      },
    ],
    [data]
  );

  const morePersonInfo = useMemo(
    () => [
      {
        title: "family_code",
        value: data?.family_code,
      },
      {
        title: "is_migrant",
        value: data?.is_migrant ? "Yes" : "No",
      },
      {
        title: "migration_place",
        value: data?.migration_place,
      },
      {
        title: "special_case",
        value: data?.special_case,
      },
      {
        title: "special_case_place",
        value: data?.special_case_place,
      },
      {
        title: "chronic_diseases",
        value: data?.chronic_diseases,
      },
      {
        title: "disability",
        value: data?.disability,
      },
      {
        title: "created_by",
        value: data?.created_by?.name,
      },
      {
        title: "created_at",
        value: dateFormatter(data?.created_at, "fullDate"),
      },
      {
        title: "updated_by",
        value: data?.updated_by?.name,
      },
      {
        title: "updated_at",
        value: dateFormatter(data?.updated_at, "fullDate"),
      },
    ],
    [data]
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
  if (!data) return <h1>no data</h1>;

  return (
    <>
      <AddPersonPopUp
        formik={formik}
        setIsOpen={setIsAddPersonPopupOpen}
        isOpen={isAddPersonPopupOpen}
        onSave={formik.handleSubmit}
        hideIcon
      />
      <div className="person-view">
        <div className="personality">
          {personalInfo.map((info) => (
            <div key={info.title} className="personal-info">
              <h3 className="title"> {info.title} </h3>
              <p> {info.value || "no result"} </p>
            </div>
          ))}
        </div>
        <div className="more-person-info">
          {morePersonInfo.map((info) => (
            <div key={info.title} className="personal-info">
              <h3 className="title"> {info.title} </h3>
              <p> {info.value || "no result"} </p>
            </div>
          ))}
          <IconButton
            onClick={() => setIsAddPersonPopupOpen(true)}
            title="update"
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
