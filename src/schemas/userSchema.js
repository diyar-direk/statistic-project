import * as yup from "yup";

const userSchema = (isUpdate) =>
  yup.object().shape({
    username: isUpdate
      ? yup
          .string()
          .min(2, "Username must be at least 2 characters")
          .notRequired()
      : yup
          .string()
          .min(2, "Username must be at least 2 characters")
          .required("Username is required"),

    password: isUpdate
      ? yup
          .string()
          .min(2, "Password must be at least 2 characters")
          .notRequired()
      : yup
          .string()
          .min(2, "Password must be at least 2 characters")
          .required("Password is required"),

    first_name: yup.string().required("Name is required"),
    phone_number: yup.string().notRequired(),

    role: yup
      .string()
      .oneOf(["admin", "data_entry"], "Invalid role")
      .required("Role is required"),

    is_active: yup.boolean().required("Account status is required"),
  });

export default userSchema;
