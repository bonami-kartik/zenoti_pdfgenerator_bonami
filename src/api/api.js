import * as network from "./network";

const login = (data) => network.publicPost("/login", data);

// vertical
const getVerticalList = () => network.publicGet(`/vertical/list`);

// area
const getAreaList = () => network.publicGet(`/area/list`);

// region
const getRegionList = () => network.publicGet(`/country/list`);

//competitor

const getCompetitorList = () => network.publicGet(`/competitors/list`);

//pillar

const getPillarList = () => network.publicGet(`/brand_pillars/list`);

//business_area

const getBusinessAreaList = () => network.publicGet(`/business_area/list`);

// template
const getAdminList = () => network.publicGet(`/template/list`);
const addTemplate = (data) => network.post(`/template/create`, data);
const addMulitpleTemplate = (data) =>
  network.post(`/multi/template/create`, data);
const updateTemplate = (id, data) => network.put(`/template/${id}`, data);
const deleteTemplate = (id) => network.remove(`/template/${id}`);

//bulk upload
const bulkUploadData = (data) => network.post(`/upload_handler`, data);

//analytics
const logDownloadEvent = (data) => network.post(`/logs/download`, data);
const logVisitorEvent = (data) => network.post(`/logs/visitor`, data);
const getDashboardData = (params) =>
  network.get(`/analysis${params ? "?" + params : ""}`);

export {
  getVerticalList,
  login,
  getAdminList,
  addTemplate,
  addMulitpleTemplate,
  updateTemplate,
  deleteTemplate,
  getAreaList,
  getRegionList,
  bulkUploadData,
  logDownloadEvent,
  logVisitorEvent,
  getDashboardData,
  getCompetitorList,
  getPillarList,
  getBusinessAreaList,
};
