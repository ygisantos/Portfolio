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
import ScrollReveal from '@/components/ScrollReveal';
import AwardsCertificates from '@page/AwardCertificates';
import Experience from '@page/Experience';
import GroupedSkills from '@page/GroupedSkills';
import ProfileSection from '@page/Profile';
import Project from '@page/Projects';
import SkillsCarousel from '@page/Skills';

function Home() {
    const [profile, setProfile] = useState();
    const [skills, setSkills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const about_me = JSON.parse(await getAboutMe());
                setProfile(about_me);

                const skillsData = JSON.parse(await getAllSkills());
                setSkills(skillsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Section heading component for consistent styling
    const SectionHeading = ({ title, alignment = 'left', animation = 'slideInLeft' }) => (
        <ScrollReveal animation={animation}>
            <div className={`w-fit z-10 -mb-1 mx-auto ${alignment === 'right' ? 'md:mr-6 md:self-end' : 'md:ml-6'} gooey-label bg-brown-dark !pt-6 px-8 transform hover:scale-105 transition-all duration-300`}>
                <span className='text-center solid-shadow-title text-beige md:text-2xl text-md font-black tracking-wider flex items-center'>
                    <span className="text-amber-200">✦</span> 
                    <span className="mx-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-amber-200/30 after:rounded-full">{title}</span> 
                    <span className="text-amber-200">✦</span>
                </span>
            </div>
        </ScrollReveal>
    );

    return (        
        <div className='flex flex-row justify-center min-h-screen'>
            {/* Animated programming background with reduced motion for better performance */}
            <AnimatedCodeBackground symbolCount={100} minOpacity={0.05} maxOpacity={0.5} />

            <Menu />
            <main className="relative flex flex-col gap-8 p-4 md:w-[85dvw] w-[95dvw] max-w-7xl mx-auto pb-12">
                {/* PROFILE */}
                <section id="profile" className="mt-8 transform transition-all duration-500">
                    <ProfileSection profile={profile}/>
                    
                    {/* SOCIALS and DOWNLOAD CV */}                    
                    <div className='flex md:flex-row flex-col gap-4 mt-4'>
                        {/* SOCIALS */}
                        <CustomCard className={'flex-grow md:flex-row flex-col gap-4 items-center justify-around p-5 animate-slideInLeft hover:shadow-xl transition-all duration-300 border-t-4 border-brown-medium'}>
                            <div className="relative mb-4 md:mb-0">
                                <span className='font-black text-4xl text-brown-dark'>CONNECT</span>
                                <div className="absolute -bottom-2 left-0 w-3/4 h-1 bg-brown-medium rounded-full"></div>
                            </div>
                            <div className='flex md:flex-row flex-col gap-4 flex-wrap justify-center'>
                                <div className='flex flex-row gap-3 animate-fadeIn delay-100'>
                                    <ButtonIcon 
                                        icon={<FaFacebookF size={24}/>} 
                                        onclick={() => profile?.socials?.facebook && window.open(profile.socials.facebook, "_blank")}
                                        tooltip="Facebook"
                                    />
                                    <ButtonIcon 
                                        icon={<SiFacebookgaming size={24}/>} 
                                        onclick={() => profile?.socials?.facebook_page && window.open(profile.socials.facebook_page, "_blank")}
                                        tooltip="Facebook Page"
                                    />
                                </div>
                                <div className='flex flex-row gap-3 animate-fadeIn delay-200'>
                                    <ButtonIcon 
                                        icon={<FaTiktok size={24}/>} 
                                        onclick={() => profile?.socials?.tiktok && window.open(profile.socials.tiktok, "_blank")} 
                                        tooltip="TikTok"
                                    />
                                    <ButtonIcon 
                                        icon={<FaPhoneAlt size={24}/>} 
                                        onclick={() => profile?.socials?.phone && window.open(`tel:${profile.socials.phone}`, "_blank")} 
                                        tooltip="Phone"
                                    />
                                </div>
                                <div className='flex flex-row gap-3 animate-fadeIn delay-300'>
                                    <ButtonIcon 
                                        icon={<FaGithub size={24}/>} 
                                        onclick={() => profile?.socials?.github && window.open(profile.socials.github, "_blank")}
                                        tooltip="GitHub"
                                    />
                                    <ButtonIcon 
                                        icon={<FaLinkedinIn size={24}/>} 
                                        onclick={() => profile?.socials?.linkedin && window.open(profile.socials.linkedin, "_blank")}
                                        tooltip="LinkedIn"
                                    />
                                </div>
                                <div className='flex flex-row gap-3 animate-fadeIn delay-400'>
                                    <ButtonIcon 
                                        icon={<MdEmail size={24}/>} 
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
                            className={'md:w-60 animate-slideInRight transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-md border-t-4 border-brown-medium'}
                            classText={'font-bold text-xl tracking-wider'}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            }
                        />
                    </div>
                </section>

                {/* SKILLS */}                
                <section id="skills" className='mt-20 min-h-screen flex flex-col'>
                    <SectionHeading title="WHAT I WORK WITH" alignment="left" animation="slideInLeft" />
                    
                    <ScrollReveal animation="fadeIn" className="flex-grow">
                        <CustomCard className="overflow-hidden shadow-lg border-l-4 border-brown-medium hover:shadow-xl transition-all duration-300">
                            <SkillsCarousel skills={skills}/>
                        </CustomCard>

                        {/* Grouped Skills - Keep within the same ScrollReveal */}
                        <div className="mt-8">
                            <GroupedSkills skills={skills} />
                        </div>
                    </ScrollReveal>
                </section>

                {/* AWARDS & CERTIFICATES */}                
                <section id="awards" className='mt-20 flex flex-col md:items-end items-center'>
                    <SectionHeading title="AWARDS & CERTIFICATES" alignment="right" animation="slideInRight" />
                    
                    <ScrollReveal animation="fadeIn">
                        <CustomCard className="shadow-lg border-r-4 border-brown-medium hover:shadow-xl transition-all duration-300">
                            <AwardsCertificates />
                        </CustomCard>
                    </ScrollReveal>
                </section>                
                
                {/* EXPERIENCE */}
                <section id="experiences" className='mt-20 flex flex-col'>
                    <SectionHeading title="EXPERIENCES" alignment="center" animation="slideInRight" />
                    
                    <ScrollReveal animation="fadeIn">
                        <CustomCard className="shadow-lg border-t-4 border-brown-medium hover:shadow-xl transition-all duration-300">
                            <Experience />
                        </CustomCard>
                    </ScrollReveal>
                </section>  

                {/* PROJECTS */}
                <section id="projects" className='mt-20 flex flex-col'>
                    <SectionHeading title="PROJECTS" alignment="left" animation="slideInLeft" />
                    
                    <ScrollReveal animation="fadeIn">
                        <CustomCard className="overflow-hidden shadow-lg border-l-4 border-brown-medium hover:shadow-xl transition-all duration-300">
                            <Project />
                        </CustomCard>
                    </ScrollReveal>
                </section>
                
                {/* TESTIMONIAL */}
                <section id="testimonials" className='mt-20 flex flex-col'>
                    <SectionHeading title="TESTIMONIALS" alignment="left" animation="slideInLeft" />
                    
                    <ScrollReveal animation="fadeIn">
                        <CustomCard className="shadow-lg border-l-4 border-brown-medium hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col gap-6 p-2">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="bg-brown-light/10 p-6 rounded-lg border border-brown-light/20 hover:border-brown-medium transition-all duration-300 hover:-translate-y-1 shadow-md flex-1">
                                        <div className="flex items-center mb-4">
                                            <div className="w-16 h-16 rounded-full bg-brown-light/30 flex items-center justify-center">
                                                <span className="text-3xl">👨‍💼</span>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="font-bold text-lg">John Doe</h3>
                                                <p className="text-sm text-brown-dark/70">CEO, Tech Company</p>
                                            </div>
                                        </div>
                                        <p className="italic text-brown-dark/80 text-lg">"Excellent work ethic and technical skills. Delivered the project on time with high quality."</p>
                                        <div className="mt-3 flex">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <span key={star} className="text-amber-400 text-xl">★</span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-brown-light/10 p-6 rounded-lg border border-brown-light/20 hover:border-brown-medium transition-all duration-300 hover:-translate-y-1 shadow-md flex-1">
                                        <div className="flex items-center mb-4">
                                            <div className="w-16 h-16 rounded-full bg-brown-light/30 flex items-center justify-center">
                                                <span className="text-3xl">👩‍💼</span>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="font-bold text-lg">Jane Smith</h3>
                                                <p className="text-sm text-brown-dark/70">Project Manager</p>
                                            </div>
                                        </div>
                                        <p className="italic text-brown-dark/80 text-lg">"A pleasure to work with. Consistently exceeds expectations and brings creative solutions to complex problems."</p>
                                        <div className="mt-3 flex">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <span key={star} className="text-amber-400 text-xl">★</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CustomCard>
                    </ScrollReveal>                    
                </section>

                {/* GITHUB STAT */}
                <section id="github-stats" className='mt-20 flex flex-col mb-32'>
                    <SectionHeading title="GITHUB CODING ACTIVITY" alignment="right" animation="slideInRight" />
                    
                    <ScrollReveal animation="fadeIn">
                        <CustomCard className="shadow-lg border-r-4 border-brown-medium hover:shadow-xl transition-all duration-300">
                            <GitHubStats username="ygisantos" />
                        </CustomCard>
                    </ScrollReveal>
                </section>
            </main>
            <BackToTop />
        </div>
    );
}

export default Home;