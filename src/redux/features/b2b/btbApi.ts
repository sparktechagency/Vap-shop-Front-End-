/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../baseApi";
export const  btbApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBtbConnects: builder.query({
        query: ({page,per})=>({
            url:`/b2b/requests/incoming?page=${page}&per_page=${per}`
        })
    })
  })
})

export const {useGetBtbConnectsQuery} = btbApi;


