import axiosInstance from "../../../../utils/axios";

export const getLists = async ({ page = 1, sort = {} }) => {
  const params = new URLSearchParams();
  const ordering = sort
    ? Object.values(sort)
        .map((v) => v)
        .join(",")
    : "";

  params.append("page_size", 10);
  params.append("page", page);
  params.append("ordering", ordering);

  const { data } = await axiosInstance.get("backup/families/list/", { params });

  return { data: data?.backups, totalCount: data.total };
};
export const createBackUp = async () => {
  const { data } = await axiosInstance.get("backup/families/create/");
  return data;
};

export const downloadBackUp = async (src) => {
  try {
    const response = await axiosInstance.get(
      `backup/families/download/${src}/`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", src);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
};

export const restoreBackup = async (file) => {
  const { data } = await axiosInstance.post("backup/families/restore/", {
    filename: file,
  });

  return data;
};
export const replaceBackup = async (file) => {
  const { data } = await axiosInstance.post("backup/families/replace/", {
    filename: file,
  });
  return data;
};

export const deleteBackUp = async (filenames) => {
  await axiosInstance.delete(`backup/families/delete/`, {
    data: {
      filenames,
    },
  });
};

export const uploadBackUp = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post(
    `backup/families/upload/`,
    formData
  );
  return data.filename;
};
