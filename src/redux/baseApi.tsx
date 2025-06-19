import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import Cookies from "js-cookie";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://10.0.80.13/api/",
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      console.log("tokenFromBaseApi", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        headers.set("Accept", `*/*`);
        // headers.set("Content-Type", `application/json`);
        // headers.set("Access-Control-Allow-Origin", `*/*`);
      }
      return headers;
    },
  }),
  tagTypes: ["user", "blog", "faq", "about", "notification"],
  endpoints: () => ({}),
});

export const imageUrl = "https://10.0.80.13";
