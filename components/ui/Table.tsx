/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export type Column<T> = {
  key: keyof T | string;
  accessor?: (row: T) => any;
  title: string;

  classNameHeader?: string;
  classNameItem?: string;

  render?: (value: any, row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  className?: string;
  showIndex?: boolean;
  startIndex?: number;
};

export const Table = <T,>({
  columns,
  data,
  className = "",
  showIndex = false,
  startIndex = 0,
}: TableProps<T>) => {
  return (
    <div
      className={`
        overflow-x-auto
        border
        rounded-xl
        ${className}
      `}
    >
      <table className="w-full">
        <thead className="bg-thead h-10 text-muted-foreground">
          <tr>
            {showIndex && (
              <th className="px-4 py-2 text-center text-muted-foreground border-b font-semibold w-12">
                Stt
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-4 py-2 border-b font-semibold text-center ${column.classNameHeader || ""}`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data?.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-muted/50 transition-colors">
              {showIndex && (
                <td className="px-4 py-2 border-b text-center">
                  {startIndex + rowIndex + 1}
                </td>
              )}
              {columns.map((column) => {
                const value = column.accessor
                  ? column.accessor(row)
                  : row[column.key as keyof T];

                return (
                  <td
                    key={String(column.key)}
                    className={`px-4 py-2 border-b ${
                      column.classNameItem || ""
                    }`}
                  >
                    {column.render
                      ? column.render(value, row)
                      : String(value ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
