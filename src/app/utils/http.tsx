import axios from "axios";
import cookie from "./cookie";

const REACT_APP_API_BASEURL = "https://banyan.backend.ricive.com/api/v1";

export const Http = axios.create({
  baseURL: REACT_APP_API_BASEURL,
  timeout: 45000,
  headers: {
    // "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

Http.interceptors.request.use((config: any) => {
  const token = cookie().getCookie("token");
  const userType = cookie().getCookie("userType");
  // const apiKey = cookie().getCookie("API_KEY");


  // Read and combine token parts
  //  const numParts = parseInt(cookie().getCookie('token_parts') || '0');
  //  let combinedToken = '';
  //  for (let i = 0; i < numParts; i++) {
  //    combinedToken += cookie().getCookie(`token_part_${i}`) || '';
  //  }


  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // let kk =  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MWIxOWVhNC03NjdhLTQwMzgtOTZhNC1kZDE5ODMxNWE1YWYiLCJyb2xlSWQiOiIxMzBhMDk4Yy0xMTI3LTQ0ODktYjZlMi1kMjRiNzkyYTljMTgiLCJidXNpbmVzc0lkIjoiYzBlZjQzNTAtNDk2OC00NTdhLWE1NGYtZTM3ZTM1YzJmODFhIiwiZmlyc3ROYW1lIjoiSm9lbCIsImxhc3ROYW1lIjoiVWd3dW1hZHUiLCJlbWFpbCI6InVnd3VtYWR1MTE2QGdtYWlsLmNvbSIsImlhdCI6MTczMjE0NzA2MywiZXhwIjoxNzMyMjMzNDYzfQ.r2ldsZULzYlgcQKkd3CTqN10VCSVC5_1KtGLY6qsYwY`
  // if (combinedToken && config.url !== "/auth/signin") {
  //   config.headers.Authorization = `Bearer ${kk}`;
  //   // config.headers.Authorization = `Bearer ${combinedToken}`;
  // }
  if (userType) {
    config.headers["X-User-Type"] = userType;
  }
  // if (apiKey) {
  //   config.headers["X-API-KEY"] = apiKey;
  // }

  return config;
});

Http.interceptors.response.use(
  (response: any) => response.data,
  (error: any) => {
    if (error.response?.status) {
      if (
        error.response.status === 401 ||
        error?.response?.data?.statusCode == 401
      ) {

        const currentPath = window.location.pathname;
        if (currentPath.includes("dashboard")) {
          // window.location.pathname = "/login";
        }

        cookie().deleteCookie("token");
      }

      if (error.response.status === 500) {
        console.log("Server error occurred");
      }
    }

    return Promise.reject(error);
  }
);

export default Http;
