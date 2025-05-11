import { useEffect, useState, useRef } from "react";
import { getAllCertificates } from "@/api/Api";
import CustomButton from "@/components/CustomButton";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

function AwardsCertificates() {
    const [certificates, setCertificates] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [currentFilter, setCurrentFilter] = useState("ALL");
    const sliderRef = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const autoplayIntervalRef = useRef(null);

    const getCerts = async () => {
        try {
            const response = await getAllCertificates();
            const certs = JSON.parse(response);
            console.log(certs);
            setCertificates(certs);
        } catch (error) {
            console.error("Error fetching certificates:", error);
        }
    };

    useEffect(() => {
        getCerts();
    }, []);

    useEffect(() => {
        // Auto-scroll every 5 seconds if there are certificates
        if (certificates.length > 0) {
            autoplayIntervalRef.current = setInterval(() => {
                moveSlide(1);
            }, 5000);
        }

        return () => {
            if (autoplayIntervalRef.current) {
                clearInterval(autoplayIntervalRef.current);
            }
        };
    }, [certificates, currentIndex]);

    // Pause autoplay when modal is open
    useEffect(() => {
        if (showModal && autoplayIntervalRef.current) {
            clearInterval(autoplayIntervalRef.current);
        } else if (!showModal && certificates.length > 0) {
            autoplayIntervalRef.current = setInterval(() => {
                moveSlide(1);
            }, 5000);
        }

        return () => {
            if (autoplayIntervalRef.current) {
                clearInterval(autoplayIntervalRef.current);
            }
        };
    }, [showModal]);

    const moveSlide = (direction) => {
        if (isAnimating || certificates.length <= 1) return;

        setIsAnimating(true);
        let newIndex;

        if (direction > 0) {
            newIndex = (currentIndex + 1) % certificates.length;
        } else {
            newIndex = (currentIndex - 1 + certificates.length) % certificates.length;
        }

        setCurrentIndex(newIndex);
        
        // Reset animation state after transition finishes
        setTimeout(() => {
            setIsAnimating(false);
        }, 500);
    };

    const openCertificateModal = (certificate) => {
        setSelectedCertificate(certificate);
        setShowModal(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Function to get visible certificates with circular indexing and filtering
    const getVisibleCertificates = () => {
        if (!certificates.length) return [];
        
        const filteredCertificates = currentFilter === "ALL" 
            ? certificates
            : certificates.filter(cert => cert.type.toLowerCase() === currentFilter.toLowerCase());
        
        if (filteredCertificates.length === 0) return [];
        
        // Ensure currentIndex is within bounds of filtered certificates
        const normalizedIndex = currentIndex % filteredCertificates.length;
        
        // Show 3 on desktop, 1 on mobile
        const isMobile = window.innerWidth < 768;
        const visibleCount = Math.min(isMobile ? 1 : 3, filteredCertificates.length);
        
        let items = [];
        for (let i = 0; i < visibleCount; i++) {
            const index = (normalizedIndex + i) % filteredCertificates.length;
            items.push({
                certificate: filteredCertificates[index],
                position: i
            });
        }
        return items;
    };

    return (
        <div className="relative flex flex-col w-full">
            {/* Filter Buttons */}
            <div className="flex justify-center gap-2">
                {["ALL", "CERTIFICATE", "AWARD"].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => {
                            setCurrentFilter(filter);
                            setCurrentIndex(0);
                        }}
                        className={`px-4 py-2 rounded-full transition-all duration-300 ${
                            currentFilter === filter 
                                ? 'bg-brown-dark text-beige' 
                                : 'bg-brown-light text-brown-dark hover:bg-brown-dark hover:text-beige'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
            
            {certificates.length > 0 ? (
                <div className="relative overflow-hidden px-4 py-8">
                    {/* Navigation Arrows */}
                    <button 
                        className="absolute left-0 top-1/2 p-2 -translate-y-1/2 z-10 bg-brown-dark hover:bg-brown-light text-beige rounded-full shadow-md transition-all duration-300"
                        onClick={() => moveSlide(-1)}
                        disabled={isAnimating}
                    >
                        <FaArrowLeft size={24} />
                    </button>
                    
                    <button 
                        className="absolute right-0 top-1/2 p-2 -translate-y-1/2 z-10 bg-brown-dark hover:bg-brown-light text-beige rounded-full shadow-md transition-all duration-300"
                        onClick={() => moveSlide(1)}
                        disabled={isAnimating}
                    >
                        <FaArrowRight size={24} />
                    </button>
                    
                    {/* Certificate Slider */}
                    <div 
                        ref={sliderRef}
                        className="flex justify-center transition-all duration-500 ease-in-out"
                    >
                        {getVisibleCertificates().map(({certificate, position}) => (
                            <div 
                                key={certificate.id} 
                                className={`md:w-1/3 w-full px-4 transform transition-all duration-500 ${
                                    position === 1 ? 'scale-105' : 'scale-95 opacity-80'
                                }`}
                            >
                                <div 
                                    className="border border-brown-dark rounded-lg overflow-hidden bg-beige shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                                    onClick={() => openCertificateModal(certificate)}
                                >
                                    <div className="h-48 overflow-hidden">
                                        <div className="h-full flex items-center justify-center bg-gray-100">
                                            <img 
                                                src={certificate.image} 
                                                alt={certificate.title}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="font-bold text-xl mb-2 line-clamp-2">{certificate.title}</h3>
                                        <p className="text-sm text-gray-500 mb-2">{formatDate(certificate.date)}</p>
                                        <p className="text-sm line-clamp-3">{certificate.description}</p>
                                        <div className="mt-auto pt-4">
                                            <div className="inline-block px-3 py-1 bg-brown-dark text-beige text-xs font-semibold rounded-full">
                                                {certificate.type}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Pagination Dots */}
                    <div className="flex justify-center mt-6">
                        {certificates.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
                                    index === currentIndex ? 'bg-brown-dark scale-125' : 'bg-brown-light opacity-50'
                                }`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Loading certificates...</p>
                </div>
            )}
            
            {/* Certificate Modal */}
            {showModal && selectedCertificate && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-[#000000c2] bg-opacity-75" onClick={() => setShowModal(false)}>
                    <div className="relative bg-white rounded-lg max-w-3xl w-11/12 max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button 
                            className="absolute top-2 right-2 text-gray-700 hover:text-black z-10 bg-white bg-opacity-70 rounded-full p-2"
                            onClick={() => setShowModal(false)}
                        >
                            <FaTimes size={24} />
                        </button>
                        
                        <div className="flex flex-col md:flex-row h-full">
                            <div className="md:w-2/3 h-64 md:h-auto flex-shrink-0 bg-gray-100">
                                <img 
                                    src={selectedCertificate.image} 
                                    alt={selectedCertificate.title}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="md:w-1/3 p-6 overflow-y-auto">
                                <h3 className="text-2xl font-bold mb-2">{selectedCertificate.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">{formatDate(selectedCertificate.date)}</p>
                                <div className="mb-4">
                                    <span className="inline-block px-3 py-1 bg-brown-dark text-beige text-xs font-semibold rounded-full">
                                        {selectedCertificate.type}
                                    </span>
                                </div>
                                <p className="text-gray-700">{selectedCertificate.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AwardsCertificates;