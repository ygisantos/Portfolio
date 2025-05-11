import { getAllExperiences } from "@/api/Api";
import { useEffect, useState } from "react";
import { FaBriefcase, FaCalendarAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoSchool } from "react-icons/io5";

function Experience() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedItems, setExpandedItems] = useState({});

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
        <div className="w-full">
            <h2 className="text-3xl font-bold mb-6">Professional Experience</h2>
            
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
                    {/* Timeline Line */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-brown-dark"></div>
                    
                    {/* Experience Items */}
                    {experiences.map((exp, index) => (
                        <div 
                            key={exp.id}
                            className={`relative flex flex-col md:flex-row md:items-center mb-12 last:mb-0 ${
                                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse text-right'
                            }`}
                        >
                            {/* Timeline Dot */}
                            <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-brown-dark flex items-center justify-center">
                                <FaBriefcase className="text-beige" />
                            </div>
                            
                            {/* Date Column */}
                            <div className={`md:w-1/2 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                                <div className={`bg-brown-dark text-beige px-4 py-2 rounded-lg inline-block mb-2 shadow-md`}>
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-2" />
                                        <span>{formatDate(exp.from)} - {exp.still_doing ? "Present" : formatDate(exp.to)}</span>
                                    </div>
                                    <div className="text-sm opacity-75 mt-1">
                                        {calculateDuration(exp.from, exp.to, exp.still_doing)}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Content Column */}
                            <div className={`md:w-1/2 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}>
                                <div className={`bg-beige rounded-lg p-4 shadow-md border-l-4 border-brown-dark hover:shadow-lg transition-all duration-300`}>
                                    <h3 className="text-xl font-bold">{exp.name}</h3>
                                    <h4 className="text-lg font-semibold text-brown-dark">{exp.role}</h4>
                                    
                                    <div className="mt-4">
                                        <p className={expandedItems[exp.id] ? '' : 'line-clamp-3'}>{exp.description}</p>
                                    </div>
                                    
                                    {expandedItems[exp.id] && (
                                        <div className="mt-4 bg-brown-light bg-opacity-20 p-3 rounded-lg">
                                            <h5 className="font-semibold text-brown-dark mb-2">What I Learned:</h5>
                                            <p>{exp.learned}</p>
                                        </div>
                                    )}
                                    
                                    <button 
                                        className="mt-4 text-brown-dark flex items-center hover:text-brown-light transition-colors duration-200"
                                        onClick={() => toggleExpand(exp.id)}
                                    >
                                        {expandedItems[exp.id] ? (
                                            <>
                                                <FaChevronUp className="mr-1" />
                                                <span>Show Less</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaChevronDown className="mr-1" />
                                                <span>Show More</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Experience;