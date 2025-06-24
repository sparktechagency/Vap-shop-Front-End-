import { api } from "@/redux/baseApi";

export const adminApis = api.injectEndpoints({
    endpoints: (builder) => ({
        getallusers: builder.query<any, { page: number; per_page: number; role: number }>({
            query: ({ page, per_page, role }) =>
                `/admin/manage-users?role=${role}&per_page=${per_page}&page=${page}`,
        }),

        banAuser: builder.mutation<any, { id: number; _method: string }>({
            query: (body) => ({
                url: `/admin/ban-user/${body.id}`,
                method: "POST",
                body,
            }),
        }),
        unBanUser: builder.mutation<any, { id: number; _method: string }>({
            query: (body) => ({
                url: `/admin/unban-user/${body.id}`,
                method: "POST",
                body,
            }),
        }),

        getallbandedusers: builder.query<any, { page: number; per_page: number; }>({
            query: ({ page, per_page }) =>
                `/admin/get-banned-users?per_page=${per_page}&page=${page}`,
        }),

        getAdminSliders: builder.query<any, void>({
            query: () => `/admin/slider`,
            providesTags: ["slider"],
        }),

        createAdminSlider: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: `/admin/slider`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["slider"],
        }),


        deleteAdminSlider: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                url: `/admin/slider/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["slider"],
        }),

        getallAddRequest: builder.query<any, { page: number; per_page: number; type: string }>({
            query: ({ page, per_page, type }) =>
                `/admin/get-all-ad-requests?page=${page}&per_page=${per_page}&type=${type}`,
        }),



    }),
});

export const {
    useGetallusersQuery,
    useBanAuserMutation,
    useGetallbandedusersQuery,
    useUnBanUserMutation,
    useGetAdminSlidersQuery,
    useCreateAdminSliderMutation,
    useDeleteAdminSliderMutation,
    useGetallAddRequestQuery,
} = adminApis;
