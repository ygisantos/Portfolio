import { useState, useEffect } from "react";
import { FaUser, FaTools, FaAward, FaProjectDiagram, FaBriefcase, FaCommentDots } from 'react-icons/fa';
import ButtonIcon from "@components/ButtonIcon";
import "./Menu.css"; // Import custom CSS for gooey effect

function Menu() {
    const [activeSection, setActiveSection] = useState("profile");
    const [hoveredButton, setHoveredButton] = useState(null); // Track hovered button
    const [isMobile, setIsMobile] = useState(false);

    // Detect screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        // Initial check
        handleResize();
        
        // Add event listener
        window.addEventListener('resize', handleResize);
        
        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const sections = document.querySelectorAll("section");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.6 } 
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const handleScrollTo = (sectionId) => {
        setActiveSection(sectionId);
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    };

    const handleMouseEnter = (sectionId) => setHoveredButton(sectionId);
    const handleMouseLeave = () => setHoveredButton(null);

    // Menu item configuration
    const menuItems = [
        { id: "profile", icon: <FaUser size={isMobile ? 24 : 32} />, label: "Profile" },
        { id: "skills", icon: <FaTools size={isMobile ? 24 : 32} />, label: "Skills" },
        { id: "awards", icon: <FaAward size={isMobile ? 24 : 32} />, label: "Awards" },
        { id: "projects", icon: <FaProjectDiagram size={isMobile ? 24 : 32} />, label: "Projects" },
        { id: "experiences", icon: <FaBriefcase size={isMobile ? 24 : 32} />, label: "Experiences" },
        { id: "testimonials", icon: <FaCommentDots size={isMobile ? 24 : 32} />, label: "Testimonials" },
    ];

    return (
        <div className={`!z-5 flex flex-col items-center justify-center ${isMobile ? 'bottom-2' : 'bottom-5'} fixed w-full`}>
            {/* LABEL */}
            <span className={`gooey-label bg-brown-light opacity-95 shadow-2xl ${isMobile ? 'text-sm' : ''}`}>
                {activeSection}
            </span>
            <div className={`flex ${isMobile ? 'flex-wrap justify-center' : 'flex-row'} gap-${isMobile ? '3' : '6'} 
                p-${isMobile ? '3' : '5'} px-${isMobile ? '8' : '16'} bg-brown-light opacity-95 
                rounded-4xl relative overflow-hidden ${isMobile ? 'max-w-[95%]' : ''}`}>
                {/* Decorative border-radius-1 blob at the bottom */}
                <div className="absolute h-[40%] bg-beige left-0 bottom-0 w-full border-radius-1 pointer-events-none mask"></div>
                
                {/* Menu buttons */}
                {menuItems.map(({ id, icon, label }) => (
                    <div key={id} className="relative flex flex-col items-center">
                        <div 
                            onMouseEnter={() => handleMouseEnter(id)} 
                            onMouseLeave={handleMouseLeave}
                        >
                            <ButtonIcon
                                icon={icon}
                                onclick={() => handleScrollTo(id)}
                                className={`transition-all ${
                                    activeSection === id || hoveredButton === id
                                        ? `transition-all bg-beige text-brown-dark !scale-${isMobile ? '110' : '125'} !-translate-y-${isMobile ? '1' : '1.5'}`
                                        : "text-beige"
                                }`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Menu;