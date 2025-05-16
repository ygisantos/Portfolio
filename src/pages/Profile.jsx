import { AgeCalculate } from '@/utils/Calculator';
import ButtonIcon from '@components/ButtonIcon';
import CustomCard from '@components/CustomCard';
import { FaGithub, FaPhoneAlt } from "react-icons/fa";
import { FaLinkedinIn, FaLocationDot } from "react-icons/fa6";
import { IoCalendar } from "react-icons/io5";
import { MdEmail, MdOutlineWork } from "react-icons/md";

export default function ProfileSection({profile}) {
    return (
        <div className='flex md:flex-row flex-col gap-4'>
            {/* PROFILE PICTURE AND SOME INFO */}
            <CustomCard className='flex-1/3 animate-fadeIn hover:shadow-xl transition-all duration-300'>
                <div className="relative overflow-hidden rounded-lg mb-4">
                    <img 
                        className='w-full h-auto object-cover transition-transform duration-700 hover:scale-105' 
                        src={profile?.image_url || 'https://static.vecteezy.com/system/resources/thumbnails/036/594/092/small_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'}
                        alt="Profile"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brown-dark/80 to-transparent p-3">
                        <h3 className="text-beige font-bold text-lg">{profile?.role || "Developer"}</h3>
                    </div>
                </div>
                <div className='flex flex-col mt-2'>
                    <div className='flex flex-row items-center gap-3 p-2 rounded-md hover:bg-brown-light/10 transition-colors duration-200'>
                        <MdEmail className='text-brown-dark text-xl'/>
                        <span className='text-sm font-medium'>{profile?.socials?.email || 'loading...'}</span>
                    </div>
                    <div className='flex flex-row items-center gap-3 p-2 rounded-md hover:bg-brown-light/10 transition-colors duration-200'>
                        <FaPhoneAlt className='text-brown-dark text-xl'/>
                        <span className='text-sm font-medium'>{profile?.socials?.phone || 'loading...'}</span>
                    </div>
                    <div className='flex flex-row items-center gap-3 p-2 rounded-md hover:bg-brown-light/10 transition-colors duration-200'>
                        <MdOutlineWork className='text-brown-dark text-xl'/>
                        <span className='text-sm font-medium'>{profile?.availability || 'loading...'}</span>
                    </div>
                    <div className='flex flex-row items-center gap-3 p-2 rounded-md hover:bg-brown-light/10 transition-colors duration-200'>
                        <FaLocationDot className='text-brown-dark text-xl'/>
                        <span className='text-sm font-medium'>{profile?.location || 'loading...'}</span>
                    </div>
                    <div className='flex flex-row items-center gap-3 p-2 rounded-md hover:bg-brown-light/10 transition-colors duration-200'>
                        <IoCalendar className='text-brown-dark text-xl'/>
                        <span className='text-sm font-medium'>{AgeCalculate()} Years Old</span>
                    </div>
                </div>
            </CustomCard>

            <div className='flex flex-col flex-2/3 gap-3'>
                {/* DESCRIPTION */}
                <CustomCard className={'flex flex-col flex-6/7 animate-fadeIn delay-100 hover:shadow-xl transition-all duration-300'}>
                    <div className='flex flex-col md:flex-row justify-between gap-4'>
                        <div className='flex flex-col'>
                            <h1 className='!font-bold md:!text-4xl text-2xl text-brown-dark tracking-wide'>
                                YGI MARTIN B. SANTOS
                            </h1>
                            <div className="h-1 bg-brown-dark w-3/4 mt-2 rounded-full"></div>
                        </div>
                        <div className='flex flex-row md:items-start items-start gap-2'>
                            <ButtonIcon 
                                className='text-xl'
                                icon={<MdEmail/>} 
                                onclick={() => window.open(profile?.socials?.email ? `mailto:${profile.socials.email}` : '#', '_blank')}
                                tooltip="Email"
                            />
                            <ButtonIcon 
                                className='text-xl'
                                icon={<FaLinkedinIn/>} 
                                onclick={() => window.open(profile?.socials?.linkedin || '#', '_blank')}
                                tooltip="LinkedIn"
                            />
                            <ButtonIcon 
                                className='text-xl'
                                icon={<FaGithub/>} 
                                onclick={() => window.open(profile?.socials?.github || '#', '_blank')}
                                tooltip="GitHub"
                            />
                        </div>
                    </div>
                    <div className='mt-6 text-justify'>
                        <p className='text-lg leading-relaxed'>{profile?.description || 'loading...'}</p>
                    </div>
                </CustomCard>
                {/* SOCIALS and DOWNLOAD CV remain in Home.jsx */}
            </div>
        </div>
    );
}
