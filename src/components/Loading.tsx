import { Box, Center, Spinner } from "@chakra-ui/react";

const Loading = ({display}:any) => {
  return (
    <Box display={display}>
      <Center>
        <Spinner color="#ff4e0e" size="xl" />
      </Center>
    </Box>
  );
};

export default Loading;
