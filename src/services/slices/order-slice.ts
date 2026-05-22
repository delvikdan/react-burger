import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { createOrderApi } from '@services/burger-api';

type TOrderState = {
  error: string | null;
  isLoading: boolean;
  orderNumber: number | null;
};

const initialState: TOrderState = {
  error: null,
  isLoading: false,
  orderNumber: null,
};

export const createOrder = createAsyncThunk<number, string[], { rejectValue: string }>(
  'order/createOrder',
  async (ingredients, { rejectWithValue }) => {
    try {
      return await createOrderApi({ ingredients });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Не удалось оформить заказ';

      return rejectWithValue(message);
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.error = null;
      state.orderNumber = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumber = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось оформить заказ';
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
