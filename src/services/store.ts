import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '@services/slices/auth-slice';
import { constructorReducer } from '@services/slices/constructor-slice';
import { ingredientDetailsReducer } from '@services/slices/ingredient-details-slice';
import { ingredientsReducer } from '@services/slices/ingredients-slice';
import { orderReducer } from '@services/slices/order-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    burgerConstructor: constructorReducer,
    ingredientDetails: ingredientDetailsReducer,
    ingredients: ingredientsReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
