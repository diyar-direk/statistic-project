import * as Yup from "yup";

const personSchema = {
  values: {
    family_from: "",
    first_name: "",
    father_name: "",
    last_name: "",
    mother_name: "",
    is_male: true,
    birth_date: "",
    birth_place: "",
    marital_status: "",
    education_level: "",
    current_job: "",
    chronic_diseases: "",
    special_case: "",
    special_case_place: "",
    disability: "",
    is_migrant: false,
    migration_place: "",
  },
  schema: Yup.object({
    family_from: Yup.number().nullable(),

    first_name: Yup.string()
      .required("first name is required")
      .max(100, "must be less than 100 characters"),

    father_name: Yup.string()
      .nullable()
      .max(100, "must be less than 100 characters"),

    last_name: Yup.string()
      .required("last name is required")
      .max(100, "must be less than 100 characters"),

    mother_name: Yup.string()
      .required("mother name is required")
      .max(100, "must be less than 100 characters"),

    is_male: Yup.boolean().required("gender is required"),

    birth_date: Yup.date()
      .required("birth date is required")
      .max(new Date(), "birth date cannot be in the future"),

    birth_place: Yup.string()
      .required("birth place is required")
      .max(100, "must be less than 100 characters"),

    marital_status: Yup.string()
      .required("marital status is required")
      .oneOf(
        ["Single", "Married", "Divorced", "Widowed"],
        "invalid marital status"
      ),

    education_level: Yup.string()
      .required("education level is required")
      .max(100, "must be less than 100 characters"),

    current_job: Yup.string()
      .nullable()
      .max(100, "must be less than 100 characters"),

    chronic_diseases: Yup.string()
      .nullable()
      .max(200, "must be less than 200 characters"),

    special_case: Yup.string()
      .nullable()
      .max(200, "must be less than 200 characters"),

    special_case_place: Yup.string()
      .nullable()
      .max(200, "must be less than 200 characters"),

    disability: Yup.string()
      .nullable()
      .max(200, "must be less than 200 characters"),

    is_migrant: Yup.boolean().required("migration status is required"),

    migration_place: Yup.string()
      .nullable()
      .max(200, "must be less than 200 characters"),
  }),
};

export default personSchema;
