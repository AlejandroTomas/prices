"use client"
import React, { useState } from 'react'
import Modal from '@/components/Modal'
import { Product } from '@/types'
import { Input, Stack, Text } from '@chakra-ui/react'
import { baseUrl } from './page'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { updatePriceProduct } from '@/features/products/proeductsSlice'

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
  const hanldeUpdatePriceProduct = (newProduct:Product)=>{
    dispatch(updatePriceProduct({newProduct}))
    onClose();
  }
  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title='Modal Standard'
        size='xl'
        onSubmit={()=>hanldeUpdatePriceProduct({...productSelected, price})}
    >
        <Stack spacing={3}>
            <>
                <Text>Producto</Text>
                <Input placeholder='Product'size='lg' defaultValue={productSelected.name}/>
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