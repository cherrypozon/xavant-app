import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSmartCamerasApi } from '@/app/store/api/smartCamerasApi';

// Fetch all smart camera data
export const fetchSmartCamerasData = createAsyncThunk(
  'smartCameras/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchSmartCamerasApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);