// src/redux/slices/finishedGoodsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Async thunk to fetch finished goods with variants
export const fetchFinishedGoods = createAsyncThunk(
  'finishedGoods/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/finish_goods'); // Adjust endpoint as needed
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Fetch failed');
    }
  }
);
export const fetchFinishedGoodsFactory = createAsyncThunk(
  'finishedGoodsFactory/fetchAll',
  async (id, thunkAPI) => {
    try {
      // const response = await axiosInstance.get('https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/finish_goods'); // Adjust endpoint as needed
      const response = await axiosInstance.get(`http://localhost:7777/api/v1/finish_goods/${id}`); // Adjust endpoint as needed
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Fetch failed');
    }
  }
);

const finishedGoodsSlice = createSlice({
  name: 'finishedGoods',
  initialState: {
    data: [],
    FactoryGoods:[],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinishedGoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinishedGoods.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFinishedGoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFinishedGoodsFactory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinishedGoodsFactory.fulfilled, (state, action) => {
        state.loading = false;
        state.FactoryGoods = action.payload;
      })
      .addCase(fetchFinishedGoodsFactory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default finishedGoodsSlice.reducer;
