import { useQuery } from "@tanstack/react-query";
import Table from "/src/components/table/Table";
import { useMemo, useState } from "react";
import dateFormatter from "src/utils/dateFormatter";
import { Link } from "react-router";
import APIClient from "src/utils/ApiClient";
import FamilyTableFilters from "../components/FamilyTableFilters";
import { useDebounce } from "use-debounce";
import { FormFamilyQueryKey } from "./AddFamilyForm";

const columns = [
  {
    name: "form_number",
    headerName: "form_number",
    sort: true,
  },
  {
    name: "head_of_family",
    headerName: "FamilyName",
    getCell: ({ row }) => row.head_of_family?.full_name,
    sort: true,
  },
  {
    name: "created_at",
    headerName: "created at",
    getCell: ({ row }) => dateFormatter(row.created_at, "fullDate"),
    sort: true,
  },

  {
    name: "created_by",
    headerName: "created_by",
    getCell: ({ row }) => row.created_by?.name,
  },

  {
    name: "family_code",
    headerName: "FamilyCode",
    sort: true,
  },

  {
    name: "option",
    headerName: "options",
    getCell: ({ row, setSelectedItems, setIsPopUpOpen }) => (
      <>
        <i
          onClick={() => {
            setIsPopUpOpen(true);
            setSelectedItems(new Set([row.id]));
          }}
          className="fa-solid fa-trash-can icon-delete"
          title="delete"
        />
        <Link to={`/update_category/${row.id}`} title="update">
          <i className="fa-solid fa-pen-to-square" />
        </Link>
      </>
    ),
  },
];

const apiClient = new APIClient("family-forms");
const FormFamilyTable = () => {
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
      FormFamilyQueryKey,
      page,
      JSON.stringify(sort),
      JSON.stringify(filters),
      debouncedSearch,
    ],
    [page, sort, filters, debouncedSearch]
  );
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => apiClient.getAll({ page, sort, filters, search }),
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
        deleteEndPoint="family-forms/bulk-delete/"
        queryKey={FormFamilyQueryKey}
        heading="information"
        addDataRoute="/add_family_form"
        setSearch={setSearch}
      >
        <FamilyTableFilters filters={filters} setFilters={setFilters} />
      </Table>
    </>
  );
};

export default FormFamilyTable;
