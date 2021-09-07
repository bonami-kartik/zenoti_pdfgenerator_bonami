import React, { useCallback, useEffect, useState } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { Table } from "../common";
import { getAdminList, getVerticalList, logVisitorEvent } from "../api/api";
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
import Data from "./data.json";
import UserFilterComponent from "./userfilterComponent";

const pageSizes = [10, 20, 30, 40, 50, 100, 500];

const List = () => {
  const context = React.useContext(SearchContext);
  const [verticalOption, setVerticalOptions] = useState([]);

  useEffect(() => {
    getVerticalList().then((res) => {
      let list = res.map((v) => ({ value: v, label: v }));
      setVerticalOptions(list);
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
    area: "",
    business_benefits: "",
    pillar: "",
    theme: "",
    uniqueZenoti: false,
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
      let countryList = [];
      let areaList = [];
      res.forEach((d, index) => {
        if (d.country && !countryList.includes(d.country)) {
          countryList.push(d.country);
        }
        if (d.area && !areaList.includes(d.area)) {
          areaList.push(d.area);
        }
        setAreaFilterOption(areaList);

        if (index > 100) {
          d.pillar = "pillar1";
          d.theme = "theme6";
          d.competitor = {
            Booker: "N",
            MBO: "N",
            Salonbiz: "N",
            Phorest: "N",
            Boulevard: "N",
          };
        } else if (100 < index > 200) {
          d.pillar = "pillar2";
          d.theme = "theme5";
          d.competitor = {
            Booker: "Y",
            MBO: "Y",
            Salonbiz: "Y",
            Phorest: "Y",
            Boulevard: "Y",
          };
        } else if (200 < index > 300) {
          d.pillar = "pillar3";
          d.theme = "theme4";
          d.competitor = {
            Booker: "Y",
            MBO: "Y",
            Salonbiz: "Y",
            Phorest: "Y",
            Boulevard: "Y",
          };
        } else if (300 < index > 400) {
          d.pillar = "pillar4";
          d.theme = "theme3";
          d.competitor = {
            Booker: "Y",
            MBO: "Y",
            Salonbiz: "Y",
            Phorest: "Y",
            Boulevard: "Y",
          };
        } else if (400 < index > 500) {
          d.pillar = "pillar5";
          d.theme = "theme2";
          d.competitor = {
            Booker: "Y",
            MBO: "Y",
            Salonbiz: "Y",
            Phorest: "Y",
            Boulevard: "Y",
          };
        } else {
          d.pillar = "pillar6";
          d.theme = "theme1";
          d.competitor = {
            Booker: "Y",
            MBO: "Y",
            Salonbiz: "Y",
            Phorest: "Y",
            Boulevard: "Y",
          };
        }
      });
      setCountryOption(countryList);
      setDefaultData(res);
      setFecthing(false);
    });

    // let countryList = [];
    // let areaList = [];
    // Data.forEach((d, index) => {
    //   if (d.country && !countryList.includes(d.country)) {
    //     countryList.push(d.country);
    //   }
    //   if (d.area && !areaList.includes(d.area)) {
    //     areaList.push(d.area);
    //   }
    //   setAreaFilterOption(areaList);
    //   if (index < 10) {
    //     d.pillar = "pillar1";
    //     d.theme = "theme6";
    //     d.competitor = {
    //       Booker: "Y",
    //       MBO: "N",
    //       Salonbiz: "Y",
    //       Phorest: "Y",
    //       Boulevard: "Y",
    //     };
    //   } else if (index < 20) {
    //     d.pillar = "pillar2";
    //     d.theme = "theme5";
    //     d.competitor = {
    //       Booker: "N",
    //       MBO: "N",
    //       Salonbiz: "Y",
    //       Phorest: "Y",
    //       Boulevard: "Y",
    //     };
    //   } else if (index < 30) {
    //     d.pillar = "pillar3";
    //     d.theme = "theme4";
    //     d.competitor = {
    //       Booker: "Y",
    //       MBO: "Y",
    //       Salonbiz: "Y",
    //       Phorest: "Y",
    //       Boulevard: "Y",
    //     };
    //   } else if (index < 40) {
    //     d.pillar = "pillar4";
    //     d.theme = "theme3";
    //     d.competitor = {
    //       Booker: "Y",
    //       MBO: "Y",
    //       Salonbiz: "Y",
    //       Phorest: "Y",
    //       Boulevard: "Y",
    //     };
    //   } else if (index < 50) {
    //     d.pillar = "pillar5";
    //     d.theme = "theme2";
    //     d.competitor = {
    //       Booker: "Y",
    //       MBO: "Y",
    //       Salonbiz: "Y",
    //       Phorest: "Y",
    //       Boulevard: "Y",
    //     };
    //   } else {
    //     d.pillar = "pillar6";
    //     d.theme = "theme1";
    //     d.competitor = {
    //       Booker: "Y",
    //       MBO: "Y",
    //       Salonbiz: "Y",
    //       Phorest: "Y",
    //       Boulevard: "Y",
    //     };
    //   }
    // });
    // setCountryOption(countryList);
    // setDefaultData(Data);
    // setFecthing(false);
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
          business_benefits: data.business_benefits,
          country: data.country,
          description: data.description,
          differentiator: data.differentiator ? "Yes" : "No",
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
        country: {
          filter: filter.country,
          filterType: "text",
          type: "equals",
        },
      });
      grid.api.deselectAll();
    }
  }, [filter.vertical, filter.country]);

  const columnDefs = [
    {
      headerName: "Theme",
      field: "theme",
      flex: 2,
      minWidth: 120,
      tooltipField: "theme",
      tooltipComponentParams: { width: 100 },
    },
    {
      headerName: "Pillar",
      field: "pillar",
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

  const Competitor = ["Booker", "MBO", "Salonbiz", "Phorest"];
  Competitor.forEach((data) => {
    columnDefs.push({
      headerName: data,
      flex: 1,
      field: data,
      minWidth: 100,
      hide: !(filter.competitor.includes(data) && filter.competitor.length > 0),
    });
  });

  const BusinessImpactFilter = (value, DataList) => {
    let searchData = [];
    let searchValueText = value;
    searchValueText = searchValueText.replace(
      /[-[\]{}()*+?.,\\^$|#\s]/g,
      "\\$&"
    );
    const regex = new RegExp(`${searchValueText}`, "ig");
    context.searchString = searchValueText;
    DataList.forEach((data) => {
      const searchObj = {
        business_benefits: data.business_benefits,
      };
      if (Object.values(searchObj).join().match(regex)) {
        searchData.push(data);
      }
    });
    return searchData;
  };

  const MultipleCompetitorCompare = (value, DataList) => {
    let filterData = new Set();
    DataList.forEach((data, index) => {
      if (value.competitor.length > 0 && !value.uniqueZenoti) {
        value.competitor.forEach((val, index) => {
          if (data.competitor[val] === "N" || data.competitor[val] === "NIA") {
            data[val] = "✗";
          } else {
            data[val] = "✔";
          }
        });

        filterData.add(data);
      } else if (value.competitor.length > 0 && value.uniqueZenoti) {
        const checkingvalue = value.competitor.map((val) => {
          if (
            data.differentiator === true &&
            (data.competitor[val] === "N" || data.competitor[val] === "NIA")
          ) {
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
    let pillarAndthemeList = [];
    DataList.forEach((data) => {
      if (data.pillar || data.theme) {
        if (!pillar && theme) {
          if (data.theme === theme) {
            pillarAndthemeList.push(data);
          }
        } else if (pillar && !theme) {
          if (data.pillar === pillar) {
            pillarAndthemeList.push(data);
          }
        } else if (pillar && theme) {
          if (data.pillar === pillar && data.theme === theme) {
            pillarAndthemeList.push(data);
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

      if (filter.area) {
        if (filter.area.toLowerCase() === d.area.toLowerCase()) {
          DataList.add(d);
        }
      } else if (!filter.area) {
        DataList.add(d);
      }
    });
    if (filter.competitor.length > 0 || filter.uniqueZenoti) {
      DataList = MultipleCompetitorCompare(filter, DataList);
    }

    if (filter.business_benefits) {
      DataList = BusinessImpactFilter(filter.business_benefits, DataList);
    }

    if (filter.pillar || filter.theme) {
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
    filter.area,
    filter.uniqueZenoti,
    filter.business_benefits,
    filter.pillar,
    filter.theme,
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
          <UserFilterComponent
            filter={filter}
            handleFilterChange={(data) => {
              setFilter(data);
            }}
            countryOption={countryOption}
            verticalOption={verticalOption}
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
