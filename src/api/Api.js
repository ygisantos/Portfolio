import {db, auth} from './Firebase';
import {
  doc, getDoc, collection, getDocs,
  increment, updateDoc, setDoc, deleteDoc
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

export const fetchProfileData = async () => {
  const docRef = doc(db, 'about_me', 'profile');
  const docSnap = await getDoc(docRef);
  return docSnap?.data() || {};
};

export const fetchCollectionData = async (collections) => {
  const collectionData = {};
  for (const col of collections) {
    const colSnap = await getDocs(collection(db, col));
    collectionData[col] = colSnap?.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) || [];
  }
  return collectionData;
};

export const fetchAndUpdateStats = async () => {
  const statsRef = doc(db, 'information', 'stats');
  let statsSnap = await getDoc(statsRef);

  if (!statsSnap.exists()) {
    await setDoc(statsRef, { visits: 0 });
    statsSnap = await getDoc(statsRef);
  }

  await updateDoc(statsRef, { visits: increment(1) });
  const updatedStatsSnap = await getDoc(statsRef);
  return updatedStatsSnap?.data()?.visits || 0;
};

export const deleteDocument = async (collectionName, id) => {
  if (!id) {
    console.error('deleteDocument: No ID provided');
    return false;
  }
  
  try {
    console.log(`Deleting ${collectionName} document with ID: ${id}`);
    
    // If deleting a work, also delete its images subcollection
    if (collectionName === 'works') {
      console.log(`Deleting images subcollection for work ${id}`);
      const imageResult = await deleteWorkImages(id);
      if (!imageResult.success) {
        console.warn(`Failed to delete some images for work ${id}:`, imageResult.error);
      } else {
        console.log(`Deleted ${imageResult.deletedCount} images for work ${id}`);
      }
    }
    
    const itemRef = doc(db, collectionName, id);
    await deleteDoc(itemRef);
    
    console.log(`Successfully deleted ${collectionName} document ${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting ${collectionName} document ${id}:`, error);
    throw error; // Re-throw to let the calling function handle the error
  }
};

export const updateProfile = async (data) => {
  const profileRef = doc(db, 'about_me', 'profile');
  await setDoc(profileRef, data, { merge: true });
};

export const updateCollection = async (collectionName, items) => {
  if (collectionName === 'works') {
    // Handle works separately to manage images in subcollections
    const results = [];
    for (const item of items) {
      if (item.title) { // Ensure the work has a title (valid work)
        const result = await updateWork(item);
        results.push({ 
          item: item.title, 
          result,
          hasImages: item.images && item.images.length > 0
        });
      }
    }
    
    // Provide summary of results
    const failed = results.filter(r => !r.result.success);
    const withImageIssues = results.filter(r => r.result.imageError);
    
    if (failed.length > 0 || withImageIssues.length > 0) {
      const errors = [];
      if (failed.length > 0) {
        errors.push(`${failed.length} work(s) failed to save`);
      }
      if (withImageIssues.length > 0) {
        errors.push(`${withImageIssues.length} work(s) had image saving issues`);
      }
      
      return { 
        success: false, 
        error: errors.join(', '),
        details: results
      };
    }
    
    return { 
      success: true, 
      results,
      message: `Successfully saved ${results.length} work(s)`
    };
  } else {
    // Handle other collections normally
    const colRef = collection(db, collectionName);
    for (const item of items) {
      if (item.title || item.name || item.comment) {
        const itemRef = item.id ? doc(colRef, item.id) : doc(colRef);
        await setDoc(itemRef, { ...item, id: itemRef.id }, { merge: true });
      }
    }
    return { success: true };
  }
};

