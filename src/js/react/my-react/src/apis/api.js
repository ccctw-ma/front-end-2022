/**
 * @Author: msc
 * @Date: 2021-12-01 14:24:56
 * @LastEditTime: 2021-12-01 15:32:43
 * @LastEditors: msc
 * @Description:
 */
import axios from "axios";

/****
 * @description: use axios to request server source
 * @param method
 * @return
 */
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
      data: response.status === 200 ? response.data.response.data : null,
    };
  };
};

const api = {
  GET: apiCall("get"),
  POST: apiCall("post"),
  DELETE: apiCall("delete"),
  PUT: apiCall("put"),
};

export default api;
