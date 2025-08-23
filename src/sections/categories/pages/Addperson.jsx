
import { useMutation, useQueryClient } from '@tanstack/react-query';
import addperson from '../../../schemas/categories/addperson';
import './styles.css';
import { useFormik } from 'formik';
import APIClient from '../../../utils/ApiClient';
import { useNavigate } from 'react-router';
import Button from '../../../components/buttons/Button';


const AddPerson = () => {
  const apiClient = new APIClient(`users`);
  const nav = useNavigate();
const queryClient=useQueryClient()
const handleSubmit = useMutation({
    mutationKey: ["categoriesQueryKey"],
    mutationFn: (data) => apiClient.addData({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categoriesQueryKey"],
      });
      nav(-1);
    },
  });

  const formik = useFormik({
    initialValues:{
    name: '',
    fatherName: '',
    surname: '',
    motherName: '',
    gender: '',
    birthYear: '',
    birthPlace: '',
    maritalStatus: '',
    education: '',
    currentJob: '',
    chronicDiseases: '',
    diseaseType: '',
    specialCase: '',
    caseDetails: '',
    caseLocation: '',
    disability: '',
    disabilityType: '',
    isMigrant: '',
    migrantLocation: ''},
    validationSchema:addperson,
    onSubmit: (values) =>  handleSubmit.mutate(values),
  });


 

  return (
    <div className="containers">
      <div className="form-wrapper">
        <h2>إضافة فرد من العائلة</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Personal Information */}
          <div className="form-grid">
            <div className="form-group">
              <label>الاسم</label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>اسم الأب</label>
              <input
                type="text"
                name="fatherName"
                value={formik.values.fatherName}
                onChange={formik.handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>الكنية</label>
              <input
                type="text"
                name="surname"
                value={formik.values.surname}
                onChange={formik.handleChange}
              />
            </div>
            <div className="form-group">
              <label>اسم الأم</label>
              <input
                type="text"
                name="motherName"
                value={formik.values.motherName}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          {/* Gender and Birth Info */}
          <div className="form-grid">
            <div className="form-group">
              <label>الجنس</label>
              <select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                required
              >

                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
            <div className="form-group">
              <label>سنة الميلاد</label>
              <input
                type="number"
                name="birthYear"
                value={formik.values.birthYear}
                onChange={formik.handleChange}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
            <div className="form-group">
              <label>مكان الميلاد</label>
              <input
                type="text"
                name="birthPlace"
                value={formik.values.birthPlace}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          {/* Other Personal Info */}
          <div className="form-grid">
            <div className="form-group">
              <label>الوضع العائلي</label>
              <select
                name="maritalStatus"
                value={formik.values.maritalStatus}
                onChange={formik.handleChange}
              >
                <option value="">اختر</option>
                <option value="single">أعزب</option>
                <option value="married">متزوج</option>
                <option value="divorced">مطلق</option>
                <option value="widowed">أرمل</option>
              </select>
            </div>
            <div className="form-group">
              <label>المؤهل العلمي</label>
              <input
                type="text"
                name="education"
                value={formik.values.education}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          {/* Job and Health */}
          <div className="form-grid">
            <div className="form-group">
              <label>العمل الحالي</label>
              <input
                type="text"
                name="currentJob"
                value={formik.values.currentJob}
                onChange={formik.handleChange}
              />
            </div>
            <div className="form-group">
              <label>الأمراض المزمنة</label>
              <input
                type="text"
                name="chronicDiseases"
                value={formik.values.chronicDiseases}
                onChange={formik.handleChange}
              />
            </div>
            <div className="form-group">
              <label>نوع المرض</label>
              <input
                type="text"
                name="diseaseType"
                value={formik.values.diseaseType}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          {/* Special Cases */}
          <div className="form-group">
            <label>الحالة الفردية</label>
            <select
              name="specialCase"
              value={formik.values.specialCase}
              onChange={formik.handleChange}
            >
              <option value="missing">مفقود</option>
              <option value="warInjury">إصابة حرب</option>
              <option value="detained">معتقل</option>
              <option value="none">لا يوجد</option>
            </select>
          </div>

          {formik.values.specialCase && formik.values.specialCase !== 'none' && (
            <div className="special-case-section">
              <div className="form-group">
                <label>تفاصيل الحالة</label>
                <input
                  type="text"
                  name="caseDetails"
                  value={formik.values.caseDetails}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="form-group">
                <label>مكان الحالة</label>
                <input
                  type="text"
                  name="caseLocation"
                  value={formik.values.caseLocation}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="form-group">
                <label>الإعاقة</label>
                <select
                  name="disability"
                  value={formik.values.disability}
                  onChange={formik.handleChange}
                >
                  <option value="">اختر</option>
                  <option value="yes">نعم</option>
                  <option value="no">لا</option>
                </select>
              </div>
              {formik.values.disability === 'yes' && (
                <div className="form-group">
                  <label>نوع الإعاقة</label>
                  <input
                    type="text"
                    name="disabilityType"
                    value={formik.values.disabilityType}
                    onChange={formik.handleChange}
                  />
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label>هل هو مهاجر؟</label>
            <select
              name="isMigrant"
              value={formik.values.isMigrant}
              onChange={formik.handleChange}
            >
              <option value="">اختر</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
          </div>
          {formik.values.isMigrant === 'yes' && (
            <div className="form-group">
              <label>مكان الهجرة</label>
              <input
                type="text"
                name="migrantLocation"
                value={formik.values.migrantLocation}
                onChange={formik.handleChange}
              />
            </div>
          )}

          <Button type="submit" className="submit-button" isSending={handleSubmit.isPending}  >
            إضافة الفرد
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddPerson;