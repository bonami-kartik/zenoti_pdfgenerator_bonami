import React from 'react';
import { Row, Col, Form, FormGroup, FormLabel, Button } from 'react-bootstrap';
import Select from 'react-select';

const FilterComponent = ({
  filter,
  handleFilterChange,
  verticalOption,
  countryOption,
}) => {

  const handleChange = (name, value) => {
    handleFilterChange({ ...filter, [name]: value });
  }

  const resetFilter = () => {
    const filterObj = { ...filter };
    Object.keys(filterObj).map(key => filterObj[key] = "");
    handleFilterChange(filterObj);
  }

  return <Form>
    <FormGroup as={Row} className="mb-0">
      <Col className="col-lg-80 align-self-center">
        <FormLabel className="mb-0">Filter:</FormLabel>
      </Col>
      <Col className="p-2" md={4} sm={12}>
        <Select
          classNamePrefix="form-select"
          name="vertical"
          placeholder="Select Vertical"
          value={filter.vertical ? { value: filter.vertical, label: filter.vertical } : null}
          onChange={(option) => handleChange("vertical", option && option.value || "")}
          options={verticalOption}
          isClearable
          menuPlacement="auto"
        />
      </Col>
      <Col className="p-2" md={4} sm={12}>
        <Select
          classNamePrefix="form-select"
          name="country"
          placeholder="Select Region"
          value={filter.country ? { value: filter.country, label: filter.country } : null}
          onChange={(option) => handleChange("country", option && option.value || "")}
          options={countryOption.map(country => ({ value: country, label: country }))}
          isClearable
          menuPlacement="auto"
        />
      </Col>
      <Col md={2} sm={12} className="p-2 align-self-center">
        <Button size="sm" variant="secondary" className="float-sm-none float-right" onClick={() => resetFilter()}>Reset</Button>
      </Col>
    </FormGroup>
  </Form>
}

export default FilterComponent;