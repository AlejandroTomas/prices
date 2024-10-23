"use client";
import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
const SelectChakra = dynamic(() => import("react-select"), { ssr: false });

interface OptionsType {
  value: any;
  label: string;
}

interface SelectProps {
  defaultValue?: any;
  value?: any;
  onChange: (val: any | null, obj?: any) => void;
  options: OptionsType[] | string[];
  placeholder?: string;
  clearable?: boolean;
  cb?: (val: any) => void;
  filterOption?: (
    option: {
      label: string;
      value: string;
      data: any;
    },
    inputValue: string
  ) => boolean;
  onInputChange?: (e: any) => any;
  isLoading?: boolean;
  isMulti?: boolean;
  isDisabled?: boolean;
  width?: string;
  closeMenuOnSelect?: boolean;
  isOptionDisabled?: any;
  controlHeight?: string;
  menuPosition?: "fixed" | "absolute";
}

export default function Select({
  options,
  defaultValue,
  placeholder = "",
  clearable = false,
  value,
  isLoading = false,
  cb = (e) => {},
  onChange,
  filterOption,
  onInputChange,
  isMulti = false,
  isDisabled = false,
  width = "full",
  closeMenuOnSelect,
  isOptionDisabled,
  controlHeight = "50px",
  menuPosition = "fixed",
}: SelectProps): JSX.Element {
  return (
    <Box w={width} id="select-react">
      <SelectChakra
        menuPosition={menuPosition}
        isDisabled={isDisabled}
        defaultValue={defaultValue}
        onChange={(obj: any) => {
          if (!isMulti) {
            const { value } = obj ?? {
              value: "",
            };
            onChange(value, obj);
            cb(value);
          } else {
            onChange(obj);
          }
        }}
        isMulti={isMulti}
        onInputChange={onInputChange}
        isLoading={isLoading}
        value={value}
        options={options}
        isSearchable={true}
        placeholder={placeholder ?? "Seleccione"}
        isClearable={clearable}
        filterOption={filterOption}
        styles={{
          option: (provided, state) => ({
            ...provided,
            fontSize: "20px", // Cambia el tamaño del texto de los ítems
            padding: 10, // Cambia el padding de los ítems
          }),
          singleValue: (provided, state) => ({
            ...provided,
            fontSize: "20px", // Cambia el tamaño del texto del ítem seleccionado
          }),
          menu: (baseStyles, state) => ({
            ...baseStyles,
            zIndex: "110",
            fontSize: "20px", // Cambia el tamaño del texto del menú
          }),
          control: (provided, state) => ({
            ...provided,
            color: "red",
            height: controlHeight, // Cambia la altura del control
          }),
        }}
        blurInputOnSelect={false}
        captureMenuScroll={true}
        closeMenuOnScroll={false}
        closeMenuOnSelect={closeMenuOnSelect}
        isOptionDisabled={isOptionDisabled}
      />
    </Box>
  );
}
