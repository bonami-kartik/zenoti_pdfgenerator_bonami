import React from 'react';
import { renderToString } from "react-dom/server";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const reactElementToString = (element) => {
  return renderToString(element);
}

function formateHeaderText(str, maxWidth) {
  let newLineStr = "&#10";
  let res = '';
  let found = false;
  while (str.length > maxWidth) {
    found = false;
    for (let i = maxWidth - 1; i >= 0; i--) {
      if (testWhite(str.charAt(i))) {
        res = res + [str.slice(0, i), newLineStr].join('');
        str = str.slice(i + 1);
        found = true;
        break;
      }
    }
    if (!found) {
      res += [str.slice(0, maxWidth), newLineStr].join('');
      str = str.slice(maxWidth);
    }

  }

  return res + str;
}

function testWhite(x) {
  let white = new RegExp(/^\s$/);
  return white.test(x.charAt(0));
};

const HeaderCellRender = (props) => {
  let tooptip = props.tooptip || "";
  if (tooptip.length > 50) {
    tooptip = formateHeaderText(tooptip, 50);
  }

  return {
    template:
      '<div class="ag-cell-label-container" role="presentation">' +
      '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
      '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
      `    <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
            <span class="mx-1" title="${tooptip}"> 
              ${reactElementToString(<FontAwesomeIcon className="mx-1 tooltip-icon" icon={faQuestionCircle} />)}
            </span> ` +
      '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
      '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
      '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
      '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
      '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
      '  </div>' +
      '</div>'
  }
}

export default HeaderCellRender;