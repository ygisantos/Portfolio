import { useState } from 'react';
import { FaUser, FaTools, FaAward, FaProjectDiagram, FaBriefcase, FaCommentDots } from 'react-icons/fa';

function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    const handleScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false); // Close the side panel after navigation on mobile
    };

    return (
        <nav className="navigation">
            <button className="sidepanel-toggle" onClick={() => setIsOpen(!isOpen)}>
                ☰
            </button>
            <div className={`sidepanel ${isOpen ? 'open' : ''}`}>
                <ul className="nav-links">
                    <li onClick={() => handleScroll('profile')}>
                        <FaUser /> Profile
                    </li>
                    <li onClick={() => handleScroll('skills')}>
                        <FaTools /> Skills
                    </li>
                    <li onClick={() => handleScroll('awards')}>
                        <FaAward /> Awards & Certificates
                    </li>
                    <li onClick={() => handleScroll('projects')}>
                        <FaProjectDiagram /> Projects
                    </li>
                    <li onClick={() => handleScroll('experiences')}>
                        <FaBriefcase /> Experiences
                    </li>
                    <li onClick={() => handleScroll('testimonials')}>
                        <FaCommentDots /> Testimonials
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navigation;