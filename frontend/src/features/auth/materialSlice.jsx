import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Async thunk: Get all materials by factory_id
export const fetchAllMaterials = createAsyncThunk(
  'material/fetchAll',
  async (factory_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/materials/${factory_id}`);
      // const response = await axiosInstance.get(`http://localhost:7777/api/v1/materials/${factory_id}`);
      return response.data.data; // assuming the response structure is { data: [...] }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch materials';
      return rejectWithValue(message);
    }
  }
);
export const fetchAllMaterialsforPurchese = createAsyncThunk(
  'Purchesematerial/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // const response = await axiosInstance.get(`https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/materials`);
      const response = await axiosInstance.get(`http://localhost:7777/api/v1/materials`);
      return response.data.data; // assuming the response structure is { data: [...] }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch materials';
      return rejectWithValue(message);
    }
  }
);

export const fetchAllvendor = createAsyncThunk(
  'vendor/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/Vendors'); // adjust endpoint as needed
      return response.data.data; // assuming API returns { materials: [...] }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch vendor';
      return rejectWithValue(message);
    }
  }
);
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

const materialSlice = createSlice({
  name: 'material',
  initialState: {
    materials: [],
    material:[],
    Vendor:[],
    factory:[],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMaterials.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllvendor.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllFactory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllMaterialsforPurchese.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllMaterials.fulfilled, (state, action) => {
        state.materials = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAllvendor.fulfilled, (state, action) => {
        state.Vendor = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAllFactory.fulfilled, (state, action) => {
        state.factory = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAllMaterialsforPurchese.fulfilled, (state, action) => {
        state.material = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAllMaterials.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch materials';
      })
      .addCase(fetchAllvendor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch materials';
      })
      .addCase(fetchAllFactory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch materials';
      })
      .addCase(fetchAllMaterialsforPurchese.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch materials';
      })
  },
});

export default materialSlice.reducer;
