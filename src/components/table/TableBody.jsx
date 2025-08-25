import { memo, useCallback, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

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
}) => {
  const { user } = useAuth();
  const { role } = user;

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
          role,
          setIsPopUpOpen,
          isPopUpOpen,
          isCustomPopUpOpen,
          setIsCustomPopUpOpen,
          returnRow,
        });
      }
      return row[column.name];
    },
    [
      setSelectedItems,
      role,
      setIsPopUpOpen,
      isPopUpOpen,
      isCustomPopUpOpen,
      setIsCustomPopUpOpen,
      returnRow,
    ]
  );

  const rows = useMemo(
    () =>
      data?.map((row) => (
        <tr key={row.id}>
          {selectable && (
            <td>
              <div
                onClick={() => selectRowId(row.id)}
                className={`checkbox ${
                  selectedItems?.has(row.id) ? "active" : ""
                }`}
              ></div>
            </td>
          )}
          {column?.map(
            (column) =>
              !column.hidden &&
              (!column.allowedTo || column.allowedTo?.includes(role)) && (
                <td key={column.name} className={column.className}>
                  {renderCell(column, row)}
                </td>
              )
          )}
        </tr>
      )),
    [data, column, renderCell, selectable, selectedItems, role, selectRowId]
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
