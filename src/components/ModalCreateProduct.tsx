import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { Box, HStack, Input, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { createProductThunk } from "@/features/products/proeductsSlice";
import { getStatus } from "@/features/products/selector";
import { LoadingStates } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const initialState = {
  name: "",
  price: 0,
  unit: "",
  type: "",
  quantityOnStock: 0,
  onStock: true,
  tag: "normal",
  ean: "",
};

const ModalCreateProduct = ({ isOpen, onClose }: Props) => {
  const [formval, setForm] = useState(initialState);
  const dispatch = useDispatch<any>();
  const state = useSelector(getStatus);
  const handleFor = (e: any) => {
    let { name, value } = e.target;
    if (name === "price") {
      value = Number(value);
    }
    setForm({
      ...formval,
      [name]: value,
    });
  };
  const handleSubmit = () => {
    dispatch(createProductThunk(formval as any));
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
      onSubmit={handleSubmit}
    >
      <HStack display={"flex"} gap={3}>
        <Box>
          <Text>Producto</Text>
          <Input
            placeholder="Nombre del producto"
            size="lg"
            name="name"
            onChange={(e) => {
              handleFor(e);
              return e;
            }}
            value={formval.name}
          />
        </Box>
        <Box>
          <Text>Unidad</Text>
          <Input
            placeholder="Unidad"
            size="lg"
            name="unit"
            onChange={(e) => {
              handleFor(e);
              return e;
            }}
            value={formval.unit}
          />
        </Box>
      </HStack>

      <HStack display={"flex"} gap={3}>
        <Box>
          <Text>Precio</Text>
          <Input
            placeholder="Precio"
            type="number"
            size="lg"
            name="price"
            onChange={(e) => {
              handleFor(e);
              return e;
            }}
            value={formval.price}
          />
        </Box>

        <Box>
          <Text>Codigo de barras</Text>
          <Input
            placeholder="Codigo de barras"
            size="lg"
            name="ean"
            onChange={(e) => {
              handleFor(e);
              return e;
            }}
            value={formval.ean}
          />
        </Box>
      </HStack>
    </Modal>
  );
};

export default ModalCreateProduct;
