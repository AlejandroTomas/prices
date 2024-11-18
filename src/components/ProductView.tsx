"use client";
import { getProducts } from "@/features/products/proeductsSlice";
import { getMapEan } from "@/features/products/selector";
import { Product } from "@/types";
import { useToast, Flex, Text } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _debounce from "lodash/debounce";

interface Props {
  tabIndex: number;
}
const ProductView = ({ tabIndex }: Props) => {
  const [, setBarcode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const dispatch = useDispatch<any>();
  const eansData = useSelector(getMapEan);
  const toast = useToast();
  const refInput = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    _debounce((value) => {
      setBarcode(value);
    }, 300), // 300ms debounce, ajustable según sea necesario
    []
  );

  const handleScan = (barcode: string) => {
    try {
      const value = eansData.get(barcode);
      if (value === undefined) throw new Error("Código no encontrado");
      setProduct(value);
      refInput.current?.focus();
    } catch (error: any) {
      toast.closeAll();
      toast({
        title: "ERROR",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  useEffect(() => {
    refInput.current?.focus();
    dispatch(getProducts());
  }, []);

  useEffect(() => {
    if (tabIndex === 0) {
      setTimeout(() => {
        refInput.current?.focus();
      }, 100);
    }
  }, [tabIndex]);

  return (
    <Flex minH={"75dvh"} flexDirection={"column"} gap={5}>
      <div className="chakra-input-container">
        <input
          className="chakra-input"
          ref={refInput}
          placeholder="Escanear código de barras"
          inputMode="none"
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              void handleScan(e.target.value); // Ejecutamos el escaneo al presionar Enter
              e.target.value = "";
              e.target.inputMode = "none";
            }
            return e;
          }}
        />
      </div>
      <Flex
        flex={"1"}
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        padding={4}
        boxShadow="sm"
        textAlign="center"
        flexDirection={"column"}
        alignItems={"center"}
      >
        <Text fontSize="2.5rem" fontWeight="bold">
          {product?.name}
        </Text>

        <Text fontSize="1.5rem" color="gray.500">
          {product?.unit}
        </Text>

        <Text fontSize="8rem" fontWeight="bold" color="teal.500">
          ${(product?.price ?? 0).toFixed(2)}
        </Text>
      </Flex>
    </Flex>
  );
};

export default ProductView;
