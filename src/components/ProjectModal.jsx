import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function ProjectModal({ project, onClose, extractLanguages, getLanguageDisplayName }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    // Set up keyboard navigation
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && project.images?.length > 1) {
        nextImage();
      } else if (e.key === 'ArrowLeft' && project.images?.length > 1) {
        prevImage();
      }
    };
    
    window.addEventListener('keydown', handleKeydown);
    
    // Set up auto-slide
    let slideInterval;
    if (project.images?.length > 1) {
      slideInterval = setInterval(nextImage, 5000); // Change slide every 5 seconds
    }
    
    // Focus trap and scroll lock for accessibility
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      if (slideInterval) clearInterval(slideInterval);
      document.body.style.overflow = originalOverflow;
    };
  }, [project]);
  
  const nextImage = () => {
    if (project.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev === project.images.length - 1 ? 0 : prev + 1));
    }
  };
  
  const prevImage = () => {
    if (project.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
    }
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!project) return null;
  
  return (    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm modal-backdrop animate-fadeIn"
      onClick={handleModalClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 id="project-modal-title" className="!text-3xl !font-bold text-slate-800">{project.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 text-2xl focus:outline-none focus:ring-2 focus:ring-slate-500 rounded p-1"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {project.images && project.images.length > 0 ? (
                <div className="relative rounded-lg overflow-hidden mb-4 shadow-lg">
                  <img 
                    src={project.images[currentImageIndex]} 
                    alt={`${project.title} - Image ${currentImageIndex + 1}`} 
                    className="w-full h-auto animate-fadeIn"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/api/placeholder/600/400";
                    }}                  />
                  {/* Image counter - always show */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-full">
                    {currentImageIndex + 1} out of {project.images.length}
                  </div>
                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Previous image"
                      >
                        <FaChevronLeft size={20} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Next image"
                      >
                        <FaChevronRight size={20} />
                      </button>                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {project.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setCurrentImageIndex(index); 
                            }}
                            className={`w-3 h-3 rounded-full transition-all focus:outline-none ${
                              index === currentImageIndex ? 'bg-white scale-125' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                            aria-current={index === currentImageIndex ? 'true' : 'false'}
                          />
                        ))}                      </div>
                    </>
                  )}
                </div>
              ) : null}
              
              {project.video_link && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Video Preview</h3>
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                    <iframe 
                      src={project.video_link} 
                      title={`Video for ${project.title}`}
                      className="w-full h-64 rounded"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
            
            <div className="animate-slideInRight">
              <div className="mb-6">
                <h3 className="!text-xl !font-bold mb-2">Project Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 !font-bold">Year</p>
                    <p className="font-medium">{project.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 !font-bold">Duration</p>
                    <p className="font-medium">{project.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 !font-bold">Category</p>
                    <p className="font-medium">{project.category}</p>
                  </div>
                  {project.client && (
                    <div>
                      <p className="text-gray-600 !font-bold">Client</p>
                      <p className="font-medium">{project.client}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="!text-xl !font-bold mb-2">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {extractLanguages(project.languages).map((lang, index) => (
                    <span 
                      key={index} 
                      className="text-white px-3 py-1 rounded bg-slate-600"
                    >
                      {getLanguageDisplayName(lang)}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="!text-xl !font-bold mb-2">Description</h3>
                <p className="text-gray-700">{project.description}</p>
              </div>
              
              {project.url && (
                <div className="mt-6">
                  <a 
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
                  >
                    View Project
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ProjectModal.propTypes = {
  project: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  extractLanguages: PropTypes.func.isRequired,
  getLanguageDisplayName: PropTypes.func.isRequired
};

export default ProjectModal;
