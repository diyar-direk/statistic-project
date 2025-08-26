import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useFormik } from "formik";
import APIClient from "../../../../utils/ApiClient";
import * as yup from "yup";
import FormContainer from "./../../../../components/formContainer/FormContainer";
import Input from "src/components/inputs/Input";
import Table from "src/components/table/Table";
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
          className="fa-solid fa-trash-can icon-delete "
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
export const communesQueryKey = "communes";
const apiClient = new APIClient("communes/");
const Communes = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const queryKey = useMemo(
    () => [communesQueryKey, page, JSON.stringify(sort), debouncedSearch],
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
          queryClient.invalidateQueries({ queryKey: [communesQueryKey] });
          setIsUpdate(false);
        },
      });
    },
  });

  const handleCancelForm = useCallback(() => {
    setIsUpdate(false);
    formik.resetForm();
  }, [formik]);

  const handleDelete = useMutation({
    mutationKey: queryKey,
    mutationFn: (id) => apiClient.deleteOne({ id: Array.from(id)[0] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [communesQueryKey] });
      setIsUpdate(false);
    },
  });

  return (
    <div className="table-with-form-container">
      <FormContainer
        onSubmit={formik.handleSubmit}
        buttonProps={{ isSending: addNewUser.isPending }}
        header="add commune"
        isUpdate={isUpdate}
        oncancel={handleCancelForm}
      >
        <Input
          placeholder="write commune name...."
          title="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          errorText={formik.touched.ame && formik.errors.name}
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
        deleteEndPoint="communes/"
        queryKey={communesQueryKey}
        heading="communes"
        setSearch={setSearch}
        hidefilterIcon
        returnRow={setIsUpdate}
        deleteFn={handleDelete.mutate}
      ></Table>
    </div>
  );
};

export default Communes;
