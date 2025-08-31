import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import IconButton from "src/components/buttons/IconButton";
import "./backup.css";
import ConfirmPopUp from "src/components/popup/ConfirmPopUp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replaceBackup, restoreBackup, uploadBackUp } from "./api";
const AddBackUps = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);

  const handleSelectFile = useCallback((e) => {
    const selectedFile = e.target.files[0];
    const isJson =
      selectedFile.type === "application/json" ||
      selectedFile.name.toLowerCase().endsWith(".json");
    if (selectedFile && isJson) {
      setFile(selectedFile);
    } else {
      toast.error("Please select a valid JSON file.");
      e.target.value = "";
    }
  }, []);

  const [openPopup, setOpenPopup] = useState(false);
  const handleCancelFile = useCallback(() => {
    setFile(null);
    setOpenPopup(false);
  }, []);

  const handleConfirm = useMutation({
    mutationKey: ["backup"],
    mutationFn: () => uploadBackUp(file),
    onSuccess: (data) => {
      if (openPopup === "replace") replaceBackup(data);
      else if (openPopup === "restore") restoreBackup(data);
      queryClient.clear();
      handleCancelFile();
    },
  });

  return (
    <>
      <IconButton title="Select Backup" color="secondry-color">
        <label htmlFor="backup">
          <i className="fa-solid fa-folder-open" />
          <input
            type="file"
            hidden
            id="backup"
            accept="application/json"
            onClick={(e) => {
              e.currentTarget.value = "";
            }}
            onChange={handleSelectFile}
          />
        </label>
      </IconButton>
      {file && (
        <article className="backup-select-option">
          <h3 onClick={() => setOpenPopup("replace")}> replace </h3>
          <h3 onClick={() => setOpenPopup("restore")}> restore </h3>
          <span onClick={handleCancelFile}>cancel</span>
        </article>
      )}
      <ConfirmPopUp
        isOpen={openPopup}
        onClose={handleCancelFile}
        heading={`are yo sure you want to ${openPopup}`}
        onConfirm={handleConfirm.mutate}
      />
    </>
  );
};

export default AddBackUps;
