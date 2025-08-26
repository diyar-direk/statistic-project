
import { Link } from "react-router";
import IconButton from "../buttons/IconButton";
import { memo, useCallback, useMemo, useState } from "react";
import TableFiltersContainer from "../tableFilters/TableFiltersContainer";

const TableToolBar = ({
  children,
  heading,
  columns,
  setColumns,
  hideDeleteIcon,
  addDataRoute,
  selectedItems,
  setIsPopUpOpen,
  addIcons,
  setSearch,
  hidefilterIcon,
}) => {
 
  const handleDeleteClick = useCallback(
    () => setIsPopUpOpen(true),
    [setIsPopUpOpen]
  );
  const deleteClassName = useMemo(
    () => `fa-solid fa-trash ${selectedItems?.size > 0 ? "color-red" : ""}`,
    [selectedItems.size]
  );
  const [filterArea, setFiltersArea] = useState(false);
  const toggelFiltersArea = useCallback(
    () => setFiltersArea((prev) => !prev),
    []
  );
  const filtersIconColor = useMemo(
    () => (filterArea ? "main" : "secondry-color"),
    [filterArea]
  );

  return (
    <>
      <header className="table-toolbar">
        {heading && <h2>{heading}</h2>}
        <div className="icons-container">
          <label htmlFor="search">
            <input
              type="text"
              id="search"
              placeholder="search for"
              onInput={(e) => setSearch(e.target.value)}
            />
            <i className="fa-solid fa-magnifying-glass" />
          </label>
          {!hideDeleteIcon && (
            <IconButton
              placement="bottom"
              disabled={selectedItems?.size === 0}
              title="delete"
              color="secondry-color"
            >
              <i onClick={handleDeleteClick} className={deleteClassName} />
            </IconButton>
          )}
          {addDataRoute && (
            <IconButton placement="bottom" title="add" color="secondry-color">
              <Link to={addDataRoute} className="fa-solid fa-plus" />
            </IconButton>
          )}
          {!hidefilterIcon && (
            <IconButton
              onClick={toggelFiltersArea}
              placement="bottom"
              title="filters"
              color={filtersIconColor}
            >
              <i className="fa-solid fa-filter" />
            </IconButton>
          )}
          {addIcons}
          <ShowRows columns={columns} setColumns={setColumns} />
        </div>
      </header>
      {!hidefilterIcon && (
        <TableFiltersContainer isOpen={filterArea}>
          {children}
        </TableFiltersContainer>
      )}
    </>
  );
};

export default memo(TableToolBar);


const ShowRows = ({ columns, setColumns }) => {
  const [search, setSearch] = useState("");
  const updateRows = useCallback(
    (column) => {
      const updated = columns?.map((col) =>
        col.name === column.name ? { ...col, hidden: !col.hidden } : col
      );
      setColumns(updated);
    },
    [columns, setColumns]
  );
  const inputs = useMemo(
    () =>
      columns?.map((column) => {
        const headerName =
          typeof column.headerName === "function"
            ? column.headerName()
            : column.headerName;
        return (
          (!column.allowedTo || column.allowedTo?.includes("admin")) &&
          (!search ? (
            <div key={column.name}>
              <input
                type="checkbox"
                id={column.name}
                checked={!column.hidden}
                onChange={() => updateRows(column)}
              />
              <label htmlFor={column.name}>{headerName}</label>
            </div>
          ) : (
            (column.name.includes(search) || headerName.includes(search)) && (
              <div key={column.name}>
                <input
                  type="checkbox"
                  id={column.name}
                  checked={!column.hidden}
                  onChange={() => updateRows(column)}
                />
                <label htmlFor={column.name}>{headerName}</label>
              </div>
            )
          ))
        );
      }),
    [columns, updateRows, search]
  );

  return (
    <div className="show-rows relative">
      <IconButton placement="bottom" title="rows" color="secondry-color">
        <i
          onClick={(e) => {
            e.stopPropagation();
            document
              .querySelector(".show-rows > article")
              .classList.toggle("active");
          }}
          className="fa-solid fa-ellipsis-vertical"
        />
      </IconButton>

      <article onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          className="search"
          placeholder={"search for row"}
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
        {inputs}
        <h4>
          rows available: <span> {inputs?.length}</span>
        </h4>
      </article>
    </div>
  );
};

document.addEventListener("click", () => {
  const rowDiv = document.querySelector(".show-rows > article.active");
  rowDiv?.classList.remove("active");
});
