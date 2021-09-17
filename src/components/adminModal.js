import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalTitle,
} from "react-bootstrap";
import Select from "react-select";

const defaultData = {
  title: "",
  description: "",
  business_benefits: "",
  vertical: null,
  area: null,
  country: null,
  competitorOption: null,
  pillarOption: null,
  businessAreaOption: null,
  themeOption: null,
  differentiator: null,
  small_biz: null,
};

const AdminModal = ({
  verticalOption,
  areaOption,
  regionOption,
  competitorOption,
  pillarOption,
  businessAreaOption,
  themeOption,
  adminModal,
  deleteAdminModal,
  addProductFlag,
  deleteProductFlag,
  selectedRow,
  toggleAdminModal,
  toggleDeleteAdminModal,
  saveProduct,
  deleteProduct,
}) => {
  const { control, register, handleSubmit, setValue, reset, watch, errors } =
    useForm({ defaultValues: defaultData });
  const isEdit = selectedRow && selectedRow.isEdit ? true : false;

  useEffect(() => {
    let data = {};
    let verticals = null;
    let selectedCoutry = null;
    let selectedCompetitor = null;
    let selectedPillar = null;
    let selectedBusinessArea = null;
    let selectedThemes = null;
    if (selectedRow && selectedRow.data) {
      data = { ...selectedRow.data };
    } else {
      verticals = verticalOption.map((v) => v.value);
      selectedCoutry = regionOption;
      selectedCompetitor = competitorOption;
      selectedPillar = pillarOption;
      selectedBusinessArea = businessAreaOption;
      selectedThemes = themeOption;
      data.differentiator = "yes";
      data.small_biz = "yes";
    }
    if (data.differentiator === null) {
      data.differentiator = "yes";
    }
    if (data.small_biz === null) {
      data.small_biz = "yes";
    }
    if (data.vertical) {
      verticals = data.vertical;
    }
    if (data.country) {
      selectedCoutry = regionOption.find((c) => c.value === data.country);
    }
    if (data.competitors) {
      selectedCompetitor = competitorOption.find(
        (c) => c.value === data.competitors
      );
    }
    if (data.brand_pillars) {
      selectedPillar = pillarOption.find((c) => c.value === data.brand_pillars);
    }
    if (data.business_area) {
      selectedBusinessArea = businessAreaOption.find(
        (c) => c.value === data.business_area
      );
    }
    if (data.themes) {
      selectedThemes = themeOption.find((c) => c.value === data.themes);
    }
    if (data.differentiator !== undefined && data.differentiator !== null) {
      data.differentiator = data.differentiator ? "yes" : "no";
    }
    if (data.small_biz !== undefined && data.small_biz !== null) {
      data.small_biz = data.small_biz ? "yes" : "no";
    }
    reset({
      title: data.title || "",
      description: data.description || "",
      business_benefits: data.business_benefits || "",
      vertical:
        (verticals && verticals.map((v) => ({ value: v, label: v }))) || null,
      area: data.area ? { value: data.area, label: data.area } : null,
      country: selectedCoutry,
      competitors: selectedCompetitor,
      brand_pillars: selectedPillar,
      business_area: selectedBusinessArea,
      themes: selectedThemes,
      differentiator: data.differentiator || null,
      small_biz: data.small_biz || null,
    });
  }, [selectedRow]);

  const handleSave = (data) => {
    const newData = { ...data };
    newData.vertical = newData.vertical.map((v) => v.value);
    newData.area = newData.area && newData.area.value;
    if (isEdit) {
      newData.country = isEdit && newData.country ? newData.country.value : "";
      newData.competitors =
        isEdit && newData.competitors ? newData.competitors.value : "";
      newData.brand_pillars =
        isEdit && newData.brand_pillars ? newData.brand_pillars : "";
      newData.business_area =
        isEdit && newData.business_area ? newData.business_area : "";
      newData.themes = isEdit && newData.themes ? newData.themes : "";
    } else {
      newData.country = newData.country
        ? newData.country.map((c) => c.value)
        : [];

      newData.competitors = newData.competitors
        ? newData.competitors.map((c) => c.value)
        : [];

      newData.brand_pillars = newData.brand_pillars
        ? newData.brand_pillars.map((c) => c.value)
        : [];

      newData.business_area = newData.business_area
        ? newData.business_area.map((c) => c.value)
        : [];

      newData.themes = newData.themes ? newData.themes.map((c) => c.value) : [];
    }

    if (newData.differentiator === "yes") {
      newData.differentiator = true;
    } else if (newData.differentiator === "no") {
      newData.differentiator = false;
    } else {
      newData.differentiator = null;
    }

    saveProduct(newData);
  };

  return (
    <>
      <Modal
        size="lg"
        show={adminModal}
        centered
        onHide={() => toggleAdminModal(null)}
      >
        <Modal.Header closeButton>
          <ModalTitle className="px-4">{`${
            isEdit ? "Edit" : "Add"
          } Feature`}</ModalTitle>
        </Modal.Header>
        <ModalBody className="px-5">
          <Form onSubmit={handleSubmit(handleSave)}>
            <Row>
              <Col lg={6} md={12}>
                <FormGroup controlId="admin-title">
                  <FormLabel className="text-secondary">Feature</FormLabel>
                  <FormControl
                    placeholder="Enter Feature"
                    name="title"
                    ref={register({
                      required: "Feature is required",
                      maxLength: {
                        value: 150,
                      },
                    })}
                    onChange={(e) => {
                      if (e.target.value.length >= 150) {
                        const trimedValue = e.target.value.slice(0, 150);
                        setValue("title", trimedValue);
                      }
                    }}
                  />
                  {watch("title") && watch("title").length >= 100 && (
                    <p className="form-error text-muted">
                      {150 - watch("title").length} characters left
                    </p>
                  )}
                  {errors.title && (
                    <p className="form-error">{errors.title.message}</p>
                  )}
                </FormGroup>
              </Col>
              <Col sm={12}>
                <FormGroup controlId="admin-description">
                  <FormLabel className="text-secondary">Description</FormLabel>
                  <FormControl
                    as="textarea"
                    placeholder="Enter Description"
                    name="description"
                    rows={5}
                    ref={register({
                      required: "Description is required",
                      maxLength: {
                        value: 800,
                      },
                    })}
                    onChange={(e) => {
                      if (e.target.value.length >= 800) {
                        const trimedValue = e.target.value.slice(0, 800);
                        setValue("description", trimedValue);
                      }
                    }}
                  />
                  {watch("description") &&
                    watch("description").length >= 750 && (
                      <p className="form-error text-muted">
                        {800 - watch("description").length} characters left
                      </p>
                    )}
                  {errors.description && (
                    <p className="form-error">{errors.description.message}</p>
                  )}
                </FormGroup>
              </Col>
              <Col sm={12}>
                <Row>
                  <Col sm={6}>
                    <FormGroup>
                      <FormLabel className="text-secondary mb-0">
                        Unique to Zenoti
                      </FormLabel>
                      <div>
                        <Form.Check
                          inline
                          type="radio"
                          label="Yes"
                          name="differentiator"
                          ref={register}
                          value="yes"
                          defaultChecked={watch("differentiator") === true}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="No"
                          name="differentiator"
                          ref={register}
                          value="no"
                          defaultChecked={watch("differentiator") === false}
                        />
                        {errors.product_feature && (
                          <p className="form-error">
                            {errors.product_feature.message}
                          </p>
                        )}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col sm={6}>
                    <FormGroup>
                      <FormLabel className="text-secondary mb-0">
                        Available For Small Business
                      </FormLabel>
                      <div>
                        <Form.Check
                          inline
                          type="radio"
                          label="Yes"
                          name="small_biz"
                          ref={register}
                          value="yes"
                          defaultChecked={watch("small_biz") === true}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="No"
                          name="small_biz"
                          ref={register}
                          value="no"
                          defaultChecked={watch("small_biz") === false}
                        />
                        {errors.small_biz && (
                          <p className="form-error">
                            {errors.small_biz.message}
                          </p>
                        )}
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
              <Col sm={12}>
                <FormGroup controlId="admin-benefits">
                  <FormLabel className="text-secondary">
                    Business Impact
                  </FormLabel>
                  <FormControl
                    as="textarea"
                    placeholder="Enter Business Impact"
                    name="business_benefits"
                    rows={4}
                    ref={register({
                      maxLength: {
                        value: 300,
                      },
                    })}
                    onChange={(e) => {
                      if (e.target.value.length >= 300) {
                        const trimedValue = e.target.value.slice(0, 300);
                        setValue("business_benefits", trimedValue);
                      }
                    }}
                  />
                  {watch("business_benefits") &&
                    watch("business_benefits").length >= 250 && (
                      <p className="form-error text-muted">
                        {300 - watch("business_benefits").length} characters
                        left
                      </p>
                    )}
                  {errors.business_benefits && (
                    <p className="form-error">
                      {errors.business_benefits.message}
                    </p>
                  )}
                </FormGroup>
              </Col>
              <Col lg={6} md={12}>
                <FormGroup controlId="admin-area">
                  <FormLabel className="text-secondary">Area</FormLabel>
                  <Controller
                    as={Select}
                    control={control}
                    classNamePrefix="form-select"
                    name="area"
                    placeholder="Select area"
                    options={areaOption}
                    defaultValue={null}
                    isClearable
                    menuPlacement="auto"
                    rules={{
                      required: "Area is required",
                    }}
                  />
                  {errors.area && (
                    <p className="form-error">{errors.area.message}</p>
                  )}
                </FormGroup>
              </Col>
              <Col lg={6} md={12}>
                <FormGroup controlId="admin-vertical">
                  <FormLabel className="text-secondary">Vertical</FormLabel>
                  <Controller
                    control={control}
                    name="vertical"
                    rules={{
                      required: "Vertical is required",
                    }}
                    render={(controllerProps) => {
                      let verticalList = [...verticalOption];
                      if (
                        !controllerProps.value ||
                        controllerProps.value.length !== verticalOption.length
                      ) {
                        verticalList = [
                          { label: "All", value: "all" },
                          ...verticalOption,
                        ];
                      }
                      return (
                        <Select
                          classNamePrefix="form-select"
                          placeholder="Select Vertical"
                          options={verticalList}
                          defaultValue={null}
                          isClearable
                          isMulti
                          menuPlacement="auto"
                          value={controllerProps.value}
                          onChange={(value, { option }) => {
                            if (option && option.value === "all") {
                              control.setValue("vertical", verticalOption);
                            } else {
                              control.setValue("vertical", value);
                            }
                          }}
                          onMenuClose={() => {
                            if (
                              Array.isArray(watch("vertical")) &&
                              watch("vertical").length === 0
                            ) {
                              control.setValue("vertical", null);
                            }
                          }}
                        />
                      );
                    }}
                  />
                  {errors.vertical && (
                    <p className="form-error">{errors.vertical.message}</p>
                  )}
                </FormGroup>
              </Col>
              <Col lg={6} md={12}>
                <FormGroup controlId="admin-country">
                  <FormLabel className="text-secondary">
                    Region{" "}
                    {!isEdit && regionOption.length > 10 && (
                      <small>(Maximum 10 regions allowed)</small>
                    )}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="country"
                    rules={{
                      required: "Region is required",
                    }}
                    render={(controllerProps) => {
                      let regionList = [...regionOption];
                      if (
                        !isEdit &&
                        (!controllerProps.value ||
                          controllerProps.value.length !== regionOption.length)
                      ) {
                        regionList = [
                          { label: "All", value: "all" },
                          ...regionOption,
                        ];
                      }
                      return (
                        <Select
                          classNamePrefix="form-select"
                          placeholder="Select region"
                          options={regionList}
                          isClearable
                          isMulti={!isEdit}
                          defaultValue={null}
                          value={controllerProps.value}
                          menuPlacement="auto"
                          onChange={(value, { option }) => {
                            if (option && option.value === "all") {
                              control.setValue("country", regionOption);
                            } else {
                              control.setValue("country", value);
                            }
                          }}
                          isOptionDisabled={() => {
                            return !isEdit && watch("country")
                              ? watch("country").length >= 10
                              : false;
                          }}
                          onMenuClose={() => {
                            if (
                              !isEdit &&
                              Array.isArray(watch("country")) &&
                              watch("country").length === 0
                            ) {
                              control.setValue("country", null);
                            }
                          }}
                        />
                      );
                    }}
                  />
                  {!isEdit && regionOption.length > 10 && watch("country") && (
                    <p className="form-error text-muted">
                      {watch("country").length >= 5
                        ? `${10 - watch("country").length} selections left`
                        : ""}
                    </p>
                  )}
                  {errors.country && (
                    <p className="form-error">{errors.country.message}</p>
                  )}
                </FormGroup>
              </Col>
              <Col lg={6} md={12}>
                <FormGroup controlId="admin-competitors">
                  <FormLabel className="text-secondary">
                    Competitor{" "}
                    {!isEdit && competitorOption.length > 10 && (
                      <small>(Maximum 10 regions allowed)</small>
                    )}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="competitors"
                    rules={{
                      required: "Competitor is required",
                    }}
                    render={(controllerProps) => {
                      let competitorList = [...competitorOption];
                      if (
                        !isEdit &&
                        (!controllerProps.value ||
                          controllerProps.value.length !==
                            competitorOption.length)
                      ) {
                        competitorList = [
                          { label: "All", value: "all" },
                          ...competitorOption,
                        ];
                      }
                      return (
                        <Select
                          classNamePrefix="form-select"
                          placeholder="Select Competitor"
                          options={competitorList}
                          isClearable
                          isMulti={!isEdit}
                          defaultValue={null}
                          value={controllerProps.value}
                          menuPlacement="auto"
                          onChange={(value, { option }) => {
                            if (option && option.value === "all") {
                              control.setValue("competitors", competitorOption);
                            } else {
                              control.setValue("competitors", value);
                            }
                          }}
                          isOptionDisabled={() => {
                            return !isEdit && watch("competitors")
                              ? watch("competitors").length >= 10
                              : false;
                          }}
                          onMenuClose={() => {
                            if (
                              !isEdit &&
                              Array.isArray(watch("competitors")) &&
                              watch("competitors").length === 0
                            ) {
                              control.setValue("competitors", null);
                            }
                          }}
                        />
                      );
                    }}
                  />
                  {!isEdit &&
                    competitorOption.length > 10 &&
                    watch("competitors") && (
                      <p className="form-error text-muted">
                        {watch("competitors").length >= 5
                          ? `${
                              10 - watch("competitors").length
                            } selections left`
                          : ""}
                      </p>
                    )}
                  {errors.competitors && (
                    <p className="form-error">{errors.competitors.message}</p>
                  )}
                </FormGroup>
              </Col>

              <Col lg={6} md={12}>
                <FormGroup controlId="admin-brand_pillars">
                  <FormLabel className="text-secondary">
                    Pillar{" "}
                    {!isEdit && pillarOption.length > 10 && (
                      <small>(Maximum 10 regions allowed)</small>
                    )}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="brand_pillars"
                    rules={{
                      required: "Pillar is required",
                    }}
                    render={(controllerProps) => {
                      let pillarList = [...pillarOption];
                      if (
                        !isEdit &&
                        (!controllerProps.value ||
                          controllerProps.value.length !== pillarOption.length)
                      ) {
                        pillarList = [
                          { label: "All", value: "all" },
                          ...pillarOption,
                        ];
                      }
                      return (
                        <Select
                          classNamePrefix="form-select"
                          placeholder="Select Pillars"
                          options={pillarList}
                          isClearable
                          isMulti={!isEdit}
                          defaultValue={null}
                          value={controllerProps.value}
                          menuPlacement="auto"
                          onChange={(value, { option }) => {
                            if (option && option.value === "all") {
                              control.setValue("brand_pillars", pillarOption);
                            } else {
                              control.setValue("brand_pillars", value);
                            }
                          }}
                          isOptionDisabled={() => {
                            return !isEdit && watch("brand_pillars")
                              ? watch("brand_pillars").length >= 10
                              : false;
                          }}
                          onMenuClose={() => {
                            if (
                              !isEdit &&
                              Array.isArray(watch("brand_pillars")) &&
                              watch("brand_pillars").length === 0
                            ) {
                              control.setValue("brand_pillars", null);
                            }
                          }}
                        />
                      );
                    }}
                  />
                  {!isEdit &&
                    pillarOption.length > 10 &&
                    watch("brand_pillars") && (
                      <p className="form-error text-muted">
                        {watch("brand_pillars").length >= 5
                          ? `${
                              10 - watch("brand_pillars").length
                            } selections left`
                          : ""}
                      </p>
                    )}
                  {errors.brand_pillars && (
                    <p className="form-error">{errors.brand_pillars.message}</p>
                  )}
                </FormGroup>
              </Col>
              <Col lg={6} md={12}>
                <FormGroup controlId="admin-business_area">
                  <FormLabel className="text-secondary">
                    Business Area{" "}
                    {!isEdit && businessAreaOption.length > 10 && (
                      <small>(Maximum 10 regions allowed)</small>
                    )}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="business_area"
                    rules={{
                      required: "Business Area is required",
                    }}
                    render={(controllerProps) => {
                      let businessList = [...businessAreaOption];
                      if (
                        !isEdit &&
                        (!controllerProps.value ||
                          controllerProps.value.length !==
                            businessAreaOption.length)
                      ) {
                        businessList = [
                          { label: "All", value: "all" },
                          ...businessAreaOption,
                        ];
                      }
                      return (
                        <Select
                          classNamePrefix="form-select"
                          placeholder="Select Business Area"
                          options={businessList}
                          isClearable
                          isMulti={!isEdit}
                          defaultValue={null}
                          value={controllerProps.value}
                          menuPlacement="auto"
                          onChange={(value, { option }) => {
                            if (option && option.value === "all") {
                              control.setValue(
                                "business_area",
                                businessAreaOption
                              );
                            } else {
                              control.setValue("business_area", value);
                            }
                          }}
                          isOptionDisabled={() => {
                            return !isEdit && watch("business_area")
                              ? watch("business_area").length >= 10
                              : false;
                          }}
                          onMenuClose={() => {
                            if (
                              !isEdit &&
                              Array.isArray(watch("business_area")) &&
                              watch("business_area").length === 0
                            ) {
                              control.setValue("business_area", null);
                            }
                          }}
                        />
                      );
                    }}
                  />
                  {!isEdit &&
                    businessAreaOption.length > 10 &&
                    watch("business_area") && (
                      <p className="form-error text-muted">
                        {watch("business_area").length >= 5
                          ? `${
                              10 - watch("business_area").length
                            } selections left`
                          : ""}
                      </p>
                    )}
                  {errors.business_area && (
                    <p className="form-error">{errors.business_area.message}</p>
                  )}
                </FormGroup>
              </Col>
              <Col lg={6} md={12}>
                <FormGroup controlId="admin-themes">
                  <FormLabel className="text-secondary">
                    Themes{" "}
                    {!isEdit && themeOption.length > 10 && (
                      <small>(Maximum 10 regions allowed)</small>
                    )}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="themes"
                    rules={{
                      required: "Theme is required",
                    }}
                    render={(controllerProps) => {
                      let themeList = [...themeOption];
                      if (
                        !isEdit &&
                        (!controllerProps.value ||
                          controllerProps.value.length !== themeOption.length)
                      ) {
                        themeList = [
                          { label: "All", value: "all" },
                          ...themeOption,
                        ];
                      }
                      return (
                        <Select
                          classNamePrefix="form-select"
                          placeholder="Select Themes"
                          options={themeList}
                          isClearable
                          isMulti={!isEdit}
                          defaultValue={null}
                          value={controllerProps.value}
                          menuPlacement="auto"
                          onChange={(value, { option }) => {
                            if (option && option.value === "all") {
                              control.setValue("themes", themeOption);
                            } else {
                              control.setValue("themes", value);
                            }
                          }}
                          isOptionDisabled={() => {
                            return !isEdit && watch("themes")
                              ? watch("themes").length >= 10
                              : false;
                          }}
                          onMenuClose={() => {
                            if (
                              !isEdit &&
                              Array.isArray(watch("themes")) &&
                              watch("themes").length === 0
                            ) {
                              control.setValue("themes", null);
                            }
                          }}
                        />
                      );
                    }}
                  />
                  {!isEdit &&
                    themeOption.length > 10 &&
                    watch("themes") && (
                      <p className="form-error text-muted">
                        {watch("themes").length >= 5
                          ? `${
                              10 - watch("themes").length
                            } selections left`
                          : ""}
                      </p>
                    )}
                  {errors.themes && (
                    <p className="form-error">{errors.themes.message}</p>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <div className="button-container">
              <Button
                variant="primary"
                type="submit"
                className="mx-2"
                disabled={addProductFlag}
              >
                {isEdit ? "Save" : "Add"}
              </Button>
              <Button
                variant="secondary"
                type="button"
                className="mx-2"
                onClick={() => toggleAdminModal(null)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      <Modal
        show={deleteAdminModal}
        onHide={() => toggleDeleteAdminModal(null)}
      >
        <Modal.Header closeButton>
          <ModalTitle>Delete Feature</ModalTitle>
        </Modal.Header>
        <ModalBody>
          <p>Are you sure you want to delete this feature?</p>
          <div className="button-container">
            <Button
              variant="primary"
              type="button"
              className="mx-2"
              onClick={() => deleteProduct()}
              disabled={deleteProductFlag}
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              type="button"
              className="mx-2"
              onClick={() => toggleDeleteAdminModal(null)}
            >
              Cancel
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default AdminModal;
