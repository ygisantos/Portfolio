import { getAllExperiences } from "@/api/Api";
import ScrollReveal from "@/components/ScrollReveal";
import { useEffect, useState, useRef } from "react";
import { FaBriefcase, FaCalendarAlt, FaChevronDown, FaChevronUp, FaGraduationCap, FaLaptopCode } from "react-icons/fa";
import { IoSchool } from "react-icons/io5";
import "./Experience.css";

function Experience() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedItems, setExpandedItems] = useState({});
    const [yearMarkers, setYearMarkers] = useState({});
    const [activeYear, setActiveYear] = useState(null);
    
    const cardRefs = useRef({});

    const handleMouseMove = (e, cardId) => {
        const card = cardRefs.current[cardId];
        if (!card) return;
        
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--x', `${x}%`);
        card.style.setProperty('--y', `${y}%`);
    };

    const getExp = async () => {
        try {
            const response = await getAllExperiences();
            const parsedExperiences = JSON.parse(response);
            
            // Sort experiences by date (most recent first)
            const sortedExperiences = parsedExperiences.sort((a, b) => {
                const dateA = a.still_doing ? new Date() : new Date(a.to);
                const dateB = b.still_doing ? new Date() : new Date(b.to);
                return dateB - dateA;
            });
            
            setExperiences(sortedExperiences);
        } catch (error) {
            console.error("Error fetching experiences:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getExp();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "Present";
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short'
        });
    };

    const calculateDuration = (fromDate, toDate, stillDoing) => {
        const start = new Date(fromDate);
        const end = stillDoing ? new Date() : new Date(toDate);
        
        const yearDiff = end.getFullYear() - start.getFullYear();
        const monthDiff = end.getMonth() - start.getMonth();
        
        let years = yearDiff;
        let months = monthDiff;
        
        if (monthDiff < 0) {
            years--;
            months += 12;
        }
        
        let result = '';
        if (years > 0) {
            result += `${years} year${years !== 1 ? 's' : ''}`;
        }
        if (months > 0) {
            result += result ? ` ${months} month${months !== 1 ? 's' : ''}` : `${months} month${months !== 1 ? 's' : ''}`;
        }
        
        return result || 'Less than a month';
    };

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="w-full experience-section-bg">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-dark"></div>
                </div>
            ) : experiences.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">No experience data available.</p>
                </div>
            ) : (
                <div className="relative">
                    
                    {/* Experience Items */}
                    {experiences.map((exp, index) => (
                        <ScrollReveal 
                            key={exp.id} 
                            animation={index % 2 === 0 ? "slideInLeft" : "slideInRight"}
                            delay={(index % 3) * 100}
                            duration={500}
                        >
                            <div 
                                className={`relative flex flex-col md:flex-row md:items-center mb-12 last:mb-0 group mt-5 ${
                                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse text-right'
                                }`}
                            >
                                
                                {/* Date Column */}
                                <div className={`w-[256px] items-center flex flex-col bg-brown-dark text-beige px-4 py-2 rounded-lg mb-2 shadow-md hover:shadow-lg transition-all duration-300 relative`}>
                                    
                                    <div className="flex items-center relative">
                                        <div className="bg-brown-light bg-opacity-30 p-1 rounded-full mr-2 ">
                                            <FaCalendarAlt className="text-beige animate-pulse" />
                                        </div>
                                        <div className="month-year-display">
                                            <span className="font-medium">{formatDate(exp.from)}</span>
                                            <span className="text-xs opacity-80">to</span>
                                            <span className="font-medium">{exp.still_doing ? "Present" : formatDate(exp.to)}</span>
                                        </div>
                                    </div>
                                    {/* DATE CALCULATION */}
                                    <div className="w-full text-sm opacity-75 mt-1 bg-brown-light bg-opacity-20 px-2 py-1 rounded-sm inline-block">
                                        <span className="inline-flex items-center">
                                            <span className="w-2 h-2 bg-brown-dark rounded-full mr-2"></span>
                                            {calculateDuration(exp.from, exp.to, exp.still_doing)}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Content Column */}
                                <div className={`md:w-1/2 w-full pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}>
                                    <div 
                                        ref={el => cardRefs.current[exp.id] = el}
                                        className={`bg-beige rounded-lg p-4 shadow-md border-l-4 border-brown-dark hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 experience-card experience-hover-effect ${activeYear === new Date(exp.from).getFullYear().toString() ? 'animate-card-pop' : ''}`}
                                        onMouseMove={(e) => handleMouseMove(e, exp.id)}
                                    >
                                        <h3 className="text-xl !font-bold">{exp.name}</h3>
                                        <h4 className="text-lg font-semibold text-brown-dark opacity-60">{exp.role}</h4>
                                        
                                        <div className="mt-4">
                                            <p className={`${expandedItems[exp.id] ? 'content-expanded' : 'content-collapsed'} transition-all duration-300 !text-sm opacity-75`}>{exp.description}</p>
                                        </div>
                                        
                                        {expandedItems[exp.id] && (
                                            <div className="mt-4 bg-brown-light bg-opacity-20 p-3 rounded-lg animate-scaleIn text-sm">
                                                <h5 className="font-semibold text-brown-dark mb-2 flex items-center">
                                                    <span className="mr-2">💡</span>What I Learned:
                                                </h5>
                                                
                                                {/* Display learned items as a list with emojis */}
                                                {exp.learned && exp.learned.split('. ').filter(item => item.trim().length > 0).map((item, i) => (
                                                    <div key={i} className="flex items-start mb-2">
                                                        <span className="mr-2 mt-1">
                                                            {[
                                                                '✨', '🔍', '🧠', '🚀', '💻', 
                                                                '📊', '🌟', '🛠️', '📱', '🔧'
                                                            ][i % 10]}
                                                        </span>
                                                        <p>{item}.</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <button 
                                            className="mt-4 text-brown-dark flex items-center hover:text-brown-light transition-colors duration-200"
                                            onClick={() => toggleExpand(exp.id)}
                                        >
                                            {expandedItems[exp.id] ? (
                                                <>
                                                    <FaChevronUp className="mr-1 animate-bounce" />
                                                    <span>Show Less</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FaChevronDown className="mr-1 animate-bounce" />
                                                    <span>Show More</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Experience;