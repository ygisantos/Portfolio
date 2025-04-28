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
import SkillSlider from '@/components/SkillSlider'; // Import a new component for the slider
// Add import for the animated background
import AnimatedCodeBackground from '@/components/AnimatedCodeBackground';
import SkillsCarousel from './Skills';
import ProfileSection from './Profile';
import PixelatedSlider from '@/components/PixelatedSlider'; // Import custom pixelated slider component

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
            <div className="relative flex flex-col gap-2 p-2 md:w-[80vw] w-[90vw]">
                {/* PROFILE */}
                <section id="profile">
                    <ProfileSection profile={profile}/>
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
                        <SkillsCarousel skills={skills}/>
                    </CustomCard>

                    {/* Grouped Skills */}
                    <div className='grid md:grid-cols-3 grid-cols-1 md:grid-rows-2 grid-rows-6 gap-2 mt-6'>
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
                        .map(([category, categorySkills]) => (
                            <CustomCard key={category}>
                                <span className='font-bold md:text-xl text-lg'>{category.toUpperCase()}</span>
                                <div className='flex flex-col gap-4 mt-2'>
                                    {categorySkills.map(skill => (
                                        <div key={skill.id} className='flex flex-row items-center gap-4'>
                                            <img
                                                src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skill.icon}/${skill.icon}-original.svg`}
                                                alt={skill.title}
                                                className="h-6 flex-1/10"
                                            />
                                            <span className='flex-5/10 font-medium'>{skill.title}</span>
                                            <span className='flex-1/10 font-medium'>{skill.proficiency}%</span>
                                            <PixelatedSlider value={skill.proficiency} className={`flex-4/10 w-full`}/>
                                        </div>
                                    ))}
                                </div>
                            </CustomCard>
                        ))}
                    </div>
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