"use client"
import { Box, Button, Input, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import TableComponent from './Table'
import { createColumnHelper } from '@tanstack/react-table'
import { FaEdit } from 'react-icons/fa'
import { LoadingStates, Product, PropsAxios } from "../../types"
import ModalUpdatePrice from './ModalUpdatePrice'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts as getProductsSelector , getSearchResults, getStatus } from '@/features/products/selector'
import Loading from '@/components/Loading'
import { getProducts, setSearchProduct, uploadAllProducts, uploadAllProductsLogic } from '@/features/products/proeductsSlice'
import productos from "../../features/data/data"
import _debounce from "lodash/debounce";

const local = true;

export const baseUrl = local ? "http://localhost:5000" : "https://api-server-v2-production.up.railway.app"
const columnHelper = createColumnHelper<Product>()

const PageTable = () => {
  const {isOpen, onClose, onOpen} = useDisclosure();
  const [search, setSearch] = useState<string>("")
  const dispatch = useDispatch<any>();
  // const [data, setData] = useState([])
  const [productSelected, setProductSelected] = useState<Product | null>(null)
  const data = useSelector(getProductsSelector)
  const searchResults = useSelector(getSearchResults)
  const columns = useMemo(
    () =>[
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('unit', {
      header: () => 'Cantidad',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('price', {
      header: () => 'Price',
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor(row => row, {
      id:"all",
      cell(props) {
        const value : Product = props.getValue()
        return <Box
                  cursor={"pointer"}
                  onClick={()=>{
                    setProductSelected(value)
                    onOpen();
                  }}
                  display={"flex"}
                >
                  <Text mr={"1rem"}>Editar</Text> <FaEdit />
                </Box> 
      },
    footer: info => "id" 
    })
  ],[data])
  useEffect(() => {
    dispatch(getProducts({
      url :`${baseUrl}/productos`,  
      configAxios: {
        method:"GET",
        headers:{
          "Content-Type": "application/json",
        },
      }
    }))
  }, [])

  const debounceSearch = _debounce((value: string) => {
    setSearch(value);
    dispatch(setSearchProduct(value));
  }, 500);

  const handleSearch = (e: any) => {
    debounceSearch(e.target.value);
    return e;
  };

  return (
    <Box p={"2rem"}>
      <Input  
        placeholder='Buscar Producto' 
        size='lg' 
        mb={"2rem"}
        onChange={handleSearch}
      />
        {
          data.length === 0 
          ?<Loading/>
          :<TableComponent data={!(search === "") ? searchResults : data} columns={columns}/>
        }
        
        {
           productSelected !== null && (
            <ModalUpdatePrice isOpen={isOpen} onClose={onClose} productSelected={productSelected} />
           )   
        }
        {/* <Button
          onClick={()=>{
            dispatch(uploadAllProducts({
              products:productos
            }))
          }}
        >
          Crear producto
        </Button> */}
    </Box>
  )
}

export default PageTable