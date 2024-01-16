"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Box, Table, Tbody, Td, Tfoot, Th, Thead, Tr, chakra } from '@chakra-ui/react'
import Loading from '@/components/Loading';

interface Props{
  fullHeight? : boolean, 
  data: any[],
  columns:any,
  loading?: boolean,
}
function TableComponent({fullHeight = true, data, columns, loading = false }:Props) {
  const table = useReactTable({
    data:data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  const COLUMN_PERCENTAGE = columns.length / 100;
  if (loading) {
    return <Loading />;
  }
  return (
    <Box
    borderWidth="thin"
      borderRadius="lg"
      padding="2"
      overflow="auto"
      width="full"
      maxHeight={fullHeight ? "auto" : { base: "430px", xl: "670px" }}
    >
      <Table variant="simple" size={"sm"}>
        <Thead>
          {table.getHeaderGroups().map(headerGroup => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <Th key={header.id}
                  width={`${COLUMN_PERCENTAGE}%`}
                >
                  <chakra.span pl="4">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </chakra.span>
                  
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map(row => (
            <Tr 
              key={row.id}
              bg={
                (row.original.__v !== 0 ? "#35e65e" : null) as any
              }
            >
              {row.getVisibleCells().map(cell => (
                <Td key={cell.id} p={"1rem 0"}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <Tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <Td key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </Td>
              ))}
            </Tr>
          ))}
        </Tfoot>
      </Table>
      <div className="h-4" />
    </Box>
  )
}

export default TableComponent