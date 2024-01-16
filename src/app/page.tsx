"use client"
import { Box, Button, CheckboxIcon, HStack, Input, InputGroup, InputLeftElement, InputRightElement, Text, useDisclosure, useMediaQuery } from '@chakra-ui/react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import TableComponent from '../components/Table'
import { createColumnHelper } from '@tanstack/react-table'
import { FaEdit } from 'react-icons/fa'
import { LoadingStates, Product, PropsAxios, baseUrl } from "../types"
import ModalUpdatePrice from '../components/ModalUpdatePrice'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts as getProductsSelector , getSearchResults, getStatus } from '@/features/products/selector'
import Loading from '@/components/Loading'
import { getProducts, setSearchProduct, uploadAllProducts, uploadAllProductsLogic } from '@/features/products/proeductsSlice'
import productos from "../features/data/data"
import _debounce from "lodash/debounce";
import { IoMdClose } from 'react-icons/io'
import { MdOutlineCreateNewFolder } from 'react-icons/md'
import ModalCreateProduct from '@/components/ModalCreateProduct'
import MobileTable from '@/components/mobileTable'

const columnHelper = createColumnHelper<Product>()

const PageTable = () => {
  const {isOpen, onClose, onOpen} = useDisclosure();
  const createProductDisclosure = useDisclosure();
  const [search, setSearch] = useState<string>("")
  const dispatch = useDispatch<any>();
  // const [data, setData] = useState([])
  const [productSelected, setProductSelected] = useState<Product | null>(null)
  const data = useSelector(getProductsSelector)
  const searchResults = useSelector(getSearchResults)
  const [mediaQuery] = useMediaQuery('(max-width: 540px)')
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
  const ref = useRef(null)
  const handleOpenMobileModal = (val:Product) => {
    setProductSelected(val)
    onOpen();
  }


  return (
    <Box p={["1rem", "2rem"]}>
      <Box display={"flex"}>
        <InputGroup mb={"2rem"}>
          <Input  
            ref={ref}
            placeholder='Buscar Producto' 
            size='lg'
            onChange={handleSearch}
          />
          <InputRightElement
            onClick={()=>{
              const input : any = ref.current
              if(input !== null){
                input.value = "";
              }
              setSearch("")
            }
          }
            cursor={"pointer"}
            top={"8%"}
          >
            <IoMdClose />
          </InputRightElement>
        </InputGroup>
        <Button ml={"1rem"}
          onClick={()=>{
            createProductDisclosure.onOpen()
          }}
        >
          <MdOutlineCreateNewFolder fontSize={"1.5rem"}/>
        </Button>
      </Box>
        {
          data.length === 0 
          ?<Loading display={["none", "block"]}/>
          :
          !mediaQuery && (
          <Box display={["none", "block"]}>
            <TableComponent data={!(search === "") ? searchResults : data} columns={columns}/>
          </Box>
          )
        }
        {
          data.length === 0 
          ?<Loading display={["block", "none"]}/>
          :
          mediaQuery && <MobileTable items={!(search === "") ? searchResults : data} onClick={handleOpenMobileModal}/>
          
        }
        {
           productSelected !== null && (
            <ModalUpdatePrice key={"modal-update"} isOpen={isOpen} onClose={onClose} productSelected={productSelected} />
           )   
        }
        <ModalCreateProduct key={"modal-create-product"} isOpen={createProductDisclosure.isOpen} onClose={createProductDisclosure.onClose}/>
    </Box>
  )
}

export default PageTable