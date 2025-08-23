import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useDebounce } from "use-debounce";
import { limit } from "./../categories/pages/CategoriesTable";
import dateFormatter from "../../utils/dateFormatter";
import APIClient from "../../utils/ApiClient";
import Table from "../../components/table/Table";

const columns = [
  {
    name: "firstName",
    headerName: "firstName",
    sort: true,
  },
  {
    name: "lastName",
    headerName: "lastName",
    sort: true,
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
    name: "createdAt",
    headerName: "created at",
    getCell: ({ row }) => dateFormatter(row.createdAt, "justYear"),
    sort: true,
  },
  {
    name: "updatedAt",
    headerName: "updatedAt",
    getCell: ({ row }) => dateFormatter(row.updatedAt, "justYear"),
    hidden: true,
    sort: true,
  },
  {
    name: "createdBy",
    headerName: "createdBy",
    allowedTo: ["admin"],
    getCell: ({ row }) => row.createdBy?.username,
  },
  {
    name: "option",
    headerName: "options",
    getCell: ({ row, setSelectedItems, setIsPopUpOpen }) => (
      <>
        <i
          onClick={() => {
            setIsPopUpOpen(true);
            setSelectedItems(new Set([row._id]));
          }}
          className="fa-solid fa-trash-can"
          title="delete"
        />
        <Link to={`/update_category/${row._id}`} title="update">
          <i className="fa-solid fa-pen-to-square" />
        </Link>
      </>
    ),
  },
];
export const categoriesQueryKey = "users";
const apiClient = new APIClient("users");
const UsersTable = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const queryKey = useMemo(
    () => [categoriesQueryKey, page, JSON.stringify(sort), debouncedSearch],
    [page, sort, debouncedSearch]
  );
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => apiClient.getAll({ page, sort, limit, search }),
    keepPreviousData: true,
  });

  return (
    <Table
      colmuns={columns}
      loading={isLoading}
      selectable
      currentPage={page}
      setPage={setPage}
      data={data?.data}
      dataLength={data?.totalCount}
      setSort={setSort}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
      delelteEndPoint="users"
      queryKey={categoriesQueryKey}
      heading="users"
      setSearch={setSearch}
      hidefilterIcon
    ></Table>
  );
};

export default UsersTable;
