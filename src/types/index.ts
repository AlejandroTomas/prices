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
  error: null | null,
}

export interface PropsAxios {
  url:string, 
  configAxios:{
    method: "GET" | "PUT" | "PUSH",
    headers: Record<string, string>
    body?:any
  }
}