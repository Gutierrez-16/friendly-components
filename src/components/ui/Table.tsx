import * as React from "react";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  caption?: string;
}

const Table: React.FC<TableProps> = ({
  caption,
  children,
  className = "",
  ...props
}) => {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse ${className}`} {...props}>
        {caption && (
          <caption className="text-lg font-semibold py-2">{caption}</caption>
        )}
        {children}
      </table>
    </div>
  );
};

const TableHead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <thead className={`bg-gray-200 ${className}`} {...props}>
      {children}
    </thead>
  );
};

const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
};

const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <tr
      className={`border-b border-gray-300 hover:bg-primary-light/20 transition-colors ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
};

const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <td className={`py-2 px-4 ${className}`} {...props}>
      {children}
    </td>
  );
};

const TableHeaderCell: React.FC<
  React.ThHTMLAttributes<HTMLTableCellElement>
> = ({ children, className = "", ...props }) => {
  return (
    <th
      className={`py-2 px-4 text-primary-dark font-semibold ${className} border-b border-b-gray-200`}
      {...props}
    >
      {children}
    </th>
  );
};

export { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell };
