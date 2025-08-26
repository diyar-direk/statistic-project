import * as yup from "yup";

export const famlyFormSchema = {
  values: {
    form_number: "",
    family_code: "",
    //
    members_count: 0,
    ethnic_component: "",
    religion: "",
    phone_number: "",
    //
    city: "",
    village_town: "",
    council: "",
    commune: "",
    //
    previous_city: "",
    previous_town: "",
    previous_council: "",
    previous_coummune: "",
    //
    housing_type: "",
    housing_condition: "",
    housing_ownership: "",
    //
    annual_income: 0,
    economic_status: "",
    //
    residence_status: "",
    //
    real_estate_m2: 0,
    rainfed_land_hectare: 0,
    irrigated_land_hectare: 0,
    //
    trees_count: 0,
    machinery: "",
    buildings_count: 0,
    sheep_count: 0,
    cows_count: 0,
    other_assets: "",
    //
    electricity_sources: [],
    water_sources: [],
    income_sources: [],
    sewage_types: [],
  },

  schema: yup.object({
    // ===================== required =====================
    form_number: yup.string().required("Form number is required"),

    family_code: yup.string().required("Family code is required"),

    members_count: yup
      .number()
      .integer("Must be an integer")
      .min(1, "Must be greater than 0")
      .required("Members count is required"),

    ethnic_component: yup.object().required("Ethnic component is required"),

    city: yup.object().required("City is required"),

    economic_status: yup.string().required("Economic status is required"),

    residence_status: yup.string().required("Residence status is required"),

    trees_count: yup
      .number()
      .integer("Must be an integer")
      .min(0, "Must be 0 or more")
      .required("Trees count is required"),

    buildings_count: yup
      .number()
      .integer("Must be an integer")
      .min(0, "Must be 0 or more")
      .required("Buildings count is required"),

    sheep_count: yup
      .number()
      .integer("Must be an integer")
      .min(0, "Must be 0 or more")
      .required("Sheep count is required"),

    cows_count: yup
      .number()
      .integer("Must be an integer")
      .min(0, "Must be 0 or more")
      .required("Cows count is required"),

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

    annual_income: yup.number().min(0, "Must be 0 or more").nullable(),

    real_estate_m2: yup
      .number()
      .integer("Must be an integer")
      .min(0, "Must be 0 or more")
      .nullable(),

    rainfed_land_hectare: yup
      .number()
      .integer("Must be an integer")
      .min(0, "Must be 0 or more")
      .nullable(),

    irrigated_land_hectare: yup
      .number()
      .integer("Must be an integer")
      .min(0, "Must be 0 or more")
      .nullable(),

    phone_number: yup
      .string()
      .matches(/^[0-9]{6,20}$/, "Phone must be 6-20 digits")
      .nullable(),

    machinery: yup.string().nullable(),

    other_assets: yup.string().nullable(),

    electricity_sources: yup.array().of(yup.object().nullable()),
    water_sources: yup.array().of(yup.object().nullable()),
    income_sources: yup.array().of(yup.object().nullable()),
    sewage_types: yup.array().of(yup.object().nullable()),
  }),
};
