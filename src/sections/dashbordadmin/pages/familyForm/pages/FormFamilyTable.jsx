import { useQuery } from "@tanstack/react-query";
import Table from "/src/components/table/Table";
import { memo, useMemo, useState } from "react";
import dateFormatter from "src/utils/dateFormatter";
import { Link } from "react-router";
import APIClient from "src/utils/ApiClient";
import { useDebounce } from "use-debounce";
import { FormFamilyQueryKey } from "./AddFamilyForm";
import FamilyTableFilters from "../components/FamilyTableFilters";
import { useTranslation } from "react-i18next";

const apiClient = new APIClient("family-forms");

const FormFamilyTable = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());
  const { t } = useTranslation(); 
  const [filters, setFilters] = useState({
    created_by: "",
    updated_by: "",
    city: "",
    commune: "",
    council: "",
    village_town: "",
    economic_status: "",
    ethnic_component: "",
    members_count: "",
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

  const columns = [
    {
      name: "form_number",
      headerName: t("form_number"),
      sort: true,
    },
    {
      name: "family_code",
      headerName: t("FamilyCode"),
      getCell: ({ row }) => (
        <Link className="visit-text" to={`/family_form/${row.id}`}>
          {t("FamilyCode")}
        </Link>
      ),
      sort: true,
    },
    {
      name: "head_of_family",
      headerName: t("FamilyName"),
      getCell: ({ row }) => row.head_of_family?.full_name,
      sort: true,
    },
    {
      name: "members_count",
      headerName: t("members_count"),
      sort: true,
    },
    {
      name: "city",
      headerName: t("city"),
      getCell: ({ row }) => row.city?.name,
    },
    {
      name: "created_at",
      headerName: t("created_at"),
      getCell: ({ row }) => dateFormatter(row.created_at, "fullDate"),
      sort: true,
    },
    {
      name: "created_by",
      headerName: t("created_by"),
      getCell: ({ row }) => row.created_by?.name,
    },
    {
      name: "updated_at",
      headerName: t("updated_at"),
      getCell: ({ row }) => dateFormatter(row.updated_at, "fullDate"),
      sort: true,
      hidden: true,
    },
    {
      name: "updated_by",
      headerName: t("updated_by"),
      getCell: ({ row }) => row.updated_by?.name,
      hidden: true,
    },
    {
      name: "option",
      headerName: t("options"),
      getCell: ({ row, setSelectedItems, setIsPopUpOpen }) => (
        <div className="table-actions">
          <i
            onClick={() => {
              setIsPopUpOpen(true);
              setSelectedItems(new Set([row.id]));
            }}
            className="fa-solid fa-trash-can icon-delete"
            title={t("delete")}
          />
          <Link to={`/update_family_form/${row.id}`} title={t("update")}>
            <i className="fa-solid fa-pen-to-square icon-edit" />
          </Link>
          <Link to={`/family_form/${row.id}`} title={t("view")}>
            <i className="fa-regular fa-eye icon-eye" />
          </Link>
        </div>
      ),
    },
  ];

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
        heading={t("information")}
        addDataRoute="add_family_form"
        setSearch={setSearch}
      >
        <FamilyTableFilters filters={filters} setFilters={setFilters} />
      </Table>
    </>
  );
};

export default memo(FormFamilyTable);