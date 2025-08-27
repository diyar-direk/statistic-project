export const handleAddPerson = async (formik, callBack) => {
  const errors = await formik.validateForm();

  if (Object.keys(errors).length > 0) {
    formik.setTouched(
      Object.keys(errors).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );
    return false;
  }
  callBack && callBack();
  return true;
};
