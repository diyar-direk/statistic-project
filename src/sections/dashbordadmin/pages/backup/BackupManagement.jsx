import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Table from "/src/components/table/Table";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createBackUp, deleteBackUp, getLists } from "./api";
import dateFormatter from "../../../../utils/dateFormatter";
import AddBackUps from "./AddBackUps";
import IconButton from "src/components/buttons/IconButton";
import toast from "react-hot-toast";
import ConfirmPopUp from "../../../../components/popup/ConfirmPopUp";

const columns = [
  {
    name: "filename",
    headerName: "filename",
  },
  {
    name: "created_at",
    headerName: "created_at",
    sort: true,
    getCell: ({ row }) => dateFormatter(row.created_at, "fullDate"),
  },
  {
    name: "size",
    headerName: "size",
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
      isCustomPopUpOpen,
      setIsCustomPopUpOpen,
      replaceOrRestoreBackupFn,
    }) => (
      <div className="table-actions">
        <i
          onClick={() => {
            setIsPopUpOpen(true);
            setSelectedItems(new Set([row.filename]));
          }}
          className="fa-solid fa-trash-can icon-delete pointer"
          title={translate("delete")}
        />
        <i
          className="fa-solid fa-repeat icon-edit pointer"
          title="replace"
          onClick={() => setIsCustomPopUpOpen("replace")}
        />
        <i
          className="fa-solid fa-rotate-right icon-eye pointer"
          title="restore"
          onClick={() => setIsCustomPopUpOpen("restore")}
        />
        <i
          title="download"
          className="fa-solid fa-download pointer"
          onClick={() => downloadBackUp(row.filename)}
        />
        <ConfirmPopUp
          isOpen={isCustomPopUpOpen}
          onClose={() => setIsCustomPopUpOpen(false)}
          heading={`are yo sure you want to ${isCustomPopUpOpen}`}
          onConfirm={() =>
            replaceOrRestoreBackupFn.mutate({
              action: isCustomPopUpOpen,
              file: row.filename,
            })
          }
        />
      </div>
    ),
  },
];
const BackupManagement = () => {
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

  const { t } = useTranslation();
  const deleteFn = useMutation({
    mutationKey: ["backup"],
    mutationFn: (selectedItems) => deleteBackUp([...selectedItems]),
    onSuccess: () => {
      queryclient.invalidateQueries(["backup"]);
    },
  });

  const handleCreateBackup = useMutation({
    mutationFn: createBackUp,
    onMutate: () => {
      toast.loading("Creating backup...", { id: "backup" });
    },
    onSuccess: () => {
      toast.success("Backup created successfully ✅", { id: "backup" });
      queryclient.invalidateQueries(["backup"]);
    },
    onError: () => {
      toast.error("Failed to create backup ❌", { id: "backup" });
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
        heading={t("backup")}
        hidefilterIcon
        selectable
        hideSearchArea
        deleteFn={deleteFn.mutate}
        addIcons={
          <>
            <IconButton
              placement="bottom"
              title="create new back up"
              color="secondry-color"
              onClick={handleCreateBackup.mutate}
            >
              <i className="fa-solid fa-plus" />
            </IconButton>
            <AddBackUps />
          </>
        }
      />
    </>
  );
};

export default memo(BackupManagement);
