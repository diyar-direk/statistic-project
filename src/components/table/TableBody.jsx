import { memo, useCallback, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router";
import { downloadBackUp } from "../../sections/dashbordadmin/pages/backup/api";

const TableBody = ({
  loading,
  column,
  data,
  selectable,
  selectedItems,
  setSelectedItems,
  setIsPopUpOpen,
  isPopUpOpen,
  returnRow,
  translate,
}) => {
  const { user } = useAuth();
  const role = user?.role;

  const [isCustomPopUpOpen, setIsCustomPopUpOpen] = useState(false);

  const selectRowId = useCallback(
    (id) => {
      setSelectedItems((prev) => {
        const newIds = new Set(prev);
        if (newIds.has(id)) newIds.delete(id);
        else newIds.add(id);
        return newIds;
      });
    },
    [setSelectedItems]
  );

  const renderCell = useCallback(
    (column, row) => {
      if (column.getCell) {
        return column.getCell({
          row,
          setSelectedItems,
          user,
          setIsPopUpOpen,
          isPopUpOpen,
          isCustomPopUpOpen,
          setIsCustomPopUpOpen,
          returnRow,
          translate,
          downloadBackUp,
        });
      }
      return row[column.name];
    },
    [
      setSelectedItems,
      user,
      setIsPopUpOpen,
      isPopUpOpen,
      isCustomPopUpOpen,
      setIsCustomPopUpOpen,
      returnRow,
      translate,
    ]
  );
  const location = useLocation();

  const rows = useMemo(
    () =>
      data?.map((row, i) => (
        <tr key={row.id || i}>
          {selectable && (
            <td>
              {!(location.pathname.includes("users") && row.id === user.id) && (
                <div
                  onClick={() => selectRowId(row.id || row.filename)}
                  className={`checkbox ${
                    selectedItems?.has(row.id || row.filename) ? "active" : ""
                  }`}
                ></div>
              )}
            </td>
          )}
          {column?.map(
            (column) =>
              !column.hidden &&
              (!column.allowedTo || column.allowedTo?.includes(user.role)) && (
                <td key={column.name} className={column.className}>
                  {renderCell(column, row)}
                </td>
              )
          )}
        </tr>
      )),
    [
      data,
      column,
      renderCell,
      selectable,
      selectedItems,
      selectRowId,
      user,
      location,
    ]
  );

  const visibleColumnsCount = useMemo(() => {
    return (
      column?.filter(
        (col) => !col.hidden && (!col.allowedTo || col.allowedTo.includes(role))
      ).length + (selectable ? 1 : 0)
    );
  }, [column, role, selectable]);

  return (
    <tbody className={loading || rows ? "relative" : ""}>
      {loading ? (
        <tr>
          <td className="table-loading" colSpan={visibleColumnsCount}>
            loading ...
          </td>
        </tr>
      ) : rows?.length > 0 ? (
        <>{rows}</>
      ) : (
        <tr>
          <td className="no-data" colSpan={visibleColumnsCount}>
            no data found
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default memo(TableBody);
