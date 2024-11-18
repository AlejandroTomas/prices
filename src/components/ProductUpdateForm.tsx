import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import Select from "./Select";
import { useDispatch, useSelector } from "react-redux";
import { getSearchResults } from "@/features/products/selector";
import _debounce from "lodash/debounce";
import {
  setSearchProduct,
  updateProduct,
} from "@/features/products/proeductsSlice";
import { updateProductInDB } from "@/functions/idb";
import { Product } from "@/types";
import useAsyncLoader from "@/hooks/useAsyncLoader";
import { useForm } from "react-hook-form";

const FormGroup = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <VStack
      spacing={4}
      w="full"
      alignContent="flex-start"
      alignItems="flex-start"
    >
      <Flex
        gap={5}
        w="full"
        sx={{ "*": { flex: 1 } }}
        wrap={"wrap"}
        flexDirection={"row"}
      >
        {children}
      </Flex>
    </VStack>
  );
};

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

const ProductUpdateForm = () => {
  const [product, setProduct] = useState<Product | null>(null); // Estado para almacenar el producto seleccionado

  const {
    register,
    getValues,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const searchResults = useSelector(getSearchResults);

  const dispatch = useDispatch<any>();

  // Función para manejar la actualización del producto

  const { executeAsync, isLoading } = useAsyncLoader();

  const updateProductFn = async () => {
    if (product == null) return;
    const formData = getValues();
    const productUpdated: any = Object.assign(
      structuredClone(product),
      formData
    );
    // actualizar en local
    dispatch(updateProduct(productUpdated));
    // actualizar en permanete
    await updateProductInDB(productUpdated);
    setProduct(null);
    reset();
  };

  const handleUpdateProduct = () => {
    executeAsync(updateProductFn, [], {
      successMessage: "Producto Actualizado",
      errorMessage: "No se pudo actualizar el producto",
    });
  };

  const handleSelectProduct = (val: any) => {
    reset({
      ...val,
    });
    setProduct(val);
  };

  const productsOptions = useMemo(
    () =>
      searchResults.map((item) => ({
        label: `${item.name} - ${item.unit}`,
        value: item,
      })),
    [searchResults]
  );

  const debounceSearch = _debounce((value: string) => {
    if (value.length < 2) return;
    dispatch(setSearchProduct(value));
  }, 400);
  const handleSearch = (e: any) => {
    debounceSearch(e);
    return e;
  };

  return (
    <Box padding={4}>
      {/* Campo de búsqueda */}
      <FormControl id="search">
        <FormLabel>Buscar producto</FormLabel>
        <Select
          clearable
          value={productsOptions.find(
            ({ value: { name } }) => name === product?.name
          )}
          onChange={handleSelectProduct}
          options={productsOptions}
          onInputChange={handleSearch}
          menuPosition="absolute"
        />
      </FormControl>

      {/* Mostrar formulario si se encuentra el producto */}
      {product && (
        <Box padding={4}>
          <SimpleGrid
            columns={{ base: 1, md: 2 }} // 1 columna en móvil, 2 en pantallas medianas en adelante
            spacing={4} // Espaciado entre los campos
          >
            <FormControl id="name">
              <FormLabel>Nombre</FormLabel>
              <Input {...register("name", { required: true })} />
            </FormControl>

            <FormControl id="price">
              <FormLabel>Precio</FormLabel>
              <Input
                type="number"
                {...register("price", { required: true, valueAsNumber: true })}
              />
            </FormControl>

            <FormControl id="priceOffert">
              <FormLabel>Precio de oferta</FormLabel>
              <Input
                type="number"
                {...register("priceOffert", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </FormControl>

            <FormControl id="type">
              <FormLabel>Tipo</FormLabel>
              <Input {...register("type")} />
            </FormControl>
            <FormControl id="quantityOnStock">
              <FormLabel>Cantidad en stock</FormLabel>
              <Input
                type="number"
                {...register("quantityOnStock", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </FormControl>

            <FormControl id="tag">
              <FormLabel>Etiqueta</FormLabel>
              <Input {...register("tag")} />
            </FormControl>

            <FormControl id="unit">
              <FormLabel>Unidad</FormLabel>
              <Input {...register("unit", { required: true })} />
            </FormControl>

            <FormGroup>
              <FormControl id="ean">
                <FormLabel>Código de barras</FormLabel>
                <Input {...register("ean", { required: true })} />
              </FormControl>
            </FormGroup>

            {/* Botón de envío, ocupa todo el ancho en pantallas móviles */}

            <Button colorScheme="teal" onClick={handleUpdateProduct}>
              Actualizar Producto
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                setProduct(null);
              }}
            >
              Cancelar
            </Button>
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
};

export default ProductUpdateForm;
