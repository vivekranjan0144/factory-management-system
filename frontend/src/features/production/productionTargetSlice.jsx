import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '../../utils/axiosInstance';

// Async thunk to fetch all production targets
export const fetchProductionTargets = createAsyncThunk(
  'productionTargets/fetchAll',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/production/targets/${id}`); // Adjust URL as needed
      return response.data.data; // assuming backend returns { success, message, data }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch targets');
    }
  }
);
export const fetchProductionTargetsUpdate = createAsyncThunk(
  'productionTargetsUpdate/update',
  async ({id,data}, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/target/review/${id}`,data); // Adjust URL as needed
      return response.data.data; // assuming backend returns { success, message, data }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch targets');
    }
  }
);

const productionTargetSlice = createSlice({
  name: 'productionTargets',
  initialState: {
    targets: [],
    update:{},
    loading: false,
    error: null
  },
  reducers: {
    clearUpdateStatus: (state) => {
      state.update = {};
       state.error= null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductionTargets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductionTargets.fulfilled, (state, action) => {
        state.loading = false;
        state.targets = action.payload;
      })
      .addCase(fetchProductionTargets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductionTargetsUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductionTargetsUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.update = action.payload;
      })
      .addCase(fetchProductionTargetsUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});
export const { clearUpdateStatus } = productionTargetSlice.actions;
export default productionTargetSlice.reducer;

