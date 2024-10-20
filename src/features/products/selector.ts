import { createSelector } from "reselect";
import { createAsyncSelectorResults } from "async-selector-kit";
import { RootState } from "@/store/reducers";
import { Product, ProductState } from "@/types";

const productsSelector = (state: RootState) => state.products;

export const getStatus = createSelector(
  productsSelector,
  (state: ProductState): ProductState["status"] => state.status
);

const productsListSelector = (state: RootState) => state.products.productos;

const productSearchSelector = (state: RootState) =>
  state.products.searchProduct;

export const getProducts = createSelector(
  productsSelector,
  (state: ProductState): ProductState["productos"] => state.productos
);

function isArrayOfStrings(parametro: string | string[]): boolean {
  if (typeof parametro === "string") {
    return false;
  } else if (
    Array.isArray(parametro) &&
    parametro.every((item) => typeof item === "string")
  ) {
    return true;
  } else {
    throw new Error("El parametro no es un array de strings");
  }
}

function searchProduct(searchTerm: string, products: Product[]): Product[] {
  const trimmedSearchTerm = searchTerm.trim();
  let result: Product[] = [];
  result = products.filter(
    (product) =>
      product.name.toLowerCase().includes(trimmedSearchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
  );
  return result;
}

export const getSearchResults = createSelector(
  [productSearchSelector, productsListSelector],
  (searchTerm: string | string[], products: Product[]): Product[] => {
    const isArray = isArrayOfStrings(searchTerm);
    let response: Product[] = [];
    if (searchTerm.length < 1 || products.length === 0) return [];

    if (isArray) {
      response = (searchTerm as string[]).flatMap((searchTerm) =>
        searchProduct(searchTerm, products)
      );
    } else {
      response = searchProduct(searchTerm as string, products);
    }
    return response;
  }
);

function createEanMap(products: Product[]) {
  const eanMap = new Map<string, Product>();

  for (const product of products) {
    if (product.ean != null && product.ean !== "") {
      eanMap.set(product.ean, product);
    }
  }

  return eanMap;
}

export const getMapEan = createSelector(
  productsSelector,
  (state: ProductState) => createEanMap(state.productos)
);
