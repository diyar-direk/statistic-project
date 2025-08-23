import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router';
import Button from '../../../components/buttons/Button';
import APIClient from '../../../utils/ApiClient';
import '../../categories/pages/addcategory.css';

const AddInformation = () => {
  const apiClient = new APIClient(`locations`); // عدل المسار حسب API عندك
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = useMutation({
    mutationKey: ["locationsQueryKey"],
    mutationFn: (data) => apiClient.addData({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locationsQueryKey"],
      });
      nav(-1);
    },
  });

  const formik = useFormik({
    initialValues: {
      city: "",
      town: "",
      council: "",
      komin: "",
    },
    onSubmit: (values) => handleSubmit.mutate(values),
  });

  return (
    <div className="containers">
      <div className="form-wrapper">
        <h2>إضافة بيانات جديدة</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label>إضافة مدينة جديدة</label>
            <input
              type="text"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              placeholder="أدخل اسم المدينة"
              required
            />
          </div>

          <div className="form-group">
            <label>إضافة بلدة جديدة</label>
            <input
              type="text"
              name="town"
              value={formik.values.town}
              onChange={formik.handleChange}
              placeholder="أدخل اسم البلدة"
              required
            />
          </div>

          <div className="form-group">
            <label>إضافة مجلس جديد</label>
            <input
              type="text"
              name="council"
              value={formik.values.council}
              onChange={formik.handleChange}
              placeholder="أدخل اسم المجلس"
              required
            />
          </div>

          <div className="form-group">
            <label>إضافة كومين جديد</label>
            <input
              type="text"
              name="komin"
              value={formik.values.komin}
              onChange={formik.handleChange}
              placeholder="أدخل اسم الكومين"
              required
            />
          </div>

          <Button
            type="submit"
            className="submit-button"
            isSending={handleSubmit.isPending}
          >
            حفظ البيانات
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddInformation;
