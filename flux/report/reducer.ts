import { createSlice } from '@reduxjs/toolkit';

export interface ReportState {}

const initialState: ReportState = {};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
});

export const {} = reportSlice.actions;

export default reportSlice;
