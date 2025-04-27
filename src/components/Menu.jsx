import { useState, useEffect } from "react";
import { FaUser, FaTools, FaAward, FaProjectDiagram, FaBriefcase, FaCommentDots } from 'react-icons/fa';
import ButtonIcon from "@components/ButtonIcon";
import "./Menu.css"; // Import custom CSS for gooey effect

function Menu() {
    const [activeSection, setActiveSection] = useState("profile");
    const [hoveredButton, setHoveredButton] = useState(null); // Track hovered button

    useEffect(() => {
        const sections = document.querySelectorAll("section");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
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

    return (
        <div className="!z-5 flex flex-col items-center justify-center bottom-1 fixed w-full">
            {/* LABEL */}
            <span className="gooey-label bg-brown-light">{activeSection}</span>
            <div className="flex flex-row ! gap-4 p-5 bg-brown-light rounded-xl relative">
                {/* Decorative border-radius-1 blob at the bottom */}
                <div className="absolute h-[40%] bg-beige left-0 bottom-0 w-full border-radius-1 pointer-events-none"></div>
                
                {/* Menu buttons */}
                { [
                    { id: "profile", icon: <FaUser size={32} />, label: "Profile" },
                    { id: "skills", icon: <FaTools size={32} />, label: "Skills" },
                    { id: "awards", icon: <FaAward size={32} />, label: "Awards" },
                    { id: "projects", icon: <FaProjectDiagram size={32} />, label: "Projects" },
                    { id: "experiences", icon: <FaBriefcase size={32} />, label: "Experiences" },
                    { id: "testimonials", icon: <FaCommentDots size={32} />, label: "Testimonials" },
                ].map(({ id, icon, label }) => (
                    <div key={id} className="relative flex flex-col items-center">
                        <div onMouseEnter={() => handleMouseEnter(id)} onMouseLeave={handleMouseLeave} >
                            <ButtonIcon
                                icon={icon}
                                onclick={() => handleScrollTo(id)}
                                className={`transition-all ${
                                    activeSection === id || hoveredButton === id
                                        ? "transition-all bg-beige text-brown-dark !scale-125 !-translate-y-1.5"
                                        : "text-beige"
                                }`}
                            />
                        </div>
                    </div>
                )) }
            </div>
        </div>
    );
}

export default Menu;