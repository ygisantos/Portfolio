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
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineWork } from "react-icons/md";
import { IoCalendar } from "react-icons/io5";

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
            <AnimatedCodeBackground symbolCount={150} minOpacity={0.05} maxOpacity={0.5} />

            <Menu />
            <main className="relative flex flex-col gap-8 p-4 md:w-[85dvw] w-[95dvw] max-w-7xl mx-auto pb-12">
                {/* HERO SECTION - Redesigned based on inspiration */}
                <section id="profile" className="min-h-screen flex md:flex-row flex-col justify-center items-center relative">
                    {/* Hero Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-brown-light/10 to-brown-dark/20 z-0"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px] opacity-30 z-0"></div>
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/10 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
                        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brown-medium/20 rounded-full filter blur-3xl opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
                    </div>

                    {/* Left Column (Profile Image) */}
                    <div className="flex-1 flex justify-center items-center z-10 py-10">
                        <ScrollReveal animation="slideInLeft">
                            <div className="relative w-80 h-80 md:w-[32rem] md:h-[32rem] rounded-full overflow-hidden border-8 border-brown-medium shadow-2xl transform hover:scale-105 transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brown-dark/40 z-10"></div>
                                <img 
                                    className="w-full h-full object-cover" 
                                    src={profile?.image_url || 'https://static.vecteezy.com/system/resources/thumbnails/036/594/092/small_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'} 
                                    alt="Profile"
                                />
                                <div className="absolute inset-0 border-12 border-white/10 rounded-full"></div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right Column (Text Content) */}
                    <div className="flex-1 z-10 flex flex-col items-center md:items-start justify-center px-4">
                        <ScrollReveal animation="slideInRight">
                            <div className="text-center md:text-left mb-8">
                                <h2 className="!text-2xl md:!text-3xl font-bold text-brown-dark/80 mb-3 animate-fadeIn">
                                    Hello, I'm
                                </h2>
                                <h1 className="!text-4xl md:!text-6xl !font-black text-brown-dark tracking-tight mb-3 animate-fadeIn" style={{textShadow: '0 0 60px rgba(255,255,255,0.4)'}}>
                                    {profile?.name || "YGI MARTIN B. SANTOS"}
                                </h1>
                                <div className="h-3 bg-brown-medium mx-auto md:mx-0 rounded-full shadow-lg"></div>
                                <h2 className="!text-xl md:!text-2xl !font-bold text-brown-dark opacity-70 italic !mb-8 animate-fadeIn delay-200" style={{textShadow: '0 0 30px rgba(255,255,255,0.3)'}}>
                                    {profile?.role || "Developer"}
                                </h2>
                            
                                {/* Social Media Icons */}
                                <div className="flex flex-wrap justify-center md:justify-start gap-5 mb-10 animate-fadeIn delay-400">
                                    <ButtonIcon 
                                        icon={<FaGithub size={35}/>} 
                                        onclick={() => profile?.socials?.github && window.open(profile.socials.github, "_blank")}
                                        tooltip="GitHub"
                                        className="hover:scale-110 hover:shadow-lg transition-all duration-300 p-4"
                                    />
                                    <ButtonIcon 
                                        icon={<FaLinkedinIn size={35}/>} 
                                        onclick={() => profile?.socials?.linkedin && window.open(profile.socials.linkedin, "_blank")}
                                        tooltip="LinkedIn"
                                        className="hover:scale-110 hover:shadow-lg transition-all duration-300 p-4"
                                    />
                                    <ButtonIcon 
                                        icon={<MdEmail size={35}/>} 
                                        onclick={() => profile?.socials?.email && window.open(`mailto:${profile.socials.email}`, "_blank")}
                                        tooltip="Email"
                                        className="hover:scale-110 hover:shadow-lg transition-all duration-300 p-4"
                                    />
                                    <ButtonIcon 
                                        icon={<FaFacebookF size={35}/>} 
                                        onclick={() => profile?.socials?.facebook && window.open(profile.socials.facebook, "_blank")}
                                        tooltip="Facebook"
                                        className="hover:scale-110 hover:shadow-lg transition-all duration-300 p-4"
                                    />
                                    <ButtonIcon 
                                        icon={<SiFacebookgaming size={35}/>} 
                                        onclick={() => profile?.socials?.facebook_page && window.open(profile.socials.facebook_page, "_blank")}
                                        tooltip="Facebook Page"
                                        className="hover:scale-110 hover:shadow-lg transition-all duration-300 p-4"
                                    />
                                    <ButtonIcon 
                                        icon={<FaTiktok size={35}/>} 
                                        onclick={() => profile?.socials?.tiktok && window.open(profile.socials.tiktok, "_blank")} 
                                        tooltip="TikTok"
                                        className="hover:scale-110 hover:shadow-lg transition-all duration-300 p-4"
                                    />
                                    <ButtonIcon 
                                        icon={<FaPhoneAlt size={35}/>} 
                                        onclick={() => profile?.socials?.phone && window.open(`tel:${profile.socials.phone}`, "_blank")} 
                                        tooltip="Phone"
                                        className="hover:scale-110 hover:shadow-lg transition-all duration-300 p-4"
                                    />
                                </div>
                            
                                {/* Download CV button */}
                                <CustomButton
                                    text={"DOWNLOAD CV"}
                                    onclick={() => {
                                        if (profile?.resume_url) window.open(profile.resume_url, "_blank");
                                    }}
                                    className={'animate-fadeIn delay-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 shadow-lg border-t-8 border-brown-medium px-8 py-4'}
                                    classText={'font-bold text-2xl tracking-wider'}
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    }
                                />
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce opacity-70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </section>

                {/* About Me Section - Reorganized with two columns */}
                <section id="about-me" className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-brown-light/5 to-brown-dark/10 rounded-3xl -z-10"></div>
                    
                    <ScrollReveal animation="slideInUp">
                        <CustomCard className="mx-auto p-10 border-t-4 border-brown-medium shadow-2xl backdrop-blur-sm">
                            <h3 className="text-4xl font-bold text-brown-dark mb-8 relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-brown-medium after:rounded-full">
                                About Me
                            </h3>

                            <div className="flex flex-col md:flex-row gap-10">
                                {/* Left column - About me description */}
                                <div className="flex-1">
                                    <p className="text-2xl leading-relaxed text-brown-dark/80">
                                        {profile?.description || "Loading my professional profile..."}
                                    </p>
                                </div>

                                {/* Right column - Personal info */}
                                <div className="flex-1 md:border-l-2 border-brown-light/30 md:pl-10">
                                    <h4 className="text-3xl font-bold text-brown-dark mb-6">Personal Info</h4>
                                    
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-brown-light/20 p-3 rounded-full">
                                                <MdEmail className="text-brown-dark text-3xl"/>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-brown-dark/60">Email</p>
                                                <p className="text-xl font-medium">{profile?.socials?.email || 'loading...'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="bg-brown-light/20 p-3 rounded-full">
                                                <FaPhoneAlt className="text-brown-dark text-3xl"/>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-brown-dark/60">Phone</p>
                                                <p className="text-xl font-medium">{profile?.socials?.phone || 'loading...'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="bg-brown-light/20 p-3 rounded-full">
                                                <FaLocationDot className="text-brown-dark text-3xl"/>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-brown-dark/60">Location</p>
                                                <p className="text-xl font-medium">{profile?.location || 'loading...'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="bg-brown-light/20 p-3 rounded-full">
                                                <MdOutlineWork className="text-brown-dark text-3xl"/>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-brown-dark/60">Availability</p>
                                                <p className="text-xl font-medium">{profile?.availability || 'loading...'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="bg-brown-light/20 p-3 rounded-full">
                                                <IoCalendar className="text-brown-dark text-3xl"/>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-brown-dark/60">Birthday</p>
                                                <p className="text-xl font-medium">October 15, 2002</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CustomCard>
                    </ScrollReveal>
                </section>

                {/* SKILLS */}                
                <section id="skills" className='mt-20'>
                    <SectionHeading title="WHAT I WORK WITH" alignment="left" animation="slideInLeft" />
                    
                    <ScrollReveal animation="fadeIn">
                        <CustomCard className="overflow-hidden shadow-lg border-l-4 border-brown-medium hover:shadow-xl transition-all duration-300">
                            <SkillsCarousel skills={skills}/>
                        </CustomCard>
                    </ScrollReveal>

                    {/* Grouped Skills */}
                    <div className="mt-8">
                        <GroupedSkills skills={skills} />
                    </div>
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