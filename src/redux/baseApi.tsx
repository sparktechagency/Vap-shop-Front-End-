import { BASE_API_ENDPOINT } from "@/lib/config/data";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import Cookies from "js-cookie";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_ENDPOINT,
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
  tagTypes: [
    "user",
    "blog",
    "faq",
    "about",
    "notification",
    "tranding",
    "brand",
    "post",
    "thread",
    "slider",
<<<<<<< HEAD
    "ads",
=======
    "review",
>>>>>>> 7b4a23b39bef78517b5bf731086472cff830f82b
  ],
  endpoints: () => ({}),
});

export const imageUrl = "http://10.0.80.13:7001/";
