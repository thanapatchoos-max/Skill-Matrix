import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  itemsPerPage?: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
  className?: string;
  autoScrollTop?: boolean;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  itemsPerPage,
  totalPages: propTotalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
  itemLabel = 'คน',
  className = '',
  autoScrollTop = true,
}: PaginationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [jumpPage, setJumpPage] = useState('');
  const effectivePageSize = pageSize ?? itemsPerPage ?? 10;
  const calculatedTotalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));
  const totalPages = propTotalPages ?? calculatedTotalPages;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
    if (autoScrollTop && typeof window !== 'undefined' && containerRef.current) {
      const target =
        containerRef.current.closest('.overflow-x-auto') ||
        containerRef.current.previousElementSibling ||
        containerRef.current.parentElement;

      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (target instanceof HTMLElement) {
          target.scrollLeft = 0;
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum)) {
      const clamped = Math.max(1, Math.min(pageNum, totalPages));
      handlePageChange(clamped);
      setJumpPage('');
    }
  };

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * effectivePageSize + 1;
  const endItem = Math.min(safeCurrentPage * effectivePageSize, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (safeCurrentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  const btnBase =
    'inline-flex items-center justify-center rounded-lg border text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent';
  const navBtn = `${btnBase} h-8 px-2 border-slate-200 text-slate-700 bg-white hover:bg-slate-50`;
  const pageBtn = (isActive: boolean) =>
    `${btnBase} h-8 min-w-8 px-2.5 ${
      isActive
        ? 'border-blue-600 bg-blue-600 text-white font-bold shadow-sm'
        : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
    }`;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t border-slate-200 bg-white rounded-b-xl ${className}`}
    >
      {/* Left: Summary text & Page Size */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
        <span>
          แสดง <strong className="font-semibold text-slate-800">{startItem}–{endItem}</strong> จากทั้งหมด{' '}
          <strong className="font-semibold text-slate-800">{totalItems}</strong> {itemLabel}
        </span>
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
            <span>แสดงทีละ:</span>
            <select
              aria-label="จำนวนรายการต่อหน้า"
              value={effectivePageSize}
              onChange={(e) => {
                const nextSize = Number(e.target.value);
                onPageSizeChange(nextSize);
                handlePageChange(1);
              }}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span>{itemLabel}/หน้า</span>
          </div>
        )}
      </div>

      {/* Right: Navigation Controls & Page Search/Jump */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          {/* First Page */}
          <button
            type="button"
            aria-label="หน้าแรกสุด"
            title="หน้าแรกสุด"
            disabled={safeCurrentPage <= 1}
            onClick={() => handlePageChange(1)}
            className={navBtn}
          >
            <ChevronsLeft size={16} />
            <span className="hidden md:inline ml-1">หน้าแรก</span>
          </button>

          {/* Previous Page */}
          <button
            type="button"
            aria-label="ก่อนหน้า"
            title="ก่อนหน้า"
            disabled={safeCurrentPage <= 1}
            onClick={() => handlePageChange(Math.max(1, safeCurrentPage - 1))}
            className={navBtn}
          >
            <ChevronLeft size={16} />
            <span className="hidden md:inline ml-1">ก่อนหน้า</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 mx-1">
            {pages.map((p, idx) =>
              typeof p === 'number' ? (
                <button
                  key={`page-${p}`}
                  type="button"
                  aria-label={`หน้า ${p}`}
                  aria-current={safeCurrentPage === p ? 'page' : undefined}
                  onClick={() => handlePageChange(p)}
                  className={pageBtn(safeCurrentPage === p)}
                >
                  {p}
                </button>
              ) : (
                <span key={`ellipsis-${idx}`} className="px-1 text-xs text-slate-400">
                  ...
                </span>
              )
            )}
          </div>

          {/* Next Page */}
          <button
            type="button"
            aria-label="ถัดไป"
            title="ถัดไป"
            disabled={safeCurrentPage >= totalPages}
            onClick={() => handlePageChange(Math.min(totalPages, safeCurrentPage + 1))}
            className={navBtn}
          >
            <span className="hidden md:inline mr-1">ถัดไป</span>
            <ChevronRight size={16} />
          </button>

          {/* Last Page */}
          <button
            type="button"
            aria-label="หน้าหลังสุด"
            title="หน้าหลังสุด"
            disabled={safeCurrentPage >= totalPages}
            onClick={() => handlePageChange(totalPages)}
            className={navBtn}
          >
            <span className="hidden md:inline mr-1">หน้าหลังสุด</span>
            <ChevronsRight size={16} />
          </button>
        </div>

        {/* Jump / Search Page Input (ช่องค้นหาหน้า / กระโดดไปหน้า) */}
        {totalPages > 1 && (
          <form
            onSubmit={handleJump}
            className="flex items-center gap-1.5 border-l border-slate-200 pl-2 sm:pl-3 text-xs text-slate-600"
          >
            <span className="text-slate-500 whitespace-nowrap">ไปหน้า:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              placeholder={String(safeCurrentPage)}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              aria-label="ค้นหาหรือระบุเลขหน้า"
              className="w-14 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-center text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-slate-400">/{totalPages}</span>
            <button
              type="submit"
              aria-label="ไปยังหน้าที่ระบุ"
              title="ไปยังหน้าที่ระบุ"
              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
            >
              ไป
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Pagination;
