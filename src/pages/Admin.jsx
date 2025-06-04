import React, { useEffect, useState } from 'react';
import { ICONS } from '../constants/Icons';
import {
  getAboutMe,
  getAllCertificates,
  getAllExperiences,
  getAllSkills,
  getAllTestimonials,
  getAllWorks,
  getVisits,
  deleteDocument,
  updateProfile,
  updateCollection,
  updateWork,
  loginWithEmailAndPassword,
  logout,
  updateWorkImages,
  getWorkImages,
  deleteWorkImages,
  deleteWorkImage,
  debugImageCounts,
  testImageOperations,
} from '@api/Api';
import LanguageIcon from '@components/LanguageIcon';

// Helper function to sort works by priority
const sortWorksByPriority = (works) => {
  return [...works].sort((a, b) => {
    if (!a.priority && !b.priority) return 0;
    if (!a.priority) return 1;
    if (!b.priority) return -1;
    return parseInt(a.priority) - parseInt(b.priority);
  });
};

// Helper components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const SuccessAlert = ({ message, onClose }) => (
  <div 
    className="border px-4 py-3 rounded relative mb-4" 
    role="alert"
    style={{
      backgroundColor: '#dcfce7',
      borderColor: '#16a34a',
      color: '#166534'
    }}
  >
    <span className="block sm:inline">{message}</span>
    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={onClose}>
      <svg 
        className="fill-current h-6 w-6" 
        role="button" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20"
        style={{ color: '#16a34a' }}
      >
        <title>Close</title>
        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
      </svg>
    </span>
  </div>
);

const ErrorAlert = ({ message, onClose }) => (
  <div 
    className="border px-4 py-3 rounded relative mb-4" 
    role="alert"
    style={{
      backgroundColor: '#fef2f2',
      borderColor: '#ef4444',
      color: '#dc2626'
    }}
  >
    <span className="block sm:inline">{message}</span>
    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={onClose}>
      <svg 
        className="fill-current h-6 w-6" 
        role="button" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20"
        style={{ color: '#ef4444' }}
      >
        <title>Close</title>
        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
      </svg>
    </span>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className="mr-2 px-4 py-2 rounded-md transition-colors"
    style={active ? 
      { backgroundColor: '#3b82f6', color: 'white', border: 'none' } : 
      { backgroundColor: '#e5e7eb', color: '#374151', border: 'none' }
    }
  >
    {children}
  </button>
);

const PrimaryButton = ({ onClick, children, className = '', disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`py-2 px-4 rounded-md transition-colors ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
    style={{
      backgroundColor: disabled ? '#93c5fd' : '#3b82f6',
      color: 'white',
      border: 'none'
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.target.style.backgroundColor = '#2563eb';
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled) {
        e.target.style.backgroundColor = '#3b82f6';
      }
    }}
  >
    {children}
  </button>
);

const DangerButton = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 rounded-md transition-colors ${className}`}
    style={{
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none'
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = '#dc2626';
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = '#ef4444';
    }}
  >
    {children}
  </button>
);

