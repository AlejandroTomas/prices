"use client";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { FaDatabase } from "react-icons/fa";
import { IoIosMenu, IoMdClose } from "react-icons/io";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import ModalCreateProduct from "./ModalCreateProduct";
import { baseUrl } from "@/types";
import { addProductToDB } from "@/functions/idb";
import toast from "react-hot-toast";
import useAsyncLoader from "@/hooks/useAsyncLoader";
import LoaderFullScreen from "./LoaderFullScreen";

const Header = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { executeAsync, isLoading } = useAsyncLoader();
  const getProductSFromDB = async () => {
    const res = await fetch(`${baseUrl}/productos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let json: any[] = await res.json();
    if (!res.ok) throw { status: res.status, statusText: res.statusText }; //Capturar el error
    json.forEach(async (prd) => {
      await addProductToDB(prd);
    });
  };
  const handleClick = () => {
    executeAsync(getProductSFromDB, [], {
      successMessage: "Datos cargados correctamente",
      errorMessage: "No se pudieron cargar los datos",
    });
  };
  return (
    <Flex gap={5} p={3} justifyContent={"space-between"}>
      {isLoading && <LoaderFullScreen />}
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<IoIosMenu />}
          variant="outline"
        />
        <MenuList>
          <MenuItem icon={<FaDatabase />} command="⌘T" onClick={handleClick}>
            Traer DB
          </MenuItem>
        </MenuList>
      </Menu>
      <Box>
        <Text>Miscenalea Alex</Text>
      </Box>
      <Button
        ml={"1rem"}
        onClick={() => {
          onOpen();
        }}
      >
        <MdOutlineCreateNewFolder fontSize={"1.5rem"} />
      </Button>
      <ModalCreateProduct
        key={"modal-create-product"}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Flex>
  );
};

export default Header;