import axios from "axios";
import { NavigateFunction, useNavigate } from "react-router";
import store from "store";

export const get = axios.get;
export const post = axios.post;
export const del = axios.delete;
export const put = axios.put;

const axiosInstance = (history = null) => {
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const token = store.get("token");

  const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: { Authorization: `bearer ${token}` },
  });

  axiosInstance.interceptors.response.use(
    (response) =>
      new Promise((resolve, reject) => {
        resolve(response);
      }),
    (error) => {
      if (!error.response) {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
      if (error.response.status === 403) {
        localStorage.removeItem("token");
        var navigate: NavigateFunction = useNavigate();
        if (history) {
          navigate("/");
        } else {
          window.location.href = "/";
        }
      } else {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
    },
  );

  return axiosInstance;
};

export default axiosInstance;
