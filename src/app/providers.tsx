"use client";
import store from "@/store";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <Provider store={store}>{children}</Provider>
    </ChakraProvider>
  );
}
