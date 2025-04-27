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
import {getAboutMe} from '@api/Api';
import { useEffect } from 'react';
import { useState } from 'react';
import { RxDividerHorizontal } from "react-icons/rx";
import { IoCalendar } from "react-icons/io5";
import Menu from '@/components/Menu';
function Home() {
    const [profile,setProfile] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const about_me = JSON.parse(await getAboutMe());
            setProfile(about_me);
        }

        fetchData();
    }, []);
    return (
        <div>
            {/* <Navigation /> */}
            <Menu />
            <div className="flex flex-col gap-2 p-2">
                <div id='profile' className='flex flex-row'>
                    {/* PROFILE PICTURE AND SOME INFO */}
                    <CustomCard className='flex-1/3'>
                        <img 
                            className='rounded-xs'
                            src='https://static.vecteezy.com/system/resources/thumbnails/036/594/092/small_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'/>
                        <div className='flex flex-col gap-1 mt-2'>
                            <div className='flex flex-row items-center gap-1'>
                                <MdOutlineWork className='flex-1/8'/>
                                <span className='flex-7/8 text-sm capitalize'>{profile?.availability || 'loading...'}</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <FaLocationDot className='flex-1/8'/>
                                <span className='flex-7/8 text-sm capitalize'>{profile?.location || 'loading...'}</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <IoCalendar className='flex-1/8'/>
                                <span className='flex-7/8 text-sm capitalize'>{AgeCalculate()} Years Old</span>
                            </div>
                            {
                                /* DI MUNA IPAKITA */
                                false && 
                                <div className='flex flex-row items-center gap-1'>
                                <MdDescription />
                                <span className='capitalize'>{profile?.short_description || 'loading...'}</span>
                            </div>
                            }
                        </div>
                    </CustomCard>

                    <div className='flex flex-col flex-2/3'>
                        {/* DESCRIPTION */}
                        <CustomCard className={'flex flex-col flex-6/7'}>
                            <div className='flex flex-row justify-between'>
                                <div className='flex flex-row items-center gap-1'>
                                    <span className='font-black md:!text-4xl text-lg'>YGI MARTIN B. SANTOS</span>
                                </div>
                                
                                <div className='flex flex-row md:items-center items-start md:gap-2 gap-0.5'>
                                    <ButtonIcon 
                                        className='md:text-2xl text-xs'
                                        icon={<MdEmail/>} 
                                        onclick={() => window.open(profile?.socials?.email ? `mailto:${profile.socials.email}` : '#', '_blank')} />
                                    <ButtonIcon 
                                        className='md:text-2xl text-xs'
                                        icon={<FaLinkedinIn/>} 
                                        onclick={() => window.open(profile?.socials?.linkedin || '#', '_blank')} />
                                    <ButtonIcon 
                                        className='md:text-2xl text-xs'
                                        icon={<FaGithub/>} 
                                        onclick={() => window.open(profile?.socials?.github || '#', '_blank')} />
                                </div>
                            </div>
                            <div className='mt-2 text-justify'>
                                <span className='text-xl font-semibold opacity-60'>{profile?.description || 'loading...'}</span>
                            </div>
                        </CustomCard>

                        <div className='flex md:flex-row flex-col flex-1/7'>
                            {/* SOCIALS */}
                            <CustomCard className={'flex md:flex-row flex-col gap-2 items-center justify-around flex-3/4'}>
                                <span className='font-bold text-4xl'>SOCIALS</span>
                                <div className='flex md:flex-row flex-col gap-2'>
                                    <div className='flex flex-row gap-2'>
                                        <ButtonIcon 
                                            icon={<FaFacebookF size={32}/>}
                                            onclick={null}
                                        />
                                        <ButtonIcon 
                                            icon={<SiFacebookgaming size={32}/>}
                                            onclick={null}
                                        />
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <ButtonIcon 
                                            icon={<FaTiktok size={32}/>}
                                            onclick={null}
                                        />
                                        <ButtonIcon 
                                            icon={<FaPhoneAlt size={32}/>}
                                            onclick={null}
                                        />
                                    </div>
                                </div>
                            </CustomCard>

                            {/* DOWNLOAD RESUME */}
                            <CustomButton text={"DOWNLOAD CV"} onclick={null} className={'flex-1/4'} classText={'font-bold text-xl'}/>
                        </div>
                    </div>
                </div>
                <CustomCard>
                    <section id="skills">
                        <h2>Skills</h2>
                        {/* Skills content */}
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                        <h1 className='h-[74px]'>TEST CONTENT</h1>
                    </section>
                </CustomCard>
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