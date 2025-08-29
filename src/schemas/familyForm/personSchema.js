import * as Yup from "yup";
import i18next from "i18next";

const personSchema = {
  values: (data) => ({
    family_from: data?.family_from ?? "",
    first_name: data?.first_name ?? "",
    father_name: data?.father_name ?? "",
    last_name: data?.last_name ?? "",
    mother_name: data?.mother_name ?? "",
    is_male: data?.is_male ?? true,
    birth_date: data?.birth_date ?? "",
    birth_place: data?.birth_place ?? "",
    marital_status: data?.marital_status ?? "",
    education_level: data?.education_level ?? "",
    current_job: data?.current_job ?? "",
    chronic_diseases: data?.chronic_diseases ?? "",
    special_case: data?.special_case ?? "",
    special_case_place: data?.special_case_place ?? "",
    disability: data?.disability ?? "",
    is_migrant: data?.is_migrant ?? false,
    migration_place: data?.migration_place ?? "",
    is_head_of_family: data?.is_head_of_family ?? false,
  }),

  schema: Yup.object({
    family_from: Yup.number().nullable(),

    first_name: Yup.string()
      .required(i18next.t("first_name_required"))
      .max(100, i18next.t("max_100_characters")),

    father_name: Yup.string()
      .nullable()
      .max(100, i18next.t("max_100_characters")),

    last_name: Yup.string()
      .required(i18next.t("last_name_required"))
      .max(100, i18next.t("max_100_characters")),

    mother_name: Yup.string()
      .required(i18next.t("mother_name_required"))
      .max(100, i18next.t("max_100_characters")),

    is_male: Yup.boolean().required(i18next.t("gender_required")),

    birth_date: Yup.date()
      .required(i18next.t("birth_date_required"))
      .max(new Date(), i18next.t("birth_date_not_future")),

    birth_place: Yup.string()
      .required(i18next.t("birth_place_required"))
      .max(100, i18next.t("max_100_characters")),

    marital_status: Yup.string()
      .required(i18next.t("marital_status_required"))
      .oneOf(
        ["Single", "Married", "Divorced", "Widowed"],
        i18next.t("invalid_marital_status")
      ),

    education_level: Yup.string()
      .required(i18next.t("education_level_required"))
      .max(100, i18next.t("max_100_characters")),

    current_job: Yup.string()
      .nullable()
      .max(100, i18next.t("max_100_characters")),

    chronic_diseases: Yup.string()
      .nullable()
      .max(200, i18next.t("max_200_characters")),

    special_case: Yup.string()
      .nullable()
      .max(200, i18next.t("max_200_characters")),

    special_case_place: Yup.string()
      .nullable()
      .max(200, i18next.t("max_200_characters")),

    disability: Yup.string()
      .nullable()
      .max(200, i18next.t("max_200_characters")),

    is_migrant: Yup.boolean().required(i18next.t("migration_status_required")),

    is_head_of_family: Yup.boolean().required(i18next.t("is_head_of_family_required")),

    migration_place: Yup.string()
      .nullable()
      .max(200, i18next.t("max_200_characters")),
  }),
};

export default personSchema;