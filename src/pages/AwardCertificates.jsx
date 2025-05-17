import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { getAllCertificates } from "@/api/Api";
import CustomButton from "@/components/CustomButton";
import { FaArrowLeft, FaArrowRight, FaTimes, FaExternalLinkAlt } from "react-icons/fa";
import LoadingState from "@/components/LoadingState";
import "./AwardCertificates.css";

// Filter options constant
const FILTER_OPTIONS = ["ALL", "CERTIFICATE", "AWARD"];
const AUTOPLAY_DELAY = 5000;

function AwardsCertificates() {
    const [certificates, setCertificates] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [currentFilter, setCurrentFilter] = useState("ALL");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const sliderRef = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const autoplayIntervalRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const getCerts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getAllCertificates();
            const certs = JSON.parse(response);
            setCertificates(certs);
        } catch (error) {
            console.error("Error fetching certificates:", error);
            setError("Failed to load certificates. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getCerts();
    }, [getCerts]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Manage autoplay interval
    useEffect(() => {
        const startAutoplay = () => {
            if (certificates.length <= 1 || showModal) return;
            
            // Clear any existing interval first
            if (autoplayIntervalRef.current) {
                clearInterval(autoplayIntervalRef.current);
            }
            
            // Set new interval
            autoplayIntervalRef.current = setInterval(() => {
                moveSlide(1);
            }, AUTOPLAY_DELAY);
        };
        
        startAutoplay();
        
        // Cleanup function
        return () => {
            if (autoplayIntervalRef.current) {
                clearInterval(autoplayIntervalRef.current);
                autoplayIntervalRef.current = null;
            }
        };
    }, [certificates.length, currentIndex, showModal]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't capture keyboard events when modal is open
            if (showModal) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    moveSlide(-1);
                    break;
                case 'ArrowRight':
                    moveSlide(1);
                    break;
                case 'Escape':
                    if (showModal) {
                        setShowModal(false);
                    }
                    break;
                default:
                    break;
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showModal]);
    
    const moveSlide = useCallback((direction) => {
        if (isAnimating || certificates.length <= 1) return;
        
        // Get filtered certificates
        const filteredCerts = currentFilter === "ALL" 
            ? certificates
            : certificates.filter(cert => cert.type.toLowerCase() === currentFilter.toLowerCase());
            
        if (filteredCerts.length <= 1) return;

        setIsAnimating(true);
        let newIndex;

        if (direction > 0) {
            newIndex = (currentIndex + 1) % filteredCerts.length;
        } else {
            newIndex = (currentIndex - 1 + filteredCerts.length) % filteredCerts.length;
        }

        setCurrentIndex(newIndex);
        
        // Reset animation state after transition finishes
        setTimeout(() => {
            setIsAnimating(false);
        }, 500);
    }, [isAnimating, certificates, currentFilter, currentIndex]);

    const openCertificateModal = useCallback((certificate) => {
        setSelectedCertificate(certificate);
        setShowModal(true);
    }, []);

    const formatDate = useCallback((dateString) => {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString;
        }
    }, []);
    
    // Memoized filtered certificates
    const filteredCertificates = useMemo(() => {
        return currentFilter === "ALL" 
            ? certificates
            : certificates.filter(cert => cert.type.toLowerCase() === currentFilter.toLowerCase());
    }, [certificates, currentFilter]);
    
    // Get visible certificates with circular indexing and filtering
    const visibleCertificates = useMemo(() => {
        if (!filteredCertificates.length) return [];
        
        // Ensure currentIndex is within bounds of filtered certificates
        const normalizedIndex = currentIndex % filteredCertificates.length;
        
        // Show 3 on desktop, 1 on mobile
        const isMobile = windowWidth < 768;
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
    }, [filteredCertificates, currentIndex, windowWidth]);

    // Check if we should render the navigation arrows
    const shouldShowNavigation = useMemo(() => {
        return filteredCertificates.length > (windowWidth < 768 ? 1 : 3);
    }, [filteredCertificates.length, windowWidth]);

    return (
        <div className="relative flex flex-col w-full min-h-[400px]">
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6 px-4 py-2 top-0 z-20">
                {FILTER_OPTIONS.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => {
                            setCurrentFilter(filter);
                            setCurrentIndex(0);
                        }}
                        className={`!px-5 !py-2.5 rounded-full transition-all duration-300 filter-button text-center min-w-[128px] hover:!scale-110 ${
                            currentFilter === filter ? 'bg-brown-dark text-beige shadow-md' : 'bg-brown-light text-brown-dark hover:bg-brown-dark hover:text-beige'
                        }`}
                        aria-label={`Filter by ${filter}`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
            
            <LoadingState
                isLoading={isLoading}
                isError={!!error}
                error={error}
                onRetry={getCerts}
                loadingMessage="Loading certificates..."
                isEmpty={filteredCertificates.length === 0}
                emptyMessage={`No ${currentFilter.toLowerCase() !== 'all' ? currentFilter.toLowerCase() : ''} certificates found`}
            />

            {/* Gradient background overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    background: "linear-gradient(to top, rgba(245, 222, 179, 1) 80%, rgba(245, 222, 179, 0.3) 0%)"
                }}
            />

            {!isLoading && !error && filteredCertificates.length > 0 && (
                <div className="relative overflow-hidden px-4 py-8 mt-4">{/* Added mt-4 for spacing */}
                    {/* Navigation Arrows */}
                    {shouldShowNavigation && (
                        <>
                            <button 
                                className="absolute left-0 top-1/2 p-2 -translate-y-1/2 z-10 bg-brown-dark hover:bg-brown-light text-beige rounded-full shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brown-dark"
                                onClick={() => moveSlide(-1)}
                                disabled={isAnimating}
                                aria-label="Previous slide"
                            >
                                <FaArrowLeft size={24} />
                            </button>
                            
                            <button 
                                className="absolute right-0 top-1/2 p-2 -translate-y-1/2 z-10 bg-brown-dark hover:bg-brown-light text-beige rounded-full shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brown-dark"
                                onClick={() => moveSlide(1)}
                                disabled={isAnimating}
                                aria-label="Next slide"
                            >
                                <FaArrowRight size={24} />
                            </button>
                        </>
                    )}
                    
                    {/* Certificate Slider */}
                    <div 
                        ref={sliderRef}
                        className="flex justify-center transition-all duration-500 ease-in-out"
                        role="region"
                        aria-label="Certificate carousel"
                    >
                        {visibleCertificates.map(({certificate, position}) => (
                            <div 
                                key={certificate.id} 
                                className={`md:w-1/3 w-full px-4 transform transition-all duration-500 ${
                                    position === 1 ? 'scale-105 z-10' : 'scale-95 opacity-80'
                                }`}
                            >
                                <div 
                                    className="border border-brown-dark rounded-lg overflow-hidden bg-beige shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 h-full flex flex-col certificate-card"
                                    onClick={() => openCertificateModal(certificate)}
                                    role="button"
                                    aria-label={`View ${certificate.title}`}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            openCertificateModal(certificate);
                                        }
                                    }}
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="h-full flex items-center justify-center bg-gray-100">
                                            <img 
                                                src={certificate.image} 
                                                alt={certificate.title}
                                                className="object-cover w-full h-full transition-all duration-300"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'placeholder-image-url'; // Add a placeholder image URL
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="!font-bold text-xl mb-2 line-clamp-2">{certificate.title}</h3>
                                        <p className="text-sm text-gray-500 mb-2">{formatDate(certificate.date)}</p>
                                        <p className="text-sm line-clamp-3 certificate-description">{certificate.description}</p>
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
                    {filteredCertificates.length > 1 && (
                        <div className="flex justify-center mt-8 mb-4 flex-wrap gap-2 pagination-container">
                            {filteredCertificates.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-4 h-4 mx-1 rounded-full transition-all duration-300 pagination-dot ${
                                        index === currentIndex ? 'bg-brown-dark active' : 'bg-brown-light opacity-50 hover:opacity-75'
                                    }`}
                                    onClick={() => setCurrentIndex(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                    aria-current={index === currentIndex ? 'true' : 'false'}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            {/* Certificate Modal */}
            {showModal && selectedCertificate && (
                <div 
                    className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/80 modal-backdrop animate-fadeIn" 
                    onClick={() => setShowModal(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="certificate-modal-title">
                    <div 
                        className="relative bg-white rounded-lg max-w-3xl w-11/12 max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn certificate-modal-content" 
                        onClick={e => e.stopPropagation()} >
                        <button 
                            className="absolute top-2 right-2 text-gray-700 hover:text-black z-20 bg-white bg-opacity-70 rounded-full p-2 transition-all hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-brown-dark"
                            onClick={() => setShowModal(false)}
                            aria-label="Close modal">
                            <FaTimes size={24} />
                        </button>
                        
                        <div className="flex flex-col md:flex-row h-full certificate-modal-content">
                            <div className="md:w-2/3 !h-full md:h-auto flex-shrink-0 bg-gray-100 relative">
                                <img 
                                    src={selectedCertificate.image} 
                                    alt={selectedCertificate.title}
                                    className="w-full object-contain animate-fadeIn"
                                    loading="eager"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-certificate.png'; 
                                    }}
                                />
                            </div>
                            <div className="md:w-1/3 mt-5 md:mt-0 z-10 bg-white p-6 overflow-y-auto animate-slideInRight" style={{ maxHeight: '80vh' }}>
                                <h3 id="certificate-modal-title" className="text-2xl font-bold mb-2 text-brown-dark">{selectedCertificate.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">{formatDate(selectedCertificate.date)}</p>
                                <div className="mb-4 flex flex-wrap gap-2">
                                    <span className="inline-block px-3 py-1 bg-brown-dark text-beige text-xs font-semibold rounded-full">
                                        {selectedCertificate.type}
                                    </span>
                                    {selectedCertificate.skills && selectedCertificate.skills.map(skill => (
                                        <span key={skill} className="inline-block px-3 py-1 bg-brown-light text-brown-dark text-xs font-semibold rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-gray-700 certificate-description overflow-y-auto max-h-[128px]">{selectedCertificate.description}</p>
                                
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Memoize the entire component to prevent unnecessary re-renders
const MemoizedAwardsCertificates = React.memo(AwardsCertificates);
MemoizedAwardsCertificates.displayName = 'AwardsCertificates';

export default MemoizedAwardsCertificates;