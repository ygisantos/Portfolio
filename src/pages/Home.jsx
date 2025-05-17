import Menu from '@/components/Menu';
import { getAboutMe, getAllSkills } from '@api/Api';
import ButtonIcon from '@components/ButtonIcon';
import CustomButton from '@components/CustomButton';
import CustomCard from '@components/CustomCard';
import GitHubStats from '@components/GitHubStats';
import { useEffect, useState } from 'react';
import { FaFacebookF, FaGithub, FaLinkedinIn, FaPhoneAlt, FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { SiFacebookgaming } from "react-icons/si";

import AnimatedCodeBackground from '@/components/AnimatedCodeBackground';
import BackToTop from '@/components/BackToTop';
import PixelatedSlider from '@/components/PixelatedSlider';
import ScrollReveal from '@/components/ScrollReveal';
import AwardsCertificates from '@page/AwardCertificates';
import Experience from '@page/Experience';
import ProfileSection from '@page/Profile';
import Project from '@page/Projects';
import SkillsCarousel from '@page/Skills';

function Home() {
    const [profile, setProfile] = useState();
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const about_me = JSON.parse(await getAboutMe());
            setProfile(about_me);

            const skillsData = JSON.parse(await getAllSkills());
            console.log(skillsData);
            setSkills(skillsData);
        };

        fetchData();
    }, []);


    return (        
        <div className='flex flex-row justify-center min-h-screen overflow'>
            {/* Animated programming background */}
            <AnimatedCodeBackground />

            {/* <Navigation /> */}
            <Menu />
            <div className="relative flex flex-col gap-6 p-4 md:w-[85dvw] w-[95dvw] max-w-7xl mx-auto pb-12">
                {/* PROFILE */}
                <section id="profile" className="mt-6">
                    <ProfileSection profile={profile}/>
                    {/* SOCIALS and DOWNLOAD CV  */}                    
                    <div className='flex md:flex-row flex-col flex-1/7 gap-3'>
                        {/* SOCIALS */}
                        <CustomCard className={'flex md:flex-row flex-col gap-4 items-center justify-around flex-3/4 animate-slideInLeft hover:shadow-xl transition-all duration-300'}>
                            <div className="relative">
                                <span className='font-black text-4xl text-brown-dark'>CONNECT</span>
                                <div className="absolute -bottom-2 left-0 w-3/4 h-1 bg-brown-medium rounded-full"></div>
                            </div>
                            <div className='flex md:flex-row flex-col gap-3'>                                <div className='flex flex-row gap-3 animate-fadeIn delay-100'>
                                    <ButtonIcon 
                                        icon={<FaFacebookF size={28}/>} 
                                        onclick={() => profile?.socials?.facebook && window.open(profile.socials.facebook, "_blank")}
                                        tooltip="Facebook"
                                    />
                                    <ButtonIcon 
                                        icon={<SiFacebookgaming size={28}/>} 
                                        onclick={() => profile?.socials?.facebook_page && window.open(profile.socials.facebook_page, "_blank")}
                                        tooltip="Facebook Page"
                                    />
                                </div>
                                <div className='flex flex-row gap-3 animate-fadeIn delay-200'>
                                    <ButtonIcon 
                                        icon={<FaTiktok size={28}/>} 
                                        onclick={() => profile?.socials?.tiktok && window.open(profile.socials.tiktok, "_blank")} 
                                        tooltip="TikTok"
                                    />
                                    <ButtonIcon 
                                        icon={<FaPhoneAlt size={28}/>} 
                                        onclick={() => profile?.socials?.phone && window.open(`tel:${profile.socials.phone}`, "_blank")} 
                                        tooltip="Phone"
                                    />
                                </div>
                                <div className='flex flex-row gap-3 animate-fadeIn delay-300'>
                                    <ButtonIcon 
                                        icon={<FaGithub size={28}/>} 
                                        onclick={() => profile?.socials?.github && window.open(profile.socials.github, "_blank")}
                                        tooltip="GitHub"
                                    />
                                    <ButtonIcon 
                                        icon={<FaLinkedinIn size={28}/>} 
                                        onclick={() => profile?.socials?.linkedin && window.open(profile.socials.linkedin, "_blank")}
                                        tooltip="LinkedIn"
                                    />
                                </div>
                                <div className='flex flex-row gap-3 animate-fadeIn delay-400'>
                                    <ButtonIcon 
                                        icon={<MdEmail size={28}/>} 
                                        onclick={() => profile?.socials?.email && window.open(`mailto:${profile.socials.email}`, "_blank")}
                                        tooltip="Email"
                                    />
                                </div>
                            </div>
                        </CustomCard>
                          <CustomButton
                            text={"DOWNLOAD CV"}
                            onclick={() => {
                                if (profile?.resume_url) window.open(profile.resume_url, "_blank");
                            }}
                            className={'flex-1/4 animate-slideInRight transition-all duration-300 hover:shadow-lg hover:-translate-y-1'}
                            classText={'font-bold text-xl tracking-wider'}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            }
                        />
                        </div>
                        </section>

                {/* SKILLS */}                
                <section id="skills" className='mt-16'>
                    <ScrollReveal animation="slideInLeft">
                        <div className={'w-fit z-1 -mb-1 ml-6 gooey-label bg-brown-dark !pt-6'} >
                            <span className='text-center solid-shadow-title text-beige md:text-2xl text-lg font-black tracking-wider'>✦ WHAT I WORK WITH ✦</span>
                        </div>
                        <CustomCard className={`overflow-hidden`}>
                            <SkillsCarousel skills={skills}/>
                        </CustomCard>
                    </ScrollReveal>

                    {/* Grouped Skills */}                    
                    <div className='grid md:grid-cols-3 grid-cols-1 md:grid-rows-2 grid-rows-6 gap-4 mt-6'>
                        {Object.entries(
                            skills.reduce((acc, skill) => {
                                acc[skill.category] = acc[skill.category] || [];
                                acc[skill.category].push(skill);
                                return acc;
                            }, {})
                        )
                        .sort(([categoryA, skillsA], [categoryB, skillsB]) => {
                            if (categoryA === "Others") return 1;
                            if (categoryB === "Others") return -1;

                            const maxProficiencyA = Math.max(...skillsA.map(skill => skill.proficiency));
                            const maxProficiencyB = Math.max(...skillsB.map(skill => skill.proficiency));

                            return maxProficiencyB - maxProficiencyA;
                        })
                        .map(([category, categorySkills], index) => (
                            <CustomCard 
                                key={category} 
                                className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${index % 2 === 0 ? 'animate-slideInLeft' : 'animate-slideInRight'} delay-${index * 100}`}
                            >
                                <div className="flex items-center mb-3">
                                    <span className='font-black md:text-xl text-lg text-brown-dark'>{category.toUpperCase()}</span>
                                    <div className="ml-2 h-0.5 flex-grow bg-brown-light opacity-50 rounded-full"></div>
                                </div>
                                <div className='flex flex-col gap-4 mt-2'>
                                    {categorySkills.map((skill, idx) => (
                                        <div key={skill.id} className={`flex flex-row items-center gap-4 p-2 rounded hover:bg-beige/30 transition-all duration-200`}>
                                            <img
                                                src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skill.icon}/${skill.icon}-original.svg`}
                                                alt={skill.title}
                                                className="h-8 w-8 flex-1/10 object-contain drop-shadow-sm"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skill.icon}/${skill.icon}-plain.svg`;
                                                }}
                                            />
                                            <span className='flex-5/10 font-medium'>{skill.title}</span>
                                            <span className='flex-1/10 font-bold text-brown-dark'>{skill.proficiency}%</span>
                                            <PixelatedSlider value={skill.proficiency} className={`flex-4/10 w-full`}/>
                                        </div>
                                    ))}
                                </div>
                            </CustomCard>
                        ))}
                    </div>
                </section>

                {/* AWARDS & CERTIFICATES */}                
                <section id="awards" className='mt-16 flex flex-col items-end'>
                    <ScrollReveal animation="slideInRight">
                        <div className={'w-fit z-1 -mb-1 mr-6 gooey-label bg-brown-dark !pt-6'} >
                            <span className='text-center solid-shadow-title text-beige md:text-2xl text-lg font-black tracking-wider'>✦ AWARDS & CERTIFICATES ✦</span>
                        </div>
                        {/* Awards & Certificates content */}
                        <CustomCard className="hover:shadow-xl transition-all duration-300">
                            <AwardsCertificates />
                        </CustomCard>
                    </ScrollReveal>
                </section>                
                
                {/* EXPERIENCE */}
                <section id="experiences" className='mt-16 flex flex-col'>
                    <ScrollReveal animation="slideInRight">
                        <div className={'w-fit z-1 -mb-1 ml-6 gooey-label bg-brown-dark !pt-6 self-center'} >
                            <span className='text-center solid-shadow-title text-beige md:text-2xl text-lg font-black tracking-wider'>✦ EXPERIENCES ✦</span>
                        </div>
                        <CustomCard className="hover:shadow-xl transition-all duration-300">
                            <Experience />
                        </CustomCard>
                    </ScrollReveal>
                </section>  

                {/* PROJECTS */}
                <section id="projects" className='mt-16 flex flex-col'>
                    <ScrollReveal animation="slideInLeft">
                        <div className={'w-fit z-1 -mb-1 ml-6 gooey-label bg-brown-dark !pt-6'} >
                            <span className='text-center solid-shadow-title text-beige md:text-2xl text-lg font-black tracking-wider'>✦ PROJECTS ✦</span>
                        </div>
                        <CustomCard className="overflow-hidden hover:shadow-xl transition-all duration-300">
                            <Project />
                        </CustomCard>
                    </ScrollReveal>
                </section>
                
                              <section id="testimonials" className='mt-16 flex flex-col mb-8'>
                <ScrollReveal animation="slideInLeft">
                    <div className={'w-fit z-1 -mb-1 ml-6 gooey-label bg-brown-dark !pt-6'} >
                        <span className='text-center solid-shadow-title text-beige md:text-2xl text-lg font-black tracking-wider'>✦ TESTIMONIALS ✦</span>
                    </div>
                    <CustomCard className="hover:shadow-xl transition-all duration-300">
                        <div className="flex flex-col gap-4">
                            {/* Placeholder for actual testimonials */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="bg-brown-light/10 p-4 rounded-lg border border-brown-light/20 hover:border-brown-medium transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 rounded-full bg-brown-light/30 flex items-center justify-center">
                                            <span className="text-2xl">👨‍💼</span>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="font-bold">John Doe</h3>
                                            <p className="text-sm text-brown-dark/70">CEO, Tech Company</p>
                                        </div>
                                    </div>
                                    <p className="italic text-brown-dark/80">"Excellent work ethic and technical skills. Delivered the project on time with high quality."</p>
                                </div>
                                
                                <div className="bg-brown-light/10 p-4 rounded-lg border border-brown-light/20 hover:border-brown-medium transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 rounded-full bg-brown-light/30 flex items-center justify-center">
                                            <span className="text-2xl">👩‍💼</span>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="font-bold">Jane Smith</h3>
                                            <p className="text-sm text-brown-dark/70">Project Manager</p>
                                        </div>
                                    </div>
                                    <p className="italic text-brown-dark/80">"A pleasure to work with. Consistently exceeds expectations and brings creative solutions to complex problems."</p>
                                </div>
                            </div>
                        </div>
                    </CustomCard>
                </ScrollReveal>                    
                </section>
                    <section id="github-stats" className='mt-16 flex flex-col mb-8'>
                    <ScrollReveal animation="slideInRight">
                        <div className={'w-fit z-1 -mb-1 mr-6 gooey-label bg-brown-dark !pt-6 self-end'} >
                            <span className='text-center solid-shadow-title text-beige md:text-2xl text-lg font-black tracking-wider'>✦ GITHUB CODING ACTIVITY ✦</span>
                        </div>
                        <GitHubStats username="ygisantos" />
                    </ScrollReveal>
                </section>
            </div>
            <BackToTop />
        </div>
    );
}

export default Home;