import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ColorState {
  color: string;
}

const initialState: ColorState = {
  color: '#1F2937',
};

export const colorSlice = createSlice({
  name: 'color',
  initialState,
  reducers: {
    changeColor: (state: ColorState, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeColor } = colorSlice.actions;

const colorSliceReducer = colorSlice.reducer;

export default colorSliceReducer;
