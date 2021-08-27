export default class TooltipRenderer {
  init(params) {
    var eGui = (this.eGui = document.createElement('div'));
    eGui.style['max-width'] = `${params.width ? params.width : 150}px`;

    eGui.classList.add('custom-tooltip');
    eGui.innerHTML =
      '<p>' + params.value + '</p>';
  };

  getGui() {
    return this.eGui;
  };
}