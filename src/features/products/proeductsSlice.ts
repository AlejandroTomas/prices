import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LoadingStates, Product, ProductState, PropsAxios } from "../../types"
import toast from "react-hot-toast";
import { baseUrl } from "@/app/table/page";

const initialState: ProductState = {
  status: LoadingStates.IDLE,
  productos: [],
  error: null,
};


export const getProducts  = createAsyncThunk(
    "products/getProducts",
async ({url, configAxios }:PropsAxios) => {
      try {
        const res = await fetch(url,configAxios);
        let json = await res.json();
        if(!res.ok) throw {status:res.status,statusText:res.statusText}; //Capturar el error
        return json;
    } catch (err : any) {
        let message= err.statusText || "Ocurrio un error";
        console.log(err)
        console.log(message +" "+ err.status)
    }
    }
)

export const updatePriceProduct = createAsyncThunk(
  "products/updatePriceProduct",
  async ({newProduct}:{newProduct:Product})=>{
    try {
        const url = `${baseUrl}/productos/priceupdate/${newProduct._id}`;
        const configAxios = {
            method:"PUT",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify(newProduct)
        }
        const res = await fetch(url,configAxios);
        let json = await res.json();
        if(!res.ok) throw {status:res.status,statusText:res.statusText}; //Capturar el error
        return {
          response : json,
          newProduct,
        };
    } catch (error) {
      console.log(error)
    }
  }
)

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers:{},
  extraReducers(builder) {
    builder
    .addCase(getProducts.pending,(state)=>{
      state.status = LoadingStates.LOADING
    })
    .addCase(getProducts.fulfilled,(state, action)=>{
      state.status = LoadingStates.SUCCEEDED
      state.productos = action.payload;
    })
    .addCase(getProducts.rejected,(state, action)=>{
      state.status = LoadingStates.REJECT
      console.log("No se pudo traer los productos")
    })
    builder
    .addCase(updatePriceProduct.pending,(state)=>{
      state.status = LoadingStates.LOADING
    })
    .addCase(updatePriceProduct.fulfilled,(state, action)=>{
      state.status = LoadingStates.SUCCEEDED
      const { payload } = action

      if(payload !== undefined){
        const index = state.productos.findIndex((product)=>product._id === payload.newProduct._id )
        if(index !== -1){
          state.productos[index].price = payload.newProduct.price
          toast.success("Precio Actualizado")
        }else{
          toast.error("No se pudo actualizar el precio")
          console.log("producto no encontrado")
        }
      }else{
        toast.error("No se pudo actualizar el precio")
        console.log("payload es undefined")
      }
    })
    .addCase(updatePriceProduct.rejected,(state, action)=>{
      state.status = LoadingStates.REJECT
      console.log("No se pudo actualizar el precio")
    })
  },
});

export default productsSlice.reducer;
