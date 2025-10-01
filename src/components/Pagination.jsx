import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ pagination, handlePageChange }) => {
  const { t } = useTranslation();

  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const { currentPage, totalPages } = pagination;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;
    const halfMax = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMax);
    let endPage = Math.min(totalPages, currentPage + halfMax);

    if (currentPage - halfMax < 1) {
      endPage = Math.min(totalPages, maxPagesToShow);
    }
    if (currentPage + halfMax > totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(<span key="start-ellipsis" className="px-3 py-1 text-gray-500">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`h-9 w-9 border rounded-md text-sm transition-colors ${
            currentPage === i 
              ? 'bg-blue-600 text-white border-blue-600 font-bold' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(<span key="end-ellipsis" className="px-3 py-1 text-gray-500">...</span>);
    }

    return pageNumbers;
  };

  const buttonClass = "flex items-center justify-center h-9 px-3 border rounded-md bg-white text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      <button onClick={() => handlePageChange(1)} disabled={currentPage <= 1} className={buttonClass}>
        <ChevronsLeft className="h-4 w-4" />
      </button>
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} className={buttonClass}>
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline ml-1">{t('previous')}</span>
      </button>

      <div className="hidden md:flex items-center gap-2">
        {renderPageNumbers()}
      </div>

      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className={buttonClass}>
        <span className="hidden sm:inline mr-1">{t('next')}</span>
        <ChevronRight className="h-4 w-4" />
      </button>
      <button onClick={() => handlePageChange(totalPages)} disabled={currentPage >= totalPages} className={buttonClass}>
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;