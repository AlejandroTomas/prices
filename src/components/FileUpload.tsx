import React, { useState } from "react";
import Modal from "./Modal";
import * as XLSX from "xlsx";
import { Box, Button, Input, Text } from "@chakra-ui/react";
import { addProductToDB } from "@/functions/idb";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const FileUpload = ({ isOpen, onClose }: Props) => {
  const [excelData, setExcelData] = useState<any[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // Asumiendo que el archivo tiene solo una hoja
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convierte los datos de la hoja en formato JSON
      const data = XLSX.utils.sheet_to_json(sheet);
      setExcelData(data);
    };
    reader.readAsBinaryString(file);
  };

  const saveExcelData = () => {
    try {
      excelData.forEach(async (prd) => {
        await addProductToDB(prd);
      });
      toast.success("Datos guardados correctamente");
    } catch (error) {
      toast.error("Ocurrió un error al guardar los datos");
    }
  };
  const handleClose = () => {
    setExcelData([]);
    onClose();
  };
  return (
    <Modal title="Subir Archivo" isOpen={isOpen} onClose={handleClose}>
      <Box p={4}>
        <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        {excelData.length > 0 && (
          <Box mt={4}>
            <Text fontSize="lg" fontWeight="bold">
              Archivo Subido correctamente ...
            </Text>
            <Button onClick={saveExcelData}>Guardar Datos</Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default FileUpload;
