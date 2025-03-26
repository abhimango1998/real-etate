"use client";

// React Imports
import { useEffect, useState } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { CircularProgress, TablePagination } from "@mui/material";

// Third-party Imports
import classnames from "classnames";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

// Component Imports
import CustomTextField from "@core/components/mui/TextField";

// Icon Imports
import ChevronRight from "@menu/svg/ChevronRight";

// Style Imports
import styles from "@core/styles/table.module.css";
import TablePaginationComponent from "../TablePaginationComponent";

// A debounced input react component
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, onChange, debounce]);

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const ReusableTable = ({
  columns,
  data,
  loading,
  searchQuery,
  onSearch,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <Card>
        <CardHeader
          action={
            <DebouncedInput
              value={searchQuery ?? ""}
              onChange={(value) => onSearch(String(value))}
              placeholder="Search all columns..."
            />
          }
        />
        <div className="overflow-x-auto">
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id}>
                        {header.isPlaceholder ? null : (
                          <>
                            <div
                              className={classnames({
                                "flex items-center":
                                  header.column.getIsSorted(),
                                "cursor-pointer select-none":
                                  header.column.getCanSort(),
                              })}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {{
                                asc: (
                                  <ChevronRight
                                    fontSize="1.25rem"
                                    className="-rotate-90"
                                  />
                                ),
                                desc: (
                                  <ChevronRight
                                    fontSize="1.25rem"
                                    className="rotate-90"
                                  />
                                ),
                              }[header.column.getIsSorted()] ?? null}
                            </div>
                          </>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td
                    colSpan={table.getVisibleFlatColumns().length}
                    className="text-center py-4"
                  >
                    <div className="flex justify-center items-center">
                      <CircularProgress size={24} color="warning" />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : data.length === 0 ? (
              <tbody>
                <tr>
                  <td
                    colSpan={table.getVisibleFlatColumns().length}
                    className="text-center"
                  >
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>

        <TablePagination
          component={() => (
            <TablePaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          )}
          count={totalItems}
          rowsPerPage={itemsPerPage}
          page={currentPage - 1}
          onPageChange={(_, page) => {
            onPageChange(page + 1);
          }}
          onRowsPerPageChange={() => {}}
          rowsPerPageOptions={[itemsPerPage]}
        />
      </Card>
    </>
  );
};

export default ReusableTable;
