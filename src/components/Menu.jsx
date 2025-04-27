import { useState, useEffect } from "react";
import { FaUser, FaTools, FaAward, FaProjectDiagram, FaBriefcase, FaCommentDots } from 'react-icons/fa';
import ButtonIcon from "@components/ButtonIcon";

function Menu() {
    const [activeSection, setActiveSection] = useState("profile");
    const [hoveredButton, setHoveredButton] = useState(null); // Track hovered button

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
            { threshold: 0.6 } // Adjust threshold to determine when a section is considered "in view"
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
        <div className="flex items-center justify-center bottom-1 fixed w-full">
            <div className="flex flex-row gap-4 p-4 bg-[#a07850c6] rounded-lg !backdrop-blur">
                { [
                    { id: "profile", icon: <FaUser size={32} />, label: "Profile" },
                    { id: "skills", icon: <FaTools size={32} />, label: "Skills" },
                    { id: "awards", icon: <FaAward size={32} />, label: "Awards" },
                    { id: "projects", icon: <FaProjectDiagram size={32} />, label: "Projects" },
                    { id: "experiences", icon: <FaBriefcase size={32} />, label: "Experiences" },
                    { id: "testimonials", icon: <FaCommentDots size={32} />, label: "Testimonials" },
                ].map(({ id, icon, label }) => (
                    <div key={id} className="relative flex flex-col items-center">
                        {(hoveredButton === id || activeSection === id) && (
                            <span className="absolute -top-10 text-xs text-white bg-brown-light p-3 border-radius-1">{label}</span>
                        )}
                        <div
                            onMouseEnter={() => handleMouseEnter(id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <ButtonIcon
                                icon={icon}
                                onclick={() => handleScrollTo(id)}
                                className={`transition-transform ${
                                    activeSection === id || hoveredButton === id
                                        ? "text-white !scale-125"
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