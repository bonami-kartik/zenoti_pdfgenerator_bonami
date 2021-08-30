import React, { useState, useEffect } from "react";
import { ReactDOM } from "react";
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

  const [uniqueZenoti, setUniqueZenoti] = useState(false);

  const applyFilter = () => {
    handleFilterChange({
      vertical: verticalFilter,
      country: regionFilter,
      competitor: competitorFilter,
      area: areaFilter,
      business_benefits: businessFilter,
      uniqueZenoti,
    });
  };

  useEffect(() => {
    handleFilterChange({
      vertical: verticalFilter,
      country: regionFilter,
      competitor: competitorFilter,
      area: areaFilter,
      business_benefits: businessFilter,
      uniqueZenoti,
    });
  }, [uniqueZenoti]);

  const resetFilter = () => {
    const AllButton = document.querySelectorAll(".buttonClass");
    AllButton.forEach((data) => {
      if (data.classList.value.includes("buttonClass-active")) {
        data.classList.remove("buttonClass-active");
      }
    });
    document.getElementById("switch").checked = false;
    setVerticalFilter("");
    setRegionFilter("");
    setCompetitorFilter("");
    setAreaFilter("");
    setBusinessFilter("");
    setUniqueZenoti(false);
    const filterObj = { ...filter };
    Object.keys(filterObj).map((key) => (filterObj[key] = ""));
    handleFilterChange(filterObj);
  };

  const Competitor = ["Booker", "MBO", "Salonbiz", "Phorest"];
  const Area = ["R&A", "Packages", "Payments", "Reports & Analytics"];
  const BusinessBenefits = ["Streamline operations", "unify the business"];

  const onChange = (index, value, Filter) => {
    const firstvalue = index.split("_");
    const spanButton = document.querySelector(`#${index}`);

    const spanButtonAll = document.querySelectorAll(`.${firstvalue[0]}`);

    if (firstvalue[0] == "Competitor") {
      if (spanButton.classList.value.includes("buttonClass-active")) {
        spanButton.classList.remove("buttonClass-active");
        Filter("");
      } else {
        spanButton.classList.add("buttonClass-active");
        Filter(value);
      }
    } else {
      if (spanButton.classList.value.includes("buttonClass-active")) {
        spanButton.classList.remove("buttonClass-active");
        Filter("");
      } else {
        spanButtonAll.forEach((data) => {
          if (data.classList.value.includes("buttonClass-active")) {
            data.classList.remove("buttonClass-active");
          }
        });
        spanButton.classList.add("buttonClass-active");
        Filter(value);
      }
    }
  };

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
            {verticalOption.map(({ value }, index) => {
              return (
                <span
                  className="buttonClass btn btn-sm verticalOption"
                  key={value}
                  id={`verticalOption_${index}`}
                  size="sm"
                  onClick={() =>
                    onChange(
                      `verticalOption_${index}`,
                      value,
                      setVerticalFilter
                    )
                  }
                >
                  {value}
                </span>
              );
            })}
            <hr />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h6>
              <b>Select Region</b>
            </h6>
            {countryOption.map((country, index) => {
              return (
                <span
                  className="buttonClass btn btn-sm countryOption"
                  key={country}
                  id={`countryOption_${index}`}
                  size="sm"
                  onClick={() =>
                    onChange(`countryOption_${index}`, country, setRegionFilter)
                  }
                >
                  {country}
                </span>
              );
            })}
            <hr />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h6>
              <b>Competitor</b>
            </h6>
            {Competitor.map((data, index) => {
              return (
                <span
                  className="buttonClass btn btn-sm Competitor"
                  key={data}
                  id={`Competitor_${index}`}
                  size="sm"
                  onClick={() =>
                    onChange(`Competitor_${index}`, data, setCompetitorFilter)
                  }
                >
                  {data}
                </span>
              );
            })}
            <hr />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h6>
              <b>Available for small business</b>
            </h6>
            {Competitor.map((data, index) => {
              return (
                <span
                  className="buttonClass btn btn-sm Aval_Business"
                  key={data}
                  id={`Aval_Business_${index}`}
                  size="sm"
                  onClick={() =>
                    onChange(
                      `Aval_Business_${index}`,
                      data,
                      setCompetitorFilter
                    )
                  }
                >
                  {data}
                </span>
              );
            })}
            <hr />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h6>
              <b>Area</b>
            </h6>
            {Area.map((data, index) => {
              return (
                <span
                  className="buttonClass btn btn-sm Area"
                  key={`Area_${index}`}
                  id={`Area_${index}`}
                  size="sm"
                  onClick={() => onChange(`Area_${index}`, data, setAreaFilter)}
                >
                  {data}
                </span>
              );
            })}
            <hr />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h6>
              <b>Business Impact</b>
            </h6>
            {BusinessBenefits.map((data, index) => {
              return (
                <span
                  className="buttonClass btn btn-sm Business"
                  key={data}
                  id={`Business_${index}`}
                  size="sm"
                  onClick={() =>
                    onChange(`Business_${index}`, data, setBusinessFilter)
                  }
                >
                  {data}
                </span>
              );
            })}
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
            <input
              type="checkbox"
              id="switch"
              className="switch"
              onChange={() => {
                setUniqueZenoti(!uniqueZenoti);
              }}
            />
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
