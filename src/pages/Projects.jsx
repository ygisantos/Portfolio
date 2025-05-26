import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getAllWorks } from "@/api/Api";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import FilterSection from "@/components/FilterSection";
import LoadingState from "@/components/LoadingState";
import "./Projects.css";

const getPriorityNum = (work) => {
  if (!work?.priority) return Infinity;
  const num = parseInt(work.priority);
  return isNaN(num) ? Infinity : num;
};

function Project() {
  const extractLanguages = useCallback((languagesArray) => {
    if (!languagesArray || !Array.isArray(languagesArray)) return [];
    
    try {
      return languagesArray.map(lang => {
        if (lang?.name && lang?.icon) return lang.name;
        if (typeof lang === 'string') return lang;
        let current = lang;
        while (current?.name && typeof current.name !== 'string') current = current.name;
        return current?.name || null;
      }).filter(Boolean); 
    } catch (error) {
      console.error("Error extracting languages:", error);
      return [];
    }
  }, []);

  const getLanguageDisplayName = useCallback((name) => {
    if (!name) return '';
    
    const displayNames = {
      csharp: "C#",
      java: "Java",
      android: "Android",
      akka: "Akka",
      azuresqldatabase: "Azure SQL",
      angularjs: "Angular.js",
      angularmaterial: "Angular Material",
      javascript: "JavaScript",
      typescript: "TypeScript",
      python: "Python",
      reactjs: "React",
      react: "React",
      nextjs: "Next.js",
      vuejs: "Vue.js",
      nodejs: "Node.js",
      dotnet: ".NET",
      tailwindcss: "Tailwind CSS",
      mongodb: "MongoDB",
      postgresql: "PostgreSQL",
      mysql: "MySQL",
      firebase: "Firebase"
    };
    
    const lowercaseName = name.toLowerCase();
    return displayNames[lowercaseName] || name;
  }, []);

  const truncateText = useCallback((text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }, []);  
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedSort, setSelectedSort] = useState({ value: 'importance', label: 'Importance (Low to High)' });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Track window width for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoized values
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(works.map(work => work.category))];
    return uniqueCategories
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .map(category => ({ value: category, label: category }));
  }, [works]);

  const languages = useMemo(() => {
    const uniqueLanguages = [...new Set(
      works.flatMap(work => extractLanguages(work.languages))
    )];
    return uniqueLanguages
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .map(lang => ({ value: lang, label: getLanguageDisplayName(lang) }));
  }, [works, extractLanguages, getLanguageDisplayName]);

  // Filter and sort works based on selected criteria
  const filteredWorks = useMemo(() => {
    const filtered = works.filter(work => {
      const matchesCategory = !selectedCategory || work.category === selectedCategory.value;
      const matchesLanguage = !selectedLanguage || 
        extractLanguages(work.languages).includes(selectedLanguage.value);
      return matchesCategory && matchesLanguage;
    });

    return [...filtered].sort((a, b) => {
      // Sort based on the selected sort option
      switch (selectedSort?.value) {
        case 'importance':
          const priorityA = getPriorityNum(a);
          const priorityB = getPriorityNum(b);
          return priorityA - priorityB;
        case 'year':
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          return yearB - yearA;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          // Default to importance sorting
          const defaultPriorityA = getPriorityNum(a);
          const defaultPriorityB = getPriorityNum(b);
          return defaultPriorityA - defaultPriorityB;
      }
    });
  }, [works, selectedCategory, selectedLanguage, selectedSort, extractLanguages]);

  const getWorks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllWorks();
      const parsedWorks = JSON.parse(response);
      
      // Sort works by priority first (lowest to highest), then by year as default secondary sort
      const sortedWorks = parsedWorks.sort((a, b) => {
        const priorityA = getPriorityNum(a);
        const priorityB = getPriorityNum(b);
        
        // If priorities are different, sort by priority (lowest first)
        if (priorityA !== priorityB) return priorityA - priorityB; 
        
        return parseInt(b.year) - parseInt(a.year);
      });
      
      setWorks(sortedWorks);
    } catch (error) {
      console.error("Error fetching works:", error);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getWorks();
  }, [getWorks]);

  const handleWorkClick = useCallback((work) => {
    setSelectedWork(work);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    // Restore scrolling when modal is closed
    document.body.style.overflow = 'auto';
  }, []);
    const handleClearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedLanguage(null);
    setSelectedSort({ value: 'importance', label: 'Importance (Low to High)' });
  }, []);
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Projects</h1>
        {/* Filter Section */}      <FilterSection 
        categories={categories}
        languages={languages}
        selectedCategory={selectedCategory}
        selectedLanguage={selectedLanguage}
        selectedSort={selectedSort}
        onCategoryChange={setSelectedCategory}
        onLanguageChange={setSelectedLanguage}
        onSortChange={setSelectedSort}
        onClearFilters={handleClearFilters}
        filteredWorks={filteredWorks}
      />
        <LoadingState
        isLoading={loading}
        isError={!!error}
        error={error}
        onRetry={getWorks}
        loadingMessage="Loading projects..."
        isEmpty={filteredWorks.length === 0}
        emptyMessage="No projects found matching your filters."
        onClearFilters={handleClearFilters}
      />
        {!loading && !error && filteredWorks.length > 0 && (
        <div className="projects-container mb-8">
          <div className="projects-grid animate-fadeIn">
            {filteredWorks.map((work) => (
              <ProjectCard
                key={work.id}
                work={work}
                onClick={handleWorkClick}
                truncateText={truncateText}
                extractLanguages={extractLanguages}
                getLanguageDisplayName={getLanguageDisplayName}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Project Modal */}
      {modalOpen && selectedWork && (
        <ProjectModal
          project={selectedWork}
          onClose={closeModal}
          extractLanguages={extractLanguages}
          getLanguageDisplayName={getLanguageDisplayName}
        />
      )}
    </div>
  );
}

// Memoize the entire component to prevent unnecessary re-renders
const MemoizedProject = React.memo(Project);
MemoizedProject.displayName = 'Project';

export default MemoizedProject;