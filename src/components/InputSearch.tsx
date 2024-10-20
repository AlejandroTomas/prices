import { CiSearch } from "react-icons/ci";
import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import React, { type ChangeEvent } from "react";

interface Props {
  onChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  width?: string;
  ref?: any;
}

const InputSearch = ({
  onChangeSearch,
  placeholder,
  width = "100%",
  ref,
}: Props) => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <CiSearch color="gray.300" />
      </InputLeftElement>
      <Input
        ref={ref}
        w={width}
        type="text"
        placeholder={placeholder ?? "ID/Folio documento"}
        onChange={onChangeSearch}
      />
    </InputGroup>
  );
};

export default InputSearch;
