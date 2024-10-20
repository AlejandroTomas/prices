import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  CreateProduct,
  JsonProps,
  LoadingStates,
  Product,
  ProductDirty,
  ProductState,
  PropsAxios,
  PropsToCreateOneProcut,
  baseUrl,
} from "../../types";
import toast from "react-hot-toast";
import PromisePool from "@supercharge/promise-pool";
import { addProductToDB, getAllProductsFromDB } from "@/functions/idb";
import { generarUUID } from "@/functions/generateID";

const initialState: ProductState = {
  status: LoadingStates.IDLE,
  productos: [],
  error: null,
  searchProduct: "",
  searchResults: [],
};

export async function uploadAllProductsLogic(newProduct: ProductDirty) {
  try {
    const data: PropsToCreateOneProcut = {
      name: newProduct.Nombre,
      price: Number(newProduct.Precio),
      quantityOnStock: 0,
      type: newProduct.category,
      unit: newProduct.Tamaño,
      img: "https://i.ibb.co/St69zhK/default.jpg",
    };
    const url = `${baseUrl}/productos`;
    const configAxios: PropsAxios["configAxios"] = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(url, configAxios);
    let json: JsonProps = await res.json();
    if (Object.prototype.hasOwnProperty.call(json, "message"))
      throw Error(json.message.message);
    return json;
  } catch (error: any) {
    return error.message;
  }
}

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async () => {
    try {
      return await getAllProductsFromDB();
    } catch (err: any) {
      let message = err.statusText || "Ocurrio un error";
      console.log(err);
      console.log(message + " " + err.status);
      toast.error("No se pudo traer los productos localles");
    }
  }
);

export const updatePriceProduct = createAsyncThunk(
  "products/updatePriceProduct",
  async ({ newProduct }: { newProduct: Product }) => {
    try {
      const url = `${baseUrl}/productos/priceupdate/${newProduct._id}`;
      const configAxios = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      };
      const res = await fetch(url, configAxios);
      let json = await res.json();
      if (!res.ok) throw { status: res.status, statusText: res.statusText }; //Capturar el error
      return {
        response: json,
        newProduct,
      };
    } catch (error) {
      console.log(error);
    }
  }
);

export const createProductThunk = createAsyncThunk(
  "product/createProcut",
  async (val: CreateProduct) => {
    const data: Product = {
      ...val,
      _id: generarUUID(25),
      priceOffert: 0,
      __v: 1,
    };
    await addProductToDB({
      ...data,
      __v: 0,
      _id: "",
      priceOffert: 0,
    });
    return data;
  }
);

export const uploadAllProducts = createAsyncThunk(
  "products/uploadAllProducts",
  async ({ products }: { products: ProductDirty[] }) => {
    const { results, errors } = await PromisePool.for(products)
      .withConcurrency(10)
      .onTaskFinished((user, pool) => {
        // retrieve the percentage of processed tasks in the pool
        toast(
          `Cargando Productos al ${pool.processedPercentage().toFixed(0)}% `,
          {
            id: "loading",
          }
        );
      })
      .process(async (data) => {
        const response: Product = await uploadAllProductsLogic(data);
        if (response._id === undefined) {
          throw response;
        }
        return response;
      });
    return {
      results,
      errors,
    };
  }
);
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchProduct: (state, action) => {
      state.searchProduct = action.payload;
    },
    updateProduct: (state: ProductState, action: any) => {
      const productUpdated = action.payload;
      const index = state.productos.findIndex(
        ({ _id }) => _id === productUpdated._id
      );
      if (index !== -1) {
        state.productos[index] = productUpdated;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getProducts.pending, (state) => {
        state.status = LoadingStates.LOADING;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = LoadingStates.IDLE;
        if (action.payload) {
          state.productos = action.payload;
        }
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = LoadingStates.REJECT;
        console.log("No se pudo traer los productos");
      });

    builder
      .addCase(updatePriceProduct.pending, (state) => {
        state.status = LoadingStates.LOADING;
      })
      .addCase(updatePriceProduct.fulfilled, (state, action) => {
        state.status = LoadingStates.SUCCEEDED;
        const { payload } = action;

        if (payload !== undefined) {
          const index = state.productos.findIndex(
            (product) => product._id === payload.newProduct._id
          );
          if (index !== -1) {
            state.productos[index] = payload.newProduct;
            toast.success("Precio Actualizado");
          } else {
            toast.error("No se pudo actualizar el precio");
            console.log("producto no encontrado");
          }
        } else {
          toast.error("No se pudo actualizar el precio");
          console.log("payload es undefined");
        }
      })
      .addCase(updatePriceProduct.rejected, (state, action) => {
        state.status = LoadingStates.REJECT;
        console.log("No se pudo actualizar el precio");
      });

    builder
      .addCase(uploadAllProducts.pending, (state) => {
        state.status = LoadingStates.LOADING;
      })
      .addCase(uploadAllProducts.fulfilled, (state, action) => {
        state.status = LoadingStates.SUCCEEDED;
        const { results, errors } = action.payload;
        state.productos.concat(results);
        state.error = errors.map((errPOOL) => errPOOL.message);
      })
      .addCase(uploadAllProducts.rejected, (state, action) => {
        state.status = LoadingStates.REJECT;
        console.log("No se pudieron subir ninguno de los productos");
      });

    builder
      .addCase(createProductThunk.pending, (state) => {
        state.status = LoadingStates.LOADING;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.status = LoadingStates.SUCCEEDED;
        const product = action.payload;
        if (product !== undefined) {
          state.productos.push(product);
          toast.success("Producto Creado");
        }
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.status = LoadingStates.REJECT;
        toast.error("Producto no Creado");
        console.log("No se pudieron subir ninguno de los productos");
      });
  },
});

export const { setSearchProduct, updateProduct } = productsSlice.actions;

export default productsSlice.reducer;
