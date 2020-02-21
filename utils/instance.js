import axios from "axios";

const instance = axios.create({
  baseURL: "https://opendata.resas-portal.go.jp",
  timeout: 1000,
  headers: {
    "X-API-KEY": process.env.RESAS_API_KEY
  }
});

export default instance;
