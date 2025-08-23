import { memo, useCallback } from "react";
import Button from "../buttons/Button";

const ConfrimAndRestBtns = ({ values, resetForm, setFilters }) => {
  const handleFiltersChange = useCallback(() => {
    setFilters(values);
  }, [setFilters, values]);
  const handleFiltersReset = useCallback(() => {
    resetForm();
  }, [resetForm]);
  return (
    <div>
      <Button btnType="save" onClick={handleFiltersChange}>
        <i className="fa-solid fa-check"></i> save filters
      </Button>
      <Button btnType="delete" onClick={handleFiltersReset}>
        <i className="fa-solid fa-rotate-right"></i> reset filters
      </Button>
    </div>
  );
};

export default memo(ConfrimAndRestBtns);
