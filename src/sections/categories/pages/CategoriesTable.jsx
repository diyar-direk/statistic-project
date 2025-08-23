import { useQuery } from "@tanstack/react-query";
import Table from "./../../../components/table/Table";
import { useMemo, useState } from "react";
import dateFormatter from "./../../../utils/dateFormatter";
import { Link } from "react-router";
import APIClient from "./../../../utils/ApiClient";
import PopUp from "../../../components/popup/PopUp";
import CategoriesTableFilters from "../components/CategoriesTableFilters";
import { useDebounce } from "use-debounce";

const columns = [
  {
    name: "name",
    headerName: "name",
    sort: true,
    allowedTo: ["user", "admin"],
  },
  {
    name: "createdAt",
    headerName: "created at",
    getCell: ({ row, isCustomPopUpOpen, setIsCustomPopUpOpen }) => {
      return (
        <>
          <PopUp
            isOpen={isCustomPopUpOpen}
            onClose={() => setIsCustomPopUpOpen(false)}
          >
            <p>{dateFormatter(row.createdAt, "fullDate")}</p>
          </PopUp>
          <p onClick={() => setIsCustomPopUpOpen(true)}>
            {dateFormatter(row.createdAt, "justYear")}
          </p>
        </>
      );
    },
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
    getCell: ({ row, role, setSelectedItems, setIsPopUpOpen }) =>
      role === "admin" && (
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
export const limit = 10;
export const categoriesQueryKey = "categories";
const apiClient = new APIClient("categories");
const CategoriesTable = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    createdBy: "",
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const queryKey = useMemo(
    () => [
      categoriesQueryKey,
      page,
      JSON.stringify(sort),
      JSON.stringify(filters),
      debouncedSearch,
    ],
    [page, sort, filters, debouncedSearch]
  );
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => apiClient.getAll({ page, sort, filters, limit, search }),
    keepPreviousData: true,
  });

  return (
    <>
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
        delelteEndPoint="categories"
        queryKey={categoriesQueryKey}
        heading="information"
        addDataRoute="add_category"
        setSearch={setSearch}
      >
        <CategoriesTableFilters filters={filters} setFilters={setFilters} />
      </Table>
    </>
  );
};

export default CategoriesTable;
