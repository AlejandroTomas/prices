import { Product } from '@/types';
import { Box, Button, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react'

const MobileTable = ({items, onClick}:{items:Product[], onClick:(par:any)=>void}) => {
    useEffect(() => {
        console.log("renderizado desde table mobiel", items)
    
      return () => {
        
      }
    }, [])
  return (
    <Box display={["block", "none"]}>
        {
            items.length > 0 ? (
                items.map((item) => {
                return (
                    <VStack
                    bg={
                        (item.__v !== 0 ? "#35e65e" : null) as any
                    }
                    key={item._id}
                    alignItems="flex-start"
                    width="full"
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    paddingY={4}
                    paddingX={2}
                    spacing={4}
                    >
                    <HStack
                        width="full"
                        alignItems="flex-start"
                        justifyContent="space-between"
                    >
                        <Heading size="md">
                        {item.name}
                        </Heading>
                        <Text fontSize="sm"></Text>
                    </HStack>
                    <VStack alignItems="flex-end" justifyContent="space-between" w={"100%"}>
                        <Text fontSize="lg" fontWeight="medium">                    
                            {`Cantidad: ${item.unit}` }
                        </Text>
                        <Text fontSize="lg" fontWeight="medium">
                            {`Precio: ${item.price}` }
                        </Text>
                        <Button
                            onClick={()=>onClick(item)}
                        >
                            Editar
                        </Button>
                    </VStack>
                    </VStack>
                );
                })
            )
            : 
            <Box>
                <Text>No se Encontraron Productos</Text>
            </Box>
        }
      </Box>
  )
}

export default MobileTable