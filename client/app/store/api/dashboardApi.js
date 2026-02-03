'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => 'dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    getAreaActivity: builder.query({
      query: (params) => ({
        url: 'dashboard/activity',
        params,
      }),
      providesTags: ['Dashboard'],
    }),
    getAlerts: builder.query({
      query: (params) => ({
        url: 'dashboard/alerts',
        params,
      }),
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAreaActivityQuery,
  useGetAlertsQuery,
} = dashboardApi;
