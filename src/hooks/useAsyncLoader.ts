import { useToast } from "@chakra-ui/react";
import { useState } from "react";

const useAsyncLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Wrapper para ejecutar funciones asíncronas con manejo de estado y toast
  const executeAsync = async (
    asyncFunction: (...args: any[]) => Promise<any>, // Acepta cualquier función asíncrona
    args: any[] = [], // Argumentos opcionales para la función
    toastOptions: {
      // Permite pasar opciones de toast personalizadas
      successMessage?: string;
      errorMessage?: string;
      successOptions?: object;
      errorOptions?: object;
    } = {}
  ) => {
    setIsLoading(true);

    const {
      successMessage = "Tarea realizada correctamente",
      errorMessage = "Error al ejecutar la tarea",
      successOptions = {},
      errorOptions = {},
    } = toastOptions;

    try {
      const result = await asyncFunction(...args); // Ejecuta la función asíncrona
      toast({
        title: "INFO",
        description: successMessage,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-left",
        ...successOptions, // Sobrescribir opciones del toast si es necesario
      });
      return result; // Devuelve el resultado de la función asíncrona
    } catch (error: any) {
      toast({
        title: "ERROR",
        description: errorMessage,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left",
        ...errorOptions, // Sobrescribir opciones del toast si es necesario
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, executeAsync };
};

export default useAsyncLoader;
