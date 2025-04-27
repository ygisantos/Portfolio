import CustomCard from '@components/CustomCard';
import ButtonIcon from '@components/ButtonIcon';
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineWork } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { IoCalendar } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { AgeCalculate } from '@/utils/Calculator';
import { getAboutMe } from '@api/Api';
import { useEffect, useState } from 'react';

export default function ProfileSection() {
    const [profile, setProfile] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const about_me = JSON.parse(await getAboutMe());
            setProfile(about_me);
        };
        fetchData();
    }, []);

    return (
        <div className='flex md:flex-row flex-col'>
            {/* PROFILE PICTURE AND SOME INFO */}
            <CustomCard className='flex-1/3'>
                <img className='rounded-xs' src='https://static.vecteezy.com/system/resources/thumbnails/036/594/092/small_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'/>
                <div className='flex flex-col gap-1 mt-2'>
                    <div className='flex flex-row items-center gap-1'>
                        <MdEmail className='flex-1/8'/>
                        <span className='flex-7/8 text-sm capitalize'>{profile?.socials?.email || 'loading...'}</span>
                    </div>
                    <div className='flex flex-row items-center gap-1'>
                        <FaPhoneAlt className='flex-1/8'/>
                        <span className='flex-7/8 text-sm capitalize'>{profile?.socials?.phone || 'loading...'}</span>
                    </div>
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
                {/* SOCIALS and DOWNLOAD CV remain in Home.jsx */}
            </div>
        </div>
    );
}
