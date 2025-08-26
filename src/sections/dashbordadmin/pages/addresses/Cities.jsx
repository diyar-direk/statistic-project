import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useFormik } from "formik";
import APIClient from "../../../../utils/ApiClient";
import * as yup from "yup";
import FormContainer from "./../../../../components/formContainer/FormContainer";
import Input from "src/components/inputs/Input";
import Table from "src/components/table/Table";
import { useAuth } from "src/context/AuthContext";
const columns = [
  {
    name: "name",
    headerName: "name",
    sort: true,
  },
  {
    name: "option",
    headerName: "options",
    getCell: ({ row, setSelectedItems, setIsPopUpOpen, returnRow }) => (
      <>
      <i
          onClick={() => {
            setIsPopUpOpen(true);
            setSelectedItems(new Set([row.id]));
          }}
          className="fa-solid fa-trash-can icon-delete"
          title="delete"
        />
        <i
          className="fa-solid fa-pen-to-square icon-edit"
          title="update"
          onClick={() => returnRow(row)}
        />

      </>
    ),
  },
];
const apiClient = new APIClient("cities/");
export const citiesQueryKey = "cities";
const Cities = () => {
  const { user } = useAuth();
  const role = user?.role;
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const queryKey = useMemo(
    () => [citiesQueryKey, page, JSON.stringify(sort), debouncedSearch],
    [page, sort, debouncedSearch]
  );
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => apiClient.getAll({ page, sort, page_size: 10, search }),
    keepPreviousData: true,
  });

  const queryClient = useQueryClient();

  const [isUpdate, setIsUpdate] = useState(false);

  const addNewUser = useMutation({
    mutationKey: queryKey,
    mutationFn: (data) => apiClient.addData({ data }),
  });
  const updateUser = useMutation({
    mutationKey: queryKey,
    mutationFn: (data) => apiClient.updateData({ id: isUpdate?.id, data }),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: isUpdate.name || "",
    },
    validationSchema: yup.object({
      name: yup.string().min(2, "name must be more than 2 characters"),
    }),
    onSubmit: (values) => {
      (isUpdate ? updateUser : addNewUser).mutate(values, {
        onSuccess: () => {
          formik.resetForm();
          queryClient.invalidateQueries({ queryKey: [citiesQueryKey] });
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
        buttonProps={{ isSending: addNewUser.isPending }}
        header="add city"
        isUpdate={isUpdate}
        oncancel={handleCancelForm}
      >
        <Input
          placeholder="write city name...."
          title="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          errorText={formik.touched.name && formik.errors.name}
        />
      </FormContainer>
      <Table
        colmuns={columns}
        loading={isLoading}
        currentPage={page}
        setPage={setPage}
        data={data?.data}
        dataLength={data?.totalCount}
        setSort={setSort}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        deleteEndPoint="cities/bulk-delete/"
        queryKey={citiesQueryKey}
        heading="cities"
        setSearch={setSearch}
        hidefilterIcon
        returnRow={setIsUpdate}
        selectable={role === "admin"}
      ></Table>
    </div>
  );
};

export default Cities;
