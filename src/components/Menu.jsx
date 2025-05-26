import ButtonIcon from "@components/ButtonIcon";
import { useEffect, useState } from "react";
import { FaAward, FaBriefcase, FaCommentDots, FaGithub, FaProjectDiagram, FaTools, FaUser } from 'react-icons/fa';
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
                    // Debug logging
                    console.log(`Section ${entry.target.id}: ${entry.isIntersecting ? 'visible' : 'hidden'} (${entry.intersectionRatio})`);
                    
                    // Only update if the new section is more visible than current threshold
                    if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { 
                threshold: [0.15, 0.3, 0.5],  // Multiple thresholds for better detection
                rootMargin: "-10% 0px -10% 0px"  // Percentage-based margins
            } 
        );

        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
            observer.disconnect();
        };
    }, []);  // Remove isMobile dependency since we're using percentage-based values

    const handleScrollTo = (sectionId) => {
        setActiveSection(sectionId);
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    };

    const handleMouseEnter = (sectionId) => setHoveredButton(sectionId);
    const handleMouseLeave = () => setHoveredButton(null);    // Menu item configuration
    const menuItems = [
        { id: "profile", icon: <FaUser size={isMobile ? 20 : 28} />, label: "Profile" },
        { id: "skills", icon: <FaTools size={isMobile ? 20 : 28} />, label: "Skills" },
        { id: "awards", icon: <FaAward size={isMobile ? 20 : 28} />, label: "Awards" },
        { id: "experiences", icon: <FaBriefcase size={isMobile ? 20 : 28} />, label: "Experiences" },
        { id: "projects", icon: <FaProjectDiagram size={isMobile ? 20 : 28} />, label: "Projects" },
        // { id: "testimonials", icon: <FaCommentDots size={isMobile ? 20 : 28} />, label: "Testimonials" },
        { id: "github-stats", icon: <FaGithub size={isMobile ? 20 : 28} />, label: "GitHub" },
    ];

    return (
        <div className={`!z-20 flex flex-col  items-center justify-center ${isMobile ? 'bottom-1' : 'bottom-5'} fixed w-full`}>
            {/* LABEL */}
            <span className={`gooey-label !shadow-xl/30 bg-brown-light outline-dashed outline-[#633f18] opacity-95 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                ✦ <span className="mx-1">{activeSection}</span> ✦
            </span>
            <div className={`!shadow-xl/30 flex ${isMobile ? 'flex-wrap justify-center gap-2 p-2 px-4 max-w-[90%]' : 'flex-row gap-6 p-5 px-16'} 
                bg-brown-light opacity-95 rounded-4xl relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300`}>
                {/* Decorative border-radius-1 blob at the bottom */}
                <div className="absolute h-[40%] bg-beige left-0 bottom-0 w-full border-radius-1 pointer-events-none mask"></div>
                
                {/* Menu buttons */}
                {menuItems.map(({ id, icon, label }) => (
                    <div key={id} className="!shadow-xl/10 relative flex flex-col items-center">
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