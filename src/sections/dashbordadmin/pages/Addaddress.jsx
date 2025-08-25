
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import APIClient from "../../../utils/ApiClient";
import Table from "../../../components/table/Table";
import Input from "../../../components/inputs/Input";
import { useFormik } from "formik";
import FormContainer from "../../../components/formContainer/FormContainer";
import * as Yup from "yup";

const GenericLocationTable = ({ endpoint, heading, label, schema }) => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const [isUpdate, setIsUpdate] = useState(false);

  const apiClient = new APIClient("councils/");
  const queryKey = useMemo(
    () => [endpoint, page, JSON.stringify(sort), debouncedSearch],
    [endpoint, page, sort, debouncedSearch]
  );

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => apiClient.getAll({ page, sort, page_size: 10, search }),
    keepPreviousData: true,
  });

  const queryClient = useQueryClient();

  const addNewItem = useMutation({
    mutationKey: queryKey,
    mutationFn: (data) => apiClient.addData({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setIsUpdate(false);
    },
  });

  const updateItem = useMutation({
    mutationKey: queryKey,
    mutationFn: (data) => apiClient.updateData({ id: isUpdate?.id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setIsUpdate(false);
    },
  });

  const handleDelete = useMutation({
    mutationKey: queryKey,
    mutationFn: (id) => apiClient.deleteOne({ id: Array.from(id)[0] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setIsUpdate(false);
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { name: isUpdate.name || "" },
    validationSchema: schema,
    onSubmit: (values) => {
      (isUpdate ? updateItem : addNewItem).mutate(values, {
        onSuccess: () => {
          formik.resetForm();
          queryClient.invalidateQueries({ queryKey: [endpoint] });
          setIsUpdate(false);
        },
      });
    },
  });

  const handleCancelForm = useCallback(() => {
    setIsUpdate(false);
    formik.resetForm();
  }, [formik]);

  return (
    <div className="table-with-form-container">
      <FormContainer
        onSubmit={formik.handleSubmit}
        buttonProps={{ isSending: addNewItem.isPending || updateItem.isPending }}
        header={isUpdate ? `تعديل ${label}` : `إضافة ${label} جديد`}
        isUpdate={isUpdate}
        oncancel={handleCancelForm}
      >
        <Input
          placeholder={`أدخل اسم ${label}...`}
          title={`اسم ${label}`}
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          errorText={formik.touched.name && formik.errors.name}
        />
      </FormContainer>
      <Table
        columns={[
          { name: "name", headerName: `اسم ${label}`, sort: true },
          {
            name: "option",
            headerName: "الخيارات",
            getCell: ({ row, setSelectedItems, setIsPopUpOpen, returnRow }) => (
              <>
                <i
                  onClick={() => {
                    setIsPopUpOpen(true);
                    setSelectedItems(new Set([row.id]));
                  }}
                  className="fa-solid fa-trash-can"
                  title="حذف"
                />
                <i
                  className="fa-solid fa-pen-to-square"
                  title="تعديل"
                  onClick={() => returnRow(row)}
                />
              </>
            ),
          },
        ]}
        loading={isLoading}
        currentPage={page}
        setPage={setPage}
        data={data?.results}
        dataLength={data?.count}
        setSort={setSort}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        deleteEndPoint={endpoint}
        queryKey={endpoint}
        heading={heading}
        setSearch={setSearch}
        hidefilterIcon
        returnRow={setIsUpdate}
        deleteFn={handleDelete.mutate}
      />
    </div>
  );
};

const LocationManager = () => {
  const citySchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "اسم المدينة قصير جدًا")
      .max(100, "اسم المدينة طويل جدًا")
      .required("اسم المدينة مطلوب"),
  });

  const villageTownSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "اسم البلدة قصير جدًا")
      .max(100, "اسم البلدة طويل جدًا")
      .required("اسم البلدة مطلوب"),
  });

  const councilSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "اسم المجلس قصير جدًا")
      .max(100, "اسم المجلس طويل جدًا")
      .required("اسم المجلس مطلوب"),
  });

  const communeSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "اسم الكومين قصير جدًا")
      .max(100, "اسم الكومين طويل جدًا")
      .required("اسم الكومين مطلوب"),
  });

  return (
    <div>
      <h1>إدارة المواقع</h1>
      <div>
        <h2>المدن</h2>
        <GenericLocationTable
          endpoint="cities"
          heading="المدن"
          label="المدينة"
          schema={citySchema}
        />
      </div>
      <div>
        <h2>البلدات</h2>
        <GenericLocationTable
          endpoint="villagetowns"
          heading="البلدات"
          label="البلدة"
          schema={villageTownSchema}
        />
      </div>
      <div>
        <h2>المجالس</h2>
        <GenericLocationTable
          endpoint="councils"
          heading="المجالس"
          label="المجلس"
          schema={councilSchema}
        />
      </div>
      <div>
        <h2>الكومينات</h2>
        <GenericLocationTable
          endpoint="communes"
          heading="الكومينات"
          label="الكومين"
          schema={communeSchema}
        />
      </div>
    </div>
  );
};

export default LocationManager;
