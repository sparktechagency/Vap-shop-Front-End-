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

    }),
});

export const {
    useGetallusersQuery,
    useBanAuserMutation
} = adminApis;
