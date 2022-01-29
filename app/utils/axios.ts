import Axios from "axios";
import { redirect } from "remix";

const baseURL = "http://localhost:3333";
// const baseURL = "https://yzs3zsa9n7.execute-api.us-west-2.amazonaws.com";

export const axios = Axios.create({
  baseURL,
});

// only to be called from loader functions
export function authenticatedAxios(token: string) {
  const instance = Axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (!error?.response?.status || error.response.status === 401) {
        redirect("/login");
      }

      return Promise.reject(error);
    }
  );

  return instance;
}
