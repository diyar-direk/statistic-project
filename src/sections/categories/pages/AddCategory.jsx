import { useFormik } from "formik";
import categoriesSchema from "../../../schemas/categories/categoriesSchema";
import Input from "src/components/inputs/Input";
import Button from "../../../components/buttons/Button";
import APIClient from "../../../utils/ApiClient";
import {  useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesQueryKey } from "./CategoriesTable";
import SelectOptionInput from "../../../components/inputs/SelectOptionInput ";
import { memo, useMemo } from "react";
import SelectInputApi from "../../../components/inputs/SelectInputApi";
import "./addcategory.css"; // ملف ستايل خاص بالبطاقات
const AddCategory = () => {
  const nav = useNavigate();
  const apiClient = new APIClient(`categories`);
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationKey: [categoriesQueryKey],
    mutationFn: (data) => apiClient.addData({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [categoriesQueryKey],
      });
      nav(-1);
    },
  });


  const formik = useFormik({
    initialValues: {
      form_number: "",
      address: "",
      city: "",
      town: "",
      council: "",
      commune: "",
      family_code: "",
      phone_number: "",
      family_size: "",
      component: "",
      religion: "",
      housing_type: "",
      ownership_status: "",
      housing_condition: "",
      residency_status: "",
      document_type: "",
      document_number: "",
      previous_city: "",
      previous_town: "",
      previous_council: "",
      previous_commune: "",
      real_estate_area: "",
      irrigated_land: "",
      rainfed_land: "",
      tree_land: "",
      total_hectares: "",
      income_source: "",
      annual_revenue: "",
      poverty_level: "",
      electricity_sources: [],
      water_sources: [],
      sanitation_type: "",
      machinery: "",
      facilities: "",
      sheep_count: "",
      cow_count: "",
      other_livestock: "",
      other_properties: "",
    },
    validationSchema: categoriesSchema,
    onSubmit: async (values) => await handleSubmit.mutateAsync(values),
  });

  // Calculate total hectares dynamically
  const totalHectares = useMemo(() => {
    const irrigated = parseFloat(formik.values.irrigated_land) || 0;
    const rainfed = parseFloat(formik.values.rainfed_land) || 0;
    const trees = parseFloat(formik.values.tree_land) || 0;
    const total = irrigated + rainfed + trees;
    formik.setFieldValue("total_hectares", total.toFixed(2));
    return total.toFixed(2);
  }, [formik.values.irrigated_land, formik.values.rainfed_land, formik.values.tree_land]);


  const povertyLevelOptions = useMemo(
    () => [
      { text: "فقيرة جدا", value: "very_poor" },
      { text: "فقيرة", value: "poor" },
      { text: "متوسطة", value: "medium" },
      { text: "ميسورة", value: "affluent" },
      { text: "بدون معيل", value: "without_provider" },
    ],
    []
  );

  const ownershipStatusOptions = useMemo(
    () => [
      { text: "ملك", value: "owned" },
      { text: "إيجار", value: "rented" },
      { text: "رهن", value: "mortgaged" },
    ],
    []
  );
  const residencyStatusOptions = useMemo(
    () => [
      { text: "مقيم", value: "resident" },
      { text: "نازح", value: "displaced" },
    ],
    []
  );

  return (
    <>
      <form onSubmit={formik.handleSubmit}className="form-container">

        <div className="card">
           <h2 className="card-title">العنوان الحالي</h2>
            <SelectInputApi 
            label="city"
            placeholder="select city"
              endPoint="/getcity"
              queryKey=""
              onChange={(e)=>formik.setFieldValue("city",e)} 
              value={formik.values.city?.name}
            onIgnore={()=>formik.setFieldValue("city","")}  
            optionLabel={(e)=>e.name}
            />
            
          <SelectInputApi
            label="town"
            placeholder="اختر البلدة أو القرية"
            endPoint="/getown"
            queryKey=""
            onChange={(e)=>formik.setFieldValue("town",e)} 
            value={formik.values.town?.name}
            errorText={formik.touched.town && formik.errors.town}
            onIgnore={()=>formik.setFieldValue("town","")}  
            optionLabel={(e)=>e.name}
          />
          <SelectInputApi
            label="council"
            placeholder="اختر المجلس"
            queryKey=""
            onChange={(e)=>formik.setFieldValue("council",e)} 
            value={formik.values.council?.name}
            errorText={formik.touched.council && formik.errors.council}
            onIgnore={()=>formik.setFieldValue("council","")}  
            optionLabel={(e)=>e.name}
          />
          <SelectInputApi
            label="commune"
            placeholder="اختر الكومين"
          queryKey=""
            onChange={(e)=>formik.setFieldValue("commune",e)} 
            value={formik.values.commune?.name}
            errorText={formik.touched.commune && formik.errors.commune}
            onIgnore={()=>formik.setFieldValue("commune","")}  
            optionLabel={(e)=>e.name}
          />
          <Input
            title="family_code"
            errorText={formik.touched.family_code && formik.errors.family_code}
            onChange={formik.handleChange}
            value={formik.values.family_code}
            name="family_code"
            placeholder="كود الأسرة"
          />

      </div>
       
       <div className="card">
          <h2 className="card-title">معلومات الأسرة</h2>
          <Input
            title="family_size"
            errorText={formik.touched.family_size && formik.errors.family_size}
            onChange={formik.handleChange}
            value={formik.values.family_size}
            name="family_size"
            placeholder="عدد أفراد العائلة"
          />
          <Input
            title="component"
            errorText={formik.touched.component && formik.errors.component}
            onChange={formik.handleChange}
            value={formik.values.component}
            name="component"
            placeholder="المكون"
          />
          <Input
            title="religion"
            errorText={formik.touched.religion && formik.errors.religion}
            onChange={formik.handleChange}
            value={formik.values.religion}
            name="religion"
            placeholder="الديانة"
          />
          <Input
            title="phone_number"
            errorText={formik.touched.phone_number && formik.errors.phone_number}
            onChange={formik.handleChange}
            value={formik.values.phone_number}
            name="phone_number"
            placeholder="رقم الهاتف"
          />
          </div>
      
           <div className="card">
          <h2 className="card-title">وضع المسكن</h2>
          <SelectInputApi
            label="housing_type"
            placeholder="اختر نوع المسكن"
            queryKey=""
            onChange={(e)=>formik.setFieldValue("housing_type",e)} 
            value={formik.values.housing_type?.name}
            errorText={formik.touched.housing_type && formik.errors.housing_type}
            onIgnore={()=>formik.setFieldValue("housing_type","")}  
            optionLabel={(e)=>e.name}
          />
          <SelectOptionInput
            label="ownership_status"
            placeholder="اختر حالة الملكية"
            value={formik.values.ownership_status}
            options={ownershipStatusOptions}
            onSelectOption={(option) => formik.setFieldValue("ownership_status", option.value)}
            errorText={formik.touched.ownership_status && formik.errors.ownership_status}
          />
          <SelectInputApi
            label="housing_condition"
            placeholder="اختر حالة المسكن"
            queryKey=""
            onChange={(e)=>formik.setFieldValue("housing_condition",e)} 
            value={formik.values.housing_condition?.name}
            errorText={formik.touched.housing_condition && formik.errors.housing_condition}
            onIgnore={()=>formik.setFieldValue("housing_condition","")}  
            optionLabel={(e)=>e.name}
          />
          </div>
         
           <div className="card">
          <h2 className="card-title">الإقامة</h2>
          <SelectOptionInput
            label="residency_status"
            placeholder="اختر حالة الإقامة"
            value={formik.values.residency_status}
            options={residencyStatusOptions}
            onSelectOption={(option) => formik.setFieldValue("residency_status", option.value)}
            errorText={formik.touched.residency_status && formik.errors.residency_status}
          />
          <Input
            title="document_type"
            errorText={formik.touched.document_type && formik.errors.document_type}
            onChange={formik.handleChange}
            value={formik.values.document_type}
            name="document_type"
            placeholder="نوع الوثيقة"
          />
          <Input
            title="document_number"
            errorText={formik.touched.document_number && formik.errors.document_number}
            onChange={formik.handleChange}
            value={formik.values.document_number}
            name="document_number"
            placeholder="رقم الوثيقة"
          />
          </div>
         
          <div className="card">
          <h2 className="card-title">العنوان السابق</h2>
          <SelectInputApi 
             label="city"
             placeholder="المدينة السابقة"
             endPoint="/getcity"
             queryKey=""
             onChange={(e)=>formik.setFieldValue("city",e)} 
             value={formik.values.city?.name}
             onIgnore={()=>formik.setFieldValue("city","")}  
             optionLabel={(e)=>e.name}
            />
        
            <SelectInputApi
              label="town"
              placeholder=" البلدة أو القرية السابقة"
              endPoint="/getown"
              queryKey=""
              onChange={(e)=>formik.setFieldValue("town",e)} 
              value={formik.values.town?.name}
              errorText={formik.touched.town && formik.errors.town}
              onIgnore={()=>formik.setFieldValue("town","")}  
              optionLabel={(e)=>e.name}
            />
            <SelectInputApi
              label="council"
              placeholder="اختر المجلس السابق"
              queryKey=""
              onChange={(e)=>formik.setFieldValue("council",e)} 
              value={formik.values.council?.name}
              errorText={formik.touched.council && formik.errors.council}
              onIgnore={()=>formik.setFieldValue("council","")}  
              optionLabel={(e)=>e.name}
            />
          <SelectInputApi
              label="commune"
              placeholder=" اختر الكومين السابق"
              queryKey=""
              onChange={(e)=>formik.setFieldValue("commune",e)} 
              value={formik.values.commune?.name}
              errorText={formik.touched.commune && formik.errors.commune}
              onIgnore={()=>formik.setFieldValue("commune","")}  
              optionLabel={(e)=>e.name}
            />
            </div>
        
           <div className="card">
          <h2 className="card-title">الأملاك</h2>
          <Input
            title="real_estate_area"
            errorText={formik.touched.real_estate_area && formik.errors.real_estate_area}
            onChange={formik.handleChange}
            value={formik.values.real_estate_area}
            name="real_estate_area"
            placeholder="مساحة العقار (متر مربع)"
            type="number"
          />
          <h3 className="text-lg font-semibold mb-2">الأراضي الزراعية</h3>
          <Input
            title="irrigated_land"
            errorText={formik.touched.irrigated_land && formik.errors.irrigated_land}
            onChange={formik.handleChange}
            value={formik.values.irrigated_land}
            name="irrigated_land"
            placeholder="الأرض المروية (هكتار)"
            type="number"
          />
          <Input
            title="rainfed_land"
            errorText={formik.touched.rainfed_land && formik.errors.rainfed_land}
            onChange={formik.handleChange}
            value={formik.values.rainfed_land}
            name="rainfed_land"
            placeholder="الأرض البعلية (هكتار)"
            type="number"
          />
          <Input
            title="tree_land"
            errorText={formik.touched.tree_land && formik.errors.tree_land}
            onChange={formik.handleChange}
            value={formik.values.tree_land}
            name="tree_land"
            placeholder="الأشجار (هكتار)"
            type="number"
          />
          <Input
            title="total_hectares"
            errorText={formik.touched.total_hectares && formik.errors.total_hectares}
            value={totalHectares}
            name="total_hectares"
            placeholder="مجموع الهكتارات"
            readOnly
          />

        </div>
        
           <div className="card">
          <h2 className="card-title">الحالة الاقتصادية</h2>
          <SelectInputApi
            label="income_source"
            placeholder="اختر مصدر الدخل"
            queryKey=""
            onChange={(e)=>formik.setFieldValue("income_source",e)} 
            value={formik.values.income_source?.name}
            errorText={formik.touched.income_source && formik.errors.income_source}
            onIgnore={()=>formik.setFieldValue("income_source","")}  
            optionLabel={(e)=>e.name}
          />
          <Input
            title="annual_revenue"
            errorText={formik.touched.annual_revenue && formik.errors.annual_revenue}
            onChange={formik.handleChange}
            value={formik.values.annual_revenue}
            name="annual_revenue"
            placeholder="الإيراد السنوي"
            type="number"
          />
          <SelectOptionInput
            label="poverty_level"
            placeholder="اختر مستوى الفقر"
            value={formik.values.poverty_level}
            options={povertyLevelOptions}
            onSelectOption={(option) => formik.setFieldValue("poverty_level", option.value)}
            errorText={formik.touched.poverty_level && formik.errors.poverty_level}
          />
          </div>
         
           <div className="card">
          <h2 className="card-title">الخدمات</h2>
            <SelectInputApi
            label="Electric_type"
            placeholder="اختر نوع مصادر الكهرباء"    
            queryKey=""
            onChange={(e)=>formik.setFieldValue("Electric_type",e)} 
            value={formik.values.Electric_type?.name}
            errorText={formik.touched.Electric_type && formik.errors.Electric_type}
            onIgnore={()=>formik.setFieldValue("Electric_type","")}  
            optionLabel={(e)=>e.name}
          />
               <SelectInputApi
            label="water_type"
            placeholder="اختر نوع مصادر مياه الشرب"    
            queryKey=""
            onChange={(e)=>formik.setFieldValue("water_type",e)} 
            value={formik.values.water_type?.name}
            errorText={formik.touched.water_type && formik.errors.water_type}
            onIgnore={()=>formik.setFieldValue("water_type","")}  
            optionLabel={(e)=>e.name}
          />
          <SelectInputApi
            label="sanitation_type"
            placeholder="اختر نوع الصرف الصحي"    
            queryKey=""
            onChange={(e)=>formik.setFieldValue("sanitation_type",e)} 
            value={formik.values.sanitation_type?.name}
            errorText={formik.touched.sanitation_type && formik.errors.sanitation_type}
            onIgnore={()=>formik.setFieldValue("sanitation_type","")}  
            optionLabel={(e)=>e.name}
          />
          </div>
          
           <div className="card">
          <h2 className="card-title">الآليات والممتلكات</h2>
          <Input
            title="machinery"
            errorText={formik.touched.machinery && formik.errors.machinery}
            onChange={formik.handleChange}
            value={formik.values.machinery}
            name="machinery"
            placeholder="الآليات (مثال: جرار، شاحنة)"
          />
          <Input
            title="facilities"
            errorText={formik.touched.facilities && formik.errors.facilities}
            onChange={formik.handleChange}
            value={formik.values.facilities}
            name="facilities"
            placeholder="المنشآت (مثال: مستودع، مزرعة)"
          />
          <h3 className="text-lg font-semibold mb-2">الثروة الحيوانية</h3>
          <Input
            title="sheep_count"
            errorText={formik.touched.sheep_count && formik.errors.sheep_count}
            onChange={formik.handleChange}
            value={formik.values.sheep_count}
            name="sheep_count"
            placeholder="عدد الأغنام"
            type="number"
          />
          <Input
            title="cow_count"
            errorText={formik.touched.cow_count && formik.errors.cow_count}
            onChange={formik.handleChange}
            value={formik.values.cow_count}
            name="cow_count"
            placeholder="عدد الأبقار"
            type="number"
          />
          <Input
            title="other_livestock"
            errorText={formik.touched.other_livestock && formik.errors.other_livestock}
            onChange={formik.handleChange}
            value={formik.values.other_livestock}
            name="other_livestock"
            placeholder="حيوانات أخرى (مثال: دواجن، خيول)"
          />
          <Input
            title="other_properties"
            errorText={formik.touched.other_properties && formik.errors.other_properties}
            onChange={formik.handleChange}
            value={formik.values.other_properties}
            name="other_properties"
            placeholder="ممتلكات أخرى"
          />
          </div>
          <div className="form-actions">
          <Button
            btnStyleType="outlined"
            btnType="save"
            isSending={formik.isSubmitting}
            className="popup-btn"
          >
            submit
          </Button>
          <Button
            btnStyleType="contained"
            btnType="delete"
            isSending={formik.isSubmitting}
            className="popup-btn"
            onClick={()=>nav("/add_person")}
          >
            add person 
        </Button>
       </div>
      </form>

    </>
  );
};

export default memo(AddCategory);