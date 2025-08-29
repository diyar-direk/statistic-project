import * as yup from "yup";
import i18next from "i18next";

export const famlyFormSchema = {
  values: (data = {}) => ({
    form_number: data.form_number ?? "",
    family_code: data.family_code ?? "",
    //
    members_count: data.members_count ?? 0,
    ethnic_component: data.ethnic_component ?? "",
    religion: data.religion ?? "",
    phone_number: data.phone_number ?? "",
    //
    city: data.city ?? "",
    village_town: data.village_town ?? "",
    council: data.council ?? "",
    commune: data.commune ?? "",
    //
    previous_city: data.previous_city ?? "",
    previous_town: data.previous_town ?? "",
    previous_council: data.previous_council ?? "",
    previous_coummune: data.previous_coummune ?? "",
    //
    housing_type: data.housing_type ?? "",
    housing_condition: data.housing_condition ?? "",
    housing_ownership: data.housing_ownership ?? "",
    //
    annual_income: data.annual_income ?? 0,
    economic_status: data.economic_status ?? "",
    //
    residence_status: data.residence_status ?? "",
    //
    real_estate_m2: data.real_estate_m2 ?? 0,
    rainfed_land_hectare: data.rainfed_land_hectare ?? 0,
    irrigated_land_hectare: data.irrigated_land_hectare ?? 0,
    //
    trees_count: data.trees_count ?? 0,
    machinery: data.machinery ?? "",
    buildings_count: data.buildings_count ?? 0,
    sheep_count: data.sheep_count ?? 0,
    cows_count: data.cows_count ?? 0,
    other_assets: data.other_assets ?? "",
    //
    electricity_sources: data.electricity_sources ?? [],
    water_sources: data.water_sources ?? [],
    income_sources: data.income_sources ?? [],
    sewage_types: data.sewage_types ?? [],
    //
    document_type: data.document_type ?? "",
    document_number: data.document_number ?? "",
  }),

  schema: yup.object({
    // ===================== required =====================
    form_number: yup.string().required(i18next.t("form_number_required")),

    family_code: yup.string().required(i18next.t("family_code_required")),

    members_count: yup
      .number()
      .integer(i18next.t("must_be_integer"))
      .min(1, i18next.t("must_be_greater_than_0"))
      .required(i18next.t("members_count_required")),

    ethnic_component: yup.object().required(i18next.t("ethnic_component_required")),

    city: yup.object().required(i18next.t("city_required")),

    economic_status: yup.string().required(i18next.t("economic_status_required")),

    residence_status: yup.string().required(i18next.t("residence_status_required")),

    trees_count: yup
      .number()
      .integer(i18next.t("must_be_integer"))
      .min(0, i18next.t("must_be_0_or_more"))
      .required(i18next.t("trees_count_required")),

    buildings_count: yup
      .number()
      .integer(i18next.t("must_be_integer"))
      .min(0, i18next.t("must_be_0_or_more"))
      .required(i18next.t("buildings_count_required")),

    sheep_count: yup
      .number()
      .integer(i18next.t("must_be_integer"))
      .min(0, i18next.t("must_be_0_or_more"))
      .required(i18next.t("sheep_count_required")),

    cows_count: yup
      .number()
      .integer(i18next.t("must_be_integer"))
      .min(0, i18next.t("must_be_0_or_more"))
      .required(i18next.t("cows_count_required")),

    // ===================== optional =====================
    religion: yup.object().nullable(),

    village_town: yup.object().nullable(),
    council: yup.object().nullable(),
    commune: yup.object().nullable(),

    previous_city: yup.object().nullable(),
    previous_town: yup.object().nullable(),
    previous_council: yup.object().nullable(),
    previous_coummune: yup.object().nullable(),

    housing_type: yup.object().nullable(),
    housing_condition: yup.object().nullable(),
    housing_ownership: yup.object().nullable(),

    annual_income: yup.number().min(0, i18next.t("must_be_0_or_more")).nullable(),

    real_estate_m2: yup
      .number()
      .integer(i18next.t("must_be_integer"))
      .min(0, i18next.t("must_be_0_or_more"))
      .nullable(),

    rainfed_land_hectare: yup
      .number()
      .integer(i18next.t("must_be_integer"))
      .min(0, i18next.t("must_be_0_or_more"))
      .nullable(),

    irrigated_land_hectare: yup
      .number()
      .integer(i18next.t("must_be_integer"))
      .min(0, i18next.t("must_be_0_or_more"))
      .nullable(),

    phone_number: yup
      .string()
      .matches(/^[0-9]{6,20}$/, i18next.t("phone_number_format"))
      .nullable(),

    machinery: yup.string().nullable(),

    other_assets: yup.string().nullable(),

    electricity_sources: yup.array().of(yup.object().nullable()),
    water_sources: yup.array().of(yup.object().nullable()),
    income_sources: yup.array().of(yup.object().nullable()),
    sewage_types: yup.array().of(yup.object().nullable()),

    document_type: yup.string().nullable(),
    document_number: yup.string().nullable(),
  }),
};