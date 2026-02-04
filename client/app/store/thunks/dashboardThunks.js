import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDashboardApi } from "@/app/store/api/dashboardApi";

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchDashboardApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);