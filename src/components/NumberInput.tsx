import React from 'react'
import {  NumberInput as NumberInputChakra, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react"

interface Props {
    step?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
}

const NumberInput = ({step, defaultValue, min, max}:Props) => {
  return (
    <NumberInputChakra step={step} defaultValue={defaultValue} min={min} max={max}>
        <NumberInputField />
        <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
        </NumberInputStepper>
    </NumberInputChakra>
  )
}

export default NumberInput