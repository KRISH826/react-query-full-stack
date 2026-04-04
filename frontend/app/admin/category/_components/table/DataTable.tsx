"use client"

import * as React from "react"
import {
    ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Skeleton } from "@/components/ui/skeleton"
import { useGetAllCategoriesQuery } from "@/services/categoryApi"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { columns } from "./columns"

export function CategoryTable() {
  const { data: categories, isLoading, isError } = useGetAllCategoriesQuery()
  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  const table = useReactTable({
    data: categories ?? [],
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.children, 
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel()
  })

  if (isError) {
    return <div className="p-4 text-destructive">Failed to load categories. Please try again.</div>
  }

  return (
    <div className="w-full overflow-hidden">
      <Table className="min-w-full border-collapse border-0">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead 
                  className="bg-secondary/40 border-b border-secondary/70 font-bold text-sm uppercase tracking-wider" 
                  key={header.id}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={columns.length} className="py-4">
                  <Skeleton className="h-6 w-full opacity-50" />
                </TableCell>
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow 
                key={row.id} 
                className={`transition-colors border-b last:border-0 ${row.getIsExpanded() ? 'bg-muted/30' : 'hover:bg-muted/50'}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="py-3 px-4 text-base" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                No categories available in the system.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}