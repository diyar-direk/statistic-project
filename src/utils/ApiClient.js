import axiosInstance from "./axios";

class APIClient {
  constructor(endPoint) {
    this.endPoint = endPoint;
  }
  getAll = async ({ page = 1, sort, page_size = 10, filters, ...params }) => {
    const sortStatus = sort
      ? Object.values(sort)
          .map((v) => v)
          .join(",")
      : "";
    const paramFilters = new URLSearchParams();
    Object.entries({
      ...filters,
      ...params,
      sort: sortStatus,
      page,
      page_size,
    }).forEach(([key, value]) => {
      if (key !== "from" && key !== "to")
        value && paramFilters.append(key, value);
      else {
        if (key === "from" && value)
          paramFilters.append("createdAt[gte]", value);
        if (key === "to" && value) paramFilters.append("createdAt[lte]", value);
      }
    });

    const { data } = await axiosInstance.get(this.endPoint, {
      params: paramFilters,
    });

    return { data: data.data, totalCount: data.count };
  };
  getOne = async ({ id }) => {
    const { data } = await axiosInstance.get(`${this.endPoint}/${id}`);
    return data.data;
  };
  deleteAll = async ({ ids }) => {
    await axiosInstance.delete(this.endPoint, {
      data: { ids },
    });
  };
  addData = async ({ data }) => {
    const res = await axiosInstance.post(this.endPoint, data);
    return res.data;
  };
  updateData = async ({ data, id }) => {
    const res = await axiosInstance.patch(`${this.endPoint}/${id}`, data);
    return res.data;
  };
}
export default APIClient;
