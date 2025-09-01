import { memo, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router";

const TableHeader = ({
  selectable,
  setSelectedItems,
  selectedItems,
  column,
  setSort,
  data,
  translate,
}) => {
  const updateSortStatus = useCallback(
    (column, e) => {
      setSort((prev) => {
        const prevStatus = prev[column.name]?.startsWith("-");
        e.target.parentElement.className = prevStatus ? "a-z" : "z-a";
        return {
          ...prev,
          [column.name]: `${prevStatus ? "" : "-"}${column.name}`,
        };
      });
    },
    [setSort]
  );
  const isAllSelected =
    selectedItems?.size === data?.length && data?.length !== 0;
  const { user } = useAuth();
  const role = user?.role;
  const location = useLocation();
  const header = useMemo(
    () =>
      column?.map(
        (th) =>
          !th.hidden &&
          (!th.allowedTo || th?.allowedTo?.includes(role)) && (
            <th key={th.headerName}>
              {typeof th.headerName === "function"
                ? th.headerName(translate)
                : th.headerName}
              {th.sort && (
                <i
                  className="fa-solid fa-chevron-right sort"
                  onClick={(e) => {
                    updateSortStatus(th, e);
                  }}
                ></i>
              )}
            </th>
          )
      ),
    [column, updateSortStatus, role, translate]
  );

  const selectAll = useCallback(() => {
    if (!data) return;

    setSelectedItems((prev) => {
      const allIds = location.pathname.includes("users")
        ? data.filter((item) => item.id !== user?.id).map((item) => item.id)
        : data.map((item) => item.id || item.filename);

      if (prev.size === allIds.length) {
        return new Set();
      }

      return new Set(allIds);
    });
  }, [data, user, location.pathname, setSelectedItems]);

  return (
    <thead>
      <tr>
        {selectable && (
          <th>
            <div
              className={`${isAllSelected ? "active" : ""} checkbox select-all`}
              onClick={selectAll}
            />
          </th>
        )}
        {header}
      </tr>
    </thead>
  );
};

export default memo(TableHeader);
