import React, { useEffect, useState } from 'react';
import {ICONS} from '../constants/Icons';
import {
  fetchProfileData,
  fetchCollectionData,
  fetchAndUpdateStats,
  deleteDocument,
  updateProfile,
  updateCollection,

  // temp testing
  getAboutMe, getAllCertificates, getCertificateById,
  getAllExperiences, getExperienceById, getVisits,
  getAllSkills, getAllTestimonials, getAllWorks,
  getWorkById
} from '@api/Api';

export default function PortfolioPage() {
  const [data, setData] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [activeTab, setActiveTab] = useState('basic'); // Track the active tab

  useEffect(() => {
    const test = async () => {
      const about = await getAboutMe();
      const cert = await getAllCertificates();
      const certByID = await getCertificateById("cmiCHH9FVraFxGkze2Ez");
      const exp = await getAllExperiences();
      const expByID = await getExperienceById("9V6XkyoTwJ0P7Omt5w8h");
      const visit = await getVisits();
      const skills = await getAllSkills();
      const testimonial = await getAllTestimonials();
      const works = await getAllWorks();
      const workByID = await getWorkById("twjgYdU5DrLgWGYNvO79");

      console.log("about me: " + about);
      console.log("certificates: " + cert);
      console.log("certificate by id: " + certByID);
      console.log("experiences: " + exp);
      console.log("experiences by id: " + expByID);
      console.log("visits: " + visit);
      console.log("skills: " + skills);
      console.log("testimonial: " + testimonial);
      console.log("works: " + works);
      console.log("work by id: " + workByID);
    }

    test();
    const fetchData = async () => {
      const profile = await fetchProfileData();
      const collections = [
        'certificates', 'awards', 'skills', 'experiences',
        'works', 'testimonials', 'comments'
      ];
      
      const collectionData = await fetchCollectionData(collections);
      const visits = await fetchAndUpdateStats();

      const fetchedData = {
        ...profile,
        ...collectionData,
        visits,
        socials: profile.socials || {}
      };

      setData(fetchedData);
      setEditableData(fetchedData.socials || {});
    };

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const deleteItem = async (collectionName, id) => {
    if (!id) return; // Don't delete if no ID exists
    try {
      await deleteDocument(collectionName, id);
      setData((prevData) => ({
        ...prevData,
        [collectionName]: prevData[collectionName].filter((item) => item.id !== id)
      }));
      alert(`${collectionName} item deleted successfully!`);
    } catch (error) {
      console.error(`Error deleting ${collectionName}:`, error.message);
      alert(`Failed to delete ${collectionName}. Please try again.`);
    }
  };

  const updateData = async () => {
    try {
      // Update profile data
      await updateProfile({
        short_description: editableData.short_description || '',
        description: editableData.description || '',
        location: editableData.location || '',
        availability: editableData.availability || '',
        resume_url: editableData.resume_url || '',
        socials: { 
          github: editableData.github || '',
          linkedin: editableData.linkedin || '',
          facebook: editableData.facebook || '',
          facebook_page: editableData.facebook_page || '',
          phone: editableData.phone || '',
          email: editableData.email || ''
        }
      });

      // Update collections
      const collections = ['certificates', 'skills', 'experiences', 'works', 'testimonials', 'comments'];
      for (const colName of collections) {
        if (data[colName]) {
          await updateCollection(colName, data[colName]);
        }
      }

      alert('All data updated successfully!');
    } catch (error) {
      console.error('Error updating data:', error.message);
      alert('Failed to update data. Please check your inputs and try again.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <section className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
            <div className="mb-4">
              <label className="block font-medium mb-1">Short Description:</label>
              <textarea
                value={editableData.short_description || ''}
                onChange={(e) => handleInputChange('short_description', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Description:</label>
              <textarea
                value={editableData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Location:</label>
              <input
                type="text"
                value={editableData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Availability:</label>
              <select
                value={editableData.availability || ''}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select Availability</option>
                <option value="Open for job">Open for job</option>
                <option value="Hired">Hired</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Resume (Direct Download Link):</label>
              <input
                type="text"
                value={editableData.resume_url || ''}
                onChange={(e) => handleInputChange('resume_url', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <a
              href={getData(data.resume_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Download Resume
            </a>
            </div>
          </section>
        );
      case 'certificates':
        return (
          <section className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Certificates</h2>
            {data.certificates?.map((cert, index) => (
              <div key={index} className="mb-4 border-b border-gray-200 pb-4">
                <label className="block font-medium mb-1">Type:</label>
                <select
                  value={cert.type || 'Certificate'}
                  onChange={(e) => {
                    const updated = [...data.certificates];
                    updated[index].type = e.target.value;
                    setData({ ...data, certificates: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                >
                  <option value="Certificate">Certificate</option>
                  <option value="Award">Award</option>
                </select>
                <label className="block font-medium mb-1">Title:</label>
                <input
                  type="text"
                  value={cert.title || ''}
                  onChange={(e) => {
                    const updated = [...data.certificates];
                    updated[index].title = e.target.value;
                    setData({ ...data, certificates: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">Description:</label>
                <textarea
                  value={cert.description || ''}
                  onChange={(e) => {
                    const updated = [...data.certificates];
                    updated[index].description = e.target.value;
                    setData({ ...data, certificates: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">Date:</label>
                <input
                  type="date"
                  value={cert.date || ''}
                  onChange={(e) => {
                    const updated = [...data.certificates];
                    updated[index].date = e.target.value;
                    setData({ ...data, certificates: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const base64 = await convertToBase64(file);
                      const updated = [...data.certificates];
                      updated[index].image = base64;
                      setData({ ...data, certificates: updated });
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {cert.image && (
                  <img
                    src={cert.image}
                    alt="Certificate Preview"
                    className="mt-2 w-32 h-32 object-cover border"
                  />
                )}
                {cert.id && (
                  <button
                    onClick={() => deleteItem('certificates', cert.id)}
                    className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => {
                const updated = [...(data.certificates || []), { type: 'Certificate', title: '', description: '', date: '', image: '' }];
                setData({ ...data, certificates: updated });
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Add Certificate
            </button>
          </section>
        );
      case 'contact':
        return (
          <section className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <div className="space-y-4">
              {['github', 'linkedin', 'facebook', 'facebook_page', 'phone', 'email'].map((field) => (
                <div key={field}>
                  <label className="block font-medium capitalize">{field.replace('_', ' ')}:</label>
                  <input
                    type="text"
                    value={editableData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        return (
          <section className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Skills</h2>
            {data.skills?.map((skill, index) => (
              <div key={index} className="mb-4 border-b border-gray-200 pb-4">
                <label className="block font-medium mb-1">Title:</label>
                <input
                  type="text"
                  value={skill.title || ''}
                  onChange={(e) => {
                    const updated = [...data.skills];
                    updated[index].title = e.target.value;
                    setData({ ...data, skills: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">Proficiency:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skill.proficiency || 0}
                  onChange={(e) => {
                    const updated = [...data.skills];
                    updated[index].proficiency = e.target.value;
                    setData({ ...data, skills: updated });
                  }}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">Proficiency: {skill.proficiency || 0}%</p>
                <label className="block font-medium mb-1">Icon:</label>
                <select
                  value={skill.icon || ''}
                  onChange={(e) => {
                    const updated = [...data.skills];
                    updated[index].icon = e.target.value;
                    setData({ ...data, skills: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select an Icon</option>
                  {ICONS.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                {skill.icon && (
                  <img
                    src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skill.icon}/${skill.icon}-original.svg`}
                    alt={`${skill.icon} icon`}
                    className="mt-2 w-16 h-16 object-cover border"
                  />
                )}
                {skill.id && (
                  <button
                    onClick={() => deleteItem('skills', skill.id)}
                    className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => {
                const updated = [...(data.skills || []), { title: '', proficiency: 0, icon: '' }];
                setData({ ...data, skills: updated });
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Add Skill
            </button>
          </section>
        );
      case 'experiences':
        return (
          <section className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Experiences</h2>
            {data.experiences?.map((exp, index) => (
              <div key={index} className="mb-4 border-b border-gray-200 pb-4">
                <label className="block font-medium mb-1">Name:</label>
                <input
                  type="text"
                  value={exp.name || ''}
                  onChange={(e) => {
                    const updated = [...data.experiences];
                    updated[index].name = e.target.value;
                    setData({ ...data, experiences: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">From:</label>
                <input
                  type="date"
                  value={exp.from || ''}
                  onChange={(e) => {
                    const updated = [...data.experiences];
                    updated[index].from = e.target.value;
                    setData({ ...data, experiences: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">To:</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    value={exp.to || ''} 
                    disabled={exp.still_doing}
                    onChange={(e) => {
                      const updated = [...data.experiences];
                      updated[index].to = e.target.value;
                      setData({ ...data, experiences: updated });
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 mb-2"
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={exp.still_doing || false}
                      onChange={(e) => {
                        const updated = [...data.experiences];
                        updated[index].still_doing = e.target.checked;
                        setData({ ...data, experiences: updated });
                      }}
                    /> Still doing
                  </label>
                </div>
                <label className="block font-medium mb-1">Description:</label>
                <textarea
                  value={exp.description || ''}
                  onChange={(e) => {
                    const updated = [...data.experiences];
                    updated[index].description = e.target.value;
                    setData({ ...data, experiences: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">What I Learned:</label>
                <textarea
                  value={exp.learned || ''}
                  onChange={(e) => {
                    const updated = [...data.experiences];
                    updated[index].learned = e.target.value;
                    setData({ ...data, experiences: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">Job Description/Role:</label>
                <textarea
                  value={exp.role || ''}
                  onChange={(e) => {
                    const updated = [...data.experiences];
                    updated[index].role = e.target.value;
                    setData({ ...data, experiences: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                {exp.id && (
                  <button
                    onClick={() => deleteItem('experiences', exp.id)}
                    className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => {
                const updated = [...(data.experiences || []), { name: '', from: '', to: '', description: '', learned: '', role: '', still_doing: false }];
                setData({ ...data, experiences: updated });
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Add Experience
            </button>
          </section>
        );
      case 'works':
        return (
          <section className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Works</h2>
            {data.works?.map((work, index) => (
              <div key={index} className="mb-4 border-b border-gray-200 pb-4">
                <label className="block font-medium mb-1">Title:</label>
                <input
                  type="text"
                  value={work.title || ''}
                  onChange={(e) => {
                    const updated = [...data.works];
                    updated[index].title = e.target.value;
                    setData({ ...data, works: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">Description:</label>
                <textarea
                  value={work.description || ''}
                  onChange={(e) => {
                    const updated = [...data.works];
                    updated[index].description = e.target.value;
                    setData({ ...data, works: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">Year:</label>
                <input
                  type="number"
                  value={work.year || ''}
                  onChange={(e) => {
                    const updated = [...data.works];
                    updated[index].year = e.target.value;
                    setData({ ...data, works: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">Duration:</label>
                <input
                  type="text"
                  value={work.duration || ''}
                  onChange={(e) => {
                    const updated = [...data.works];
                    updated[index].duration = e.target.value;
                    setData({ ...data, works: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">Category:</label>
                <select
                  value={work.category || ''}
                  onChange={(e) => {
                    const updated = [...data.works];
                    updated[index].category = e.target.value;
                    setData({ ...data, works: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                >
                  <option value="">Select Category</option>
                  <option value="Work">Work</option>
                  <option value="Commission">Commission</option>
                  <option value="School">School</option>
                  <option value="Side Project">Side Project</option>
                </select>
                <label className="block font-medium mb-1">Video Link (YouTube/Vimeo Embed URL):</label>
                <input
                  type="text"
                  placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
                  value={work.video_link || ''}
                  onChange={(e) => {
                    const updated = [...data.works];
                    updated[index].video_link = e.target.value;
                    setData({ ...data, works: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                {work.video_link && (
                  <div className="mb-2">
                    <iframe
                      width="100%"
                      height="315"
                      src={work.video_link}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="mb-2"
                    ></iframe>
                  </div>
                )}
                <label className="block font-medium mb-1">Languages/Technologies:</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {work.languages?.map((lang, langIndex) => (
                    <div key={langIndex} className="flex items-center bg-gray-100 p-2 rounded">
                      <img
                        src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${lang}/${lang}-original.svg`}
                        alt={lang}
                        className="w-6 h-6 mr-2"
                      />
                      <span>{lang}</span>
                      <button
                        onClick={() => {
                          const updated = [...data.works];
                          updated[index].languages = work.languages.filter((_, i) => i !== langIndex);
                          setData({ ...data, works: updated });
                        }}
                        className="ml-2 text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mb-2">
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    onChange={(e) => {
                      if (e.target.value) {
                        const updated = [...data.works];
                        updated[index].languages = [...(work.languages || []), e.target.value];
                        setData({ ...data, works: updated });
                        e.target.value = ''; // Reset select
                      }
                    }}
                  >
                    <option value="">Select Technology</option>
                    {ICONS.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <label className="block font-medium mb-1">Images:</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    const base64Images = await Promise.all(
                      files.map(file => convertToBase64(file))
                    );
                    const updated = [...data.works];
                    updated[index].images = [...(updated[index].images || []), ...base64Images];
                    setData({ ...data, works: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {work.images?.map((img, imgIndex) => (
                    <div key={imgIndex} className="relative">
                      <img src={img} alt={`Work ${imgIndex + 1}`} className="w-full h-32 object-cover" />
                      <button
                        onClick={() => {
                          const updated = [...data.works];
                          updated[index].images = work.images.filter((_, i) => i !== imgIndex);
                          setData({ ...data, works: updated });
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {work.id && (
                  <button
                    onClick={() => deleteItem('works', work.id)}
                    className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => {
                const updated = [...(data.works || []), {
                  title: '',
                  description: '',
                  year: '',
                  duration: '',
                  category: '',
                  video_link: '',
                  languages: [],
                  images: []
                }];
                setData({ ...data, works: updated });
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Add Work
            </button>
          </section>
        );
      case 'testimonials':
        return (
          <section className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Testimonials</h2>
            {data.testimonials?.map((testimonial, index) => (
              <div key={index} className="mb-4 border-b border-gray-200 pb-4">
                <label className="block font-medium mb-1">Company Name:</label>
                <input
                  type="text"
                  value={testimonial.company || ''}
                  onChange={(e) => {
                    const updated = [...data.testimonials];
                    updated[index].company = e.target.value;
                    setData({ ...data, testimonials: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">Name:</label>
                <input
                  type="text"
                  value={testimonial.name || ''}
                  onChange={(e) => {
                    const updated = [...data.testimonials];
                    updated[index].name = e.target.value;
                    setData({ ...data, testimonials: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">Role:</label>
                <input
                  type="text"
                  value={testimonial.role || ''}
                  onChange={(e) => {
                    const updated = [...data.testimonials];
                    updated[index].role = e.target.value;
                    setData({ ...data, testimonials: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">Comment:</label>
                <textarea
                  value={testimonial.comment || ''}
                  onChange={(e) => {
                    const updated = [...data.testimonials];
                    updated[index].comment = e.target.value;
                    setData({ ...data, testimonials: updated });
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <label className="block font-medium mb-1">Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const base64 = await convertToBase64(file);
                      const updated = [...data.testimonials];
                      updated[index].image = base64;
                      setData({ ...data, testimonials: updated });
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt="Profile"
                    className="mt-2 w-32 h-32 object-cover"
                  />
                )}
                {testimonial.id && (
                  <button
                    onClick={() => deleteItem('testimonials', testimonial.id)}
                    className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => {
                const updated = [...(data.testimonials || []), { company: '', name: '', role: '', comment: '', image: '' }];
                setData({ ...data, testimonials: updated });
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Add Testimonial
            </button>
          </section>
        );
      default:
        return null;
    }
  };

  if (!data) return <div>Loading...</div>;

  const getData = (val) => val ?? 'N/A';

  // Helper function to convert image file to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Portfolio</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p><strong>Intro:</strong> {getData(data.short_description)}</p>
        <p><strong>Description:</strong> {getData(data.description)}</p>
        <p><strong>Location:</strong> {getData(data.location)}</p>
        <p><strong>Availability:</strong> {getData(data.availability)}</p>
        <a
          href={getData(data.resume_url)}
          download
          className="text-blue-500 underline"
        >
          Download Resume
        </a>
      </div>

      <p className="mt-6 text-gray-600">Total Visits: {getData(data.visits)}</p>

      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
        <div className="mb-6">
          <button
            onClick={() => setActiveTab('basic')}
            className={`mr-2 px-4 py-2 rounded-md ${activeTab === 'basic' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`mr-2 px-4 py-2 rounded-md ${activeTab === 'certificates' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Certificates
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`mr-2 px-4 py-2 rounded-md ${activeTab === 'contact' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Contact
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`mr-2 px-4 py-2 rounded-md ${activeTab === 'skills' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveTab('experiences')}
            className={`mr-2 px-4 py-2 rounded-md ${activeTab === 'experiences' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Experiences
          </button>
          <button
            onClick={() => setActiveTab('works')}
            className={`mr-2 px-4 py-2 rounded-md ${activeTab === 'works' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Works
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`mr-2 px-4 py-2 rounded-md ${activeTab === 'testimonials' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Testimonials
          </button>
        </div>
        {renderTabContent()}
        <button
          onClick={updateData}
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
}