/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../baseApi";
export const  btbApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBtbConnects: builder.query({
        query: ({page,per})=>({
            url:`/b2b/requests/incoming?page=${page}&per_page=${per}`
        })
    }),
    btbStatusUpdate: builder.mutation<any,{id:string|number,status:string}>({
      query:({id,status})=>({
        url:`/b2b/request/${id}/update?status=${status}`,
        method:"PUT",
        body:{}
      })
    })
  })
})

export const {useGetBtbConnectsQuery, useBtbStatusUpdateMutation} = btbApi;


