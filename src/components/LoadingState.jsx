import React from 'react';
import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';

function LoadingState({ 
  isLoading, 
  isError, 
  error, 
  onRetry, 
  loadingMessage = "Loading...", 
  emptyMessage = "No items found.", 
  isEmpty = false,
  onClearFilters = null
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <FaSpinner className="animate-spin text-slate-600 text-3xl mb-4" />
        <p className="text-gray-600">{loadingMessage}</p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }
  
  if (isEmpty) {
    return (
      <div className="col-span-full empty-state flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 text-lg mb-4">{emptyMessage}</p>
        {onClearFilters && (
          <button 
            onClick={onClearFilters} 
            className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }
  
  return null;
}

LoadingState.propTypes = {
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
  loadingMessage: PropTypes.string,
  emptyMessage: PropTypes.string,
  isEmpty: PropTypes.bool,
  onClearFilters: PropTypes.func
};

export default LoadingState;
