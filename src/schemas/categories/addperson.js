import * as Yup from "yup";
const addperson = Yup.object({
  name: Yup.string()
    .min(2, " name must be more than 2 carectors")
    .required(" name is required"),
  fatherName: Yup.string()
  .required("fathername is required"),
});
export default addperson;
