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
const apiClient = new APIClient(`family-forms`);
const personApiClient = new APIClient(`persons/`);

const FormFamilyView = () => {
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
        cardTitle: "form information",
        children: [
          { title: "form number", value: data?.form_number },
          { title: "family code", value: data?.family_code },
          { title: "residence_status", value: data?.residence_status },
          { title: "document type", value: data?.document_type },
          { title: "document number", value: data?.document_number },
        ],
      },
      {
        cardTitle: "family information",
        children: [
          { title: "members count", value: data?.members_count },
          { title: "phone number", value: data?.phone_number },
          { title: "ethnic_component", value: data?.ethnic_component?.name },
          { title: "head_of_family", value: data?.head_of_family?.full_name },
          { title: "religion", value: data?.religion?.name },
        ],
      },
      {
        cardTitle: "members",
        children: [
          {
            customValue: (
              <div className="members">
                {data?.members.map((person) => (
                  <div key={person.id}>
                    <Link to={`/person/${person.id}`}>{person.first_name}</Link>
                    <i
                      className="fa-solid fa-trash-can icon-delete"
                      title="delete"
                      onClick={() => setSelectedPerson(person)}
                    />
                    <i
                      onClick={() => {
                        setUpdateData(person);
                        setIsAddPersonPopupOpen(true);
                      }}
                      title="update"
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
        cardTitle: "current location",
        children: [
          { title: "city", value: data?.city?.name },
          { title: "village_town", value: data?.village_town?.name },
          { title: "council", value: data?.council?.name },
          { title: "commune", value: data?.commune?.name },
        ],
      },
      {
        cardTitle: "previous Location",
        children: [
          { title: "previous_city", value: data?.previous_city?.name },
          { title: "previous_town", value: data?.previous_town?.name },
          { title: "previous_council", value: data?.previous_council?.name },
          { title: "previous_commune", value: data?.previous_commune?.name },
        ],
      },
      {
        cardTitle: "housing situation",
        children: [
          { title: "housing_type", value: data?.housing_type?.name },
          { title: "housing_ownership", value: data?.housing_ownership?.name },
          { title: "housing_condition", value: data?.housing_condition?.name },
        ],
      },
      {
        cardTitle: "Properties",
        children: [
          { title: "real_estate_m2", value: data?.real_estate_m2 },
          {
            title: "rainfed_land_hectare",
            value: data?.rainfed_land_hectare,
          },
          {
            title: "irrigated_land_hectare",
            value: data?.irrigated_land_hectare,
          },
          {
            title: "total_land_hectare",
            value: data?.total_land_hectare,
          },
        ],
      },
      {
        cardTitle: "Economic situation",
        children: [
          { title: "annual_income", value: data?.annual_income },
          {
            title: "economic_status",
            value: data?.economic_status,
          },
          {
            title: "income_sources",
            value: data?.income_sources,
            isArray: true,
          },
        ],
      },
      {
        cardTitle: "Machinery and property",
        children: [
          { title: "machinery", value: data?.machinery },
          {
            title: "buildings_count",
            value: data?.buildings_count,
          },
          {
            title: "trees_count",
            value: data?.trees_count,
          },
          {
            title: "sheep_count",
            value: data?.sheep_count,
          },
          {
            title: "cows_count",
            value: data?.cows_count,
          },
          {
            title: "other_assets",
            value: data?.other_assets,
          },
        ],
      },
      {
        cardTitle: "services",
        children: [
          {
            title: "electricity_sources",
            value: data?.electricity_sources,
            isArray: true,
          },
          {
            title: "water_sources",
            value: data?.water_sources,
            isArray: true,
          },
          {
            title: "sewage_types",
            value: data?.sewage_types,
            isArray: true,
          },
        ],
      },
      {
        cardTitle: "more information",
        children: [
          {
            title: "created_at",
            value: dateFormatter(data?.created_at, "fullDate"),
          },
          {
            title: "created_by",
            value: data?.created_by?.name,
          },
          {
            title: "updated_at",
            value: dateFormatter(data?.updated_at, "fullDate"),
          },
          {
            title: "updated_by",
            value: data?.updated_by?.name,
          },
        ],
      },
    ],
    [data]
  );

  const addnewPerson = useMutation({
    mutationKey: personQueryClient,
    mutationFn: (data) => personApiClient.addData({ data }),
    onSuccess: () => {
      formik.resetForm();
      queryClient.invalidateQueries({ queryKey: [FormFamilyQueryKey, id] });
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
  if (!data) return <h1> no data </h1>;

  return (
    <>
      <ConfirmPopUp
        isOpen={selectedPerson}
        heading={`Are you sure you want to delete ${selectedPerson?.first_name}`}
        onClose={() => setSelectedPerson(null)}
        onConfirm={confirmDeletePerson}
      />
      <div className="form-actions">
        <IconButton title="update form family">
          <Link to={`/update_family_form/${id}`}>
            <i className="fa-solid fa-pen-to-square " />
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
                {child.title && <h3 className="title"> {child.title} </h3>}
                {child.customValue ? (
                  child.customValue
                ) : (
                  <p>
                    {child.isArray
                      ? child.value.length > 0
                        ? formatArray(child.value, (e) => e.name)
                        : "no result"
                      : child.value || "no result"}
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
