import ButtonIcon from "@components/ButtonIcon";
import { useEffect, useState } from "react";
import { FaAward, FaBriefcase, FaCommentDots, FaProjectDiagram, FaTools, FaUser } from 'react-icons/fa';
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
            { 
                threshold: isMobile ? 0.3 : 0.6,
                rootMargin: isMobile ? "-20px 0px" : "0px"
            } 
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [isMobile]); // Add isMobile as a dependency

    const handleScrollTo = (sectionId) => {
        setActiveSection(sectionId);
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    };

    const handleMouseEnter = (sectionId) => setHoveredButton(sectionId);
    const handleMouseLeave = () => setHoveredButton(null);

    // Menu item configuration
    const menuItems = [
        { id: "profile", icon: <FaUser size={isMobile ? 20 : 28} />, label: "Profile" },
        { id: "skills", icon: <FaTools size={isMobile ? 20 : 28} />, label: "Skills" },
        { id: "awards", icon: <FaAward size={isMobile ? 20 : 28} />, label: "Awards" },
        { id: "projects", icon: <FaProjectDiagram size={isMobile ? 20 : 28} />, label: "Projects" },
        { id: "experiences", icon: <FaBriefcase size={isMobile ? 20 : 28} />, label: "Experiences" },
        { id: "testimonials", icon: <FaCommentDots size={isMobile ? 20 : 28} />, label: "Testimonials" },
    ];

    return (
        <div className={`!z-20 flex flex-col items-center justify-center ${isMobile ? 'bottom-1' : 'bottom-5'} fixed w-full`}>
            {/* LABEL */}
            <span className={`gooey-label bg-brown-light opacity-95 shadow-2xl ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {activeSection}
            </span>
            <div className={`flex ${isMobile ? 'flex-wrap justify-center gap-2 p-2 px-4 max-w-[90%]' : 'flex-row gap-6 p-5 px-16'} 
                bg-brown-light opacity-95 rounded-4xl relative overflow-hidden`}>
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
                                        ? `transition-all bg-beige text-brown-dark ${isMobile ? 'scale-110' : 'scale-125'} ${isMobile ? '-translate-y-1' : '-translate-y-1.5'}`
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