import Axios from "axios";

// const baseURL = "http://localhost:3333";
const baseURL = "https://yzs3zsa9n7.execute-api.us-west-2.amazonaws.com";

export const axios = Axios.create({
  baseURL,
});
