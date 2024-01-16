"use client"
import React, { useEffect, useState } from 'react'
import Modal from '@/components/Modal'
import { LoadingStates, Product } from '@/types'
import { Box, Input, Stack, Text } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { updatePriceProduct } from '@/features/products/proeductsSlice'
import { getStatus } from '@/features/products/selector'

// async function updatePriceProduct(newProduct:Product){
//     const data = {
//         price : newProduct.price
//     }
// }

interface Props {
    isOpen: boolean, 
    onClose: ()=>void, 
    productSelected : Product
}

const ModalUpdatePrice = ({isOpen, onClose, productSelected}:Props) => {
  const [price, setPrice] = useState(productSelected.price)
  const dispatch = useDispatch<any>()
  const state = useSelector(getStatus)
  const hanldeUpdatePriceProduct = (newProduct:Product)=>{
    dispatch(updatePriceProduct({newProduct}))
    
  }
  useEffect(() => {
    setPrice(productSelected.price)
  }, [productSelected])
  
  useEffect(() => {
    if(state === LoadingStates.SUCCEEDED){
        onClose();
    }
  }, [state])
  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title='Actualizar Precio'
        size='xl'
        onSubmit={()=>hanldeUpdatePriceProduct({...productSelected, price,__v:(productSelected.__v + 1)})}
    >
        <Stack spacing={3}>
            <>
                <Text>Producto</Text>
                <Box display={"flex"} gap={3}>
                    <Input  placeholder='Product'size='lg' defaultValue={productSelected.name}/>
                    <Input placeholder='Product'size='lg' defaultValue={productSelected.unit}/>
                </Box>
            </>
            <>
                <Text>Precio</Text>
                <Input placeholder='Product'size='lg' value={price}
                    onChange={(e)=>{
                        setPrice(Number(e.target.value))
                        return e;
                    }}
                />
            </>
        </Stack>
    </Modal>
  )
}

export default ModalUpdatePrice