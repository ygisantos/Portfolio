import React from 'react';
import PropTypes from 'prop-types';

function ProjectCard({ work, onClick, truncateText, getLanguageDisplayName, extractLanguages }) {
  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] cursor-pointer project-card animate-fadeIn"
      onClick={() => onClick(work)}
      role="button"
      aria-label={`View details of ${work.title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(work);
        }
      }}
    >
      <div className="h-48 overflow-hidden relative">
        {work.images && work.images[0] ? (
          <img 
            src={work.images[0]} 
            alt={work.title} 
            className="w-full h-full object-cover transition-all duration-500 hover:scale-110 hover:rotate-1"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/api/placeholder/400/300";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}        <div className="absolute top-2 left-2 text-white text-xs flex flex-row gap-0 opacity-75">
          <div className='bg-slate-800 px-2 py-1 rounded-full'>
            {work.year}
          </div>
          <div className='bg-slate-800 px-2 py-1 rounded-full'>
            {work.category}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="!text-xl !font-bold mb-2 text-slate-800">{work.title}</h2>
        <p className="text-gray-600 mb-4 opacity-70"><span className='font-bold'>Duration:</span> {work.duration}</p>
        
        <div className="mb-4">
          <p className="text-gray-700 line-clamp-3">{truncateText(work.description, 120)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {extractLanguages(work.languages).slice(0, 4).map((lang, index) => (
            <span 
              key={index} 
              className="text-xs bg-slate-600 text-white px-2 py-1 rounded-full transition-all hover:bg-slate-700"
            >
              {getLanguageDisplayName(lang)}
            </span>
          ))}
          {extractLanguages(work.languages).length > 4 && (
            <span className="text-xs bg-slate-300 text-slate-700 px-2 py-1 rounded-full">
              +{extractLanguages(work.languages).length - 4} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

ProjectCard.propTypes = {
  work: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  truncateText: PropTypes.func.isRequired,
  getLanguageDisplayName: PropTypes.func.isRequired,
  extractLanguages: PropTypes.func.isRequired
};

export default React.memo(ProjectCard);
