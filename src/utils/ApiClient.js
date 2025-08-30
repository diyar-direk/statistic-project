import axiosInstance from "./axios";

class APIClient {
  constructor(endPoint) {
    this.endPoint = endPoint;
  }
  getAll = async ({
    page = 1,
    sort = {},
    page_size = 10,
    filters = {},
    ...params
  }) => {
    const ordering = sort
      ? Object.values(sort)
          .map((v) => v)
          .join(",")
      : "";

    const paramFilters = new URLSearchParams();
    Object.entries({
      ...filters,
      ...params,
      ordering,
      page,
      page_size,
    }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        paramFilters.append(key, value.id || value);
      }
    });

    const { data } = await axiosInstance.get(this.endPoint, {
      params: paramFilters,
    });

    return { data: data.results || data, totalCount: data.count || 0 };
  };
  getOne = async ({ id }) => {
    const { data } = await axiosInstance.get(`${this.endPoint}/${id}`);

    return data;
  };
  deleteAll = async ({ ids }) => {
    await axiosInstance.post(`${this.endPoint}`, { ids });
  };
  deleteOne = async ({ id }) => {
    await axiosInstance.delete(`${this.endPoint}${id}/`);
  };
  addData = async ({ data }) => {
    const res = await axiosInstance.post(this.endPoint, data);

    return res.data.results;
  };
  updateData = async ({ data, id, url }) => {
    const res = await axiosInstance.patch(
      url || `${this.endPoint}${id}/`,
      data
    );
    return res.results;
  };
}
export default APIClient;
