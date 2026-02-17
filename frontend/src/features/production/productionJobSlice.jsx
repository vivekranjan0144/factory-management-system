import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all jobs
export const fetchAllJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/production/job/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

// Fetch batches by job ID
export const fetchBatchesByJobId = createAsyncThunk(
  'jobs/fetchBatchesByJobId',
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/production/job/batch`,
        { id },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return { id, batches: response.data.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch batches'
      );
    }
  }
);

// Track workflow for a batch
export const trackWorkFlow = createAsyncThunk(
  'jobs/trackWorkFlow',
  async ({ id, action }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/production/update/${id}`
        
      // const response = await axiosInstance.post(`http://localhost:7777/api/v1/production/update/${id}`
        
        , {
        id,
        action
      },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to track workflow');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    loading: false,
    success: null,
    error: null,
    batchesByJobId: [],
    trackedStatus: {}   // jobId => batches

  },
  reducers: {
    resetWorkflowUpdate: (state) => {
      // state.loading = null,
       state.trackedStatus= {} 
        state.error = null
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Jobs
      .addCase(fetchAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.jobs = action.payload;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;

        state.error = action.payload;
      })

      // Batches
      .addCase(fetchBatchesByJobId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchesByJobId.fulfilled, (state, action) => {
        const { jobId, batches } = action.payload;
        state.loading = false;
        state.success = true;

        state.batchesByJobId = batches;
      })
      .addCase(fetchBatchesByJobId.rejected, (state, action) => {
        state.loading = false;
        state.success = false;

        state.error = action.payload;
      })




      .addCase(trackWorkFlow.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.trackedStatus = {};
      })
      .addCase(trackWorkFlow.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.trackedStatus = action.payload;
      })
      .addCase(trackWorkFlow.rejected, (state, action) => {
        state.loading = false;
        state.success = false;

        state.error = action.payload;
      });
  }
});
export const { resetWorkflowUpdate ,clearError} = jobsSlice.actions;

export default jobsSlice.reducer;
