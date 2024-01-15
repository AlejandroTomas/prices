import { createSelector } from "reselect";

import { createAsyncSelectorResults } from "async-selector-kit";
import { RootState } from "@/store/reducers";
import { ProductState } from "@/types";


const productsSelector = (state: RootState) => state.products;

export const getStatus = createSelector(
    productsSelector,
    (state: ProductState): ProductState["status"] => state.status
);

export const getProducts = createSelector(
  productsSelector,
  (state: ProductState): ProductState["productos"] => state.productos
);