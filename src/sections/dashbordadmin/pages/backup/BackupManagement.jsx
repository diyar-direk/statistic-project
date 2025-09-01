import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Table from "/src/components/table/Table";
import { memo, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import IconButton from "src/components/buttons/IconButton";
import { deleteBackUp, getLists } from "./api";
import dateFormatter from "../../../../utils/dateFormatter";

const columns = [
  {
    name: "filename",
    headerName: (t) => t("filename"),
  },
  {
    name: "created_at",
    headerName: (t) => t("created_at"),
    sort: true,
    getCell: ({ row }) => dateFormatter(row.created_at, "fullDate"),
  },
  {
    name: "size",
    headerName: (t) => t("size"),
    sort: true,
  },

  {
    name: "option",
    headerName: (t) => t("options"),
    getCell: ({
      row,
      setSelectedItems,
      setIsPopUpOpen,
      translate,
      downloadBackUp,
    }) => (
      <div className="table-actions">
        <i
          onClick={() => {
            setIsPopUpOpen(true);
            setSelectedItems(new Set([row.filename]));
          }}
          className="fa-solid fa-trash-can icon-delete"
          title={translate("delete")}
        />
        <i className="fa-solid fa-repeat icon-edit" title="replace" />
        <i className="fa-solid fa-rotate-right icon-eye" title="restore" />
        <i
          title="download"
          className="fa-solid fa-download"
          onClick={() => downloadBackUp(row.filename)}
        />
      </div>
    ),
  },
];
const BackupManagement = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const queryclient = useQueryClient();
  const [sort, setSort] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());
  const { data, isLoading } = useQuery({
    queryKey: ["backup", page, sort],
    queryFn: () => getLists({ page, sort }),
    keepPreviousData: true,
    staleTime: 0,
  });

  const deleteFn = useMutation({
    mutationKey: ["backup"],
    mutationFn: (selectedItems) => deleteBackUp([...selectedItems]),
    onSuccess: () => {
      queryclient.invalidateQueries(["backup"]);
    },
  });

  return (
    <>
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
        deleteEndPoint="backup/families/delete/"
        queryKey={"backup"}
        heading={t("information")}
        hidefilterIcon
        selectable
        hideSearchArea
        deleteFn={deleteFn.mutate}
        addIcons={
          <IconButton title="select backup" color="secondry-color">
            <i className="fa-solid fa-folder-open" />
          </IconButton>
        }
      ></Table>
    </>
  );
};

export default memo(BackupManagement);
