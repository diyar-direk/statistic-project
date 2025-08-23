import { memo, useCallback, useMemo, useState } from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import "./table.css";
import Paginations from "./Paginations";
import ConfirmPopUp from "./../popup/ConfirmPopUp";
import APIClient from "../../utils/ApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TableToolBar from "./TableToolBar";

/**
 * @typedef TableProps
 * @property {Array<object>} colmuns أعمدة الجدول
 * @property {boolean} selectable هل يمكن تحديد الصفوف
 * @property {boolean} loading حالة التحميل
 * @property {boolean} hidefilterIcon
 * @property {number} currentPage رقم الصفحة الحالية
 * @property {(page: number) => void} setPage دالة لتغيير الصفحة
 * @property {Array<object>} data بيانات الجدول
 * @property {number} dataLength عدد البيانات الكلي (لأجل الـ Pagination)
 * @property {(sort: any) => void} setSort دالة لتحديد الفرز
 * @property {(search: string) => void} setSearch دالة للبحث
 * @property {Set<string|number>} selectedItems العناصر المحددة
 * @property {(items: Set<string|number>) => void} setSelectedItems دالة لتغيير العناصر المحددة
 * @property {string} delelteEndPoint رابط الـ API لحذف البيانات
 * @property {string} queryKey مفتاح الكاش الخاص بـ react-query
 * @property {string} heading عنوان الجدول
 * @property {boolean} hideDeleteIconOnToolBar إخفاء أيقونة الحذف من شريط الأدوات
 * @property {string} [addDataRoute] رابط إضافة البيانات (اختياري)
 * @property {Array<React.ReactNode>} [addIcons] أيقونات إضافية على شريط الأدوات
 * @property {React.ReactNode} [children] عناصر إضافية يتم عرضها داخل الـ TableToolBar
 */

/**
 * @param {TableProps} props
 */

const Table = ({
  colmuns,
  selectable,
  loading,
  currentPage,
  setPage,
  data,
  dataLength,
  setSort,
  selectedItems,
  setSelectedItems,
  delelteEndPoint,
  queryKey,
  heading,
  hideDeleteIconOnToolBar,
  addDataRoute,
  addIcons,
  children,
  setSearch,
  hidefilterIcon,
}) => {
  const [columnsState, setColumnsState] = useState(colmuns || []);

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const handleDeletePopUpClose = useCallback(() => {
    setSelectedItems(new Set());
    setIsPopUpOpen(false);
  }, [setSelectedItems]);

  const apiClient = useMemo(
    () => new APIClient(delelteEndPoint),
    [delelteEndPoint]
  );

  const queryclient = useQueryClient();

  const handleDelete = useMutation({
    mutationKey: [queryKey],
    mutationFn: (data) => apiClient.deleteAll({ ids: data }),
    onSuccess: () => {
      if (data?.length === selectedItems?.size) {
        setPage((prev) => (prev === 1 ? prev : prev - 1));
      }
      setIsPopUpOpen(false);
      setSelectedItems(new Set());
      queryclient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
  });

  const handleConfirmDelete = useCallback(() => {
    handleDelete.mutate([...selectedItems]);
  }, [handleDelete, selectedItems]);

  return (
    <>
      <div className="table-container">
        <TableToolBar
          heading={heading}
          columns={columnsState}
          setColumns={setColumnsState}
          hideDeleteIcon={hideDeleteIconOnToolBar}
          addDataRoute={addDataRoute}
          selectedItems={selectedItems}
          setIsPopUpOpen={setIsPopUpOpen}
          addIcons={addIcons}
          children={children}
          setSearch={setSearch}
          hidefilterIcon={hidefilterIcon}
        />

        <div className="table">
          <table>
            <TableHeader
              selectable={selectable}
              setSelectedItems={setSelectedItems}
              column={columnsState}
              setSort={setSort}
              data={data}
              selectedItems={selectedItems}
            />
            <TableBody
              loading={loading}
              column={columnsState}
              data={data}
              selectable={selectable}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              setIsPopUpOpen={setIsPopUpOpen}
              isPopUpOpen={isPopUpOpen}
            />
          </table>
        </div>
        <Paginations
          currentPage={currentPage}
          dataLength={dataLength}
          setPage={setPage}
          setSelectedItems={setSelectedItems}
        />
      </div>

      <ConfirmPopUp
        isOpen={isPopUpOpen}
        onClose={handleDeletePopUpClose}
        onConfirm={handleConfirmDelete}
        confirmButtonProps={{ isSending: handleDelete.isLoading }}
      />
    </>
  );
};

export default memo(Table);
