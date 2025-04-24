import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  telegram: string;
  office: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: async (args: any) => {
    // Мокаем fetchBaseQuery через localStorage
    if (args.url === '/profile' && args.method === 'GET') {
      const userId = args.params?.userId;
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.username === userId);
      if (user) {
        return { data: {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          username: user.username || '',
          telegram: user.telegram || '',
          office: user.office || '',
        }};
      }
      return { error: { status: 404, data: 'User not found' } };
    }
    return { error: { status: 400, data: 'Not implemented' } };
  },
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, string>({
      query: (userId: string) => ({ url: '/profile', method: 'GET', params: { userId } }),
    }),
  }),
});

export const { useGetProfileQuery } = userApi;
