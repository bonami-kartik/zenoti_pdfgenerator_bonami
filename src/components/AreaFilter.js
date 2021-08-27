export default class AreaFilter {
  init(params) {
    var options = params.options ? params.options.sort() : [];
    if (!options.includes("All")) { options.unshift("All"); }
    this.defaultOptions = options;
    this.options = options;
    this.filterValue = [];
    this.eGui = document.createElement('div');
    this.eGui.innerHTML =
      `<div class="area-filter">
          <div class="area-options-list">
            ${this.defaultOptions.map((op, i) => {
        return `<div class="area-option"><input class="mr-2 align-self-center check-${i}" name="${op}" type="checkbox" /> <span>${op}</span></div>`
      }).join("")}
          </div>
          <div class="area-filter-reset-block justify-content-end d-flex">
            <button class="reset-btn btn btn-secondary btn-sm" disabled>Reset</button>
          </div>
        </div>`;
    this.areaFilteredResetBlock = this.eGui.querySelector(".area-filter-reset-block");
    this.resetBtn = this.areaFilteredResetBlock.querySelector(".reset-btn");
    this.optionList = this.eGui.querySelector(".area-options-list");
    this.resetBtn.addEventListener('click', this.resetAllFiiter.bind(this));

    //add listener
    this.defaultOptions.forEach((op, i) => {
      const option = this.optionList.querySelector(`.check-${i}`);
      option.addEventListener('change', this.onValueChange.bind(this));
    })

    this.filterActive = false;
    this.filterChangedCallback = params.filterChangedCallback;
    this.gridApi = params.api;
  }

  onValueChange(e) {
    this.filterActive = true;
    if (e.target.checked) {
      if (e.target.name === "All") {
        this.defaultOptions.forEach((op, i) => {
          const option = this.optionList.querySelector(`.check-${i}`);
          option.checked = true;
        })
        this.filterValue = this.defaultOptions;
      } else {
        if (this.filterValue.includes("All")) {
          this.filterValue = this.filterValue.filter(f => f !== "All");
          this.optionList.querySelector(`.check-0`).checked = false;
        }
        this.filterValue.push(e.target.name);
      }
    } else {
      if (e.target.name === "All") {
        this.defaultOptions.forEach((op, i) => {
          const option = this.optionList.querySelector(`.check-${i}`);
          option.checked = false;
        })
        this.filterValue = [];
      } else {
        if (this.filterValue.includes("All")) {
          this.filterValue = this.filterValue.filter(f => f !== "All");
          this.optionList.querySelector(`.check-0`).checked = false;
        }
        this.filterValue = this.filterValue.filter(f => f !== e.target.name);
      }
    }
    var isBtnDisabled = this.resetBtn.disabled;
    if (this.filterValue.length > 0 && isBtnDisabled) {
      this.resetBtn.disabled = false;
    } else {
      if (this.filterValue.length === 0) { this.resetBtn.disabled = true; }
    }
    this.gridApi.deselectAll();
    this.filterChangedCallback();
  }

  resetAllFiiter() {
    this.defaultOptions.forEach((op, i) => {
      const option = this.optionList.querySelector(`.check-${i}`);
      option.checked = false;
    })
    this.resetBtn.disabled = true;
    this.filterValue = [];
    this.filterChangedCallback();
  }

  getGui() {
    return this.eGui;
  }

  doesFilterPass(params) {
    return this.filterValue.length > 0 ? this.filterValue.includes(params.data.area) : true;
  }

  isFilterActive() {
    return this.filterActive;
  }

  getModel() {
  }

  setModel() {
  }
}