// Main component
export default function PortfolioAdmin() {
  const [data, setData] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [activeTab, setActiveTab] = useState('basic');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Individual section loading states
  const [savingStates, setSavingStates] = useState({
    basicInfo: false,
    contact: false,
    skills: false,
    experiences: false,
    certificates: false,
    testimonials: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const profile = JSON.parse(await getAboutMe());
        const certificates = JSON.parse(await getAllCertificates());
        const experiences = JSON.parse(await getAllExperiences());
        const skills = JSON.parse(await getAllSkills());
        const testimonials = JSON.parse(await getAllTestimonials());
        const works = JSON.parse(await getAllWorks());
        const visits = JSON.parse(await getVisits());

        const fetchedData = {
          ...profile,
          certificates,
          experiences,
          skills,
          testimonials,
          works,
          visits,
        };

        setData(fetchedData);
        setEditableData(fetchedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  // Function to ensure data is properly sorted any time we load it
  useEffect(() => {
    if (data?.works?.length > 0) {
      const sortedWorks = sortWorksByPriority(data.works);
      if (JSON.stringify(sortedWorks) !== JSON.stringify(data.works)) {
        setData(prev => ({ ...prev, works: sortedWorks }));
      }
    }
  }, [data?.works]);

  const handleInputChange = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parentField, field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value,
      },
    }));
  };

  const deleteItem = async (collectionName, id) => {
    if (!id) {
      setError('Cannot delete item: No ID provided');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // For works, provide specific feedback about subcollection deletion
      if (collectionName === 'works') {
        setSuccess('Deleting project and its images...');
      }
      
      await deleteDocument(collectionName, id);
      
      setData((prevData) => ({
        ...prevData,
        [collectionName]: prevData[collectionName].filter((item) => item.id !== id),
      }));
      
      if (collectionName === 'works') {
        setSuccess('Project and all its images deleted successfully!');
      } else {
        setSuccess(`${collectionName} item deleted successfully!`);
      }
    } catch (error) {
      console.error(`Error deleting ${collectionName}:`, error);
      setError(`Failed to delete ${collectionName}. Please try again. Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };  const updateData = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      
      // Update profile data
      await updateProfile({
        short_description: editableData.short_description || '',
        description: editableData.description || '',
        location: editableData.location || '',
        availability: editableData.availability || '',
        resume_url: editableData.resume_url || '',
        image: editableData.image || '',
        image_url: editableData.image || '', // Also set the image_url for compatibility with Profile.jsx
        socials: {
          github: editableData.socials?.github || '',
          linkedin: editableData.socials?.linkedin || '',
          facebook: editableData.socials?.facebook || '',
          facebook_page: editableData.socials?.facebook_page || '',
          phone: editableData.socials?.phone || '',
          email: editableData.socials?.email || '',
          tiktok: editableData.socials?.tiktok || '',
        },
      });

      // Update collections
      const collections = ['certificates', 'skills', 'experiences', 'works', 'testimonials'];
      const updateResults = [];
      
      for (const colName of collections) {
        if (data[colName]) {
          const result = await updateCollection(colName, data[colName]);
          updateResults.push({ collection: colName, result });
        }
      }

      // Check for any image-related issues
      const worksResult = updateResults.find(r => r.collection === 'works')?.result;
      if (worksResult && worksResult.details) {
        const imageIssues = worksResult.details.filter(d => d.result.imageError);
        if (imageIssues.length > 0) {
          const issueDetails = imageIssues.map(issue => 
            `${issue.item}: ${issue.result.savedCount}/${issue.result.totalCount} images saved`
          ).join('; ');
          setError(`Some images failed to save: ${issueDetails}`);
          return;
        }
        
        // Show success with image details
        const imageDetails = worksResult.details
          .filter(d => d.hasImages && d.result.success)
          .map(d => `${d.item}: ${d.result.imagesSaved} images`)
          .join('; ');
        
        if (imageDetails) {
          setSuccess(`All data updated successfully! Images saved: ${imageDetails}`);
        } else {
          setSuccess('All data updated successfully!');
        }
      } else {
        setSuccess('All data updated successfully!');
      }

      // Refresh the page after a short delay to allow the user to see the success message
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error updating data:', error);
      setError('Failed to update data. Please check your inputs and try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const sanitizeLanguages = (languages) => {
    if (!languages) return [];
    
    return languages.map(lang => {
      if (lang?.name && lang?.icon) return lang;
      const langName = typeof lang === 'string' ? lang : lang?.name;
      if (!langName) return null;
      
      return {
        name: langName,
        icon: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${langName}/${langName}-original.svg`
      };
    }).filter(Boolean);
  };

  const convertToBase64 = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        // Set canvas size
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress the image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        console.log(`Image compressed: ${file.name} - Original: ~${(file.size / 1024).toFixed(1)}KB, Compressed: ~${(compressedBase64.length * 0.75 / 1024).toFixed(1)}KB`);
        
        resolve(compressedBase64);
      };
      
      img.onerror = (error) => reject(error);
      
      // Create object URL for the image
      img.src = URL.createObjectURL(file);
    });
  };

  const handleLogin = async () => {
    const { email, password } = loginData;
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await loginWithEmailAndPassword(email, password);
      if (result.success) {
        setIsLoggedIn(true);
        setSuccess('Login successful!');
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const result = await logout();
      if (result.success) {
        setIsLoggedIn(false);
        setSuccess('Logged out successfully!');
      }
    } catch (error) {
      setError(error.message || 'Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Individual save functions
  const saveBasicInfo = async () => {
    try {
      setSavingStates(prev => ({ ...prev, basicInfo: true }));
      setError(null);
      
      await updateProfile({
        short_description: editableData.short_description || '',
        description: editableData.description || '',
        location: editableData.location || '',
        availability: editableData.availability || '',
        resume_url: editableData.resume_url || '',
        image: editableData.image || '',
        image_url: editableData.image || '',
      });

      setSuccess('Basic information saved successfully!');
    } catch (error) {
      console.error('Error saving basic info:', error);
      setError('Failed to save basic information. Please try again.');
    } finally {
      setSavingStates(prev => ({ ...prev, basicInfo: false }));
    }
  };

  const saveContact = async () => {
    try {
      setSavingStates(prev => ({ ...prev, contact: true }));
      setError(null);
      
      await updateProfile({
        socials: {
          github: editableData.socials?.github || '',
          linkedin: editableData.socials?.linkedin || '',
          facebook: editableData.socials?.facebook || '',
          facebook_page: editableData.socials?.facebook_page || '',
          phone: editableData.socials?.phone || '',
          email: editableData.socials?.email || '',
          tiktok: editableData.socials?.tiktok || '',
        },
      });

      setSuccess('Contact information saved successfully!');
    } catch (error) {
      console.error('Error saving contact info:', error);
      setError('Failed to save contact information. Please try again.');
    } finally {
      setSavingStates(prev => ({ ...prev, contact: false }));
    }
  };

  const saveSkills = async () => {
    try {
      setSavingStates(prev => ({ ...prev, skills: true }));
      setError(null);
      
      if (data.skills && data.skills.length > 0) {
        const result = await updateCollection('skills', data.skills);
        
        if (result.success) {
          setSuccess('Skills saved successfully!');
        } else {
          setError(`Failed to save skills: ${result.error}`);
        }
      } else {
        setSuccess('No skills to save.');
      }
    } catch (error) {
      console.error('Error saving skills:', error);
      setError('Failed to save skills. Please try again.');
    } finally {
      setSavingStates(prev => ({ ...prev, skills: false }));
    }
  };

  const saveExperiences = async () => {
    try {
      setSavingStates(prev => ({ ...prev, experiences: true }));
      setError(null);
      
      if (data.experiences && data.experiences.length > 0) {
        const result = await updateCollection('experiences', data.experiences);
        
        if (result.success) {
          setSuccess('Experiences saved successfully!');
        } else {
          setError(`Failed to save experiences: ${result.error}`);
        }
      } else {
        setSuccess('No experiences to save.');
      }
    } catch (error) {
      console.error('Error saving experiences:', error);
      setError('Failed to save experiences. Please try again.');
    } finally {
      setSavingStates(prev => ({ ...prev, experiences: false }));
    }
  };

  const saveCertificates = async () => {
    try {
      setSavingStates(prev => ({ ...prev, certificates: true }));
      setError(null);
      
      if (data.certificates && data.certificates.length > 0) {
        const result = await updateCollection('certificates', data.certificates);
        
        if (result.success) {
          setSuccess('Certificates saved successfully!');
        } else {
          setError(`Failed to save certificates: ${result.error}`);
        }
      } else {
        setSuccess('No certificates to save.');
      }
    } catch (error) {
      console.error('Error saving certificates:', error);
      setError('Failed to save certificates. Please try again.');
    } finally {
      setSavingStates(prev => ({ ...prev, certificates: false }));
    }
  };

  const saveTestimonials = async () => {
    try {
      setSavingStates(prev => ({ ...prev, testimonials: true }));
      setError(null);
      
      if (data.testimonials && data.testimonials.length > 0) {
        const result = await updateCollection('testimonials', data.testimonials);
        
        if (result.success) {
          setSuccess('Testimonials saved successfully!');
        } else {
          setError(`Failed to save testimonials: ${result.error}`);
        }
      } else {
        setSuccess('No testimonials to save.');
      }
    } catch (error) {
      console.error('Error saving testimonials:', error);
      setError('Failed to save testimonials. Please try again.');
    } finally {
      setSavingStates(prev => ({ ...prev, testimonials: false }));
    }
  };

  const renderTabContent = () => {
    if (isLoading) return <LoadingSpinner />;
    
    switch (activeTab) {
      case 'basic':
        return (
          <BasicInfoTab 
            data={data} 
            editableData={editableData} 
            setData={setData} 
            handleInputChange={handleInputChange} 
            convertToBase64={convertToBase64}
            saveBasicInfo={saveBasicInfo}
            savingStates={savingStates}
          />
        );
      case 'certificates':
        return (
          <CertificatesTab 
            data={data} 
            setData={setData} 
            deleteItem={deleteItem} 
            convertToBase64={convertToBase64} 
            saveCertificates={saveCertificates}
            savingStates={savingStates}
          />
        );
      case 'contact':
        return (
          <ContactTab 
            editableData={editableData} 
            handleNestedInputChange={handleNestedInputChange} 
            saveContact={saveContact}
            savingStates={savingStates}
          />
        );
      case 'skills':
        return (
          <SkillsTab 
            data={data} 
            setData={setData} 
            deleteItem={deleteItem} 
            saveSkills={saveSkills}
            savingStates={savingStates}
          />
        );
      case 'experiences':
        return (
          <ExperiencesTab 
            data={data} 
            setData={setData} 
            deleteItem={deleteItem} 
            saveExperiences={saveExperiences}
            savingStates={savingStates}
          />
        );
      case 'works':
        return (
          <WorksTab 
            data={data} 
            setData={setData} 
            deleteItem={deleteItem} 
            convertToBase64={convertToBase64} 
            sanitizeLanguages={sanitizeLanguages} 
          />
        );
      case 'testimonials':
        return (
          <TestimonialsTab 
            data={data} 
            setData={setData} 
            deleteItem={deleteItem} 
            convertToBase64={convertToBase64} 
            saveTestimonials={saveTestimonials}
            savingStates={savingStates}
          />
        );
      default:
        return null;
    }
  };

  const getData = (val) => val ?? 'N/A';

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Portfolio Admin Login</h1>
          
          {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
          {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            
            <PrimaryButton 
              onClick={handleLogin} 
              disabled={isLoading}
              className="w-full flex justify-center"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8" style={{ color: 'black' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Portfolio Admin Dashboard</h1>
          <DangerButton onClick={handleLogout} disabled={isLoading}>
            {isLoading ? 'Logging out...' : 'Logout'}
          </DangerButton>
        </div>

        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Total Visits</h3>
              <p className="text-2xl font-bold">{getData(data?.visits)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">Certificates</h3>
              <p className="text-2xl font-bold">{data?.certificates?.length || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-800">Projects</h3>
              <p className="text-2xl font-bold">{data?.works?.length || 0}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800">Testimonials</h3>
              <p className="text-2xl font-bold">{data?.testimonials?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <TabButton active={activeTab === 'basic'} onClick={() => setActiveTab('basic')}>
              Basic Info
            </TabButton>
            <TabButton active={activeTab === 'contact'} onClick={() => setActiveTab('contact')}>
              Contact
            </TabButton>
            <TabButton active={activeTab === 'skills'} onClick={() => setActiveTab('skills')}>
              Skills
            </TabButton>
            <TabButton active={activeTab === 'experiences'} onClick={() => setActiveTab('experiences')}>
              Experiences
            </TabButton>
            <TabButton active={activeTab === 'works'} onClick={() => setActiveTab('works')}>
              Projects
            </TabButton>
            <TabButton active={activeTab === 'certificates'} onClick={() => setActiveTab('certificates')}>
              Certificates
            </TabButton>
            <TabButton active={activeTab === 'testimonials'} onClick={() => setActiveTab('testimonials')}>
              Testimonials
            </TabButton>
          </div>

          {renderTabContent()}

          <div className="mt-6 flex justify-end gap-2">
            <button 
              onClick={async () => {
                const results = await debugImageCounts();
                console.log('Debug results:', results);
                alert(`Image count check complete. See console for details. Total works: ${results.length}`);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Debug Image Counts
            </button>
            <button 
              onClick={async () => {
                if (data.works && data.works.length > 0) {
                  const workWithImages = data.works.find(work => work.images && work.images.length > 0);
                  if (workWithImages) {
                    const results = await testImageOperations(workWithImages.id);
                    console.log('Test results:', results);
                    alert(`Test complete for "${workWithImages.title}". Images: ${results.imageCount}. See console for details.`);
                  } else {
                    alert('No works with images found to test.');
                  }
                } else {
                  alert('No works found to test.');
                }
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Test Image Ops
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Components
const BasicInfoTab = ({ data, editableData, setData, handleInputChange, convertToBase64, saveBasicInfo, savingStates }) => (
  <section className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Basic Information</h2>
      <PrimaryButton 
        onClick={saveBasicInfo} 
        disabled={savingStates.basicInfo}
        className="w-auto"
      >
        {savingStates.basicInfo ? 'Saving...' : 'Save Basic Info'}
      </PrimaryButton>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Short Description:</label>
          <textarea
            value={editableData.short_description || ''}
            onChange={(e) => handleInputChange('short_description', e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block font-medium mb-1">Description:</label>
          <textarea
            value={editableData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={5}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Location:</label>
            <input
              type="text"
              value={editableData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Availability:</label>
            <select
              value={editableData.availability || ''}
              onChange={(e) => handleInputChange('availability', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Availability</option>
              <option value="Open for job">Open for job</option>
              <option value="Hired">Hired</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block font-medium mb-1">Resume (Direct Download Link):</label>
          <input
            type="text"
            value={editableData.resume_url || ''}
            onChange={(e) => handleInputChange('resume_url', e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
          />
          {editableData.resume_url && (
            <a
              href={editableData.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              View Resume
            </a>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Profile Image:</label>
          <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
            {editableData.image ? (
              <div className="mb-4 relative group">
                <img 
                  src={editableData.image}
                  alt="Profile"
                  className="w-48 h-48 object-cover rounded-full border-4 border-blue-500 shadow-lg"
                />
                <button
                  onClick={() => handleInputChange('image', '')}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="mb-4 w-48 h-48 rounded-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-center px-4">No profile image uploaded</p>
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const base64 = await convertToBase64(file);
                  handleInputChange('image', base64);
                }
              }}
              className="w-full border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Upload a profile image that will be displayed on your portfolio page
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ContactTab = ({ editableData, handleNestedInputChange, saveContact, savingStates }) => (
  <section className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Contact Information</h2>
      <PrimaryButton 
        onClick={saveContact} 
        disabled={savingStates.contact}
        className="w-auto"
      >
        {savingStates.contact ? 'Saving...' : 'Save Contact Info'}
      </PrimaryButton>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {['email', 'phone'].map((field) => (
        <div key={field}>
          <label className="block font-medium capitalize mb-1">{field}:</label>
          <input
            type={field === 'email' ? 'email' : 'tel'}
            value={editableData.socials?.[field] || ''}
            onChange={(e) => handleNestedInputChange('socials', field, e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      ))}
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {['github', 'linkedin', 'facebook', 'facebook_page', 'tiktok'].map((field) => (
        <div key={field}>
          <label className="block font-medium capitalize mb-1">
            {field.replace('_', ' ')}:
          </label>
          <input
            type="url"
            value={editableData.socials?.[field] || ''}
            onChange={(e) => handleNestedInputChange('socials', field, e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`https://${field}.com/username`}
          />
        </div>
      ))}
    </div>
  </section>
);

const CertificatesTab = ({ data, setData, deleteItem, convertToBase64, saveCertificates, savingStates }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    if (currentIndex < (data.certificates?.length || 0) - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Certificates</h2>
        <div className="flex gap-2">
          <PrimaryButton
            onClick={() => {
              const updated = [...(data.certificates || []), {
                type: 'Certificate',
                title: '',
                description: '',
                date: '',
                image: ''
              }];
              setData(prev => ({ ...prev, certificates: updated }));
              setCurrentIndex(updated.length - 1);
            }}
          >
            Add Certificate
          </PrimaryButton>
          <PrimaryButton 
            onClick={saveCertificates} 
            disabled={savingStates.certificates}
            className="w-auto"
          >
            {savingStates.certificates ? 'Saving...' : 'Save Certificates'}
          </PrimaryButton>
        </div>
      </div>

      {data.certificates?.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: currentIndex === 0 ? '#d1d5db' : '#3b82f6',
                color: 'white',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== 0) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== 0) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              Previous
            </button>
            <span className="text-sm">
              {currentIndex + 1} of {data.certificates.length}
            </span>
            <button
              onClick={goToNext}
              disabled={currentIndex === data.certificates.length - 1}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: currentIndex === data.certificates.length - 1 ? '#d1d5db' : '#3b82f6',
                color: 'white',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== data.certificates.length - 1) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== data.certificates.length - 1) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              Next
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            {data.certificates[currentIndex] && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-medium mb-1">Type:</label>
                    <select
                      value={data.certificates[currentIndex].type || 'Certificate'}
                      onChange={(e) => {
                        const updated = [...data.certificates];
                        updated[currentIndex].type = e.target.value;
                        setData(prev => ({ ...prev, certificates: updated }));
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Certificate">Certificate</option>
                      <option value="Award">Award</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">Title:</label>
                    <input
                      type="text"
                      value={data.certificates[currentIndex].title || ''}
                      onChange={(e) => {
                        const updated = [...data.certificates];
                        updated[currentIndex].title = e.target.value;
                        setData(prev => ({ ...prev, certificates: updated }));
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block font-medium mb-1">Description:</label>
                  <textarea
                    value={data.certificates[currentIndex].description || ''}
                    onChange={(e) => {
                      const updated = [...data.certificates];
                      updated[currentIndex].description = e.target.value;
                      setData(prev => ({ ...prev, certificates: updated }));
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-medium mb-1">Date:</label>
                    <input
                      type="date"
                      value={data.certificates[currentIndex].date || ''}
                      onChange={(e) => {
                        const updated = [...data.certificates];
                        updated[currentIndex].date = e.target.value;
                        setData(prev => ({ ...prev, certificates: updated }));
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">Image:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const base64 = await convertToBase64(file);
                          const updated = [...data.certificates];
                          updated[currentIndex].image = base64;
                          setData(prev => ({ ...prev, certificates: updated }));
                        }
                      }}
                      className="w-full border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {data.certificates[currentIndex].image && (
                  <div className="mb-4">
                    <img
                      src={data.certificates[currentIndex].image}
                      alt="Certificate Preview"
                      className="max-w-full h-auto max-h-64 object-contain border rounded"
                    />
                  </div>
                )}
                
                <div className="flex justify-end">
                  <DangerButton
                    onClick={() => {
                      deleteItem('certificates', data.certificates[currentIndex].id);
                      if (currentIndex === data.certificates.length - 1) {
                        setCurrentIndex(Math.max(0, currentIndex - 1));
                      }
                    }}
                    className="ml-2"
                  >
                    Delete
                  </DangerButton>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No certificates added yet.</p>
      )}
    </section>
  );
};

const SkillsTab = ({ data, setData, deleteItem, saveSkills, savingStates }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    if (currentIndex < (data.skills?.length || 0) - 1) setCurrentIndex(currentIndex + 1);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <div className="flex gap-2">
          <PrimaryButton
            onClick={() => {
              const updated = [...(data.skills || []), {
                title: '',
                proficiency: 0,
                icon: '',
                category: ''
              }];
              setData(prev => ({ ...prev, skills: updated }));
              setCurrentIndex(updated.length - 1);
            }}
          >
            Add Skill
          </PrimaryButton>
          <PrimaryButton 
            onClick={saveSkills} 
            disabled={savingStates.skills}
            className="w-auto"
          >
            {savingStates.skills ? 'Saving...' : 'Save Skills'}
          </PrimaryButton>
        </div>
      </div>

      {data.skills?.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: currentIndex === 0 ? '#d1d5db' : '#3b82f6',
                color: 'white',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== 0) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== 0) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              Previous
            </button>
            <span className="text-sm">
              {currentIndex + 1} of {data.skills.length}
            </span>
            <button
              onClick={goToNext}
              disabled={currentIndex === data.skills.length - 1}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: currentIndex === data.skills.length - 1 ? '#d1d5db' : '#3b82f6',
                color: 'white',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== data.skills.length - 1) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== data.skills.length - 1) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              Next
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            {data.skills[currentIndex] && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-medium mb-1">Title:</label>
                    <input
                      type="text"
                      value={data.skills[currentIndex].title || ''}
                      onChange={(e) => {
                        const updated = [...data.skills];
                        updated[currentIndex].title = e.target.value;
                        setData(prev => ({ ...prev, skills: updated }));
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">Category:</label>
                    <select
                      value={data.skills[currentIndex].category || ''}
                      onChange={(e) => {
                        const updated = [...data.skills];
                        updated[currentIndex].category = e.target.value;
                        setData(prev => ({ ...prev, skills: updated }));
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Category</option>
                      <option value="Window Application Development">Window Application Development</option>
                      <option value="Game Development">Game Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Database & Backend">Database & Backend</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block font-medium mb-1">Proficiency: {data.skills[currentIndex].proficiency || 0}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={data.skills[currentIndex].proficiency || 0}
                    onChange={(e) => {
                      const updated = [...data.skills];
                      updated[currentIndex].proficiency = e.target.value;
                      setData(prev => ({ ...prev, skills: updated }));
                    }}
                    className="w-full"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-medium mb-1">Icon:</label>
                    <select
                      value={data.skills[currentIndex].icon || ''}
                      onChange={(e) => {
                        const updated = [...data.skills];
                        updated[currentIndex].icon = e.target.value;
                        setData(prev => ({ ...prev, skills: updated }));
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select an Icon</option>
                      {ICONS.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    {data.skills[currentIndex].icon && (
                      <img
                        src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${data.skills[currentIndex].icon}/${data.skills[currentIndex].icon}-original.svg`}
                        alt={`${data.skills[currentIndex].icon} icon`}
                        className="w-16 h-16 object-contain"
                      />
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <DangerButton
                    onClick={() => {
                      deleteItem('skills', data.skills[currentIndex].id);
                      if (currentIndex === data.skills.length - 1) {
                        setCurrentIndex(Math.max(0, currentIndex - 1));
                      }
                    }}
                    className="ml-2"
                  >
                    Delete
                  </DangerButton>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No skills added yet.</p>
      )}
    </section>
  );
};

const ExperiencesTab = ({ data, setData, deleteItem, saveExperiences, savingStates }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    if (currentIndex < (data.experiences?.length || 0) - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Experiences</h2>
        <div className="flex gap-2">
          <PrimaryButton
            onClick={() => {
              const updated = [...(data.experiences || []), {
                name: '',
                from: '',
                to: '',
                still_doing: false,
                description: '',
                learned: '',
                role: ''
              }];
              setData(prev => ({ ...prev, experiences: updated }));
              setCurrentIndex(updated.length - 1);
            }}
          >
            Add Experience
          </PrimaryButton>
          <PrimaryButton 
            onClick={saveExperiences} 
            disabled={savingStates.experiences}
            className="w-auto"
          >
            {savingStates.experiences ? 'Saving...' : 'Save Experiences'}
          </PrimaryButton>
        </div>
      </div>
      
      {data.experiences?.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: currentIndex === 0 ? '#d1d5db' : '#3b82f6',
                color: 'white',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== 0) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== 0) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              Previous
            </button>
            <span className="text-sm">
              {currentIndex + 1} of {data.experiences.length}
            </span>
            <button
              onClick={goToNext}
              disabled={currentIndex === data.experiences.length - 1}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: currentIndex === data.experiences.length - 1 ? '#d1d5db' : '#3b82f6',
                color: 'white',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== data.experiences.length - 1) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== data.experiences.length - 1) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              Next
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            {data.experiences[currentIndex] && (
              <>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Name:</label>
                  <input
                    type="text"
                    value={data.experiences[currentIndex].name || ''}
                    onChange={(e) => {
                      const updated = [...data.experiences];
                      updated[currentIndex].name = e.target.value;
                      setData(prev => ({ ...prev, experiences: updated }));
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-medium mb-1">From:</label>
                    <input
                      type="date"
                      value={data.experiences[currentIndex].from || ''}
                      onChange={(e) => {
                        const updated = [...data.experiences];
                        updated[currentIndex].from = e.target.value;
                        setData(prev => ({ ...prev, experiences: updated }));
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">To:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={data.experiences[currentIndex].to || ''}
                        disabled={data.experiences[currentIndex].still_doing}
                        onChange={(e) => {
                          const updated = [...data.experiences];
                          updated[currentIndex].to = e.target.value;
                          setData(prev => ({ ...prev, experiences: updated }));
                        }}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      />
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={data.experiences[currentIndex].still_doing || false}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[currentIndex].still_doing = e.target.checked;
                            setData(prev => ({ ...prev, experiences: updated }));
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        Still Doing
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block font-medium mb-1">Description:</label>
                  <textarea
                    value={data.experiences[currentIndex].description || ''}
                    onChange={(e) => {
                      const updated = [...data.experiences];
                      updated[currentIndex].description = e.target.value;
                      setData(prev => ({ ...prev, experiences: updated }));
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block font-medium mb-1">What I Learned:</label>
                  <textarea
                    value={data.experiences[currentIndex].learned || ''}
                    onChange={(e) => {
                      const updated = [...data.experiences];
                      updated[currentIndex].learned = e.target.value;
                      setData(prev => ({ ...prev, experiences: updated }));
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block font-medium mb-1">Job Description/Role:</label>
                  <textarea
                    value={data.experiences[currentIndex].role || ''}
                    onChange={(e) => {
                      const updated = [...data.experiences];
                      updated[currentIndex].role = e.target.value;
                      setData(prev => ({ ...prev, experiences: updated }));
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end">
                  <DangerButton
                    onClick={() => {
                      deleteItem('experiences', data.experiences[currentIndex].id);
                      if (currentIndex === data.experiences.length - 1) {
                        setCurrentIndex(Math.max(0, currentIndex - 1));
                      }
                    }}
                    className="ml-2"
                  >
                    Delete
                  </DangerButton>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No experiences added yet.</p>
      )}
    </section>
  );
};

const WorksTab = ({ data, setData, deleteItem, convertToBase64, sanitizeLanguages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const goToNext = () => {
    if (currentIndex < (data.works?.length || 0) - 1) setCurrentIndex(currentIndex + 1);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // Function to move a project's priority up (decrease priority number)
  const movePriorityUp = () => {
    const currentWork = data.works[currentIndex];
    const currentPriority = parseInt(currentWork.priority);
    
    if (!currentPriority || currentPriority <= 1) return;
    const targetPriority = currentPriority - 1;
    const targetIndex = data.works.findIndex(
      work => work.priority === targetPriority.toString()
    );

    const updatedWorks = [...data.works];
    if (targetIndex !== -1) updatedWorks[targetIndex].priority = currentPriority.toString(); 
    updatedWorks[currentIndex].priority = targetPriority.toString();
    
    const sortedWorks = sortWorksByPriority(updatedWorks);
    setData(prev => ({ ...prev, works: sortedWorks }));
  };
  
  const movePriorityDown = () => {
    const currentWork = data.works[currentIndex];
    const currentPriority = parseInt(currentWork.priority);
    
    if (!currentPriority) return;
    const maxPriority = data.works.length;
    if (currentPriority >= maxPriority) return;
    const targetPriority = currentPriority + 1;
    const targetIndex = data.works.findIndex(
      work => work.priority === targetPriority.toString()
    );
    
    const updatedWorks = [...data.works];
    
    if (targetIndex !== -1) updatedWorks[targetIndex].priority = currentPriority.toString();
    
    updatedWorks[currentIndex].priority = targetPriority.toString();
    const sortedWorks = sortWorksByPriority(updatedWorks);
    setData(prev => ({ ...prev, works: sortedWorks }));
  };

  const fixPriorityNumbering = () => {
    const worksWithPriority = data.works.filter(work => work.priority);
    const worksWithoutPriority = data.works.filter(work => !work.priority);
    
    const updatedWorks = [
      ...worksWithPriority
        .sort((a, b) => parseInt(a.priority) - parseInt(b.priority))
        .map((work, index) => ({
          ...work,
          priority: (index + 1).toString()
        })),
      ...worksWithoutPriority
    ];
    
    setData(prev => ({ ...prev, works: updatedWorks }));
  };

  // Function to save only the current project
  const saveCurrentProject = async () => {
    const currentWork = data.works[currentIndex];
    
    if (!currentWork.title.trim()) {
      setError('Project title is required to save.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('Saving project...');

      const result = await updateWork(currentWork);

      if (result.success) {
        // Update the local data with the saved work ID if it's a new project
        if (!currentWork.id && result.id) {
          const updatedWorks = [...data.works];
          updatedWorks[currentIndex] = { ...currentWork, id: result.id };
          setData(prev => ({ ...prev, works: updatedWorks }));
        }

        if (result.imagesSaved && result.totalImages) {
          setSuccess(`Project "${currentWork.title}" saved successfully! ${result.imagesSaved}/${result.totalImages} images saved.`);
        } else {
          setSuccess(`Project "${currentWork.title}" saved successfully!`);
        }
      } else {
        if (result.imageError) {
          setError(`Project saved but some images failed: ${result.error}. Saved ${result.savedCount}/${result.totalCount} images.`);
        } else {
          setError(`Failed to save project: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error saving current project:', error);
      setError(`Failed to save project: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <PrimaryButton
          onClick={() => {
            const newProject = {
              title: '',
              category: '',
              description: '',
              year: '',
              duration: '',
              priority: null,
              video_link: '',
              languages: [],
              images: [],
            };
            const updated = [...(data.works || []), newProject];
            const sortedWorks = sortWorksByPriority(updated);
            setData(prev => ({ ...prev, works: sortedWorks }));
            setCurrentIndex(sortedWorks.length - 1);
          }}
        >
          Add Project
        </PrimaryButton>
      </div>

      {data.works?.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: currentIndex === 0 ? '#d1d5db' : '#3b82f6',
                color: 'white',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== 0) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== 0) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              Previous
            </button>
            <span className="text-sm">
              {currentIndex + 1} of {data.works.length}
            </span>
            <button
              onClick={goToNext}
              disabled={currentIndex === data.works.length - 1}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: currentIndex === data.works.length - 1 ? '#d1d5db' : '#3b82f6',
                color: 'white',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== data.works.length - 1) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== data.works.length - 1) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              Next
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            {success && (
              <SuccessAlert 
                message={success} 
                onClose={() => setSuccess('')} 
              />
            )}
            {error && (
              <ErrorAlert 
                message={error} 
                onClose={() => setError('')} 
              />
            )}
            {data.works[currentIndex] && (
              <>
                <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-sm text-blue-800">Project Priority</h3>
                  <div className="flex items-center gap-2 mt-1 overflow-x-auto pb-2">
                    {Array.from({ length: Math.min(data.works.length, 20) }, (_, i) => i + 1).map(num => {
                      const workWithThisPriority = data.works.find(w => w.priority === num.toString());
                      const isCurrentWork = data.works[currentIndex].priority === num.toString();
                      const workIndex = workWithThisPriority ? 
                        data.works.findIndex(w => w.priority === num.toString()) : -1;
                      
                      return (
                        <div 
                          key={num}
                          title={workWithThisPriority 
                            ? `${workWithThisPriority.title} (Priority ${num})` 
                            : `Priority ${num} - Unassigned (available)`
                          }
                          onClick={() => {
                            if (workIndex !== -1) {
                              setCurrentIndex(workIndex);
                            }
                          }}
                          className={`
                            w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                            ${isCurrentWork 
                              ? 'bg-blue-600 text-white border-2 border-blue-300' 
                              : workWithThisPriority 
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer' 
                                : 'bg-gray-50 text-gray-400 border border-dashed border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                            }
                            transition-all duration-200 shrink-0
                          `}
                        >
                          {num}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-600">
                        {data.works[currentIndex].priority 
                          ? `Priority ${data.works[currentIndex].priority}`
                          : 'No priority set'
                        }
                      </p>
                      <p className="text-xs text-gray-400">
                        (Lower numbers appear first)
                      </p>
                    </div>
                    <button
                      onClick={fixPriorityNumbering}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                      title="Fix any gaps in priority numbering while maintaining order"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
                      </svg>
                      Fix Order
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-medium mb-1">Title:</label>
                    <input
                      type="text"
                      value={data.works[currentIndex].title || ''}
                      onChange={(e) => {
                        const updated = [...data.works];
                        updated[currentIndex].title = e.target.value;
                        setData(prev => ({ ...prev, works: updated }));
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">Category:</label>
                    <select
                      value={data.works[currentIndex].category || ''}
                      onChange={(e) => {
                        const updated = [...data.works];
                        updated[currentIndex].category = e.target.value;
                        setData(prev => ({ ...prev, works: updated }));
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Category</option>
                      <option value="Work">Work</option>
                      <option value="Commission">Commission</option>
                      <option value="School">School</option>
                      <option value="Side Project">Side Project</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block font-medium mb-1">Description:</label>
                  <textarea
                    value={data.works[currentIndex].description || ''}
                    onChange={(e) => {
                      const updated = [...data.works];
                      updated[currentIndex].description = e.target.value;
                      setData(prev => ({ ...prev, works: updated }));
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block font-medium mb-1">Year:</label>
                    <input
                      type="number"
                      value={data.works[currentIndex].year || ''}
                      onChange={(e) => {
                        const updated = [...data.works];
                        updated[currentIndex].year = e.target.value;
                        setData(prev => ({ ...prev, works: updated }));
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Priority Number:</label>
                    <div className="flex space-x-2">
                      <select
                        value={data.works[currentIndex].priority || ''}
                        onChange={(e) => {
                          const newPriority = e.target.value;
                          const updated = [...data.works];
                          updated[currentIndex].priority = newPriority;
                          
                          // Sort the array by priority after updating
                          const sortedWorks = sortWorksByPriority(updated);
                          
                          setData(prev => ({ ...prev, works: sortedWorks }));
                        }}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Priority</option>
                        {Array.from({ length: Math.max(10, (data.works?.length || 0) + 3) }, (_, i) => i + 1).map(num => {
                          // Check if this priority is already used by another project
                          const isUsed = data.works?.some((work, idx) => 
                            idx !== currentIndex && work.priority === num.toString()
                          );
                          
                          return (
                            <option 
                              key={num} 
                              value={num}
                              disabled={isUsed}
                            >
                              {num}{isUsed ? ' (already assigned)' : ''}
                            </option>
                          );
                        })}
                      </select>
                      <div className="flex space-x-1">
                        <button
                          onClick={movePriorityUp}
                          disabled={!data.works[currentIndex].priority || data.works[currentIndex].priority === '1'}
                          className={`px-2 py-1 rounded flex items-center justify-center ${
                            !data.works[currentIndex].priority || data.works[currentIndex].priority === '1' 
                              ? '!bg-gray-300 !cursor-not-allowed' 
                              : '!bg-blue-500 hover:!bg-blue-600 !text-white'
                          }`}
                          title="Move Up in Priority"
                        >
                          <span className="text-lg">↑</span>
                        </button>
                        <button
                          onClick={movePriorityDown}
                          disabled={
                            !data.works[currentIndex].priority || 
                            parseInt(data.works[currentIndex].priority) >= data.works.length
                          }
                          className={`px-2 py-1 rounded flex items-center justify-center ${
                            !data.works[currentIndex].priority || 
                            parseInt(data.works[currentIndex].priority) >= data.works.length
                              ? '!bg-gray-300 !cursor-not-allowed' 
                              : '!bg-blue-500 hover:!bg-blue-600 !text-white'
                          }`}
                          title="Move Down in Priority"
                        >
                          <span className="text-lg">↓</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Use the arrows to reorder projects (lower number will appear first)
                    </p>
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">Duration:</label>
                    <input
                      type="text"
                      value={data.works[currentIndex].duration || ''}
                      onChange={(e) => {
                        const updated = [...data.works];
                        updated[currentIndex].duration = e.target.value;
                        setData(prev => ({ ...prev, works: updated }));
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block font-medium mb-1">Video Link (YouTube/Vimeo Embed URL):</label>
                  <input
                    type="text"
                    placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
                    value={data.works[currentIndex].video_link || ''}
                    onChange={(e) => {
                      const updated = [...data.works];
                      updated[currentIndex].video_link = e.target.value;
                      setData(prev => ({ ...prev, works: updated }));
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {data.works[currentIndex].video_link && (
                    <div className="mt-2">
                      <iframe
                        width="100%"
                        height="315"
                        src={data.works[currentIndex].video_link}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded"
                      ></iframe>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block font-medium mb-1">Technologies:</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {sanitizeLanguages(data.works[currentIndex].languages).map((lang, langIndex) => (
                      <div key={langIndex} className="flex items-center bg-gray-100 p-2 rounded">
                        <LanguageIcon icon={lang.icon} name={lang.name} />
                        <span className="ml-2">{lang.name}</span>
                        <button
                          onClick={() => {
                            const updated = [...data.works];
                            updated[currentIndex].languages = data.works[currentIndex].languages.filter((_, i) => i !== langIndex);
                            setData(prev => ({ ...prev, works: updated }));
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => {
                        if (e.target.value) {
                          const selectedLanguage = e.target.value;
                          const updated = [...data.works];
                          updated[currentIndex].languages = [
                            ...(data.works[currentIndex].languages || []),
                            {
                              name: selectedLanguage,
                              icon: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${selectedLanguage}/${selectedLanguage}-original.svg`
                            }
                          ];
                          setData(prev => ({ ...prev, works: updated }));
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">Select Technology</option>
                      {ICONS.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block font-medium mb-1">Images:</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      if (files.length === 0) return;
                      
                      setIsLoading(true);
                      setSuccess(`Processing ${files.length} image(s)...`);
                      
                      try {
                        const base64Images = await Promise.all(
                          files.map(file => convertToBase64(file))
                        );
                        const updated = [...data.works];
                        updated[currentIndex].images = [...(updated[currentIndex].images || []), ...base64Images];
                        setData(prev => ({ ...prev, works: updated }));
                        
                        if (files.length > 10) {
                          setSuccess(`${files.length} image(s) added! Note: Large batches will be saved in groups of 5 to avoid database limits. Use "Save Project" to save this project or "Save All Changes" to save everything.`);
                        } else {
                          setSuccess(`${files.length} image(s) added successfully! Use "Save Project" to save this project or "Save All Changes" to save everything.`);
                        }
                      } catch (error) {
                        setError('Failed to process images. Please try again.');
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Images are stored efficiently in subcollections. Large batches (10+) are uploaded in groups of 5 to prevent database limits.
                    Use "Save Project" below to save just this project quickly, or "Save All Changes" to save all changes at once.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {data.works[currentIndex].images?.map((img, imgIndex) => (
                      <div key={imgIndex} className="relative group">
                        <img
                          src={img}
                          alt={`Work ${imgIndex + 1}`}
                          className="w-full h-32 object-cover rounded border"
                        />
                        <button
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              
                              // If the work has an ID (saved to database), delete from subcollection
                              if (data.works[currentIndex].id) {
                                const result = await deleteWorkImage(data.works[currentIndex].id, imgIndex);
                                if (result.success) {
                                  // Update local state to reflect the deletion
                                  const updated = [...data.works];
                                  updated[currentIndex].images = data.works[currentIndex].images.filter((_, i) => i !== imgIndex);
                                  setData(prev => ({ ...prev, works: updated }));
                                  setSuccess(`Image deleted successfully! ${result.remainingCount} images remaining.`);
                                } else {
                                  throw new Error(result.error || 'Failed to delete image');
                                }
                              } else {
                                // For new projects not yet saved, just update local state
                                const updated = [...data.works];
                                updated[currentIndex].images = data.works[currentIndex].images.filter((_, i) => i !== imgIndex);
                                setData(prev => ({ ...prev, works: updated }));
                                setSuccess('Image removed from new project!');
                              }
                            } catch (error) {
                              console.error('Error deleting image:', error);
                              setError(`Failed to delete image: ${error.message}`);
                              // Reload data to restore original state on error
                              try {
                                const refreshedData = await getAllWorks();
                                setData(prev => ({ ...prev, works: refreshedData }));
                              } catch (refreshError) {
                                console.error('Error refreshing data:', refreshError);
                              }
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={saveCurrentProject}
                    disabled={isLoading || !data.works[currentIndex]?.title?.trim()}
                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                      isLoading || !data.works[currentIndex]?.title?.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                    }`}
                    title="Save only this project (faster than saving all projects)"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      '💾 Save Project'
                    )}
                  </button>
                  
                  <DangerButton
                    onClick={() => {
                      deleteItem('works', data.works[currentIndex].id);
                      if (currentIndex === data.works.length - 1) {
                        setCurrentIndex(Math.max(0, currentIndex - 1));
                      }
                    }}
                    className="ml-2"
                  >
                    Delete
                  </DangerButton>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No projects added yet.</p>
      )}
    </section>
  );
};

const TestimonialsTab = ({ data, setData, deleteItem, convertToBase64, saveTestimonials, savingStates }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    if (currentIndex < (data.testimonials?.length || 0) - 1) setCurrentIndex(currentIndex + 1);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Testimonials</h2>
        <div className="flex gap-2">
          <PrimaryButton
            onClick={() => {
              const updated = [...(data.testimonials || []), {
                company: '',
                name: '',
                role: '',
                comment: '',
                image: ''
              }];
              setData(prev => ({ ...prev, testimonials: updated }));
              setCurrentIndex(updated.length - 1);
            }}
          >
            Add Testimonial
          </PrimaryButton>
          <PrimaryButton 
            onClick={saveTestimonials} 
            disabled={savingStates.testimonials}
            className="w-auto"
          >
            {savingStates.testimonials ? 'Saving...' : 'Save Testimonials'}
          </PrimaryButton>
        </div>
      </div>

      {data.testimonials?.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: currentIndex === 0 ? '#d1d5db' : '#3b82f6',
                color: 'white',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== 0) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== 0) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              Previous
            </button>
            <span className="text-sm">
              {currentIndex + 1} of {data.testimonials.length}
            </span>
            <button
              onClick={goToNext}
              disabled={currentIndex === data.testimonials.length - 1}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: currentIndex === data.testimonials.length - 1 ? '#d1d5db' : '#3b82f6',
                color: 'white',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== data.testimonials.length - 1) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== data.testimonials.length - 1) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              Next
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            {data.testimonials[currentIndex] && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-medium mb-1">Company Name:</label>
                    <input
                      type="text"
                      value={data.testimonials[currentIndex].company || ''}
                      onChange={(e) => {
                        const updated = [...data.testimonials];
                        updated[currentIndex].company = e.target.value;
                        setData(prev => ({ ...prev, testimonials: updated }));
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">Name:</label>
                    <input
                      type="text"
                      value={data.testimonials[currentIndex].name || ''}
                      onChange={(e) => {
                        const updated = [...data.testimonials];
                        updated[currentIndex].name = e.target.value;
                        setData(prev => ({ ...prev, testimonials: updated }));
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block font-medium mb-1">Role:</label>
                  <input
                    type="text"
                    value={data.testimonials[currentIndex].role || ''}
                    onChange={(e) => {
                      const updated = [...data.testimonials];
                      updated[currentIndex].role = e.target.value;
                      setData(prev => ({ ...prev, testimonials: updated }));
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block font-medium mb-1">Comment:</label>
                  <textarea
                    value={data.testimonials[currentIndex].comment || ''}
                    onChange={(e) => {
                      const updated = [...data.testimonials];
                      updated[currentIndex].comment = e.target.value;
                      setData(prev => ({ ...prev, testimonials: updated }));
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block font-medium mb-1">Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const base64 = await convertToBase64(file);
                        const updated = [...data.testimonials];
                        updated[currentIndex].image = base64;
                        setData(prev => ({ ...prev, testimonials: updated }));
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {data.testimonials[currentIndex].image && (
                    <img
                      src={data.testimonials[currentIndex].image}
                      alt="Profile"
                      className="mt-2 w-32 h-32 object-cover rounded-full border"
                    />
                  )}
                </div>
                
                <div className="flex justify-end">
                  <DangerButton
                    onClick={() => {
                      deleteItem('testimonials', data.testimonials[currentIndex].id);
                      if (currentIndex === data.testimonials.length - 1) {
                        setCurrentIndex(Math.max(0, currentIndex - 1));
                      }
                    }}
                    className="ml-2"
                  >
                    Delete
                  </DangerButton>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No testimonials added yet.</p>
      )}
    </section>
  );
};