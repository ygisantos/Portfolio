import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { FaFilter, FaTimes } from 'react-icons/fa';

function FilterSection({ 
  categories, 
  languages, 
  selectedCategory, 
  selectedLanguage, 
  onCategoryChange, 
  onLanguageChange,
  onClearFilters,
  onSortChange,
  selectedSort,
  filteredWorks = []
}) {
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '0.375rem',
      borderColor: state.isFocused ? '#475569' : '#CBD5E0',
      boxShadow: state.isFocused ? '0 0 0 1px #475569' : 'none',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: state.isFocused ? '#475569' : '#A0AEC0'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#475569' : state.isFocused ? '#F1F5F9' : null,
      color: state.isSelected ? 'white' : '#1E293B',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: state.isSelected ? '#475569' : '#F1F5F9'
      }
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#F1F5F9',
      borderRadius: '0.25rem'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#475569',
      fontWeight: 500
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#64748B',
      borderRadius: '0 0.25rem 0.25rem 0',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#E2E8F0',
        color: '#1E293B'
      }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      animation: 'scaleIn 0.2s ease-out'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#94A3B8'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1E293B'
    })
  };
  
  const hasActiveFilters = selectedCategory || selectedLanguage || (selectedSort?.value !== 'priority');
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-gray-800">
          Filter Projects 
          {hasActiveFilters && filteredWorks && (
            <span className="ml-2 text-sm font-normal text-slate-500">
              ({filteredWorks.length} {filteredWorks.length === 1 ? 'result' : 'results'})
            </span>
          )}
        </h2>
        {hasActiveFilters && (
          <button 
            onClick={onClearFilters}
            className="text-sm flex items-center gap-1 text-slate-600 hover:text-slate-800 transition-colors"
            aria-label="Clear all filters"
          >
            <FaTimes size={12} />
            Clear filters
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <Select
            placeholder="Filter by category..."
            options={categories}
            value={selectedCategory}
            onChange={onCategoryChange}
            isClearable
            className="react-select-container"
            classNamePrefix="react-select"
            styles={customSelectStyles}
            aria-label="Filter by category"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Technology</label>
          <Select
            placeholder="Filter by technology..."
            options={languages}
            value={selectedLanguage}
            onChange={onLanguageChange}
            isClearable
            className="react-select-container"
            classNamePrefix="react-select"
            styles={customSelectStyles}
            aria-label="Filter by technology"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
          <Select
            placeholder="Sort projects by..."
            options={[
              { value: 'priority', label: 'Priority (Low to High)' },
              { value: 'year', label: 'Year (Newest first)' },
              { value: 'title', label: 'Title (A-Z)' }
            ]}
            value={selectedSort}
            onChange={onSortChange}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={customSelectStyles}
            aria-label="Sort projects"
            defaultValue={{ value: 'priority', label: 'Priority (Low to High)' }}
          />
        </div>
      </div>
    </div>
  );
}

FilterSection.propTypes = {
  categories: PropTypes.array.isRequired,
  languages: PropTypes.array.isRequired,
  selectedCategory: PropTypes.object,
  selectedLanguage: PropTypes.object,
  selectedSort: PropTypes.object,
  onCategoryChange: PropTypes.func.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  filteredWorks: PropTypes.array
};

FilterSection.defaultProps = {
  filteredWorks: [],
  selectedSort: { value: 'priority', label: 'Priority (Low to High)' }
};

export default React.memo(FilterSection);
