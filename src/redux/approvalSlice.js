import { createSlice } from '@reduxjs/toolkit';

const approvalSlice = createSlice({
  name: 'approval',
  initialState: {
    pendingRequestsCount: 0,
  },
  reducers: {
    setPendingRequestsCount: (state, action) => {
      state.pendingRequestsCount = action.payload;
    },
    decrementPendingRequestsCount: (state) => {
      if (state.pendingRequestsCount > 0) {
        state.pendingRequestsCount -= 1;
      }
    },
  },
});

export const { setPendingRequestsCount, decrementPendingRequestsCount } = approvalSlice.actions;
export default approvalSlice.reducer;
