import * as Yup from "yup";
const categoriesSchema = Yup.object({
  name: Yup.string()
    .min(2, "category name must be more than 2 carectors")
    .required("category name is required"),
  form_number: Yup.number().notRequired(),
});
export default categoriesSchema;
