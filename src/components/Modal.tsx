import {
    Modal as ChakraModal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
  } from "@chakra-ui/react";
  
  export interface MinimalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  interface Props extends MinimalProps {
    onSubmit?: () => void;
    children: any;
    title: string;
    cancelButton?: boolean;
    cancelButtonText?: string;
    action?: () => void;
    onSubmitButtonText?: string;
    actionColor?: string;
    isDisabled?: boolean;
    size?:
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "6xl"
      | "full";
  }
  
  export default function Modal({
    isOpen = false,
    onClose,
    onSubmit,
    title,
    children,
    onSubmitButtonText,
    isDisabled,
    size = "md",
  }: Props) {
    return (
      <ChakraModal isOpen={isOpen} onClose={onClose} size={size}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
  
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            {onSubmit !== undefined && (
              <Button
                colorScheme="blue"
                onClick={onSubmit}
                isDisabled={isDisabled}
              >
                {onSubmitButtonText ?? "Guardar"}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </ChakraModal>
    );
  }
  