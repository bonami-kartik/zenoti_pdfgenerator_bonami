import React from 'react';
import { renderToString } from "react-dom/server";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const reactElementToString = (element) => {
  return renderToString(element);
}
export default class NoteRenderer extends React.Component {
  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = `
          <div class="d-flex justify-content-start">
            <span class="note-value"></span>
            <span class="ml-auto note-action" style="display:${params.value ? "flex" : "none"}">
              <span class="mx-1 note-edit cursor-pointer">
                ${reactElementToString(<FontAwesomeIcon className="mx-1" icon={faEdit} />)}
              </span>
              <span class="mx-1 note-delete cursor-pointer">
                ${reactElementToString(<FontAwesomeIcon icon={faTrash} />)}
              </span>
            </span>
            <button class="btn btn-sm btn-primary align-self-center add-btn" style="display:${params.value ? "none" : "initial"}">Add Note</button>
          </div>`;

    this.eValue = this.eGui.querySelector('.note-value');
    this.getValueToDisplay(params);

    this.eButton = this.eGui.querySelector('.add-btn');
    this.eEditButton = this.eGui.querySelector(".note-edit");
    this.eDeleteButton = this.eGui.querySelector(".note-delete");
    this.actionButtons = this.eGui.querySelector(".note-action");

    this.eventListener = () => {
      params.toggleNoteModal(params.data, false, params.refreshCell);
    }
    this.editEventListener = () => {
      params.toggleNoteModal(params.data, true, params.refreshCell);
    }
    this.deleteEventListener = () => {
      params.toggleDelteNoteModal(params.data, params.refreshCell);
    }
    this.eButton.addEventListener('click', this.eventListener);
    this.eEditButton.addEventListener('click', this.editEventListener);
    this.eDeleteButton.addEventListener('click', this.deleteEventListener);
  }

  getGui() {
    return this.eGui;
  }

  refresh(params) {
    this.getValueToDisplay(params);
    if (params.value) {
      this.eButton.style.display = "none";
      this.actionButtons.style.display = "flex";
    } else {
      this.eButton.style.display = "flex";
      this.actionButtons.style.display = "none";

    }
    return true;
  }

  destroy() {
    if (this.eButton) {
      this.eButton.removeEventListener('click', this.eventListener);
    }
    if (this.eEditButton && this.eDeleteButton) {
      this.eEditButton.removeEventListener('click', this.editEventListener);
      this.eDeleteButton.removeEventListener('click', this.deleteEventListener);
    }
  }

  getValueToDisplay(params) {
    const valueNode = this.eValue;
    let value = params.value || "";
    const searchString = params.getSearchString();
    if (searchString && value.toLowerCase().includes(searchString)) {
      let searchValueText = searchString;
      searchValueText = searchValueText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const regex = new RegExp(`${searchValueText}`, "ig");
      const valueArray = value.split(regex);
      const matches = value.match(regex);
      valueNode.innerHTML = "";
      valueArray.map((v, i) => {
        let testStr = v;
        valueNode.innerHTML = valueNode.innerHTML + testStr;
        if (i + 1 !== valueArray.length) {
          const highlightedNode = document.createElement("span");
          highlightedNode.setAttribute("class", "table-text-highlight");
          highlightedNode.innerHTML = matches[i];
          valueNode.appendChild(highlightedNode);
        }
      })
    }
    else {
      valueNode.innerHTML = value;
    }
    return valueNode;
  }
}