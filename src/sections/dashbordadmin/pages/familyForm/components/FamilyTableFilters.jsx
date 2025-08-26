import DateFilter from "src/components/tableFilters/DateFilter";
import InputsContainer from "src/components/tableFilters/InputsContainer";
import Input from "src/components/inputs/Input";
import ConfrimAndRestBtns from "src/components/tableFilters/ConfrimAndRestBtns";
import { useFormik } from "formik";

const FamilyTableFilters = ({ filters, setFilters }) => {
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

export default FamilyTableFilters;
