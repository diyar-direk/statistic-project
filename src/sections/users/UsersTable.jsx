import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import APIClient from "../../utils/ApiClient";
import Table from "../../components/table/Table";
import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import FormContainer from "../../components/formContainer/FormContainer";
import userSchema from "./../../schemas/userSchema";

const columns = [
  {
    name: "first_name",
    headerName: "name",
    sort: true,
  },
  {
    name: "phone_number",
    headerName: "phone_number",
  },
  {
    name: "role",
    headerName: "role",
  },
  {
    name: "username",
    headerName: "username",
  },
  {
    name: "is_active",
    headerName: "account status",
    getCell: ({ row }) => (row.is_active ? "Active" : "Inactive"),
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
          className="fa-solid fa-trash-can"
          title="delete"
        />
        <i
          className="fa-solid fa-pen-to-square"
          title="update"
          onClick={() => returnRow(row)}
        />
      </>
    ),
  },
];
const apiClient = new APIClient("auth/accounts/");
const UsersTable = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const queryKey = useMemo(
    () => ["users", page, JSON.stringify(sort), debouncedSearch],
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
      username: "",
      password: "",
      first_name: isUpdate.first_name || "",
      phone_number: isUpdate.phone_number || "",
      role: isUpdate.role || "",
      is_active: isUpdate.is_active || false,
    },
    validationSchema: () => userSchema(isUpdate),
    onSubmit: (values) => {
      const sendedData = values;
      if (isUpdate) {
        delete sendedData.username;
        delete sendedData.password;
      }
      (isUpdate ? updateUser : addNewUser).mutate(sendedData, {
        onSuccess: () => {
          formik.resetForm();
          queryClient.invalidateQueries({ queryKey: ["users"] });
          setIsUpdate(false);
        },
      });
    },
  });
  const roleOptions = useMemo(
    () => [
      { text: "Admin", value: "admin" },
      { text: "data entry", value: "data_entry" },
    ],
    []
  );
  const isActiveOptions = useMemo(
    () => [
      { text: "Active", value: true },
      { text: "Inactive", value: false },
    ],
    []
  );

  const handleCancelForm = useCallback(() => {
    setIsUpdate(false);
    formik.resetForm();
  }, [formik]);

  const handleDelete = useMutation({
    mutationKey: queryKey,
    mutationFn: (id) => apiClient.deleteOne({ id: Array.from(id)[0] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsUpdate(false);
    },
  });

  return (
    <div className="table-with-form-container">
      <FormContainer
        onSubmit={formik.handleSubmit}
        buttonProps={{ isSending: addNewUser.isPending }}
        header="create user"
        isUpdate={isUpdate}
        oncancel={handleCancelForm}
      >
        {!isUpdate && (
          <>
            <Input
              placeholder="write your username...."
              title="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              errorText={formik.touched.username && formik.errors.username}
            />

            <Input
              placeholder="*********"
              title="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              errorText={formik.touched.password && formik.errors.password}
              type="password"
            />
          </>
        )}
        <SelectOptionInput
          label="role"
          placeholder={formik.values.role || "select role"}
          options={roleOptions}
          errorText={formik.touched.role && formik.errors.role}
          onSelectOption={(option) =>
            formik.setFieldValue("role", option.value)
          }
        />
        <Input
          placeholder="write your first name...."
          title="name"
          name="first_name"
          value={formik.values.first_name}
          onChange={formik.handleChange}
          errorText={formik.touched.first_name && formik.errors.first_name}
        />
        <Input
          placeholder="write your phone number...."
          title="phone number"
          name="phone_number"
          value={formik.values.phone_number}
          onChange={formik.handleChange}
          errorText={formik.touched.phone_number && formik.errors.phone_number}
        />
        <SelectOptionInput
          label="account status"
          placeholder={formik.values.is_active ? "Active" : "Inactive"}
          options={isActiveOptions}
          errorText={formik.touched.is_active && formik.errors.is_active}
          onSelectOption={(option) =>
            formik.setFieldValue("is_active", option.value)
          }
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
        deleteEndPoint="users"
        queryKey="users"
        heading="users"
        setSearch={setSearch}
        hidefilterIcon
        returnRow={setIsUpdate}
        deleteFn={handleDelete.mutate}
      ></Table>
    </div>
  );
};

export default UsersTable;
