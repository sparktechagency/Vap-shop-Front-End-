const { api } = require("../../baseApi");

const notification = api.injectEndpoints({
  endpoints: (builder) => ({
    getallnotification: builder.query({
      query: () => `notify`,
      invalidatesTags: ["notification"],
    }),

    readNotification: builder.mutation({
      query: (id) => ({
        url: `notify/${id}`,
        method: "POST",
      }),

      providesTags: ["notification"],
    }),
    redallnotification: builder.mutation({
      query: () => ({
        url: `notify-all-read`,
        method: "POST",
      }),

      providesTags: ["notification"],
    }),
  }),
});

export const {
  useGetallnotificationQuery,

  useReadNotificationMutation,
  useRedallnotificationMutation,
} = notification;
