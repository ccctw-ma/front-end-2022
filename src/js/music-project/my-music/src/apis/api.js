/**
 * @Author: msc
 * @Date: 2021-12-01 14:24:56
 * @LastEditTime: 2022-01-28 21:57:19
 * @LastEditors: msc
 * @Description:
 */
import axios from "axios";

/****
 * @description: use axios to request server source
 * @param method
 * @return
 */

axios.defaults.baseURL = "http://localhost:7977"
const apiCall = (method) => {
  return async (url, body) => {
    const response = await axios({
      method: method,
      url: url,
      data: body,
    });
    return {
      status: response.status,
      message: response.statusText,
      data: response.status === 200 ? response.data : null,
    };
  };
};

const API = {
  GET: apiCall("get"),
  POST: apiCall("post"),
  DELETE: apiCall("delete"),
  PUT: apiCall("put"),
};

export default API;
