import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  if (totalItems <= 0 || totalPages <= 1) return (
    <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50/50">
      <div className="text-sm text-slate-500 font-medium">
        แสดงผล <span className="font-bold text-slate-700">{totalItems > 0 ? 1 : 0}</span> ถึง <span className="font-bold text-slate-700">{totalItems}</span> จากทั้งหมด <span className="font-bold text-slate-700">{totalItems}</span> รายการ
      </div>
    </div>
  );
  
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-200 bg-slate-50/50">
      <div className="text-sm text-slate-500 font-medium">
        แสดงผล <span className="font-bold text-slate-700">{startItem}</span> ถึง <span className="font-bold text-slate-700">{endItem}</span> จากทั้งหมด <span className="font-bold text-slate-700">{totalItems}</span> รายการ
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex items-center gap-1 px-1">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <div key={`dots-${index}`} className="w-8 flex items-center justify-center text-slate-400">
                <MoreHorizontal size={16} />
              </div>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                  currentPage === page 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                    : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200 shadow-sm'
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
