import React, { useState } from "react";
import { Row, Col, Form, FormGroup, FormLabel, Button } from "react-bootstrap";
import Select from "react-select";

const FilterComponent = ({
  filter,
  handleFilterChange,
  verticalOption,
  countryOption,
}) => {
  const [verticalFilter, setVerticalFilter] = useState("");

  const [regionFilter, setRegionFilter] = useState("");

  const [competitorFilter, setCompetitorFilter] = useState("");

  const [areaFilter, setAreaFilter] = useState("");

  const [businessFilter, setBusinessFilter] = useState("");

  const applyFilter = () => {
    handleFilterChange({
      vertical: verticalFilter,
      country: regionFilter,
      competitor: competitorFilter,
      area: areaFilter,
      business_benefits: businessFilter,
    });
  };

  const resetFilter = () => {
    setVerticalFilter("");
    setRegionFilter("");
    setCompetitorFilter("");
    setAreaFilter("");
    setBusinessFilter("");
    const filterObj = { ...filter };
    Object.keys(filterObj).map((key) => (filterObj[key] = ""));
    handleFilterChange(filterObj);
  };

  const Competitor = ["Booker", "MBO", "Salonbiz", "Phorest"];
  const Area = ["R&A", "Packages", "Payments", "Reports & Analytics", "All"];
  const BusinessBenefits = ["Streamline operations", "unify the business"];
  return (
    <div className="formBorder section-padding" style={{ height: "60vh" }}>
      {/* <Col className="col-lg-80 align-self-center">
        <FormLabel className="mb-0">Filter:</FormLabel>
      </Col> */}

      {/* <FormLabel className="mb-0">Filter:</FormLabel> */}
      <div className="filter-scroll">
        <Row>
          <Col md={12}>
            <h6>
              <b>Vertical</b>
            </h6>
            {verticalOption.map(({ label, value }) => {
              return (
                <Button
                  className="buttonClass"
                  key={value}
                  size="sm"
                  onClick={() => setVerticalFilter(value)}
                >
                  {label}
                </Button>
              );
            })}
            {verticalFilter && (
              <div className="selectFilter">{verticalFilter}</div>
            )}
            <hr />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h6>
              <b>Select Region</b>
            </h6>
            {countryOption.map((country) => {
              return (
                <Button
                  className="buttonClass"
                  key={country}
                  size="sm"
                  onClick={() => setRegionFilter(country)}
                >
                  {country}
                </Button>
              );
            })}
            {regionFilter && <div className="selectFilter">{regionFilter}</div>}
            <hr />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h6>
              <b>Competitor</b>
            </h6>
            {Competitor.map((data) => {
              return (
                <Button
                  className="buttonClass"
                  key={data}
                  id={data}
                  size="sm"
                  onClick={() => setCompetitorFilter(data)}
                >
                  {data}
                </Button>
              );
            })}
            {competitorFilter && (
              <div className="selectFilter">{competitorFilter}</div>
            )}
            <hr />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h6>
              <b>Available for small business</b>
            </h6>
            {Competitor.map((data) => {
              return (
                <Button
                  className="buttonClass"
                  key={data}
                  id={data}
                  size="sm"
                  onClick={() => setCompetitorFilter(data)}
                >
                  {data}
                </Button>
              );
            })}
            {competitorFilter && (
              <div className="selectFilter">{competitorFilter}</div>
            )}
            <hr />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h6>
              <b>Area</b>
            </h6>
            {Area.map((data) => {
              return (
                <Button
                  className="buttonClass"
                  key={data}
                  id={data}
                  size="sm"
                  onClick={() => setAreaFilter(data)}
                >
                  {data}
                </Button>
              );
            })}
            {areaFilter && <div className="selectFilter">{areaFilter}</div>}
            <hr />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h6>
              <b>Business Impact</b>
            </h6>
            {BusinessBenefits.map((data) => {
              return (
                <Button
                  className="buttonClass"
                  key={data}
                  id={data}
                  size="sm"
                  onClick={() => setBusinessFilter(data)}
                >
                  {data}
                </Button>
              );
            })}
            {businessFilter && (
              <div className="selectFilter">{businessFilter}</div>
            )}
            <hr />
          </Col>
        </Row>
      </div>
      <Row>
        <Col md={12}>
          <h6 className="mb-3">
            <hr />
            <b>Unique to Zenoti</b>
          </h6>
          <div className="d-flex justify-content-center">
            <input type="checkbox" id="switch" className="switch" />
            <label className="round" htmlFor="switch">
              Toggle
            </label>
          </div>
          <hr />
        </Col>
      </Row>

      <Row>
        <Col md={6} sm={6} className="p-2 align-self-center text-center">
          <Button
            size="sm"
            className="float-sm-none float-right"
            onClick={() => applyFilter()}
          >
            Apply
          </Button>
        </Col>
        <Col md={6} sm={6} className="p-2 align-self-center text-center">
          <Button
            size="sm"
            className="float-sm-none float-right"
            onClick={() => resetFilter()}
          >
            Reset
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default FilterComponent;
