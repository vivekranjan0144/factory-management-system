// src/redux/slices/materialRequestSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all material requests
export const fetchMaterialRequests = createAsyncThunk(
  'materialRequests/fetchAll',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/material/request/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Fetch failed');
    }
  }
);

// Approve material requests for a batch
export const approveMaterialRequests = createAsyncThunk(
  'materialRequests/approve',
  async ({ id, action}, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/materials/approve/${id}`, {
        action,
      } ,{
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Approval failed');
    }
  }
);

const materialRequestSlice = createSlice({
  name: 'materialRequests',
  initialState: {
    data: [],
    loading: false,
    error: null,
    approving: false,
    approvalSuccess: null,
    approvalError: null,
  },
  reducers: {
    resetApprovalState: (state) => {
      state.approving = false;
      state.approvalSuccess = null;
      state.approvalError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMaterialRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterialRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMaterialRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve
      .addCase(approveMaterialRequests.pending, (state) => {
        state.approving = true;
        state.approvalError = null;
        state.approvalSuccess = null;
      })
      .addCase(approveMaterialRequests.fulfilled, (state, action) => {
        state.approving = false;
        state.approvalSuccess = action.payload.message;
        // Optional: You could also update `data` here if needed
      })
      .addCase(approveMaterialRequests.rejected, (state, action) => {
        state.approving = false;
        state.approvalError = action.payload;
      });
  },
});

export const { resetApprovalState } = materialRequestSlice.actions;
export default materialRequestSlice.reducer;
