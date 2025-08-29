import * as yup from "yup";
import i18next from "i18next";

const userSchema = (isUpdate) =>
  yup.object().shape({
    username: isUpdate
      ? yup
          .string()
          .min(2, i18next.t("username_min_2"))
          .notRequired()
      : yup
          .string()
          .min(2, i18next.t("username_min_2"))
          .required(i18next.t("username_required")),

    password: isUpdate
      ? yup
          .string()
          .min(2, i18next.t("password_min_2"))
          .notRequired()
      : yup
          .string()
          .min(2, i18next.t("password_min_2"))
          .required(i18next.t("password_required")),

    first_name: yup.string().required(i18next.t("first_name_required")),

    phone_number: yup.string().notRequired(),

    role: yup
      .string()
      .oneOf(["admin", "data_entry"], i18next.t("invalid_role"))
      .required(i18next.t("role_required")),

    is_active: yup.boolean().required(i18next.t("is_active_required")),
  });

export default userSchema;