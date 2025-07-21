import { api } from "@/redux/baseApi";

export const storeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        purchesSubscription: builder.mutation<any, any>({
            query: (body) => ({
                url: `/subscriptions/create`,
                method: "POST",
                body,
            }),
        })
    }),
});


export const { usePurchesSubscriptionMutation } = storeApi;