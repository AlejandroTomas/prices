import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateProduct, JsonProps, LoadingStates, Product, ProductDirty, ProductState, PropsAxios, PropsToCreateOneProcut, baseUrl } from "../../types"
import toast from "react-hot-toast";
import PromisePool from "@supercharge/promise-pool";

const initialState: ProductState = {
  status: LoadingStates.IDLE,
  productos: [],
  error: null,
  searchProduct : "",
  searchResults: []
};

export async function uploadAllProductsLogic(newProduct:ProductDirty){
  try {
    const data : PropsToCreateOneProcut = {
      name:newProduct.Nombre,
      price:Number(newProduct.Precio),
      quantityOnStock:0,
      type:newProduct.category,
      unit:newProduct.Tamaño,
      img:"https://i.ibb.co/St69zhK/default.jpg"
    }
    const url = `${baseUrl}/productos`;
    const configAxios : PropsAxios["configAxios"] = {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify(data)
    }
    const res = await fetch(url,configAxios);
    let json : JsonProps = await res.json();
    if(Object.prototype.hasOwnProperty.call(json,"message")) throw Error(json.message.message)
    return json
  } catch (error : any) {
    return error.message
  }
}

export const getProducts  = createAsyncThunk(
    "products/getProducts",
async ({url, configAxios }:PropsAxios) => {
      try {
        const res = await fetch(url,configAxios);
        let json = await res.json();
        if(!res.ok) throw {status:res.status,statusText:res.statusText}; //Capturar el error
        window.localStorage.setItem("dateProducts",JSON.stringify(json))
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


export const createProduct = createAsyncThunk(
  "product/createProcut",
  async ({price, name, unit}:CreateProduct) =>{
    try {
      const data : CreateProduct  = {
        name,
        type:"nuevo",
        price,
        img: "https://i.ibb.co/St69zhK/default.jpg",
        quantityOnStock:0,
        unit
      }
      const url = `${baseUrl}/productos`;
      const configAxios = {
          method:"POST",
          headers:{
              "Content-Type": "application/json",
          },
          body:JSON.stringify(data)
      }
      const res = await fetch(url,configAxios);
      let json = await res.json();
      if(Object.prototype.hasOwnProperty.call(json,"message")) throw Error(json.message.message)
      return {
        response : json,
      };
  } catch (error) {
    console.log(error)
  }
  }
)

export const uploadAllProducts = createAsyncThunk(
  "products/uploadAllProducts",
  async ({products}:{products:ProductDirty[]}) =>{
    const {results, errors} = await PromisePool.for(products)
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
    .process(async (data)=>{
      const response : Product = await uploadAllProductsLogic(data)
      if(response._id === undefined){
        throw response;
      } 
      return response;
    })
    return{
      results,
      errors
    }
  }
)
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers:{
    setSearchProduct:(state, action)=>{
      state.searchProduct = action.payload
    },
    setProductsFromLocalStorage:(state):any=>{
      const dataFromLocalStorage = window.localStorage.getItem("dateProducts")
      if(dataFromLocalStorage === null)return toast.error("No se encontro datos desde el localStorage",{duration:4000})
      if(typeof dataFromLocalStorage === "string"){
        const dataJSON :Product[] = JSON.parse(dataFromLocalStorage) 
        if(dataJSON.length === 0)return toast.error("No se encontro datos desde el localStorage",{duration:4000})
        state.productos = dataJSON;
      }
    }
  },
  extraReducers(builder) {
    builder
    .addCase(getProducts.pending,(state)=>{
      state.status = LoadingStates.LOADING
    })
    .addCase(getProducts.fulfilled,(state, action)=>{
      state.status = LoadingStates.IDLE
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
          state.productos[index] = payload.newProduct
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

    builder
    .addCase(uploadAllProducts.pending,(state)=>{
      state.status = LoadingStates.LOADING
    })
    .addCase(uploadAllProducts.fulfilled,(state, action)=>{
      state.status = LoadingStates.SUCCEEDED
      const {results , errors} = action.payload;
      state.productos.concat(results);
      state.error = errors.map((errPOOL)=>errPOOL.message)
    })
    .addCase(uploadAllProducts.rejected,(state, action)=>{
      state.status = LoadingStates.REJECT
      console.log("No se pudieron subir ninguno de los productos")
    })

    builder
    .addCase(createProduct.pending,(state)=>{
      state.status = LoadingStates.LOADING
    })
    .addCase(createProduct.fulfilled,(state, action)=>{
      state.status = LoadingStates.SUCCEEDED
      const product = action.payload?.response;
      if(product !== undefined){
        state.productos.push(product)
        toast.success("Producto Creado")
      }
    })
    .addCase(createProduct.rejected,(state, action)=>{
      state.status = LoadingStates.REJECT
      toast.error("Producto no Creado")
      console.log("No se pudieron subir ninguno de los productos")
    })
  },
});

export const {
  setSearchProduct,
  setProductsFromLocalStorage
} = productsSlice.actions;

export default productsSlice.reducer;
