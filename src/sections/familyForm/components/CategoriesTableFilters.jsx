import DateFilter from "../../../components/tableFilters/DateFilter";
import InputsContainer from "../../../components/tableFilters/InputsContainer";
import Input from "../../../components/inputs/Input";
import ConfrimAndRestBtns from "../../../components/tableFilters/ConfrimAndRestBtns";
import { useFormik } from "formik";

const CategoriesTableFilters = ({ filters, setFilters }) => {
  const formik = useFormik({
    initialValues: filters,
  });

  return (
    <>
      <DateFilter values={formik.values} handleChange={formik.handleChange} />
      <InputsContainer>
        <Input title="test filter" />
      </InputsContainer>
      <InputsContainer>
        <Input title="test filter" />
        <Input title="test filter" />
        <Input title="test filter" />
      </InputsContainer>
      <ConfrimAndRestBtns
        values={formik.values}
        resetForm={formik.resetForm}
        setFilters={setFilters}
      />
    </>
  );
};

export default CategoriesTableFilters;
