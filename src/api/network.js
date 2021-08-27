import axios from "axios";
import { getToken, removeItemFromStorage } from "../utils/helper";
// const baseUrl = process.env.API_URL;
const baseUrl = "https://o9n1hpb6l8.execute-api.ap-south-1.amazonaws.com/prod";

const HandleError = (err) => {
  if (err.response && err.response.status === 401) {
    removeItemFromStorage("user");
  }
  if (err.response && err.response.data) {
    throw err.response.data;
  }
  if (err.response) {
    throw err.response;
  }
  throw err;
};

const getConfig = () => {
  return {
    Authorization: getToken(),
  };
};
export const publicGet = (url, params) => {
  return axios
    .get(baseUrl + url, { params })
    .then((response) => response.data)
    .catch((error) => HandleError(error));
};

export const publicPost = (url, payload) => {
  return axios
    .post(baseUrl + url, payload)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return HandleError(error);
    });
};

export const get = (url, params) => {
  return axios
    .get(baseUrl + url, {
      params,
      headers: getConfig(),
    })
    .then((response) => response.data)
    .catch((error) => HandleError(error));
};

export const post = (url, payload) => {
  return axios
    .post(baseUrl + url, payload, {
      headers: getConfig(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return HandleError(error);
    });
};

export const put = (url, payload) => {
  return axios
    .put(baseUrl + url, payload, {
      headers: getConfig(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return HandleError(error);
    });
};

export const remove = (url, params) => {
  return axios
    .delete(baseUrl + url, {
      params,
      headers: getConfig(),
    })
    .then((response) => response.data)
    .catch((error) => HandleError(error));
};
