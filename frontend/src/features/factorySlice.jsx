import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

export const fetchAllFactory = createAsyncThunk(
  'factory/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/Factorys'); // adjust endpoint as needed
      return response.data.data; // assuming API returns { materials: [...] }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch factorys';
      return rejectWithValue(message);
    }
  }
);


const factorySlice = createSlice({
  name: 'factory',
  initialState: {
    factory:[],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
  
      .addCase(fetchAllFactory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
   
      .addCase(fetchAllFactory.fulfilled, (state, action) => {
        state.factory = action.payload;
        state.status = 'succeeded';
      })
     
      .addCase(fetchAllFactory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch materials';
      })
  },
});

export default factorySlice.reducer;
