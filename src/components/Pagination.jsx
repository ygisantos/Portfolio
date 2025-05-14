import React from 'react';
import PropTypes from 'prop-types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Pagination({ currentPage, totalPages, onChange }) {
  // Calculate which page numbers to show (for large page counts)
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Always show first, last, current, and pages around current
    let pages = [1];
    
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis before if needed
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Add pages around current
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis after if needed
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Add last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center items-center gap-2">
      <button
        onClick={() => onChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded flex items-center gap-1 transition-colors ${
          currentPage === 1 
            ? 'bg-gray-300 cursor-not-allowed text-white' 
            : 'bg-slate-600 hover:bg-slate-700 text-gray-500'
        }`}
        aria-label="Previous page"
      >
        <FaChevronLeft size={14} />
        <span className="hidden sm:inline">Previous</span>
      </button>
      
      <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => onChange(page)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded transition-colors ${
                currentPage === page
                  ? 'bg-slate-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900'
              }`}
              aria-current={currentPage === page ? 'page' : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-1 flex items-center justify-center text-gray-500">
              {page}
            </span>
          )
        ))}
      </div>
      
      <button
        onClick={() => onChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded flex items-center gap-1 transition-colors ${
          currentPage === totalPages 
            ? 'bg-gray-300 cursor-not-allowed text-white' 
            : 'bg-slate-600 hover:bg-slate-700 text-gray-500'
        }`}
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <FaChevronRight size={14} />
      </button>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

export default React.memo(Pagination);
