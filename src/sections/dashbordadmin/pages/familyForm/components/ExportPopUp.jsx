import PopUp from "src/components/popup/PopUp";
import Button from "src/components/buttons/Button";
import { useCallback } from "react";
import axiosInstance from "src/utils/axios";
import toast from "react-hot-toast";
import qs from "qs";

const ExportPopUp = ({ isOpen, selectedItems, setIsOpen }) => {
  const handleDownloadExcel = useCallback(
    async (onlySelected) => {
      try {
        const params = onlySelected
          ? { ids: JSON.stringify([...selectedItems]) }
          : {};

        const response = await axiosInstance.get("export-family-forms/", {
          responseType: "blob",
          params,
          paramsSerializer: (params) => qs.stringify(params, { encode: false }),
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          onlySelected ? `selected-family-forms.xlsx` : `all-family-forms.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("❌ Error downloading Excel:", error);
        toast.error("Failed to export data");
      } finally {
        setIsOpen(false);
      }
    },
    [selectedItems, setIsOpen]
  );

  return (
    <PopUp
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className="export-popup"
    >
      <h2>Confirm Export</h2>
      <div className="export space-y-2">
        <Button onClick={() => handleDownloadExcel(false)}>
          📂 Export All Forms
        </Button>

        {selectedItems?.size > 0 && (
          <Button
            btnStyleType="outlined"
            btnType="cancel"
            onClick={() => handleDownloadExcel(true)}
          >
            📑 Export {selectedItems?.size} Selected Form
            {selectedItems?.size > 1 ? "s" : ""}
          </Button>
        )}
      </div>
    </PopUp>
  );
};

export default ExportPopUp;
