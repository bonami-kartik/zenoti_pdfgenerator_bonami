import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Table } from "../common";
import {
  getAdminList,
  addTemplate,
  addMulitpleTemplate,
  updateTemplate,
  deleteTemplate,
  bulkUploadData,
  getAreaList,
  getVerticalList,
  getRegionList,
  getBusinessAreaList,
  getCompetitorList,
  getPillarList,
} from "../api/api";
import AdminModal from "./adminModal";
import FilterComponent from "./filterComponent";
import { toastError, toastSuccess } from "../common/toast";
import TooltipRenderer from "./TooltipRenderer";
import HeaderCellRender from "./HeaderCellRender";
import BulkUploadFeature from "./bulkUploadFeature";
import SearchComponent from "./searchComponent";
import { SearchContext } from "./searchContext";
import AreaFilter from "./AreaFilter";
import { listFilterIcon } from "../utils/helper";

const pageSizes = [10, 20, 30, 40, 50, 100, 500];

const AdminList = () => {
  const context = React.useContext(SearchContext);
  const [verticalOption, setVerticalOptions] = useState([]);
  const [areaOption, setAreaOptions] = useState([]);
  const [regionOption, setRegionOptions] = useState([]);
  const [competitorOption, setCompetitorOptions] = useState([]);
  const [pillarOption, setPillarOptions] = useState([]);
  const [businessAreaOption, setBusinessAreaOptions] = useState([]);
  const [defaultData, setDefaultData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [fetching, setFecthing] = useState(false);
  const [grid, setGrid] = useState(null);
  const [selectedRow, setSelectedRow] = useState({});
  const [adminModal, toggleModal] = useState(false);
  const [deleteAdminModal, toggleDeleteModal] = useState(false);
  const [addProductFlag, setAddProductFlag] = useState(false);
  const [deleteProductFlag, setDeleteProductFlag] = useState(false);
  const [showUploadModal, toggleUploadModal] = useState(false);
  const [uploadFlag, toggleUploadFlag] = useState(false);
  const [countryOption, setCountryOption] = useState([]);
  const [areaFilterOption, setAreaFilterOption] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({
    vertical: "",
    country: "",
    competitor: [],
    business_benefits: [],
    multipleVertical: [],
    multipleRegion: [],
    pillar: [],
    theme: "",
    business_area: [],
    uniqueZenoti: false,
    smallBiz: false,
  });

  useEffect(() => {
    getVerticalList().then((res) => {
      let list = res.map((v) => ({ value: v, label: v }));
      setVerticalOptions(list);
    });
    getAreaList().then((res) => {
      let list = res.map((a) => ({ value: a, label: a }));
      setAreaOptions(list);
    });
    getRegionList().then((res) => {
      let list = res.map((r) => ({ value: r, label: r }));
      setRegionOptions(list);
      setCountryOption(list);
    });
    getCompetitorList().then((res) => {
      let list = res.map((v) => ({ value: v, label: v }));
      setCompetitorOptions(list);
    });
    getPillarList().then((res) => {
      let list = res.map((v) => ({ value: v, label: v }));
      setPillarOptions(list);
    });
    getBusinessAreaList().then((res) => {
      let list = res.map((v) => ({ value: v, label: v }));
      setBusinessAreaOptions(list);
    });
  }, []);

  const ActionRenderer = (props) => {
    return (
      <span className="mx-2">
        <FontAwesomeIcon
          className="mx-1 cursor-pointer"
          icon={faEdit}
          onClick={() => toggleAdminModal(props.data, true, props.refreshCell)}
        />
        <FontAwesomeIcon
          className="mx-1 cursor-pointer"
          icon={faTrash}
          onClick={() => toggleDeleteAdminModal(props.data, props.refreshCell)}
        />
      </span>
    );
  };

  const columnDefs = [
    {
      headerName: "Theme",
      field: "themes",
      flex: 2,
      minWidth: 120,
      tooltipField: "theme",
      tooltipComponentParams: { width: 100 },
    },
    {
      headerName: "Pillar",
      field: "brand_pillars",
      flex: 2,
      minWidth: 120,
      tooltipField: "pillar",
      tooltipComponentParams: { width: 100 },
    },
    {
      headerName: "Feature",
      field: "title",
      flex: 2,
      minWidth: 160,
      headerComponentParams: HeaderCellRender({
        tooptip:
          "Feature summary. Select individual features or select all features by checking the box next to Feature.",
      }),
      tooltipField: "title",
      tooltipComponentParams: { width: 100 },
      comparator: (val1, val2) => {
        return val1.trim() < val2.trim() ? -1 : 1;
      },
      cellRenderer: "highlightCellRenderer",
    },
    {
      headerName: "Description",
      field: "description",
      flex: 3,
      minWidth: 150,
      headerComponentParams: HeaderCellRender({
        tooptip: "This appears in the PDF, along with any notes you add.",
      }),
      tooltipField: "description",
      tooltipComponentParams: { width: 700 },
      comparator: (val1, val2) => {
        return val1.trim() < val2.trim() ? -1 : 1;
      },
      cellRenderer: "highlightCellRenderer",
    },
    {
      headerName: "Unique to Zenoti",
      field: "differentiator",
      flex: 1,
      minWidth: 135,
      headerComponentParams: HeaderCellRender({
        tooptip: "Sort on Yes to focus only on differentiators.",
      }),
      comparator: (val1) => {
        return val1 ? -1 : 1;
      },
      cellRenderer: "highlightCellRenderer",
      hide: true,
    },
    {
      headerName: "Business Impact",
      field: "business_benefits",
      flex: 2,
      minWidth: 140,
      headerComponentParams: HeaderCellRender({
        tooptip: "How will this optimize the business?",
      }),
      tooltipField: "business_benefits",
      tooltipComponentParams: { width: 250 },
      comparator: (val1, val2) => {
        return val1.trim() < val2.trim() ? -1 : 1;
      },
      cellRenderer: "highlightCellRenderer",
      hide: true,
    },
    {
      headerName: "Area",
      field: "area",
      flex: 1,
      minWidth: 125,
      headerComponentParams: HeaderCellRender({
        tooptip: "The feature grouping.",
      }),
      tooltipField: "area",
      tooltipComponentParams: { width: 150 },
      filter: "areaFilter",
      filterParams: { options: areaFilterOption },
      cellRenderer: "highlightCellRenderer",
      icons: {
        menu: listFilterIcon(),
      },
      hide: true,
    },
    {
      headerName: "Vertical",
      field: "vertical",
      flex: 1,
      minWidth: 105,
      tooltipField: "vertical",
      tooltipComponentParams: { width: 150 },
      filterParams: {
        caseSensitive: true,
      },
      cellRenderer: "highlightCellRenderer",
      hide: true,
    },
    {
      headerName: "Region",
      field: "country",
      flex: 1,
      minWidth: 100,
      cellRenderer: "highlightCellRenderer",
      hide: true,
    },
    {
      headerName: "Action",
      field: "",
      flex: 1,
      sortable: false,
      resizable: false,
      cellRendererFramework: (data) => <ActionRenderer {...data} />,
      minWidth: 100,
    },
  ];

  competitorOption.forEach(({ value }) => {
    columnDefs.push({
      headerName: value,
      flex: 1,
      field: value,
      minWidth: 100,
      hide: !(filter.competitor.includes(value) && filter.competitor.length),
    });
  });

  useEffect(() => {
    setFecthing(true);
    getTableData();
  }, [getTableData]);

  useEffect(() => {
    if (grid) {
      if (fetching) grid.api.showLoadingOverlay();
      if (!fetching) grid.api.hideOverlay();
    }
  }, [fetching]);

  const getTableData = useCallback(() => {
    setFecthing(true);
    getAdminList().then((res) => {
      // let countryList = [];
      // let areaList = [];
      res.forEach((d, index) => {
        // if (d.country && !countryList.includes(d.country)) {
        //   countryList.push(d.country);
        // }
        // if (d.area && !areaList.includes(d.area)) {
        //   areaList.push(d.area);
        // }
        // setAreaFilterOption(areaList);

        //testing data inserting in template list api
        if (index < 100) {
          d.brand_pillars = ["grow"];
          d.themes = ["theme6"];
          d.competitor = ["booker", "mbo"];
        } else if (index < 200) {
          d.brand_pillars = ["elevate cx", "unify", "grow"];
          d.themes = ["theme1"];
          d.competitor = ["salonbiz", "mbo"];
        } else if (index < 300) {
          d.brand_pillars = ["unify", "automate", "grow"];
          d.themes = ["theme4"];
          d.competitor = ["booker", "mbo"];
        } else if (index < 400) {
          d.brand_pillars = ["elevate cx"];
          d.themes = ["theme3"];
          d.competitor = ["booker", "mbo"];
        } else if (index < 500) {
          d.brand_pillars = ["elevate cx", "grow"];
          d.themes = ["theme2"];
          d.competitor = ["booker", "salonbiz"];
        } else {
          d.brand_pillars = ["automate", "grow"];
          d.themes = ["theme5"];
          d.competitor = ["booker", "mbo"];
        }
      });
      // setCountryOption(countryList);
      setDefaultData(res);
      setFecthing(false);
    });
  }, []);

  useEffect(() => {
    let searchData = [];
    if (searchValue) {
      let searchValueText = searchValue;
      searchValueText = searchValueText.replace(
        /[-[\]{}()*+?.,\\^$|#\s]/g,
        "\\$&"
      );
      const regex = new RegExp(`${searchValueText}`, "ig");
      context.searchString = searchValueText;
      defaultData.forEach((data) => {
        const searchObj = {
          title: data.title,
          area: data.area,
          brand_pillars: data.brand_pillars,
          business_area: data.business_area,
          business_benefits: data.business_benefits,
          country: data.country,
          description: data.description,
          differentiator: data.differentiator ? "Yes" : "No",
          small_biz: data.small_biz ? "Yes" : "No",
          vertical: data.vertical.join(),
          note: data.note || "",
        };
        if (Object.values(searchObj).join().match(regex)) {
          searchData.push(data);
        }
      });
    } else {
      searchData = [...defaultData];
    }
    setTableData(searchData);
    setTimeout(() => {
      if (grid) grid.api.refreshCells({ columns: ["note"], force: true });
    }, 1000);
  }, [searchValue]);

  // useEffect(() => {
  //   if (grid) {
  //     grid.api.setFilterModel({
  //       ...grid.api.getFilterModel(),
        // vertical: {
        //   filter: filter.vertical,
        //   filterType: "text",
        //   type: "contains",
        // },
        // country: {
        //   filter: filter.country,
        //   filterType: "text",
        //   type: "equals",
        // },
  //     });
  //   }
  // }, [filter.vertical, filter.country]);

  const BusinessImpactFilter = ({ business_benefits, smallBiz }, DataList) => {
    let searchData = [];
    if (business_benefits.length && !smallBiz) {
      DataList.forEach((data) => {
        const checkdata = business_benefits.map((benefit) => {
          let searchValueText = benefit;
          searchValueText = searchValueText.replace(
            /[-[\]{}()*+?.,\\^$|#\s]/g,
            "\\$&"
          );
          const regex = new RegExp(`${searchValueText}`, "ig");
          context.searchString = searchValueText;

          const searchObj = {
            business_benefits: data.business_benefits,
          };
          return Object.values(searchObj).join().match(regex) ? true : false;
        });

        if (!checkdata.includes(false)) {
          searchData.push(data);
        }
      });
    } else if (!business_benefits.length && smallBiz) {
      DataList.forEach((data) => {
        if (data.small_biz) {
          searchData.push(data);
        }
      });
    } else if (business_benefits.length && smallBiz) {
      DataList.forEach((data) => {
        const checkdata = business_benefits.map((benefit) => {
          let searchValueText = benefit;
          searchValueText = searchValueText.replace(
            /[-[\]{}()*+?.,\\^$|#\s]/g,
            "\\$&"
          );
          const regex = new RegExp(`${searchValueText}`, "ig");
          context.searchString = searchValueText;

          const searchObj = {
            business_benefits: data.business_benefits,
          };
          return Object.values(searchObj).join().match(regex) && data.small_biz
            ? true
            : false;
        });

        if (!checkdata.includes(false)) {
          searchData.push(data);
        }
      });
    }

    return searchData;
  };

  const MultipleRegionFilter = (value, DataList) => {
    let filterData = new Set();
    DataList.forEach((data) => {
      if (value.multipleRegion.includes(data.country)) {
        filterData.add(data);
      }
    });
    return filterData;
  };

  const MultipleCompetitorCompare = (value, DataList) => {
    let filterData = new Set();
    DataList.forEach((data) => {
      if (value.competitor.length && !value.uniqueZenoti) {
        value.competitor.forEach((val) => {
          if (data.competitor.includes(val)) {
            data[val] = "✔";
          } else {
            data[val] = "✗";
          }
        });

        filterData.add(data);
      } else if (value.competitor.length && value.uniqueZenoti) {
        const checkingvalue = value.competitor.map((val) => {
          if (data.differentiator === true && !data.competitor.includes(val)) {
            data[val] = "✗";
            return true;
          } else {
            data[val] = "✔";
            return false;
          }
        });
        if (!checkingvalue.includes(false)) {
          filterData.add(data);
        }
      } else if (value.competitor.length === 0 && value.uniqueZenoti) {
        if (data.differentiator === true) {
          filterData.add(data);
        }
      }
    });

    return filterData;
  };

  const PillarAndTheme = ({ pillar, theme }, DataList) => {
    let pillarAndthemeList = new Set();
    DataList.forEach((data) => {
      if (data.brand_pillars || data.themes) {
        if (!pillar.length && theme) {
          if (data.themes.includes(theme)) {
            pillarAndthemeList.add(data);
          }
        } else if (pillar.length && !theme) {
          let dataChecked = pillar.map((pillar_data) => {
            return data.brand_pillars.includes(pillar_data);
          });
          if (!dataChecked.includes(false)) {
            pillarAndthemeList.add(data);
          }
        } else if (pillar.length && theme) {
          let dataChecked = pillar.map((pillar_data) => {
            return (
              data.brand_pillars.includes(pillar_data) &&
              data.themes.includes(theme)
            );
          });

          if (!dataChecked.includes(false)) {
            pillarAndthemeList.add(data);
          }
        }
      }
    });
    return pillarAndthemeList;
  };

  useEffect(() => {
    // let areaList = new Set();
    let DataList = new Set();

    defaultData.forEach((d) => {
      
      // if (!filter.country && !filter.vertical && !filter.competitor) {
      //   areaList.add(d.area);
      // } else if (!filter.vertical && filter.country) {
      //   if (d.country.toLowerCase() === filter.country.toLowerCase()) {
      //     areaList.add(d.area);
      //   }
      // } else if (!filter.country && filter.vertical) {
      //   if (
      //     d.vertical.some(
      //       (e) => e.toLowerCase() === filter.vertical.toLowerCase()
      //     )
      //   ) {
      //     areaList.add(d.area);
      //   }
      // } else {
      //   if (
      //     d.country.toLowerCase() === filter.country.toLowerCase() &&
      //     d.vertical.some(
      //       (e) => e.toLowerCase() === filter.vertical.toLowerCase()
      //     )
      //   ) {
      //     areaList.add(d.area);
      //   }
      // }

      if (filter.business_area.length && !filter.vertical) {
        const checkdata = filter.business_area.map((area) => {
          return d.business_area.includes(area);
        });
        if (!checkdata.includes(false)) {
          DataList.add(d);
        }
      } else if (
        !filter.business_area.length &&
        filter.multipleVertical.length
      ) {
        const checkdata = filter.multipleVertical.map((value, index) => {
          return d.vertical.includes(value);
        });
        if (!checkdata.includes(false)) {
          DataList.add(d);
        }
      } else if (
        filter.business_area.length &&
        filter.multipleVertical.length
      ) {
        const checkdata_vertical = filter.multipleVertical.map((value) => {
          return d.vertical.includes(value);
        });
        const checkdata_area = filter.business_area.map((area) => {
          return d.business_area.includes(area);
        });

        if (
          !checkdata_vertical.includes(false) &&
          !checkdata_area.includes(false)
        ) {
          DataList.add(d);
        }
      } else {
        DataList.add(d);
      }
    });

    if (filter.multipleRegion.length) {
      DataList = MultipleRegionFilter(filter, DataList);
    }

    if (filter.competitor.length || filter.uniqueZenoti) {
      DataList = MultipleCompetitorCompare(filter, DataList);
    }

    if (filter.business_benefits.length || filter.smallBiz) {
      DataList = BusinessImpactFilter(filter, DataList);
    }

    if (filter.pillar.length || filter.theme) {
      DataList = PillarAndTheme(filter, DataList);
    }

    setTableData(Array.from(DataList));

    // setAreaFilterOption(Array.from(areaList));
    if (grid) {
      grid.api.destroyFilter("area");
    }
  }, [
    grid,
    defaultData,
    filter.vertical,
    filter.country,
    filter.competitor.length,
    filter.business_area.length,
    filter.uniqueZenoti,
    filter.business_benefits.length,
    filter.pillar.length,
    filter.theme,
    filter.smallBiz,
  ]);

  const onGridReady = (grid) => {
    setGrid(grid);
    if (fetching) grid.api.showLoadingOverlay();
  };

  const changePageSize = (size) => {
    setPageSize(Number(size));
    grid.api.paginationSetPageSize(Number(size));
  };

  const handleFilterChange = ({ vertical, country }) => {
    if (filter.vertical && filter.country) {
      return vertical.includes(filter.vertical) && country === filter.country;
    } else {
      if (filter.vertical) {
        return vertical.includes(filter.vertical);
      }
      if (filter.country) {
        return country === filter.country;
      }
      return true;
    }
  };

  const toggleAdminModal = (data, isEdit, callBack) => {
    setSelectedRow({ data, isEdit, callBack });
    toggleModal(!adminModal);
    setAddProductFlag(false);
  };

  const toggleDeleteAdminModal = (data, callBack) => {
    setSelectedRow({ data, callBack });
    toggleDeleteModal(!deleteAdminModal);
    setDeleteProductFlag(false);
  };

  const saveProduct = (data) => {
    console.log(data);
    setAddProductFlag(true);
    const isEdit = selectedRow.data && selectedRow.data.id;
    let apiCall = null;
    if (isEdit) {
      apiCall = updateTemplate(selectedRow.data.id, data);
    } else if (data.country.length > 1) {
      const { country, ...rest } = data;
      const newData = { ...rest };
      newData.countries = country;
      apiCall = addMulitpleTemplate(newData);
    } else if (data.competitors.length > 1) {
      const { competitors, ...rest } = data;
      const newData = { ...rest };
      newData.competitors = competitors;
      apiCall = addMulitpleTemplate(newData);
    } else {
      data.country = data.country[0];
      data.competitors = data.competitors[0];
      apiCall = addTemplate(data);
    }
    
    apiCall
      .then(() => {
        toastSuccess(`Feature ${isEdit ? "updated" : "added"} successfully.`);
        getTableData();
        setSelectedRow({});
        toggleModal(!adminModal);
        setAddProductFlag(false);
      })
      .catch(() => {
        toastError("Something went wrong.");
        setAddProductFlag(false);
      });
  };

  const deleteProduct = () => {
    setDeleteProductFlag(true);
    deleteTemplate(selectedRow.data.id)
      .then(() => {
        toastSuccess("Feature deleted successfully.");
        getTableData();
        setSelectedRow({});
        toggleDeleteModal(!deleteAdminModal);
        setDeleteProductFlag(false);
      })
      .catch(() => {
        toastError("Something went wrong.");
        setDeleteProductFlag(false);
      });
  };

  const UploadCsv = (data) => {
    toggleUploadFlag(true);
    bulkUploadData(data)
      .then(() => {
        toastSuccess("Data uploaded successfully.");
        getTableData();
        toggleUploadFlag(false);
        toggleUploadModal(!showUploadModal);
      })
      .catch(() => {
        toastError(
          "Something wrong with format or order of columns, please try with the sample format attached."
        );
        toggleUploadFlag(false);
      });
  };

  const modifyPillar = pillarOption.map((c) => {
    let [v] = Object.keys(c.value);
    return { value: v, label: v };
  });

  let themeData = new Set();
  pillarOption.forEach(({ value }) => {
    value[Object.keys(value)].forEach((data) => {
      themeData.add({ value: data, label: data });
    });
  });

  const modifyThemeData = Array.from(themeData);

  return (
    <>
      <Row className="my-3 align-items-center">
        <Col lg={6} md={6} sm={12}>
          <SearchComponent
            searchValue={searchValue}
            onSearchChange={(value) => {
              setSearchValue(value);
            }}
          />
        </Col>
        <Col lg={6} md={6} sm={12} className="p-2">
          <div className="d-flex flex-wrap justify-content-end align-items-center my-3">
            <Button
              variant="primary"
              type="button"
              className="ml-2 mb-2 button_small"
              onClick={() => toggleUploadModal(!showUploadModal)}
            >
              Bulk Upload
            </Button>
            <Button
              variant="primary"
              type="button"
              className="ml-2 mb-2 button_small"
              onClick={() => toggleAdminModal(null)}
            >
              Add Feature
            </Button>
          </div>
        </Col>

        {/* <Col sm={12}>
          {" "}
          <Row>
            <Col lg={7} md={6} sm={12}>
              <SearchComponent
                searchValue={searchValue}
                onSearchChange={(value) => {
                  setSearchValue(value);
                }}
              />
            </Col>

            <Col lg={5} md={6} sm={12} className="align-self-center">
              <Form inline className="float-right">
                <Form.Group className="mt-0">
                  <Form.Label className="mr-3">Page size:</Form.Label>
                  <Form.Control
                    as="select"
                    size="sm"
                    custom
                    className="page-size-dropdwon"
                    value={pageSize}
                    onChange={(e) => {
                      changePageSize(e.target.value);
                    }}
                  >
                    {pageSizes.map((page) => (
                      <option
                        key={page}
                        value={page}
                        disabled={tableData.length < page}
                      >
                        {page}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Col> */}
      </Row>
      <Row>
        <Col sm={12} lg={3} md={12}>
          <FilterComponent
            filter={filter}
            handleFilterChange={(data) => {
              setFilter(data);
            }}
            countryOption={countryOption}
            verticalOption={verticalOption}
            competitorOption={competitorOption}
            pillarOption={pillarOption}
            businessAreaOption={businessAreaOption}
          />
        </Col>
        <Col sm={12} lg={9} md={12}>
          <SearchContext.Provider value={{ searchString: searchValue }}>
            <Table
              columns={columnDefs}
              data={tableData}
              sortableAll
              showPagination
              hasCustomFilter
              handleFilterChange={handleFilterChange}
              rowPerPage={pageSize}
              onGridReady={onGridReady}
              columnDefObj={{ tooltipComponent: "customTooltip" }}
              customComponents={{
                customTooltip: TooltipRenderer,
                areaFilter: AreaFilter,
              }}
            />
          </SearchContext.Provider>
        </Col>
      </Row>
      <AdminModal
        adminModal={adminModal}
        deleteAdminModal={deleteAdminModal}
        addProductFlag={addProductFlag}
        deleteProductFlag={deleteProductFlag}
        selectedRow={selectedRow}
        verticalOption={verticalOption}
        areaOption={areaOption}
        regionOption={regionOption}
        competitorOption={competitorOption}
        pillarOption={modifyPillar}
        themeOption={modifyThemeData}
        businessAreaOption={businessAreaOption}
        toggleAdminModal={toggleAdminModal}
        toggleDeleteAdminModal={toggleDeleteAdminModal}
        saveProduct={saveProduct}
        deleteProduct={deleteProduct}
      />
      <BulkUploadFeature
        show={showUploadModal}
        toggleModal={toggleUploadModal}
        upload={UploadCsv}
        uploadFlag={uploadFlag}
        verticalOption={verticalOption}
        areaOption={areaOption}
        regionOption={regionOption}
        competitorOption={competitorOption}
        pillarOption={pillarOption}
        businessAreaOption={businessAreaOption}
      />
    </>
  );
};

export default AdminList;
