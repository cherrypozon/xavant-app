'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const smartCameraApi = createApi({
  reducerPath: 'smartCameraApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['SmartCamera', 'Detections'],
  endpoints: (builder) => ({
    getCameras: builder.query({
      query: () => 'cameras',
      providesTags: ['SmartCamera'],
    }),
    getCameraById: builder.query({
      query: (id) => `cameras/${id}`,
      providesTags: (result, error, id) => [{ type: 'SmartCamera', id }],
    }),
    getDetections: builder.query({
      query: (params) => ({
        url: 'detections',
        params,
      }),
      providesTags: ['Detections'],
    }),
    addDetection: builder.mutation({
      query: (detection) => ({
        url: 'detections',
        method: 'POST',
        body: detection,
      }),
      invalidatesTags: ['Detections'],
    }),
  }),
});

export const {
  useGetCamerasQuery,
  useGetCameraByIdQuery,
  useGetDetectionsQuery,
  useAddDetectionMutation,
} = smartCameraApi;
