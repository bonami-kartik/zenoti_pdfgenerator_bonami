import React from 'react';
import { SearchContext } from './searchContext';

const filterHighLightCols = [];

const HighlightCellRenderer = (props) => {
  const context = React.useContext(SearchContext);
  const columnName = props.colDef.field;
  let filterObj = props.api.getFilterModel();
  filterObj = filterHighLightCols.includes(columnName) && filterObj[columnName] ? filterObj[columnName] : null;
  let value = typeof (value) === "string" ? props.value.trim() : props.value;
  let searchString = [];
  if (filterObj) {
    if (filterObj.filter) {
      searchString.push(filterObj.filter);
    } else {
      const searchStringObj = Object.keys(filterObj).filter(function (k) {
        return k.indexOf('condition') == 0;
      }).reduce(function (newData, k) {
        newData[k] = filterObj[k].filter;
        return newData;
      }, {});
      searchString = Object.values(searchStringObj);
    }
  }
  if (context.searchString) {
    searchString.push(context.searchString)
  }
  if (columnName === "vertical") {
    value = value.length > 0 ? value.join(", ") : "";
  }
  if (columnName === "differentiator") {
    value = value ? "Yes" : "No";
  }
  if (searchString.length > 0) {
    let searchValueText = searchString.join("|");
    searchValueText = searchValueText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(`${searchValueText}`, "ig");
    const matches = typeof (value) === "string" ? value.match(regex) : [];
    if (typeof (value) === "string" && matches && matches.length > 0) {
      const valueArray = value.split(regex);
      return valueArray.map((v, i) => <React.Fragment key={i}>{v}{i + 1 !== valueArray.length && <span className="table-text-highlight">{matches[i]}</span>}</React.Fragment>)
    }
  }

  return value;
}

export default HighlightCellRenderer;