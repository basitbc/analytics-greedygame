import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Analytics from '../../modules/Analytics';

// Define the initial state
const initialState = {
  reportsData: {},
  startDate: new Date(),
  endDate: new Date(),
  isLoading: false,
  error: null,
};

// Define the async thunk to fetch reports data
export const fetchReports = createAsyncThunk(
  'home/fetchReports',
  async (dateRange, thunkAPI) => {
    try {
      const response = await Analytics.getAllReports(
        dateRange.startDate,
        dateRange.endDate
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create the home slice
export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reportsData = action.payload;
        state.error = null;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export the actions
export const { setDateRange } = homeSlice.actions;

// Export the reducer
export default homeSlice.reducer;
