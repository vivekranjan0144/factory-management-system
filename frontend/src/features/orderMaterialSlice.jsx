import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

// Async thunk: Confirm Material Order
export const createMaterialOrder = createAsyncThunk(
  'orderConfirm/createMaterialOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/material/order', orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const fetchAllorder = createAsyncThunk(
  'order/fetchAllbyid',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/material/orders/${id}`); // adjust endpoint as needed
      return response.data.data; // assuming API returns { materials: [...] }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch order';
      return rejectWithValue(message);
    }
  }
);
export const fetchAllorderPurchase = createAsyncThunk(
  'order/fetchAllby',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/material/orders`); 
      // const response = await axiosInstance.get(`http://localhost:7777/api/v1/material/orders`); 
      return response.data.data; // assuming API returns { materials: [...] }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch order';
      return rejectWithValue(message);
    }
  }
);

export const UpdateOrder = createAsyncThunk(
  'order/update',
  async ({id,action}, { rejectWithValue }) => {
     try {
      const response = await axiosInstance.put(`https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/material/order/status/${id}`, {action}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch order';
      return rejectWithValue(message);
    }
  }
);


const orderConfirmSlice = createSlice({
  name: 'orderConfirm',
  initialState: {
    order: null,
    orders:[],
    purchaseorder:[],
    orderupdate:null,
    status: 'idle',
    error: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.order = null;
      state.status = 'idle';
      state.error = null;
    },
     resetOrderUpdate: (state) => {
    state.orderupdate = null;
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMaterialOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllorder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(UpdateOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllorderPurchase.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createMaterialOrder.fulfilled, (state, action) => {
        state.order = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAllorder.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.status = 'succeeded';
      })
      .addCase(UpdateOrder.fulfilled, (state, action) => {
        state.orderupdate = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAllorderPurchase.fulfilled, (state, action) => {
        state.purchaseorder = action.payload;
        state.status = 'succeeded';
      })
      .addCase(createMaterialOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create material order';
      })
      .addCase(fetchAllorder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create material order';
      })
      .addCase(UpdateOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create material order';
      })
      .addCase(fetchAllorderPurchase.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create material order';
      });
  },
});

export const { resetOrderState,resetOrderUpdate } = orderConfirmSlice.actions;

export default orderConfirmSlice.reducer;
