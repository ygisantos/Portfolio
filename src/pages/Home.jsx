import CustomCard from '@components/CustomCard';
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
            <Navigation />
            <div className="content">
                <div id='profile' className='flex flex-row'>
                    <CustomCard className='flex-1/3'>
                        <img 
                            className='rounded-xs'
                            src='https://static.vecteezy.com/system/resources/thumbnails/036/594/092/small_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'/>
                        <div className='flex flex-col'>
                            <div className='flex flex-row items-center gap-1'>
                                <MdOutlineWork />
                                <span className='capitalize'>{profile?.availability || 'loading...'}</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <FaLocationDot />
                                <span className='capitalize'>{profile?.location || 'loading...'}</span>
                            </div>
                            <div className='flex flex-row items-center gap-1'>
                                <IoCalendar  />
                                <span className='capitalize'>{AgeCalculate()} Years Old</span>
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
                        <CustomCard className={'flex flex-col flex-3/4'}>
                            <div className='flex flex-row justify-between'>
                                <div className='flex flex-row items-center gap-1'>
                                    <span className='font-black md:!text-4xl text-lg'>YGI MARTIN B. SANTOS</span>
                                </div>
                                
                                <div className='flex flex-row md:items-center items-start md:gap-2 gap-0.5'>
                                    <ButtonIcon 
                                        icon={<MdEmail className='md:text-2xl text-xs' color='#f8f4e1'/>} 
                                        onclick={() => window.open(profile?.socials?.email ? `mailto:${profile.socials.email}` : '#', '_blank')} />
                                    <ButtonIcon 
                                        icon={<FaLinkedinIn className='md:text-2xl text-xs'color='#f8f4e1'/>} 
                                        onclick={() => window.open(profile?.socials?.linkedin || '#', '_blank')} />
                                    <ButtonIcon 
                                        icon={<FaGithub className='md:text-2xl text-xs' color='#f8f4e1'/>} 
                                        onclick={() => window.open(profile?.socials?.github || '#', '_blank')} />
                                </div>
                            </div>
                            <div className='mt-2 text-justify'>
                                <span>{profile?.description || 'loading...'}</span>
                            </div>
                        </CustomCard>
                        <CustomCard className={'flex flex-col flex-1/4'}>

                        </CustomCard>
                    </div>
                </div>
                <CustomCard>
                    <section id="skills">
                        <h2>Skills</h2>
                        {/* Skills content */}
                    </section>
                </CustomCard>
                <CustomCard>
                    <section id="awards">
                        <h2>Awards & Certificates</h2>
                        {/* Awards & Certificates content */}
                    </section>
                </CustomCard>
                <CustomCard>
                    <section id="projects">
                        <h2>Projects</h2>
                        {/* Projects content */}
                    </section>
                </CustomCard>
                <CustomCard>
                    <section id="experiences">
                        <h2>Experiences</h2>
                        {/* Experiences content */}
                    </section>
                </CustomCard>
                <CustomCard>
                    <section id="testimonials">
                        <h2>Testimonials</h2>
                        {/* Testimonials content */}
                    </section>
                </CustomCard>
            </div>
        </div>
    );
}

export default Home;