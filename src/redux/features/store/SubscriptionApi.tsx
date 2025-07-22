import { api } from "@/redux/baseApi";

export const storeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        purchesSubscription: builder.mutation<any, any>({
            query: (body) => ({
                url: `/subscriptions/create`,
                method: "POST",
                body,
            }),
        }),

        getAllSubscriptionPlans: builder.query<any, void>({
            query: () => `/subscriptions/plans`,
            providesTags: ["subscription"],
        }),

        updateAdonsAndPlan: builder.mutation<any, { planId: string | number; formData: any }>({
            query: ({ planId, formData }) => ({
                url: `/admin/update-subscription-plan/${planId}`,
                method: "POST",
                body: formData,
            }),
        }),


        getallSubscribedUsers: builder.query<any, { page: number }>({
            query: ({ page }) => `/admin/subscriptions?page=${page}&per_page=6`,
            providesTags: ["subscription"],
        }),

        updateSubscribetionStatus: builder.mutation<any, any>({
            query: ({ id, formData }) => ({
                url: `/admin/subscriptions/${id}/status`,
                method: "POST",
                body: formData,
            }),

            invalidatesTags: ["subscription"],
        }),

        getSubscriptionDetails: builder.query<any, { type: string }>({
            query: ({ type }) => `/subscriptions/plans?type[]=${type}`,
            providesTags: ["subscription"],
        }),

        getstoreAdons: builder.query<any, void>({
            query: () => `/subscriptions/plans?type[]=hemp&type[]=advocacy`,

        }),
        getmemberAdons: builder.query<any, void>({
            query: () => `/subscriptions/plans?type[]=hemp`,

        }),
        wholesellerAdons: builder.query<any, void>({
            query: () => `/subscriptions/plans?type[]=hemp&type[]=advocacy`,

        }),
        brandAdons: builder.query<any, void>({
            query: () => `/subscriptions/plans?type[]=hemp&type[]=advocacy`,

        }),


        SendSubscriptionToAdmin: builder.mutation<any, any>({
            query: (body) => ({
                url: `/subscriptions/request`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["subscription"],
        }),



    }),
});

export const {
    usePurchesSubscriptionMutation,
    useGetAllSubscriptionPlansQuery,
    useUpdateAdonsAndPlanMutation,
    useGetallSubscribedUsersQuery,
    useUpdateSubscribetionStatusMutation,
    useGetSubscriptionDetailsQuery,
    useGetstoreAdonsQuery,
    useGetmemberAdonsQuery,
    useWholesellerAdonsQuery,
    useBrandAdonsQuery,
    useSendSubscriptionToAdminMutation
} = storeApi;
