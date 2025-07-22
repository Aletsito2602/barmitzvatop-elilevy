import { collection, addDoc, query, orderBy, getDocs, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

// Classes/Lessons Management
export const createClass = async (classData) => {
  try {
    const classesRef = collection(db, 'classes');
    const newClass = {
      title: classData.title,
      classNumber: classData.classNumber,
      youtubeLink: classData.youtubeLink,
      videoType: classData.videoType || 'youtube',
      description: classData.description || '',
      duration: classData.duration || '',
      difficulty: classData.difficulty || 'basico',
      category: classData.category || 'alef',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(classesRef, newClass);
    console.log('Class created with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating class:', error);
    return { success: false, error: error.message };
  }
};

export const getAllClasses = async () => {
  try {
    console.log('Getting classes from Firebase...');
    const classesRef = collection(db, 'classes');
    
    // Try without orderBy first in case of index issues
    let querySnapshot;
    try {
      const q = query(classesRef, orderBy('classNumber', 'asc'));
      querySnapshot = await getDocs(q);
    } catch (indexError) {
      console.warn('OrderBy failed, trying without sorting:', indexError);
      querySnapshot = await getDocs(classesRef);
    }
    
    const classes = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      classes.push({ 
        id: doc.id, 
        ...data,
        // Ensure classNumber is a number for sorting
        classNumber: parseInt(data.classNumber) || 0
      });
    });
    
    // Sort manually if needed
    classes.sort((a, b) => a.classNumber - b.classNumber);
    
    console.log('Classes loaded successfully:', classes.length);
    return { success: true, data: classes };
  } catch (error) {
    console.error('Error getting classes:', error);
    return { success: false, error: error.message };
  }
};

export const getClassById = async (classId) => {
  try {
    const classRef = doc(db, 'classes', classId);
    const classSnap = await getDoc(classRef);
    
    if (classSnap.exists()) {
      return { success: true, data: { id: classSnap.id, ...classSnap.data() } };
    } else {
      return { success: false, error: 'Class not found' };
    }
  } catch (error) {
    console.error('Error getting class:', error);
    return { success: false, error: error.message };
  }
};

export const updateClass = async (classId, updates) => {
  try {
    const classRef = doc(db, 'classes', classId);
    await updateDoc(classRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating class:', error);
    return { success: false, error: error.message };
  }
};

export const deleteClass = async (classId) => {
  try {
    const classRef = doc(db, 'classes', classId);
    await deleteDoc(classRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting class:', error);
    return { success: false, error: error.message };
  }
};

// Utility functions
export const extractYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const extractVimeoVideoId = (url) => {
  const regExp = /(?:vimeo\.com\/)([0-9]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

export const getVideoType = (url) => {
  if (!url) return 'personalizado';
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  return 'personalizado';
};

export const getYouTubeThumbnail = (videoId) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const getVimeoThumbnail = (videoId) => {
  return `https://vumbnail.com/${videoId}.jpg`;
};

export const getVideoThumbnail = (url, videoType) => {
  if (videoType === 'youtube') {
    const videoId = extractYouTubeVideoId(url);
    return videoId ? getYouTubeThumbnail(videoId) : null;
  }
  if (videoType === 'vimeo') {
    const videoId = extractVimeoVideoId(url);
    return videoId ? getVimeoThumbnail(videoId) : null;
  }
  return null; // Para videos personalizados no hay thumbnail automático
};

export const formatDuration = (duration) => {
  if (!duration) return 'N/A';
  
  // If duration is in minutes (number)
  if (typeof duration === 'number') {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }
  
  // If duration is already formatted (string)
  return duration;
};

// Initialize sample classes data
export const initializeSampleClasses = async () => {
  try {
    // Check if classes already exist
    const classesResult = await getAllClasses();
    
    if (classesResult.success && classesResult.data.length > 0) {
      console.log('Classes already exist');
      return { success: true, message: 'Classes already exist' };
    }
    
    const sampleClasses = [
      {
        title: 'Introducción al Curso Barmitzva',
        classNumber: 1,
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Bienvenida al curso y presentación del programa completo de preparación para Barmitzva.',
        duration: '15',
        difficulty: 'beginner',
        category: 'introduccion'
      },
      {
        title: 'Letras y Vocales Básicas del Hebreo',
        classNumber: 2,
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Aprende las letras del alfabeto hebreo y las vocales básicas para comenzar a leer.',
        duration: '25',
        difficulty: 'beginner',
        category: 'hebreo'
      },
      {
        title: 'Berajot Básicas: Talit y Tefilín',
        classNumber: 3,
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Las bendiciones fundamentales para el Talit y Tefilín, con pronunciación correcta.',
        duration: '30',
        difficulty: 'beginner',
        category: 'berajot'
      },
      {
        title: 'Introducción a los Taamim',
        classNumber: 4,
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Primeros pasos en el aprendizaje de la melodía tradicional para la lectura de la Torá.',
        duration: '35',
        difficulty: 'intermediate',
        category: 'taamim'
      },
      {
        title: 'Kidush de Shabat',
        classNumber: 5,
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Aprende el Kidush tradicional para la noche de Shabat con la entonación correcta.',
        duration: '20',
        difficulty: 'beginner',
        category: 'tefila'
      }
    ];
    
    // Create sample classes
    for (const classData of sampleClasses) {
      await createClass(classData);
    }
    
    return { success: true, message: 'Sample classes created successfully' };
  } catch (error) {
    console.error('Error initializing sample classes:', error);
    return { success: false, error: error.message };
  }
};