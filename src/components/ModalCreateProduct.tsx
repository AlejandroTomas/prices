import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { Box, HStack, Input, Text } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct } from '@/features/products/proeductsSlice'
import { getStatus } from '@/features/products/selector'
import { LoadingStates } from '@/types'

interface Props {
    isOpen : boolean, 
    onClose: () => void
}

const initialState = {
    name:"",
    price :0,
    cantidad:"pieza"
}

const ModalCreateProduct = ({ isOpen, onClose } : Props) => {
  const [formval, setForm] = useState(initialState)
  const dispatch = useDispatch<any>();
  const state = useSelector(getStatus)
  const handleFor = (e:any)=>{
    const  nameInput : string = e.target.name
    switch(nameInput){
        case "name":
            setForm({
                ...formval,
                name:e.target.value
            })
            break;
        case "price":
            setForm({
                ...formval,
                price:e.target.value
            })
            break;
        case "cantidad":
            setForm({
                ...formval,
                cantidad:e.target.value
            })
            break;
    }

  }
  const handleSubmit = ()=>{
    dispatch(createProduct({
        name:formval.name,
        price:formval.price,
        type:"",
        unit:formval.cantidad
    }))
  }
  useEffect(() => {
    if(state === LoadingStates.SUCCEEDED){
        onClose();
    }
  }, [state])
  
  return (
    <Modal
        title='Crear Producto'
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        onSubmit={handleSubmit}
    >
        <>
                <HStack display={"flex"} gap={3}>
                    <Box>
                        <Text>Producto</Text>
                        <Input placeholder='Nombre del producto'size='lg'
                            name='name'
                            onChange={(e)=>{
                                handleFor(e)
                                return e;
                            }}
                            value={formval.name}
                        />
                    </Box>
                    <Box>
                        <Text>Cantidad</Text>
                        <Input  placeholder='Cantidad'size='lg' 
                            name='cantidad'
                            onChange={(e)=>{
                                handleFor(e)
                                return e;
                            }}
                            value={formval.cantidad}
                        />
                    </Box>
                </HStack>
            </>
            <>
                <Text>Precio</Text>
                <Input placeholder='Precio'size='lg' 
                    name='price'
                    onChange={(e)=>{
                        handleFor(e)
                        return e;
                    }}
                    value={formval.price}
                />
            </>
    </Modal>
  )
}

export default ModalCreateProduct