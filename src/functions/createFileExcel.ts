import * as XLSX from "xlsx";

type Data = Record<string, any>;

const createFileExcel = (data: Data[], fileName: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Productos");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export { createFileExcel };
