import { useFormik } from "formik";
import Button from "../../../components/buttons/Button";
import Input from "../../../components/inputs/Input";
import categoriesSchema from "../../../schemas/categories/categoriesSchema";
import { useNavigate, useParams } from "react-router";
import APIClient from "../../../utils/ApiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesQueryKey } from "./CategoriesTable";
import Skeleton from "react-loading-skeleton";

const UpdateCategory = () => {
  const nav = useNavigate(-1);
  const { id } = useParams();
  const apiClient = new APIClient(`categories`);
  const { data, isLoading } = useQuery({
    queryKey: [categoriesQueryKey, id],
    queryFn: () => apiClient.getOne({ id }),
  });

  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationKey: [categoriesQueryKey],
    mutationFn: (data) => apiClient.updateData({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [categoriesQueryKey],
      });
      nav(-1);
    },
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data?.name || "",
    },
    validationSchema: categoriesSchema,
    onSubmit: (values) => handleSubmit.mutate(values),
  });
  if (isLoading) return <Skeleton height="200px" width="100%" />;
  return (
    <form onSubmit={formik.handleSubmit}>
      <Input
        title="name"
        errorText={formik.touched.name && formik.errors.name}
        onChange={formik.handleChange}
        value={formik.values.name}
        name="name"
        placeholder="write category name"
      />
      <Button
        btnStyleType="outlined"
        btnType="save"
        isSending={formik.isSubmitting}
        className="popup-btn"
      >
        submit
      </Button>
    </form>
  );
};

export default UpdateCategory;
