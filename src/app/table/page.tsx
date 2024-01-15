"use client"
import { Box, Button, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import TableComponent from './Table'
import { createColumnHelper } from '@tanstack/react-table'
import { FaEdit } from 'react-icons/fa'
import { LoadingStates, Product, PropsAxios } from "../../types"
import ModalUpdatePrice from './ModalUpdatePrice'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts as getProductsSelector , getStatus } from '@/features/products/selector'
import Loading from '@/components/Loading'
import { getProducts } from '@/features/products/proeductsSlice'

const local = true;

export const baseUrl = local ? "http://localhost:5000" : "https://api-server-v2-production.up.railway.app"
const columnHelper = createColumnHelper<Product>()

const PageTable = () => {
  const {isOpen, onClose, onOpen} = useDisclosure()
  const dispatch = useDispatch<any>();
  // const [data, setData] = useState([])
  const [productSelected, setProductSelected] = useState<Product | null>(null)
  const data = useSelector(getProductsSelector)
  const columns = useMemo(
    () =>[
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
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
  return (
    <Box p={"2rem"}>
      
        <TableComponent data={data ?? []} columns={columns}/>
        {
           productSelected !== null && (
            <ModalUpdatePrice isOpen={isOpen} onClose={onClose} productSelected={productSelected} />
           )   
        }
    </Box>
  )
}

export default PageTable