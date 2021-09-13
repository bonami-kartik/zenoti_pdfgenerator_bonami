import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";

const UserFilterComponent = ({
  filter,
  handleFilterChange,
  verticalOption,
  countryOption,
  Filtertheme,
  competitorOption,
  pillarOption,
  businessAreaOption,
}) => {
  const [verticalFilter, setVerticalFilter] = useState("");
  const [multipleVerticalFilter, setMultipleVerticalFilter] = useState([]);
  const [regionFilter, setRegionFilter] = useState("");
  const [competitorFilter, setCompetitorFilter] = useState([]);
  const [areaFilter, setAreaFilter] = useState("");
  const [businessFilter, setBusinessFilter] = useState("");
  const [pillarFilter, setPillarFilter] = useState([]);
  const [themeFilter, setThemeFilter] = useState("");
  const [dependentThemeFilter, setDependentThemeFilter] = useState([]);
  const [uniqueZenoti, setUniqueZenoti] = useState(false);
  const [scrollOpen, setScrollOpen] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [steps, setSteps] = useState(false);
  const applyFilter = () => {
    handleFilterChange({
      vertical: verticalFilter,
      country: regionFilter,
      multipleVertical: multipleVerticalFilter,
      competitor: competitorFilter,
      area: areaFilter,
      business_benefits: businessFilter,
      pillar: pillarFilter,
      theme: themeFilter,
      uniqueZenoti,
    });
  };

  window.addEventListener("resize", (e) => {
    if (e.currentTarget.innerWidth < 770) {
      setMobileView(true);
      setScrollOpen(true);
      setSteps(true);
    } else {
      setMobileView(false);
      setScrollOpen(false);
      setSteps(false);
    }
  });

  const onSelectChange = () => {
    const themeValue = document.getElementById("themefilter").value;
    setThemeFilter(themeValue);
  };

  // console.log(pillarFilter.length);
  useEffect(() => {
    if (pillarFilter.length > 0) {
      let themeData = new Set();
      pillarFilter.forEach((pillarSelectData) => {
        pillarOption.forEach(({ value }) => {
          if (value[pillarSelectData]) {
            value[pillarSelectData].forEach((data) => {
              themeData.add(data);
            });
          }
        });
      });
      setDependentThemeFilter(Array.from(themeData));
    } else {
      setDependentThemeFilter(Filtertheme);
    }
  }, [pillarFilter.length, Filtertheme]);

  useEffect(() => {
    if (window.screen.availWidth < 770) {
      setMobileView(true);
      setSteps(true);
      setScrollOpen(true);
    } else {
      setMobileView(false);
      setScrollOpen(false);
      setSteps(false);
    }
  }, []);

  useEffect(() => {
    handleFilterChange({
      vertical: verticalFilter,
      country: regionFilter,
      multipleVertical: multipleVerticalFilter,
      competitor: competitorFilter,
      area: areaFilter,
      business_benefits: businessFilter,
      pillar: pillarFilter,
      theme: themeFilter,
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
    setCompetitorFilter([]);
    setMultipleVerticalFilter([]);
    setAreaFilter("");
    setBusinessFilter("");
    setPillarFilter([]);
    setThemeFilter("");
    setUniqueZenoti(false);
    const filterObj = { ...filter };
    Object.keys(filterObj).map((key) => (filterObj[key] = ""));
    handleFilterChange(filterObj);
  };

  //testing data filters api alternative
  const Competitor = ["Booker", "MBO", "Salonbiz", "Phorest", "Boulevard"];
  const Area = ["R&A", "Packages", "Payments", "Reports & Analytics"];
  const BusinessBenefits = ["Streamline operations", "unify the business"];

  const onChange = (index, value, Filter) => {
    const firstvalue = index.split("_");
    const spanButton = document.querySelector(`#${index}`);

    const spanButtonAll = document.querySelectorAll(`.${firstvalue[0]}`);

    if (firstvalue[0] == "Competitor") {
      if (spanButton.classList.value.includes("buttonClass-active")) {
        spanButton.classList.remove("buttonClass-active");

        let newCompetitorFilter = competitorFilter;
        const index = newCompetitorFilter.indexOf(value);
        if (index > -1) {
          newCompetitorFilter.splice(index, 1);
          Filter(newCompetitorFilter);
        }
      } else {
        spanButton.classList.add("buttonClass-active");
        Filter(Array.from(new Set([...competitorFilter, value])));
      }
    } else if (firstvalue[0] == "verticalOption") {
      if (spanButton.classList.value.includes("buttonClass-active")) {
        spanButton.classList.remove("buttonClass-active");
        Filter("");
        let multipleFilter = multipleVerticalFilter;
        const index = multipleFilter.indexOf(value);
        if (index > -1) {
          multipleFilter.splice(index, 1);
          setMultipleVerticalFilter(multipleFilter);
          if (multipleVerticalFilter.length === 1) {
            Filter(multipleVerticalFilter[0]);
          }
        }
      } else {
        spanButton.classList.add("buttonClass-active");
        Filter(value);
        setMultipleVerticalFilter(
          Array.from(new Set([...multipleVerticalFilter, value]))
        );
      }
    } else if (firstvalue[0] == "Pillar") {
      const [destructurePillarData] = value;
      if (spanButton.classList.value.includes("buttonClass-active")) {
        spanButton.classList.remove("buttonClass-active");

        let newPillarFilter = pillarFilter;
        const index = newPillarFilter.indexOf(destructurePillarData);
        if (index > -1) {
          newPillarFilter.splice(index, 1);
          Filter(Array.from(new Set(newPillarFilter)));
        }
      } else {
        spanButton.classList.add("buttonClass-active");
        Filter(Array.from(new Set([...pillarFilter, destructurePillarData])));
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

  const imageDropDown = () => {
    setSteps(!steps);
  };

  // const onThemeUpdate = () => {
  //   console.log(pillarFilter);
  //   if (pillarFilter.length > 0) {
  //   }
  // let themeData = new Set();
  // if (pillarFilter.length > 0) {
  //   filterOption.forEach((dataValue)=>{
  //     themeData.add(dataValue);
  //     console.log(dataValue);
  //   });
  //   themeData.add(filterOption);
  // }

  // pillarOption.forEach(({ value }) => {
  //   // const [data] = value;
  //   if (value[pillarKey]) {
  //     value[pillarKey].forEach((dataKey) => {
  //       themeData.add(dataKey);
  //     });
  //   }
  // newPillarOption.add(data[pillarKey]);
  // });

  // setFilterOption(Array.from(themeData));
  // };

  return (
    <div className="mb-4">
      {mobileView && (
        <Row>
          <Col md={6} sm={6} className="d-flex justify-content-center">
            <div className="card mb-3 steps_Search outerBorder">
              <div
                className="card-header d-flex justify-content-center align-items-center generate-pdf-card-header outerBorder text-center"
                style={{ height: "60px" }}
              >
                <h5 className="w-100 d-flex justify-content-center align-items-center text-center mb-0">
                  Filters
                </h5>
                {steps ? (
                  <img
                    src="../assets/plus2.png"
                    className="plus_image"
                    onClick={imageDropDown}
                  />
                ) : (
                  <img
                    src="../assets/minus.png"
                    className="plus_image"
                    onClick={imageDropDown}
                  />
                )}
              </div>
            </div>
          </Col>
          <Col md={6} sm={6} className="d-flex justify-content-center">
            <div
              className="card mb-3 steps_Search outerBorder w-100"
              style={{ height: "60px" }}
            >
              <div className="card-header d-flex justify-content-center align-items-center generate-pdf-card-header outerBorder text-center">
                <h6 className="w-100 d-flex justify-content-center align-items-center text-center mb-0">
                  <b>Only on Zenoti</b>
                </h6>
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
            </div>
          </Col>
        </Row>
      )}
      {!steps && (
        <div
          className={`formBorder section-padding filterHeight formtableBorder ${
            mobileView && "transparent_background"
          }`}
          style={{ height: "65vh" }}
        >
          <div
            className="filter-scroll"
            style={!scrollOpen ? { overflow: "hidden" } : { overflowY: "auto" }}
          >
            <Row>
              <Col md={12}>
                <h6>
                  <b>Vertical</b>
                </h6>
                {verticalOption.map(({ value }, index) => {
                  return (
                    <span
                      className="buttonClass btn btn-sm verticalOption"
                      key={`verticalOption_${index}`}
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
                      key={`countryOption_${index}`}
                      id={`countryOption_${index}`}
                      size="sm"
                      onClick={() =>
                        onChange(
                          `countryOption_${index}`,
                          country,
                          setRegionFilter
                        )
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
                  <b>Compare With</b>
                </h6>
                {competitorOption.map(({ value }, index) => {
                  return (
                    <span
                      className="buttonClass btn btn-sm Competitor"
                      key={`Competitor_${index}`}
                      id={`Competitor_${index}`}
                      size="sm"
                      onClick={() =>
                        onChange(
                          `Competitor_${index}`,
                          value,
                          setCompetitorFilter
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
                  <b>Available for small business</b>
                </h6>
                {Competitor.map((data, index) => {
                  return (
                    <span
                      className="buttonClass btn btn-sm Aval_Business"
                      key={`Aval_Business_${index}`}
                      id={`Aval_Business_${index}`}
                      size="sm"
                      // onClick={() =>
                      //   onChange(
                      //     `Aval_Business_${index}`,
                      //     data,
                      //     setCompetitorFilter
                      //   )
                      // }
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
                {businessAreaOption.map(({ value }, index) => {
                  return (
                    <span
                      className="buttonClass btn btn-sm Area"
                      key={`Area_${index}`}
                      id={`Area_${index}`}
                      size="sm"
                      onClick={() =>
                        onChange(`Area_${index}`, value, setAreaFilter)
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
                  <b>Business Impact</b>
                </h6>
                {BusinessBenefits.map((data, index) => {
                  return (
                    <span
                      className="buttonClass btn btn-sm Business"
                      key={`Business_${index}`}
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
            <Row>
              <Col md={12}>
                <h6>
                  <b>Pillar</b>
                </h6>
                {pillarOption.map(({ value }, index) => {
                  return (
                    <span
                      className="buttonClass btn btn-sm Pillar"
                      key={`Pillar_${index}`}
                      id={`Pillar_${index}`}
                      size="sm"
                      onClick={() => {
                        onChange(
                          `Pillar_${index}`,
                          Object.keys(value),
                          setPillarFilter
                        );
                        // onThemeUpdate(Object.keys(value));
                      }}
                    >
                      {Object.keys(value)}
                    </span>
                  );
                })}

                <hr />
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <h6>
                  <b>Themes</b>
                </h6>
                <div className="d-flex justify-content-center">
                  <select
                    className="select_dropdown btn btn-sm Theme"
                    id="themefilter"
                    onChange={onSelectChange}
                    defaultValue={"DEFAULT"}
                    style={{ width: "70%" }}
                  >
                    <option value="">Select Theme</option>
                    {dependentThemeFilter.map((data, index) => {
                      return (
                        <option key={index} value={data}>
                          {data}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </Col>
            </Row>
          </div>
          {!mobileView && (
            <Row>
              <Col md={12}>
                {!scrollOpen && (
                  <a
                    className="view_all_filter"
                    onClick={() => setScrollOpen(!scrollOpen)}
                  >
                    <b>View All ...</b>
                  </a>
                )}
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
          )}

          <Row>
            <Col
              md={6}
              sm={6}
              className="p-2 filterButton d-flex justify-content-center"
            >
              <Button
                size="sm"
                className="float-sm-none float-right"
                onClick={() => applyFilter()}
              >
                Apply
              </Button>
            </Col>
            <Col
              md={6}
              sm={6}
              className="p-2 filterButton d-flex justify-content-center"
            >
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
      )}
    </div>
  );
};

export default UserFilterComponent;
