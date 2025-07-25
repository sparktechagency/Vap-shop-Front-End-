import { api } from "@/redux/baseApi";

export const adminApis = api.injectEndpoints({
    endpoints: (builder) => ({
        getallusers: builder.query<any, { page: number; per_page: number; role: number, searchterm: string }>({
            query: ({ page, per_page, role, searchterm }) =>
                `/admin/manage-users?role=${role}&per_page=${per_page}&page=${page}&search=${searchterm}`,
            providesTags: ["manageusers"],
        }),

        banAuser: builder.mutation<any, { id: number; _method: string }>({
            query: (body) => ({
                url: `/admin/ban-user/${body.id}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["manageusers"],
        }),
        unBanUser: builder.mutation<any, { id: number; _method: string }>({
            query: (body) => ({
                url: `/admin/unban-user/${body.id}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["manageusers"],
        }),

        deleteUser: builder.mutation<any, { id: number }>({
            query: ({ id }) => ({
                url: `/admin/delete-user/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["manageusers"],
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







        // ADS MANAGEMENT APIS------------------------------------

        getallAddRequest: builder.query<any, { page: number; per_page: number; type: string }>({
            query: ({ page, per_page, type }) =>
                `/admin/get-all-ad-requests?page=${page}&per_page=${per_page}&type=${type}`,
            providesTags: ["ads"],
        }),

        approveAdd: builder.mutation<any, { id: string, type: string, status: string, is_active: string }>({
            query: ({ id, type, status, is_active }) => ({
                url: `/admin/update-ad-request-status/${id}?status=${status}&type=${type}&is_active=${is_active}`,
                method: "PUT",
            }),
            invalidatesTags: ["ads"],
        }),
        // ADS MANAGEMENT APIS------------------------------------



        // ARTICLES APIS------------------------------------

        getallArticles: builder.query<any, { page: number; per_page: number; search: string }>({
            query: ({ page, per_page, search }) =>
                `/admin/get-all-articles?page=${page}&per_page=${per_page}&search=${search}`,
            providesTags: ["blog"],
        }),

        delteArical: builder.mutation<any, { id: number }>({
            query: ({ id }) => ({
                url: `/admin/delete/article/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["blog"],
        }),

        // ARTICLES APIS------------------------------------

        getAdminStatistics: builder.query<any, { period: string }>({
            query: ({ period }) => `/admin/dashboard?period=${period}`,
        }),

        adminResetPasswrod: builder.mutation<any, { password: string, password_confirmation: string }>({
            query: (body) => ({
                url: `/reset-password`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["user"],
        }),

        notifyuser: builder.mutation<any, { user_id: number, body: any }>({
            query: ({ user_id, body }) => ({
                url: `/admin/users/${user_id}/notify`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["user"],
        }),


        suspendUser: builder.mutation<any, { user_id: any, body: any }>({
            query: ({ user_id, body }) => ({
                url: `/admin/users/${user_id}/suspend`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ["user"],
        }),

        unsuspanduser: builder.mutation<any, { user_id: any }>({
            query: ({ user_id }) => ({
                url: `/admin/users/${user_id}/unsuspend`,
                method: "POST",
            }),
            invalidatesTags: ["user"],
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
    useApproveAddMutation,
    useGetallArticlesQuery,
    useDelteAricalMutation,
    useGetAdminStatisticsQuery,
    useDeleteUserMutation,
    useAdminResetPasswrodMutation,
    useNotifyuserMutation,
    useSuspendUserMutation,
    useUnsuspanduserMutation

} = adminApis;
