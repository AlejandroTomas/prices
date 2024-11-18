import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { createProductThunk } from "@/features/products/proeductsSlice";
import { getStatus } from "@/features/products/selector";
import { LoadingStates } from "@/types";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Inputs = {
  name: string;
  price: number;
  unit: string;
  type: string;
  quantityOnStock: number;
  onStock: boolean;
  tag: string;
  ean: string;
  priceOffert: number;
};

const ModalCreateProduct = ({ isOpen, onClose }: Props) => {
  const dispatch = useDispatch<any>();
  const state = useSelector(getStatus);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (formValues) => {
    dispatch(
      createProductThunk({
        ean: formValues.ean,
        img: "https://i.ibb.co/St69zhK/default.jpg",
        name: formValues.name,
        onStock: true,
        price: formValues.price,
        priceOffert: isNaN(formValues.priceOffert) ? 0 : formValues.priceOffert,
        quantityOnStock: 0,
        tag: formValues.tag ?? "",
        type: formValues.type ?? "",
        unit: formValues.unit ?? "",
      })
    );
    reset();
  };

  useEffect(() => {
    if (state === LoadingStates.SUCCEEDED) {
      onClose();
    }
  }, [state]);

  return (
    <Modal
      title="Crear Producto"
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <HStack display={"flex"} gap={3}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Producto*</FormLabel>
          <Input
            placeholder="Nombre del producto"
            size="lg"
            {...register("name", { required: true })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.unit}>
          <FormLabel>Unidad*</FormLabel>
          <Input
            placeholder="Unidad"
            size="lg"
            {...register("unit", { required: true })}
          />
          <FormErrorMessage>{errors.unit?.message}</FormErrorMessage>
        </FormControl>
      </HStack>

      <HStack display={"flex"} gap={3}>
        <FormControl isInvalid={!!errors.price}>
          <FormLabel>Precio*</FormLabel>
          <Input
            placeholder="Precio"
            type="number"
            size="lg"
            {...register("price", { required: true, valueAsNumber: true })}
          />
          <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.priceOffert}>
          <FormLabel>Precio secundario</FormLabel>
          <Input
            placeholder="Precio secundario"
            type="number"
            size="lg"
            {...register("priceOffert", {
              valueAsNumber: true,
              required: false,
              value: 0,
            })}
          />
          <FormErrorMessage>{errors.priceOffert?.message}</FormErrorMessage>
        </FormControl>
      </HStack>

      <HStack display={"flex"} gap={3}>
        <FormControl isInvalid={!!errors.type}>
          <FormLabel>Tipo</FormLabel>
          <Input
            placeholder="Tipo de producto"
            size="lg"
            {...register("type")}
          />
          <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.ean}>
          <FormLabel>Codigo de barras*</FormLabel>
          <Input
            placeholder="Codigo de barras"
            size="lg"
            {...register("ean", { required: true })}
          />
          <FormErrorMessage>{errors.ean?.message}</FormErrorMessage>
        </FormControl>
      </HStack>
    </Modal>
  );
};

export default ModalCreateProduct;
