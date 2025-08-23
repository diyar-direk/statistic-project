import { memo, useMemo } from "react";

const TableFiltersContainer = ({ isOpen, children }) => {
  const containerClassName = useMemo(
    () => `filters-container ${isOpen ? "open" : ""}`,
    [isOpen]
  );
  return <div className={containerClassName}> {children} </div>;
};

export default memo(TableFiltersContainer);
