'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { axiosInstance, delay } from '../../utils/helper';
import smartCamerasMockData from '@/app/mockData/smartCamerasData.json';

const USE_MOCK_DATA = true; // Toggle this to switch between mock data and real API

export const fetchSmartCamerasApi = async () => {
  if (USE_MOCK_DATA) {
    await delay(500); // Simulate network delay
    return {data: smartCamerasMockData};
  }
  const response = await axiosInstance.get('/smart-cameras');
  return response;
};
