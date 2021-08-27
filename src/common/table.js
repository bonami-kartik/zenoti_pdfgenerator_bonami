import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import HighlightCellRenderer from '../components/HighlightCellRenderer';

const HeaderHeight = 60;
const RowHeight = 70;
const PaginationPageSize = 10;

const Table = ({
  columns,
  data,
  multiRowSelection,
  rowSelection,
  sortableAll,
  filterAll,
  resizableAll,
  rowPerPage,
  showPagination,
  hasCustomFilter,
  handleFilterChange,
  onGridReady,
  onSelectionChanged,
  columnDefObj,
  customComponents,
}) => {
  const [defaultColDef, setDefaultColDef] = useState({
    resizable: true,
    flex: 1,
    wrapText: true,
    cellStyle: { wordBreak: 'break-word' },
    filterParams: { newRowsAction: 'keep' }
  });
  const isFirstColumn = (params) => {
    return columns[0].field === params.colDef.field;
  }
  useEffect(() => {
    let colDefObj = { ...defaultColDef };
    if (sortableAll) {
      colDefObj.sortable = true;
    }
    if (filterAll) {
      colDefObj.filter = true;
    }
    if (resizableAll) {
      colDefObj.resizable = true;
    }
    if (rowSelection) {
      colDefObj.headerCheckboxSelection = isFirstColumn;
      colDefObj.checkboxSelection = isFirstColumn;
      colDefObj.headerCheckboxSelectionFilteredOnly = true;
    }
    if (columnDefObj) {
      colDefObj = { ...colDefObj, ...columnDefObj }
    }
    setDefaultColDef(colDefObj);
  }, [sortableAll, filterAll, rowSelection]);

  return (
    <div className="ag-theme-alpine formtableBorder" style={{ height: "60vh" }}>
      <AgGridReact
        key={Object.keys(defaultColDef).length}
        headerHeight={HeaderHeight}
        rowHeight={RowHeight}
        defaultColDef={defaultColDef}
        suppressMenuHide={true}
        unSortIcon={true}
        suppressRowClickSelection={true}
        rowSelection={multiRowSelection ? 'multiple' : null}

        columnDefs={columns}
        rowData={data}
        pagination={showPagination}
        paginationPageSize={rowPerPage ? rowPerPage : PaginationPageSize}
        gridOptions={{
          isExternalFilterPresent: () => hasCustomFilter ? true : false,
          doesExternalFilterPass: (node) => handleFilterChange(node.data),
        }}
        onGridReady={onGridReady}
        animateRows={true}
        components={customComponents}
        onSelectionChanged={onSelectionChanged}
        frameworkComponents={{
          highlightCellRenderer: HighlightCellRenderer,
        }}
        overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Please wait while your data is loading...</span>'}
      >
      </AgGridReact>
    </div>
  )
};

Table.defaultProps = {
  multiRowSelection: false,
  rowSelection: false,
  sortableAll: false,
  filterAll: false,
  resizableAll: false,
  rowPerPage: PaginationPageSize,
  showPagination: false,
  hasCustomFilter: false,
  handleFilterChange: () => { },
  onGridReady: () => { },
  onSelectionChanged: () => { },
  columnDefObj: {},
  customComponents: {},
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      headerName: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      filter: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
      ]),
      sortable: PropTypes.bool,
      minWidth: PropTypes.number
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  multiRowSelection: PropTypes.bool,
  rowSelection: PropTypes.bool,
  sortableAll: PropTypes.bool,
  filterAll: PropTypes.bool,
  resizableAll: PropTypes.bool,
  rowPerPage: PropTypes.number,
  showPagination: PropTypes.bool,
  hasCustomFilter: PropTypes.bool,
  handleFilterChange: PropTypes.func,
  onGridReady: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  columnDefObj: PropTypes.object,
  customComponents: PropTypes.object,
};

export default Table;