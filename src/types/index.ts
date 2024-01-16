// interfaces
export type Product = {
    priceOffert: number,
    _id: string,
    type: string,
    name: string,
    price: number,
    img: string,
    quantityOnStock: number,
    onStock: boolean,
    tag: string,
    unit: string,
    __v: number
}


export enum LoadingStates{
    REJECT="REJECT",
    LOADING="LOADING",
    IDLE = "IDLE",  
    SUCCEEDED = "SUCCEEDED",
}

export interface ProductState{
  status: LoadingStates,
  productos: Product[],
  error: string[] | null,
  searchProduct: string | string[];
  searchResults: Product[];
}

export interface PropsAxios {
  url:string, 
  configAxios:{
    method: "GET" | "PUT" | "POST",
    headers: Record<string, string>
    body?:any
  }
}

export interface PropsToCreateOneProcut{
  name: string;
  type: string;
  price: number;
  img: "https://i.ibb.co/St69zhK/default.jpg";
  quantityOnStock: number | 0;
  unit:string;
}

export interface ProductDirty{
  Nombre: string,
  Tamaño: string,
  Precio: string,
  dressImage: string,
  category: string,
  state?: string,
}

export interface Error{
  message: any
}

export interface JsonProps extends Product{
  message?: any
}

export interface CreateProduct{
  name:string,
  type:string,
  price:number,
  img?:"https://i.ibb.co/St69zhK/default.jpg",
  quantityOnStock?:number,
  unit?:string
}

export const baseUrl = "https://api-server-v2-production.up.railway.app" //"http://localhost:5000"