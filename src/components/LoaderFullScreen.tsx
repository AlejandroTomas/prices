import { Box, Spinner, Text } from "@chakra-ui/react";
import React from "react";

const LoaderFullScreen = ({
  title = "Ejecutando Cambios",
}: {
  title?: string;
}) => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"flex-start"}
      position={"fixed"}
      width={"100dvw"}
      height={"100dvh"}
      top={0}
      left={0}
      zIndex={9999999}
      backdropFilter={"blur(10px)"}
      backgroundColor={"#85858565"}
    >
      <Box
        width={"550"}
        minH={"150px"}
        textAlign={"center"}
        backgroundColor="#ffffff"
        p={"10"}
        borderRadius={"0.375rem"}
        mt={"40dvh"}
      >
        <Text as={"strong"} fontSize={"1.2rem"} textTransform={"uppercase"}>
          {title}
        </Text>
        <Box m={"2"}>
          <Spinner size="md" />
        </Box>
        <Text as={"b"} color={"#808080d7"}>
          No cierre el sistema
        </Text>
      </Box>
    </Box>
  );
};

export default LoaderFullScreen;
