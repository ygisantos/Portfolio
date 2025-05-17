import React from 'react';
import CustomCard from '@/components/CustomCard';
import PixelatedSlider from '@/components/PixelatedSlider';

export default function GroupedSkills({ skills }) {
    // Function to determine skill level based on proficiency
    const getSkillLevel = (proficiency) => {
        if (proficiency >= 90) return "Expert";
        if (proficiency >= 75) return "Advanced";
        if (proficiency >= 50) return "Intermediate";
        if (proficiency >= 25) return "Beginner";
        return "Beginner";
    };
    
    // Function to get color class based on proficiency
    const getLevelColorClass = (proficiency) => {
        if (proficiency >= 90) return "text-emerald-600";
        if (proficiency >= 75) return "text-blue-600";
        if (proficiency >= 50) return "text-amber-600";
        if (proficiency >= 25) return "text-orange-600";
        return "text-red-600";
    };

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        acc[skill.category] = acc[skill.category] || [];
        acc[skill.category].push(skill);
        return acc;
    }, {});

    // Sort categories by max proficiency
    const sortedCategories = Object.entries(groupedSkills)
        .sort(([categoryA, skillsA], [categoryB, skillsB]) => {
            if (categoryA === "Others") return 1;
            if (categoryB === "Others") return -1;

            const maxProficiencyA = Math.max(...skillsA.map(skill => skill.proficiency));
            const maxProficiencyB = Math.max(...skillsB.map(skill => skill.proficiency));

            return maxProficiencyB - maxProficiencyA;
        });

    return (
        <div className='grid md:grid-cols-3 grid-cols-1 md:grid-rows-2 grid-rows-6 gap-4 mt-6'>
            {sortedCategories.map(([category, categorySkills], index) => (
                <CustomCard 
                    key={category} 
                    className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${index % 2 === 0 ? 'animate-slideInLeft' : 'animate-slideInRight'} delay-${index * 100}`}
                >
                    <div className="flex items-center mb-3">
                        <span className='font-black md:text-xl text-lg text-brown-dark'>{category.toUpperCase()}</span>
                        <div className="ml-2 h-0.5 flex-grow bg-brown-light opacity-50 rounded-full"></div>
                    </div>
                    <div className='flex flex-col gap-1 mt-2'>
                        {categorySkills.map((skill) => {
                            const skillLevel = getSkillLevel(skill.proficiency);
                            const levelColorClass = getLevelColorClass(skill.proficiency);
                            
                            return (
                                <div key={skill.id} className={`flex flex-col rounded-lg border border-transparent hover:border-brown-light/30 overflow-hidden hover:shadow-md transition-all duration-300`}>
                                    {/* Skill Header Row */}
                                    <div className="flex items-center px-2 bg-beige/20 hover:bg-beige/30 transition-all cursor-pointer">
                                        <div className="h-9 w-9 bg-beige/50 rounded-full flex items-center justify-center p-1.5 shadow-sm">
                                            <img
                                                src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skill.icon}/${skill.icon}-original.svg`}
                                                alt={skill.title}
                                                className="h-full w-full object-contain"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skill.icon}/${skill.icon}-plain.svg`;
                                                }}
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <span className='font-medium text-brown-dark'>{skill.title}</span>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${levelColorClass} bg-white/80 shadow-sm border border-${levelColorClass.split('-')[1]}-100 flex items-center gap-1`}>
                                            {skillLevel}
                                        </div>
                                    </div>
                                    
                                    {/* Proficiency Slider Row */}
                                    <div className="px-3 py-2 flex items-center gap-2">
                                        <span className="font-bold text-brown-dark min-w-[35px] text-right">
                                            {skill.proficiency}%
                                        </span>
                                        <div className="flex-grow">
                                            <PixelatedSlider value={skill.proficiency} className="!w-full" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CustomCard>
            ))}
        </div>
    );
}