// 1. Retrieve about_me
export const getAboutMe = async () => {
  try {
    const docRef = doc(db, 'about_me', 'profile');
    const docSnap = await getDoc(docRef);
    return JSON.stringify(docSnap.exists() ? docSnap.data() : null, null, 2);
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// 2. Retrieve all certificates
export const getAllCertificates = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'certificates'));
    const certificates = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return JSON.stringify(certificates, null, 2);
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// 3. Retrieve certificate by id
export const getCertificateById = async (id) => {
  try {
    const docRef = doc(db, 'certificates', id);
    const docSnap = await getDoc(docRef);
    return JSON.stringify(docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null, null, 2);
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// 4. Retrieve all experiences
export const getAllExperiences = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'experiences'));
    const experiences = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return JSON.stringify(experiences, null, 2);
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// 5. Retrieve experience by id
export const getExperienceById = async (id) => {
  try {
    const docRef = doc(db, 'experiences', id);
    const docSnap = await getDoc(docRef);
    return JSON.stringify(docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null, null, 2);
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// 6. Retrieve visits
export const getVisits = async () => {
  try {
    const docRef = doc(db, 'information', 'stats');
    const docSnap = await getDoc(docRef);
    return JSON.stringify(docSnap.exists() ? docSnap.data().visits : 0, null, 2);
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// 7. Retrieve all skills
export const getAllSkills = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'skills'));
    const skills = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return JSON.stringify(skills, null, 2);
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// 8. Retrieve all testimonials
export const getAllTestimonials = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'testimonials'));
    const testimonials = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return JSON.stringify(testimonials, null, 2);
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// 9. Retrieve all works with language icons and images from subcollections
export const getAllWorks = async () => {
  try {
    console.log('getAllWorks: Starting to fetch works...');
    const querySnapshot = await getDocs(collection(db, 'works'));
    console.log(`getAllWorks: Found ${querySnapshot.docs.length} works`);
    
    const works = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      console.log(`getAllWorks: Processing work ${docSnap.id} - ${data.title}`);
      
      const languages = data.languages?.map(lang => {
        const langName = typeof lang === 'string' ? lang : lang?.name;
        return langName ? {
          name: langName,
          icon: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${langName}/${langName}-original.svg`
        } : null;
      }).filter(Boolean);

      // Fetch images from subcollection
      console.log(`getAllWorks: Fetching images for work ${docSnap.id}...`);
      const images = await getWorkImages(docSnap.id);
      console.log(`getAllWorks: Found ${images.length} images for work ${docSnap.id}`);

      return {
        id: docSnap.id,
        ...data,
        languages,
        images
      };
    }));
    
    console.log('getAllWorks: All works processed successfully');
    console.log('getAllWorks: Sample of first work:', works[0] ? {
      id: works[0].id,
      title: works[0].title,
      imageCount: works[0].images?.length || 0,
      firstImageLength: works[0].images?.[0]?.length || 0
    } : 'No works found');
    
    return JSON.stringify(works, null, 2);
  } catch (error) {
    console.error('getAllWorks: Error occurred:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 10. Retrieve work by id with language icons
export const getWorkById = async (id) => {
  try {
    const docRef = doc(db, 'works', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return {
        success: true,
        data: null
      };
    }
    const data = docSnap.data();
    
    // Fetch images from subcollection
    const images = await getWorkImages(id);
    
    return JSON.stringify({
      id: docSnap.id,
      ...data,
      images,
      languages: data.languages?.map(lang => ({
        name: lang,
        icon: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${lang}/${lang}-original.svg`
      })) || []
    }, null, 2);
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Update functions for each component
export const updateBasicInfo = async (data) => {
  try {
    const profileRef = doc(db, 'about_me', 'profile');
    await setDoc(profileRef, {
      short_description: data.short_description || '',
      description: data.description || '',
      location: data.location || '',
      availability: data.availability || '',
      resume_url: data.resume_url || '',
    }, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateContact = async (data) => {
  try {
    const profileRef = doc(db, 'about_me', 'profile');
    await setDoc(profileRef, {
      socials: {
        github: data.github || '',
        linkedin: data.linkedin || '',
        facebook: data.facebook || '',
        facebook_page: data.facebook_page || '',
        phone: data.phone || '',
        email: data.email || ''
      }
    }, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateCertificate = async (certificate) => {
  try {
    const colRef = collection(db, 'certificates');
    const docRef = certificate.id ? doc(colRef, certificate.id) : doc(colRef);
    await setDoc(docRef, { ...certificate, id: docRef.id }, { merge: true });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateSkill = async (skill) => {
  try {
    const colRef = collection(db, 'skills');
    const docRef = skill.id ? doc(colRef, skill.id) : doc(colRef);
    await setDoc(docRef, { ...skill, id: docRef.id }, { merge: true });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateExperience = async (experience) => {
  try {
    const colRef = collection(db, 'experiences');
    const docRef = experience.id ? doc(colRef, experience.id) : doc(colRef);
    await setDoc(docRef, { ...experience, id: docRef.id }, { merge: true });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateWork = async (work) => {
  try {
    const colRef = collection(db, 'works');
    const docRef = work.id ? doc(colRef, work.id) : doc(colRef);
    
    // Extract images from the work data
    const { images, ...workDataWithoutImages } = work;
    
    // Prepare work data for saving (without images)
    const workData = {
      ...workDataWithoutImages,
      id: docRef.id,
      // Ensure languages are stored as simple strings
      languages: work.languages?.map(lang => 
        typeof lang === 'string' ? lang : lang?.name
      ).filter(Boolean) || []
    };
    
    // Save the main work document
    await setDoc(docRef, workData, { merge: true });
    
    // Handle images in subcollection
    if (images && images.length > 0) {
      const imageResult = await updateWorkImages(docRef.id, images);
      if (!imageResult.success) {
        return { 
          success: false, 
          error: imageResult.error,
          imageError: true,
          savedCount: imageResult.savedCount,
          totalCount: imageResult.totalCount
        };
      }
      return { 
        success: true, 
        id: docRef.id,
        imagesSaved: imageResult.savedCount,
        totalImages: imageResult.totalCount
      };
    }
    
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateTestimonial = async (testimonial) => {
  try {
    const colRef = collection(db, 'testimonials');
    const docRef = testimonial.id ? doc(colRef, testimonial.id) : doc(colRef);
    await setDoc(docRef, { ...testimonial, id: docRef.id }, { merge: true });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginWithPopup = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    alert(`Welcome, ${user.displayName}!`);
    return { success: true, user };
  } catch (error) {
    alert(`Login failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    alert(`Welcome, ${user.email}!`);
    return { success: true, user };
  } catch (error) {
    alert(`Login failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    alert('You have been logged out.');
    return { success: true };
  } catch (error) {
    alert(`Logout failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const requireLogin = async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) { 
        resolve(user);
      } else {
        reject(new Error('User is not logged in.'));
      }
    });
  });
};

// Helper function to compress base64 images to reduce size
export const compressBase64Image = (base64String, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve) => {
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
      
      const originalSize = (base64String.length * 0.75 / 1024).toFixed(1);
      const compressedSize = (compressedBase64.length * 0.75 / 1024).toFixed(1);
      console.log(`Image compressed: Original: ${originalSize}KB, Compressed: ${compressedSize}KB`);
      
      resolve(compressedBase64);
    };
    
    img.onerror = (error) => {
      console.error('Error compressing image:', error);
      resolve(base64String); // Return original if compression fails
    };
    
    // Set the image source
    img.src = base64String;
  });
};

// Helper function to update work images in subcollection
export const updateWorkImages = async (workId, images) => {
  try {
    const imagesColRef = collection(db, 'works', workId, 'images');
    
    // Clear existing images first
    const existingImagesSnap = await getDocs(imagesColRef);
    const deletePromises = existingImagesSnap.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Add new images in batches to avoid overwhelming Firestore
    const BATCH_SIZE = 5; // Process 5 images at a time
    const results = [];
    
    for (let i = 0; i < images.length; i += BATCH_SIZE) {
      const batch = images.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map((imageData, batchIndex) => {
        const globalIndex = i + batchIndex;
        const imageDocRef = doc(imagesColRef);
        return setDoc(imageDocRef, {
          data: imageData,
          order: globalIndex,
          created_at: new Date().toISOString()
        });
      });
      
      // Wait for this batch to complete before processing the next
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);
      
      // Add a small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < images.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Check if all images were successfully saved
    const failedImages = results.filter(result => result.status === 'rejected');
    if (failedImages.length > 0) {
      console.warn(`${failedImages.length} images failed to save:`, failedImages);
      return { 
        success: false, 
        error: `${failedImages.length} out of ${images.length} images failed to save`,
        savedCount: results.length - failedImages.length,
        totalCount: images.length
      };
    }
    
    return { 
      success: true, 
      savedCount: images.length,
      totalCount: images.length
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Helper function to get work images from subcollection
export const getWorkImages = async (workId) => {
  try {
    console.log(`getWorkImages: Fetching images for work ${workId}`);
    const imagesColRef = collection(db, 'works', workId, 'images');
    const imagesSnap = await getDocs(imagesColRef);
    
    console.log(`getWorkImages: Found ${imagesSnap.docs.length} image documents for work ${workId}`);
    
    const images = imagesSnap.docs
      .map(doc => {
        const docData = doc.data();
        console.log(`getWorkImages: Image doc ${doc.id} - order: ${docData.order}, dataLength: ${docData.data?.length || 'no data'}`);
        return {
          id: doc.id,
          ...docData
        };
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(img => img.data);
    
    console.log(`getWorkImages: Returning ${images.length} images for work ${workId}`);
    console.log(`getWorkImages: First image preview:`, images[0] ? images[0].substring(0, 50) + '...' : 'No images');
    
    return images;
  } catch (error) {
    console.error(`getWorkImages: Error fetching work images for ${workId}:`, error);
    return [];
  }
};

// Helper function to delete work images subcollection
export const deleteWorkImages = async (workId) => {
  try {
    const imagesColRef = collection(db, 'works', workId, 'images');
    const imagesSnap = await getDocs(imagesColRef);
    
    console.log(`Deleting ${imagesSnap.docs.length} images for work ${workId}`);
    
    if (imagesSnap.docs.length === 0) {
      console.log(`No images found for work ${workId}`);
      return { success: true, deletedCount: 0 };
    }
    
    const deletePromises = imagesSnap.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log(`Successfully deleted ${imagesSnap.docs.length} images for work ${workId}`);
    return { success: true, deletedCount: imagesSnap.docs.length };
  } catch (error) {
    console.error(`Error deleting images for work ${workId}:`, error);
    return { success: false, error: error.message };
  }
};

// Delete a specific image by its order/index from a work's subcollection
export const deleteWorkImage = async (workId, imageIndex) => {
  try {
    console.log(`Attempting to delete image at index ${imageIndex} for work ${workId}`);
    
    const imagesColRef = collection(db, 'works', workId, 'images');
    const imagesSnap = await getDocs(imagesColRef);
    
    if (imagesSnap.docs.length === 0) {
      console.log(`No images found for work ${workId}`);
      return { success: false, error: 'No images found' };
    }
    
    // Sort images by order to find the correct one to delete
    const imagesDocs = imagesSnap.docs.sort((a, b) => {
      const orderA = a.data().order || 0;
      const orderB = b.data().order || 0;
      return orderA - orderB;
    });
    
    if (imageIndex >= imagesDocs.length) {
      console.log(`Image index ${imageIndex} out of range. Total images: ${imagesDocs.length}`);
      return { success: false, error: 'Image index out of range' };
    }
    
    // Delete the specific image
    const imageToDelete = imagesDocs[imageIndex];
    await deleteDoc(imageToDelete.ref);
    
    // Update the order of remaining images
    const remainingImages = imagesDocs.filter((doc, idx) => idx !== imageIndex);
    const updatePromises = remainingImages.map((doc, newIndex) => {
      return setDoc(doc.ref, { ...doc.data(), order: newIndex }, { merge: true });
    });
    
    await Promise.all(updatePromises);
    
    console.log(`Successfully deleted image at index ${imageIndex} for work ${workId}`);
    return { success: true, deletedIndex: imageIndex, remainingCount: remainingImages.length };
  } catch (error) {
    console.error(`Error deleting image at index ${imageIndex} for work ${workId}:`, error);
    return { success: false, error: error.message };
  }
};

// Debug function to verify image counts (can be removed later)
export const debugImageCounts = async () => {
  try {
    const worksSnap = await getDocs(collection(db, 'works'));
    const results = [];
    
    for (const workDoc of worksSnap.docs) {
      const workData = workDoc.data();
      const imagesSnap = await getDocs(collection(db, 'works', workDoc.id, 'images'));
      
      results.push({
        workId: workDoc.id,
        title: workData.title,
        imageCount: imagesSnap.docs.length,
        images: imagesSnap.docs.map(doc => ({
          id: doc.id,
          order: doc.data().order,
          created_at: doc.data().created_at
        }))
      });
    }
    
    console.log('Image count debug results:', results);
    return results;
  } catch (error) {
    console.error('Error debugging image counts:', error);
    return [];
  }
};

// Test function to verify image operations (can be removed later)
export const testImageOperations = async (workId) => {
  try {
    console.log(`Testing image operations for work ${workId}`);
    
    // Get current images
    const currentImages = await getWorkImages(workId);
    console.log(`Current images count: ${currentImages.length}`);
    
    if (currentImages.length > 0) {
      console.log('Current images:', currentImages.map((img, idx) => ({ index: idx, dataLength: img.length })));
    }
    
    return {
      success: true,
      workId,
      imageCount: currentImages.length,
      images: currentImages.map((img, idx) => ({ index: idx, dataLength: img.length }))
    };
  } catch (error) {
    console.error('Error testing image operations:', error);
    return { success: false, error: error.message };
  }
};
