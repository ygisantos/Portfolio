import db from './Firebase';
import {
  doc, getDoc, collection, getDocs,
  increment, updateDoc, setDoc, deleteDoc
} from 'firebase/firestore';

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
  if (!id) return false;
  const itemRef = doc(db, collectionName, id);
  await deleteDoc(itemRef);
  return true;
};

export const updateProfile = async (data) => {
  const profileRef = doc(db, 'about_me', 'profile');
  await setDoc(profileRef, data, { merge: true });
};

export const updateCollection = async (collectionName, items) => {
  const colRef = collection(db, collectionName);
  for (const item of items) {
    if (item.title || item.name || item.comment) {
      const itemRef = item.id ? doc(colRef, item.id) : doc(colRef);
      await setDoc(itemRef, { ...item, id: itemRef.id }, { merge: true });
    }
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

// 9. Retrieve all works with language icons
export const getAllWorks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'works'));
    const works = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        languages: data.languages?.map(lang => ({
          name: lang,
          icon: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${lang}/${lang}-original.svg`
        }))
      };
    });
    return JSON.stringify(works, null, 2);
  } catch (error) {
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
    return JSON.stringify({
      id: docSnap.id,
      ...data,
      languages: data.languages?.map(lang => ({
        name: lang,
        icon: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${lang}/${lang}-original.svg`
      }))
    }, null, 2);
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
