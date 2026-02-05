'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { axiosInstance, delay } from '../../utils/helper';
import dashboardMockData from '@/app/mockData/dashboardData.json';

const USE_MOCK_DATA = true; // Toggle this to switch between mock data and real API

export const fetchDashboardApi = async () => {
  if (USE_MOCK_DATA) {
    await delay(500); // Simulate network delay
    return {data: dashboardMockData};
  }
  const response = await axiosInstance.get('/dashboard');
  return response;
};
