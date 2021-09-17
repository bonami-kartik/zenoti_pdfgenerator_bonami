import React, { useCallback, useEffect, useState } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { Table } from "../common";
import {
  getAdminList,
  getBusinessAreaList,
  getCompetitorList,
  getPillarList,
  getVerticalList,
  logVisitorEvent,
  getRegionList,
} from "../api/api";
import NoteModal from "./noteModal";
import PdfModal from "./pdfModal";
import NoteRenderer from "./NoteRenderer";
import TooltipRenderer from "./TooltipRenderer";
import HeaderCellRender from "./HeaderCellRender";
import SearchComponent from "./searchComponent";
import { SearchContext } from "./searchContext";
import AreaFilter from "./AreaFilter";
import { listFilterIcon } from "../utils/helper";
import publicIp from "public-ip";
import FilterComponent from "./filterComponent";

const pageSizes = [10, 20, 30, 40, 50, 100, 500];

const List = () => {
  const context = React.useContext(SearchContext);
  const [verticalOption, setVerticalOptions] = useState([]);
  const [competitorOption, setCompetitorOptions] = useState([]);
  const [pillarOption, setPillarOptions] = useState([]);
  const [businessAreaOption, setBusinessAreaOptions] = useState([]);

  useEffect(() => {
    getVerticalList().then((res) => {
      let list = res.map((v) => ({ value: v, label: v }));
      setVerticalOptions(list);
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
    getRegionList().then((res) => {
      let list = res.map((v) => ({ value: v, label: v }));
      setCountryOption(list);
    });
  }, []);

  const [defaultData, setDefaultData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [fetching, setFecthing] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [grid, setGrid] = useState(null);
  const [selectedRow, setSelectedRow] = useState({});
  const [noteModal, toggleModal] = useState(false);
  const [deleteNoteModal, toggleDeleteModal] = useState(false);
  const [pdfModal, togglePdfModal] = useState(false);
  const [countryOption, setCountryOption] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [areaFilterOption, setAreaFilterOption] = useState([]);
  const [steps, setSteps] = useState(false);
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
      let areaList = [];
      res.forEach((d, index) => {
        // if (d.country && !countryList.includes(d.country)) {
        //   countryList.push(d.country);
        // // }
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

  const onGridReady = (grid) => {
    setGrid(grid);
    if (fetching) grid.api.showLoadingOverlay();
  };

  useEffect(() => {
    if (grid) {
      grid.api.setFilterModel({
        ...grid.api.getFilterModel(),
        vertical: {
          filter: filter.vertical,
          filterType: "text",
          type: "contains",
        },
        // country: {
        //   filter: filter.country,
        //   filterType: "text",
        //   type: "equals",
        // },
      });
      grid.api.deselectAll();
    }
  }, [filter.vertical, filter.country]);

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
    let areaList = new Set();
    let DataList = new Set();

    defaultData.forEach((d) => {
      if (!filter.country && !filter.vertical && !filter.competitor) {
        areaList.add(d.area);
      } else if (!filter.vertical && filter.country) {
        if (d.country.toLowerCase() === filter.country.toLowerCase()) {
          areaList.add(d.area);
        }
      } else if (!filter.country && filter.vertical) {
        if (
          d.vertical.some(
            (e) => e.toLowerCase() === filter.vertical.toLowerCase()
          )
        ) {
          areaList.add(d.area);
        }
      } else {
        if (
          d.country.toLowerCase() === filter.country.toLowerCase() &&
          d.vertical.some(
            (e) => e.toLowerCase() === filter.vertical.toLowerCase()
          )
        ) {
          areaList.add(d.area);
        }
      }

      if (filter.business_area.length && !filter.vertical) {
        const checkdata = filter.business_area.map((area) => {
          return d.business_area.includes(area);
        });
        if (!checkdata.includes(false)) {
          DataList.add(d);
        }
      } else if (
        !filter.business_area.length &&
        filter.multipleVertical.length > 1
      ) {
        const checkdata = filter.multipleVertical.map((value, index) => {
          return d.vertical.includes(value);
        });
        if (!checkdata.includes(false)) {
          DataList.add(d);
        }
      } else if (
        filter.business_area.length &&
        filter.multipleVertical.length > 1
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

    setAreaFilterOption(Array.from(areaList));
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

  const changePageSize = (size) => {
    setPageSize(Number(size));
    grid.api.paginationSetPageSize(Number(size));
  };

  const openPdfModal = () => {
    togglePdfModal(!pdfModal);
  };

  const toggleNoteModal = (data, isEdit, callBack) => {
    setSelectedRow({ data, isEdit, callBack });
    toggleModal(!noteModal);
  };

  const toggleDelteNoteModal = (data, callBack) => {
    toggleDeleteModal(!deleteNoteModal);
    setSelectedRow({ data, callBack });
  };

  const saveNote = (data) => {
    const tableDataClone = [...defaultData];
    tableDataClone.map((t) => {
      if (t.id === selectedRow.data.id) {
        t.note = data.note;
      }
    });
    selectedRow.callBack();
    setDefaultData(tableDataClone);
    setSelectedRow({});
    toggleModal(!noteModal);
  };

  const deleteNote = () => {
    const tableDataClone = [...defaultData];
    tableDataClone.map((t) => {
      if (t.id === selectedRow.data.id) {
        t.note = "";
      }
    });
    selectedRow.callBack();
    setDefaultData(tableDataClone);
    setSelectedRow({});
    toggleDeleteModal(!deleteNoteModal);
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

  const sortObj =
    grid && grid.columnApi.getColumnState().filter((c) => c.sort).length > 0
      ? grid.columnApi.getColumnState().filter((c) => c.sort)[0]
      : null;

  const sendPublicIpToBackend = useCallback(async () => {
    try {
      const userIp = await publicIp.v4();

      if (userIp) {
        const data = {
          ip_address: userIp,
        };

        logVisitorEvent(data);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    sendPublicIpToBackend();
  }, []);
  const imageDropDown = () => {
    setSteps(!steps);
  };

  const handleFilterValue = (data) => {
    setFilter(data);
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
      minWidth: 120,
      tooltipField: "title",
      tooltipComponentParams: { width: 100 },
      headerComponentParams: HeaderCellRender({
        tooptip:
          "Feature summary. Select individual features or select all features by checking the box next to Feature.",
      }),
      comparator: (val1, val2) => {
        return val1.trim() < val2.trim() ? -1 : 1;
      },
      cellRenderer: "highlightCellRenderer",
    },
    {
      headerName: "Description",
      field: "description",
      flex: 3,
      minWidth: 120,
      tooltipField: "description",
      tooltipComponentParams: { width: 700 },
      headerComponentParams: HeaderCellRender({
        tooptip: "This appears in the PDF, along with any notes you add.",
      }),
      comparator: (val1, val2) => {
        return val1.trim() < val2.trim() ? -1 : 1;
      },
      cellRenderer: "highlightCellRenderer",
    },
    {
      headerName: "Unique to Zenoti",
      field: "differentiator",
      flex: 1,
      minWidth: 100,
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
      headerName: "Notes",
      field: "note",
      flex: 1,
      minWidth: 180,
      sortable: false,
      resizable: false,
      headerComponentParams: HeaderCellRender({
        tooptip:
          "Add a note specific to your opportunity. Once you close this tool, all your notes will disappear – so plan ahead!",
      }),
      tooltipField: "note",
      tooltipComponentParams: { width: 200 },
      cellRenderer: NoteRenderer,
      cellRendererParams: {
        toggleNoteModal: toggleNoteModal,
        toggleDelteNoteModal: toggleDelteNoteModal,
        getSearchString: () => context.searchString,
      },
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

  return (
    <>
      <Row className="my-3 align-items-center">
        <Col
          xl={6}
          lg={6}
          md={12}
          sm={12}
          className="d-flex justify-content-center"
        >
          <div
            className="card mb-1 steps_Search outerBorder w-100"
            style={{ height: "62px" }}
          >
            <div
              className="card-header d-flex justify-content-center align-items-center generate-pdf-card-header outerBorder text-center"
              style={{ height: "62px" }}
            >
              <h6 className="w-100 d-flex mb-0 justify-content-center align-items-center text-center text_size">
                Steps to generate PDF
              </h6>
              {!steps ? (
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
        <Col
          xl={6}
          lg={6}
          md={12}
          sm={12}
          className="d-flex justify-content-center"
        >
          <SearchComponent
            searchValue={searchValue}
            onSearchChange={(value) => {
              setSearchValue(value);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col
          xl={6}
          lg={6}
          md={12}
          sm={12}
          className="d-flex justify-content-center"
        >
          {steps && (
            <div className="steps_Search d-flex justify-content-center">
              <div className="card-body generate-pdf-card-body formtableBorder mb-5">
                <ol>
                  <li>Select vertical from dropdown filter.</li>
                  <li>Select region from dropdown filter.</li>
                  <li>Select at least one feature from table.</li>
                  <li>Click on generate PDF button.</li>
                </ol>
                <p className="font-weight-bold">
                  *You can create a PDF for one combination of vertical and
                  region at one time.
                </p>
              </div>
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col sm={12} lg={3} md={12}>
          <FilterComponent
            filter={filter}
            handleFilterChange={handleFilterValue}
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
              multiRowSelection
              rowSelection
              sortableAll
              showPagination
              hasCustomFilter
              handleFilterChange={handleFilterChange}
              onGridReady={onGridReady}
              rowPerPage={pageSize}
              columnDefObj={{ tooltipComponent: "customTooltip" }}
              customComponents={{
                customTooltip: TooltipRenderer,
                areaFilter: AreaFilter,
              }}
              onSelectionChanged={(grid) =>
                setSelectedRows(grid.api.getSelectedRows())
              }
            />
          </SearchContext.Provider>
        </Col>
      </Row>
      <Row className="my-3 justify-content-center">
        <Row>
          <Col lg={12} md={12} className="p-2 mt-2">
            <div className="d-flex flex-wrap justify-content-end align-items-center">
              <Button
                variant="primary"
                type="button"
                onClick={() => openPdfModal()}
                disabled={selectedRows.length === 0}
              >
                Generate PDF
              </Button>
            </div>
          </Col>
        </Row>
      </Row>
      <PdfModal
        filter={filter}
        gridObj={grid}
        pdfModal={pdfModal}
        togglePdfModal={openPdfModal}
        selectedRows={selectedRows}
        sortObj={sortObj}
      />
      <NoteModal
        noteModal={noteModal}
        deleteNoteModal={deleteNoteModal}
        selectedRow={selectedRow}
        toggleNoteModal={toggleNoteModal}
        toggleDelteNoteModal={toggleDelteNoteModal}
        saveNote={saveNote}
        deleteNote={deleteNote}
      />
    </>
  );
};

export default List;
