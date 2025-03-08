import * as React from "react";
import { SkipBack, ChevronLeft, ChevronRight, SkipForward } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-center px-2 py-2">
    <div className="flex items-center">
      <span className="mr-2 text-sm font-medium text-gray-800">Size:</span>
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="border p-1 rounded"
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
    <div className="flex items-center space-x-1">
      <span className="text-sm font-medium text-gray-800">
        Pages: {currentPage + 1} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(0)}
        disabled={currentPage === 0}
        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <SkipBack className="w-4 h-4" />
      </button>
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
        disabled={currentPage === 0}
        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))}
        disabled={currentPage >= totalPages - 1}
        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => onPageChange(totalPages - 1)}
        disabled={currentPage >= totalPages - 1}
        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <SkipForward className="w-4 h-4" />
      </button>
    </div>
  </div>
);

