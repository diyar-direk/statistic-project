import { useQuery } from "@tanstack/react-query";
import APIClient from "./../../../../../utils/ApiClient";
import { FormFamilyQueryKey } from "./AddFamilyForm";
import { useParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import Card from "../components/Card";
import { useMemo } from "react";
import { formatArray } from "./../../../../../utils/spritObject";
const apiClient = new APIClient(`family-forms`);
/**

 created_at
 members
 total_land_hectare
 created_by
 updated_at
 updated_by
 */
const FormFamilyView = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: [FormFamilyQueryKey, id],
    queryFn: () => apiClient.getOne({ id }),
  });
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
          { title: "religion", value: data?.religion?.name },
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
    ],
    [data]
  );
  if (isLoading) return <Skeleton width="100%" height="400px" />;
  if (!data) return <h1> no data </h1>;

  return (
    <div className="form-container">
      {cards.map((card) => (
        <Card key={card.cardTitle} title={card.cardTitle}>
          {card.children?.map((child) => (
            <article key={child.title} className="personal-info">
              <h3 className="title"> {child.title} </h3>
              {
                <p>
                  {child.isArray
                    ? formatArray(child.value, (e) => e.name)
                    : child.value || "no result"}
                </p>
              }
            </article>
          ))}
        </Card>
      ))}
    </div>
  );
};

export default FormFamilyView;
