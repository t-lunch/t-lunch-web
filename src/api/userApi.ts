import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  telegram: string;
  office: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, string>({
      // ← именно так, без объекта
      query: (userId) => `profile?userId=${encodeURIComponent(userId)}`,
      providesTags: (result, error, userId) => [{ type: "Profile", id: userId }],
    }),
    updateProfile: builder.mutation<UserProfile, { userId: string; data: Partial<UserProfile> }>({
      query: ({ userId, data }) => ({
        url: "profile",
        method: "PUT",
        body: { userId, ...data },
      }),
      invalidatesTags: (res, err, { userId }) => [{ type: "Profile", id: userId }],
    }),
  }),
});


export const { useGetProfileQuery, useUpdateProfileMutation } = userApi;
