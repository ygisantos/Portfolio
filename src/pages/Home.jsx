import CustomCard from '@components/CustomCard';
import CustomButton from '@components/CustomButton';
import Navigation from '@components/Navigation';
import ButtonIcon from '@components/ButtonIcon';
import { FaLocationDot } from "react-icons/fa6";
import { SiNamemc } from "react-icons/si";
import { MdDescription } from "react-icons/md";
import { MdOutlineWork } from "react-icons/md";
import { FaFacebookF } from "react-icons/fa";
import { SiFacebookgaming } from "react-icons/si";
import { FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { AgeCalculate } from '@/utils/Calculator';
import {getAboutMe, getAllSkills} from '@api/Api';
import { useEffect, useState } from 'react';
import { RxDividerHorizontal } from "react-icons/rx";
import { IoCalendar } from "react-icons/io5";
import Menu from '@/components/Menu';
import LanguageIcon from '@components/LanguageIcon';
// Add import for the animated background
import AnimatedCodeBackground from '@/components/AnimatedCodeBackground';
import SkillsCarousel from './Skills';
import ProfileSection from './Profile';

function Home() {
    const [profile, setProfile] = useState();
    const [skills, setSkills] = useState([]);
    const [offset, setOffset] = useState(0);
    const skillsPerPage = 5;
    const slideInterval = 20; // ms, lower is smoother
    const slideStep = 1; // px per interval

    useEffect(() => {
        const fetchData = async () => {
            const about_me = JSON.parse(await getAboutMe());
            setProfile(about_me);
            const skillsData = JSON.parse(await getAllSkills());
            setSkills(skillsData);
        };

        fetchData();
    }, []);

    // Smooth auto-slide effect
    useEffect(() => {
        if (!skills.length) return;
        let animationFrame;
        let currentOffset = offset;

        const slide = () => {
            // Each skill item is 96px wide (w-12 h-12 + margin), adjust as needed
            const itemWidth = 96; // px
            const totalWidth = itemWidth * skills.length;
            currentOffset += slideStep;
            if (currentOffset >= totalWidth) {
                currentOffset = 0;
            }
            setOffset(currentOffset);
            animationFrame = setTimeout(slide, slideInterval);
        };

        animationFrame = setTimeout(slide, slideInterval);
        return () => clearTimeout(animationFrame);
        // eslint-disable-next-line
    }, [skills]);

    const handlePrev = () => {
        setSkillIndex((prev) => Math.max(prev - skillsPerPage, 0));
    };

    const handleNext = () => {
        setSkillIndex((prev) =>
            Math.min(prev + skillsPerPage, Math.max(skills.length - skillsPerPage, 0))
        );
    };

    return (
        <div className='flex flex-row justify-center min-h-screen overflow'>
            {/* Animated programming background */}
            <AnimatedCodeBackground />

            {/* <Navigation /> */}
            <Menu />
            <div className="relative flex flex-col gap-2 p-2 md:w-[80vw] w-[90vw]">
                {/* PROFILE */}
                <section id="profile">
                    <ProfileSection />
                    {/* SOCIALS and DOWNLOAD CV remain here */}
                    <div className='flex md:flex-row flex-col flex-1/7'>
                        {/* SOCIALS */}
                        <CustomCard className={'flex md:flex-row flex-col gap-2 items-center justify-around flex-3/4'}>
                            <span className='font-black text-4xl'>SOCIALS</span>
                            <div className='flex md:flex-row flex-col gap-2'>
                                <div className='flex flex-row gap-2'>
                                    <ButtonIcon icon={<FaFacebookF size={32}/>} onclick={null}/>
                                    <ButtonIcon icon={<SiFacebookgaming size={32}/>} onclick={null}/>
                                </div>
                                <div className='flex flex-row gap-2'>
                                    <ButtonIcon  icon={<FaTiktok size={32}/>} onclick={null} />
                                    <ButtonIcon  icon={<FaPhoneAlt size={32}/>} onclick={null} />
                                </div>
                            </div>
                        </CustomCard>
                        {/* DOWNLOAD RESUME */}
                        <CustomButton text={"DOWNLOAD CV"} onclick={null} className={'flex-1/4'} classText={'font-bold text-xl'}/>
                    </div>
                </section>

                {/* SKILLS */}
                <section id="skills" className='mt-16'>
                    <div className={'w-fit z-1 -mb-1 ml-6 gooey-label bg-brown-dark !pt-6'} >
                        <span className='text-center solid-shadow-title text-beige text-xl font-black'>WHAT I WORK WITH</span>
                    </div>
                    <CustomCard className={``}>
                        <SkillsCarousel />
                    </CustomCard>
                </section>

                {/* AWARDS & CERTIFICATES */}
                <CustomCard>
                    <section id="awards">
                        <h2>Awards & Certificates</h2>
                        {/* Awards & Certificates content */}
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                    </section>
                </CustomCard>
                <CustomCard>
                    <section id="projects">
                        <h2>Projects</h2>
                        {/* Projects content */}
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                    </section>
                </CustomCard>
                <CustomCard>
                    <section id="experiences">
                        <h2>Experiences</h2>
                        {/* Experiences content */}
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                    </section>
                </CustomCard>
                <CustomCard>
                    <section id="testimonials">
                        <h2>Testimonials</h2>
                        {/* Testimonials content */}
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                    </section>
                </CustomCard>
            </div>
        </div>
    );
}

export default Home;