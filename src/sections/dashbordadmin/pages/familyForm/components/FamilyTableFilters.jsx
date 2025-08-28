import InputsContainer from "src/components/tableFilters/InputsContainer";
import ConfrimAndRestBtns from "src/components/tableFilters/ConfrimAndRestBtns";
import Input from "src/components/inputs/Input";
import SelectInputApi from "src/components/inputs/SelectInputApi";
import SelectOptionInput from "src/components/inputs/SelectOptionInput";
import { useFormik } from "formik";
import { useMemo } from "react";
import { citiesQueryKey } from "../../addresses/Cities";
import { villageTownQueryKey } from "../../addresses/villages-towns";
import { councilsQueryKey } from "../../addresses/councils";
import { communesQueryKey } from "../../addresses/communes";
import { useTranslation } from "react-i18next";

const FamilyTableFilters = ({ filters, setFilters }) => {
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: filters,
  });
  const povertyLevelOptions = useMemo(
    () => [
      { text: t("all_economic_status"), value: "" },
      { text: t("very_poor"), value: "very poor" },
      { text: t("poor"), value: "poor" },
      { text: t("medium"), value: "Medium" },
      { text: t("affordable"), value: "Affordable" },
      { text: t("without_breadwinner"), value: "without a breadwinner" },
    ],
    [t]
  );
  const addressFilters = useMemo(
    () => [
      {
        name: "city",
        label: t("city"),
        endPoint: "cities/",
        queryKey: citiesQueryKey,
        ifEmpty: t("all_cities"),
      },
      {
        name: "village_town",
        label: t("town"),
        endPoint: "villages-towns/",
        queryKey: villageTownQueryKey,
        ifEmpty: t("all_towns"),
      },
      {
        name: "council",
        label: t("council"),
        endPoint: "councils/",
        queryKey: councilsQueryKey,
        ifEmpty: t("all_councils"),
      },
      {
        name: "commune",
        label: t("commune"),
        endPoint: "communes/",
        queryKey: communesQueryKey,
        ifEmpty: t("all_communes"),
      },
    ],
    [t]
  );

  return (
    <>
      <InputsContainer>
        {addressFilters.map((input) => (
          <SelectInputApi
            key={input.name}
            label={input.label}
            placeholder={formik.values[input.name]?.name || input.ifEmpty}
            endPoint={input.endPoint}
            queryKey={input.queryKey}
            onChange={(e) => formik.setFieldValue(input.name, e)}
            optionLabel={(e) => e.name}
            addOption={
              <h3 onClick={() => formik.setFieldValue(input.name, null)}>
                {input.ifEmpty}
              </h3>
            }
          />
        ))}
      </InputsContainer>
      <InputsContainer>
        <SelectOptionInput
          label={t("economic_status")}
          options={povertyLevelOptions}
          placeholder={formik.values.economic_status || t("all_economic_status")}
          onSelectOption={(e) =>
            formik.setFieldValue("economic_status", e.value)
          }
        />
        <SelectInputApi
          placeholder={
            formik.values.ethnic_component?.name || t("all_ethnic_components")
          }
          queryKey="ethnic-components"
          optionLabel={(e) => e.name}
          endPoint="ethnic-components/"
          label={t("ethnic_components")}
          addOption={
            <h3 onClick={() => formik.setFieldValue("ethnic_component", null)}>
              {t("all_ethnic_components")}
            </h3>
          }
          onChange={(e) => formik.setFieldValue("ethnic_component", e)}
        />
      </InputsContainer>
      <InputsContainer>
        <Input
          title={t("members_count")}
          type="number"
          placeholder="0000"
          value={formik.values.members_count}
          name="members_count"
          onChange={formik.handleChange}
        />
      </InputsContainer>
      <InputsContainer>
        <SelectInputApi
          placeholder={formik.values.created_by?.username || t("any_user")}
          addOption={
            <h3 onClick={() => formik.setFieldValue("created_by", null)}>
              {t("any_user")}
            </h3>
          }
          onChange={(e) => formik.setFieldValue("created_by", e)}
          queryKey="users"
          optionLabel={(e) => e.username}
          endPoint="auth/accounts/"
          label={t("created_by")}
        />
        <SelectInputApi
          placeholder={formik.values.updated_by?.username || t("any_user")}
          addOption={
            <h3 onClick={() => formik.setFieldValue("updated_by", null)}>
              {t("any_user")}
            </h3>
          }
          onChange={(e) => formik.setFieldValue("updated_by", e)}
          queryKey="users"
          optionLabel={(e) => e.username}
          endPoint="auth/accounts/"
          label={t("updated_by")}
        />
      </InputsContainer>
      <ConfrimAndRestBtns
        values={formik.values}
        resetForm={formik.resetForm}
        setFilters={setFilters}
      />
    </>
  );
};

export default FamilyTableFilters;