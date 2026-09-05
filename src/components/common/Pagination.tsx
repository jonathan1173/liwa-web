import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  accentColor?: 'magenta' | 'green' | 'purple';
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 8,
  accentColor = 'magenta',
  className = '',
}) => {
  if (totalPages <= 1) return null;

  // Active color styling mapped to official Liwa palette
  const activeColorClasses = {
    magenta: 'bg-[#EC006C] text-white shadow-md shadow-[#EC006C]/25 border-[#EC006C]',
    green: 'bg-[#7AAF00] text-white shadow-md shadow-[#7AAF00]/25 border-[#7AAF00]',
    purple: 'bg-[#4A198C] text-white shadow-md shadow-[#4A198C]/25 border-[#4A198C]',
  }[accentColor];

  // Helper to compute visible page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const startItem = totalItems !== undefined ? (currentPage - 1) * itemsPerPage + 1 : undefined;
  const endItem =
    totalItems !== undefined ? Math.min(currentPage * itemsPerPage, totalItems) : undefined;

  return (
    <nav
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 ${className}`}
      aria-label="Paginación del catálogo"
    >
      {/* Summary info text */}
      {totalItems !== undefined && (
        <p className="text-xs font-medium text-slate-500 order-2 sm:order-1">
          Mostrando{' '}
          <span className="font-bold text-[#2C2C2C]">{startItem}</span> a{' '}
          <span className="font-bold text-[#2C2C2C]">{endItem}</span> de{' '}
          <span className="font-bold text-[#2C2C2C]">{totalItems}</span> productos
        </p>
      )}

      {/* Pagination controls group (Flowbite inspired) */}
      <div className="inline-flex items-center -space-x-px rounded-2xl shadow-xs bg-white/90 backdrop-blur-md border border-slate-200/90 p-1 order-1 sm:order-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center px-3 py-2 text-xs font-semibold text-[#2C2C2C] rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Page buttons */}
        <div className="flex items-center space-x-1 px-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-xs text-slate-400 select-none"
                >
                  •••
                </span>
              );
            }

            const pageNum = Number(page);
            const isActive = currentPage === pageNum;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-8 h-8 px-2 flex items-center justify-center text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? `${activeColorClasses} font-black`
                    : 'text-[#2C2C2C] hover:bg-slate-100 border border-transparent'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center px-3 py-2 text-xs font-semibold text-[#2C2C2C] rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
          aria-label="Página siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </nav>
  );
};
