import { useState, useEffect, useMemo } from "react";
import { getAllWorks } from "@/api/Api";
import Select from 'react-select';

function Project() {
  // Utility functions
  const extractLanguages = (languagesArray) => {
    if (!languagesArray || !Array.isArray(languagesArray)) return [];
    
    return languagesArray.map(lang => {
      // If it's already an object with name and icon
      if (lang?.name && lang?.icon) return lang.name;
      // If lang is a string
      if (typeof lang === 'string') return lang;
      // Handle nested name objects
      let current = lang;
      while (current?.name && typeof current.name !== 'string') {
        current = current.name;
      }
      return current?.name || null;
    }).filter(Boolean); // Remove any null values
  };

  const getLanguageDisplayName = (name) => {
    const displayNames = {
      csharp: "C#",
      java: "Java",
      android: "Android",
      akka: "Akka",
      azuresqldatabase: "Azure SQL",
      angularjs: "Angular.js",
      angularmaterial: "Angular Material"
    };
    
    return displayNames[name] || name;
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // State
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Memoized values
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(works.map(work => work.category))];
    return uniqueCategories
      .filter(Boolean)
      .map(category => ({ value: category, label: category }));
  }, [works]);

  const languages = useMemo(() => {
    const uniqueLanguages = [...new Set(
      works.flatMap(work => extractLanguages(work.languages))
    )];
    return uniqueLanguages
      .filter(Boolean)
      .map(lang => ({ value: lang, label: getLanguageDisplayName(lang) }));
  }, [works]);

  // Filter works based on selected category and language
  const filteredWorks = useMemo(() => {
    return works.filter(work => {
      const matchesCategory = !selectedCategory || work.category === selectedCategory.value;
      const matchesLanguage = !selectedLanguage || 
        extractLanguages(work.languages).includes(selectedLanguage.value);
      return matchesCategory && matchesLanguage;
    });
  }, [works, selectedCategory, selectedLanguage]);

  // Pagination logic
  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);
  const paginatedWorks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredWorks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredWorks, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedLanguage]);

  const getWorks = async () => {
    try {
      setLoading(true);
      const response = await getAllWorks();
      const parsedWorks = JSON.parse(response);
      setWorks(parsedWorks);
    } catch (error) {
      console.error("Error fetching works:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorks();
  }, []);

  const handleWorkClick = (work) => {
    setSelectedWork(work);
    setCurrentImageIndex(0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextImage = () => {
    if (selectedWork && selectedWork.images) {
      setCurrentImageIndex((prev) => 
        prev === selectedWork.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedWork && selectedWork.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedWork.images.length - 1 : prev - 1
      );
    }
  };

  // Auto-slide effect
  useEffect(() => {
    let slideInterval;
    if (modalOpen && selectedWork?.images?.length > 1) {
      slideInterval = setInterval(nextImage, 5000); // Change slide every 5 seconds
    }
    return () => {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    };
  }, [modalOpen, selectedWork]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Projects</h1>
      
      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <Select
            isClearable
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categories}
            placeholder="Filter by category..."
            className="text-gray-800"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Technology</label>
          <Select
            isClearable
            value={selectedLanguage}
            onChange={setSelectedLanguage}
            options={languages}
            placeholder="Filter by technology..."
            className="text-gray-800"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorks.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500 text-lg">No projects found matching your filters.</p>
              </div>
            ) : (
              paginatedWorks.map((work) => (
                <div 
                  key={work.id} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
                  onClick={() => handleWorkClick(work)}
                >
                  <div className="h-48 overflow-hidden">
                    {work.images && work.images[0] ? (
                      <img 
                        src={work.images[0]} 
                        alt={work.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/api/placeholder/400/300";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h2 className="!text-xl !font-bold mb-2">{work.title}</h2>
                    <p className="text-gray-600 mb-4">{work.year} | {work.duration}</p>
                    
                    <div className="mb-4">
                      <p className="text-gray-700">{truncateText(work.description, 100)}</p>
                    </div>
                      <div className="flex flex-wrap gap-2">
                      {extractLanguages(work.languages).map((lang, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-slate-600 text-white px-2 py-1 rounded"
                        >
                          {getLanguageDisplayName(lang)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1 
                    ? '!bg-gray-300 cursor-not-allowed' 
                    : '!bg-slate-600 hover:!bg-slate-700'
                } text-white`}
              >
                Previous
              </button>
              
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 rounded ${
                      currentPage === index + 1
                        ? '!bg-slate-600 !text-white'
                        : '!bg-gray-200 hover:!bg-gray-300 !text-gray-700'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages 
                    ? '!bg-gray-300 cursor-not-allowed' 
                    : '!bg-slate-600 hover:!bg-slate-700'
                } text-white`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Modal for detailed view */}
      {modalOpen && selectedWork && (
        <div className="fixed inset-0 bg-[#000000c2] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="!text-3xl !font-bold">{selectedWork.title}</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900 text-2xl focus:outline-none"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  {selectedWork.images && selectedWork.images.length > 0 ? (
                    <div className="relative rounded-lg overflow-hidden mb-4">
                      <img 
                        src={selectedWork.images[currentImageIndex]} 
                        alt={`${selectedWork.title} - Image ${currentImageIndex + 1}`} 
                        className="w-full h-auto"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/api/placeholder/600/400";
                        }}
                      />
                      {selectedWork.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                            aria-label="Previous image"
                          >
                            &#8249;
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                            aria-label="Next image"
                          >
                            &#8250;
                          </button>
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {selectedWork.images.map((_, index) => (
                              <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : null}
                  
                  {selectedWork.video_link && (
                    <div className="mt-6">
                      <h3 className="text-2xl !font-bold mb-2">Video Preview</h3>
                      <div className="aspect-w-16 aspect-h-9">
                        <iframe 
                          src={selectedWork.video_link} 
                          title={`Video for ${selectedWork.title}`}
                          className="w-full h-64 rounded"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="mb-6">
                    <h3 className="!text-2xl !font-bold mb-2">Project Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 !font-bold">Year</p>
                        <p className="font-medium">{selectedWork.year}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 !font-bold">Duration</p>
                        <p className="font-medium">{selectedWork.duration}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 !font-bold">Category</p>
                        <p className="font-medium">{selectedWork.category}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="!text-2xl !font-bold mb-2">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">                      {extractLanguages(selectedWork.languages).map((lang, index) => (
                        <span 
                          key={index} 
                          className="text-white px-3 py-1 rounded bg-slate-600"
                        >
                          {getLanguageDisplayName(lang)}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="!text-2xl !font-bold mb-2">Description</h3>
                    <p className="text-gray-700">{selectedWork.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Project;