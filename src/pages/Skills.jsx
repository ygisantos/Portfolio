import { useEffect, useRef, useState } from 'react';
import LanguageIcon from '@components/LanguageIcon';

const ITEM_WIDTH = 96; // px
const SLIDE_INTERVAL = 20; // ms
const SLIDE_STEP = 2; // px

export default function SkillsCarousel({skills}) {
    const [offset, setOffset] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const offsetRef = useRef(0);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!skills.length) return;

        const slide = () => {
            if (!isPaused) {
                offsetRef.current += SLIDE_STEP;
                const totalWidth = skills.length * ITEM_WIDTH;
                if (offsetRef.current >= totalWidth) {
                    offsetRef.current %= totalWidth;
                }
                setOffset(offsetRef.current);
            }
            animationRef.current = setTimeout(slide, SLIDE_INTERVAL);
        };

        animationRef.current = setTimeout(slide, SLIDE_INTERVAL);
        return () => clearTimeout(animationRef.current);
    }, [skills, isPaused]);    return (
        <div 
            className="relative w-full overflow-hidden h-[100px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div
                className="flex items-center absolute left-0 top-0 h-full"
                style={{ transform: `translateX(-${offset}px)`, width: skills.length ? `${skills.length * 2 * ITEM_WIDTH}px` : '100%' }}
            >
                {[...skills, ...skills].map((skill, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center mx-2 whitespace-nowrap">
                        <LanguageIcon
                            icon={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skill.icon}/${skill.icon}-original.svg`}
                            name={skill.title}
                            className="!w-12 !h-12"
                        />
                        <span className="text-xs mt-1">{skill.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
