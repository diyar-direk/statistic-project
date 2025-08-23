import { memo } from "react";
import Input from "../inputs/Input";
import InputsContainer from "./InputsContainer";

const DateFilter = ({ values, handleChange }) => {
  return (
    <InputsContainer>
      <Input
        title="date from"
        type="date"
        name="from"
        value={values?.from}
        onChange={handleChange}
      />
      <Input
        title="date to"
        type="date"
        name="to"
        value={values?.to}
        onChange={handleChange}
      />
    </InputsContainer>
  );
};

export default memo(DateFilter);
