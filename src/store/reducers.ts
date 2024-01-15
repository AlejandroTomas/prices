import proeductsSlice from "@/features/products/proeductsSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { createReducer } from "async-selector-kit";

export const reducers = combineReducers({
  products: proeductsSlice,
  AsyncSelector: createReducer(),
});

export type RootState = ReturnType<typeof reducers>;
