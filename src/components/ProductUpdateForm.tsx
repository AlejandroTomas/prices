import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import Select from "./Select";
import { useDispatch, useSelector } from "react-redux";
import { getSearchResults } from "@/features/products/selector";
import _debounce from "lodash/debounce";
import {
  setSearchProduct,
  updatePriceProduct,
  updateProduct,
} from "@/features/products/proeductsSlice";
import { updateProductInDB } from "@/functions/idb";
import { Product } from "@/types";
import useAsyncLoader from "@/hooks/useAsyncLoader";

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

const ProductUpdateForm = () => {
  const [product, setProduct] = useState<Product | null>(null); // Estado para almacenar el producto seleccionado

  const searchResults = useSelector(getSearchResults);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    priceOffert: 0,
    type: "",
    quantityOnStock: 0,
    onStock: false,
    tag: "",
    unit: "",
    ean: "",
  });

  const resetForm = () => {
    setProduct(null);
    setFormData({
      name: "",
      price: 0,
      priceOffert: 0,
      type: "",
      quantityOnStock: 0,
      onStock: false,
      tag: "",
      unit: "",
      ean: "",
    });
  };
  const dispatch = useDispatch<any>();

  // Función para manejar cambios en el formulario
  const handleChange = (e: any) => {
    let { name, value } = e.target;
    if (name === "price") {
      value = Number(value);
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para manejar la actualización del producto

  const { executeAsync, isLoading } = useAsyncLoader();

  const updateProductFn = async () => {
    if (product == null) return;
    const productUpdated: any = Object.assign(
      structuredClone(product),
      formData
    );
    // actualizar en local
    dispatch(updateProduct(productUpdated));
    // actualizar en permanete
    await updateProductInDB(productUpdated);
    resetForm();
  };

  const handleUpdateProduct = () => {
    executeAsync(updateProductFn, [], {
      successMessage: "Producto Actualizado",
      errorMessage: "No se pudo actualizar el producto",
    });
  };

  const handleSelectProduct = (val: any) => {
    setProduct(val);
    setFormData(Object.assign(formData, val));
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
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="price">
              <FormLabel>Precio</FormLabel>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="priceOffert">
              <FormLabel>Precio de oferta</FormLabel>
              <Input
                name="priceOffert"
                type="number"
                value={formData.priceOffert}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="type">
              <FormLabel>Tipo</FormLabel>
              <Input
                name="type"
                value={formData.type}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="quantityOnStock">
              <FormLabel>Cantidad en stock</FormLabel>
              <Input
                name="quantityOnStock"
                type="number"
                value={formData.quantityOnStock}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="tag">
              <FormLabel>Etiqueta</FormLabel>
              <Input name="tag" value={formData.tag} onChange={handleChange} />
            </FormControl>

            <FormControl id="unit">
              <FormLabel>Unidad</FormLabel>
              <Input
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              />
            </FormControl>

            <FormGroup>
              <FormControl id="ean">
                <FormLabel>Ean</FormLabel>
                <Input
                  name="ean"
                  value={formData.ean}
                  onChange={handleChange}
                />
              </FormControl>
            </FormGroup>

            {/* Botón de envío, ocupa todo el ancho en pantallas móviles */}

            <Button colorScheme="teal" onClick={handleUpdateProduct}>
              Actualizar Producto
            </Button>
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
};

export default ProductUpdateForm;
