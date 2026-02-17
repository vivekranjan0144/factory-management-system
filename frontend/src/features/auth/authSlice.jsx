import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        'https://pgi-server-acc0exabe4gjb6ar.australiaeast-01.azurewebsites.net/api/auth/login',
        credentials,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const { token, role, factory_id, employee_id } = response.data;
      const user = { role, factory_id, employee_id };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (err) {
      // Correct error extraction from axios error object
      const message = err.response?.data?.message || err.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

// Thunk: Load logged-in user info using token
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axiosInstance.get(
        'https://pgi-server-2-d2gmgzhyd8ffcqf8.australiaeast-01.azurewebsites.net/api/v1/me',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.user;
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to load user';
      return rejectWithValue(message);
    }
  }
);

// Optionally initialize user from localStorage to avoid flicker
const savedUser = localStorage.getItem('user');
const initialUser = savedUser ? JSON.parse(savedUser) : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    status: 'idle',
    error: null,
    loadingUser: false,  // You may set true here if you want to start loading on app init automatically
    isAuthenticated: !!initialUser,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
     reset(state) {
      // Reset status and error (you can reset other flags too if needed)
      state.status = 'idle';
      state.error = null;
      state.loadingUser = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // loadUser
      .addCase(loadUser.pending, (state) => {
        state.loadingUser = true;
        state.error = null;
        // Don't change isAuthenticated here, still unknown
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loadingUser = false;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loadingUser = false;
        state.user = null;
        state.error = action.payload;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export const { logout,reset } = authSlice.actions;
export default authSlice.reducer;
