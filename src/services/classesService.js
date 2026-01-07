import { supabase } from '../supabase/client';

// Classes/Lessons Management
export const createClass = async (classData) => {
  try {
    const { data: newClass, error } = await supabase
      .from('classes')
      .insert({
        title: classData.title,
        class_number: parseInt(classData.classNumber),
        youtube_link: classData.youtubeLink,
        video_type: classData.videoType || 'youtube',
        description: classData.description || '',
        duration: parseInt(classData.duration),
        difficulty: classData.difficulty || 'basico',
        category: classData.category || 'alef',
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;

    console.log('Class created with ID: ', newClass.id);
    return { success: true, id: newClass.id };
  } catch (error) {
    console.error('Error creating class:', error);
    return { success: false, error: error.message };
  }
};

export const getAllClasses = async () => {
  try {
    console.log('Getting classes from Supabase...');

    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('class_number', { ascending: true });

    if (error) throw error;

    const classes = data.map(cls => ({
      id: cls.id,
      title: cls.title,
      classNumber: cls.class_number,
      youtubeLink: cls.youtube_link,
      videoType: cls.video_type,
      description: cls.description,
      duration: cls.duration,
      difficulty: cls.difficulty,
      category: cls.category,
      isActive: cls.is_active,
      createdAt: cls.created_at,
      updatedAt: cls.updated_at
    }));

    console.log('Classes loaded successfully:', classes.length);
    return { success: true, data: classes };
  } catch (error) {
    console.error('Error getting classes:', error);
    return { success: false, error: error.message };
  }
};

export const getClassById = async (classId) => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single();

    if (error) throw error;

    if (data) {
      const cls = {
        id: data.id,
        title: data.title,
        classNumber: data.class_number,
        youtubeLink: data.youtube_link,
        videoType: data.video_type,
        description: data.description,
        duration: data.duration,
        difficulty: data.difficulty,
        category: data.category,
        isActive: data.is_active,
      };
      return { success: true, data: cls };
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
    const dbUpdates = {};
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.classNumber) dbUpdates.class_number = parseInt(updates.classNumber);
    if (updates.youtubeLink) dbUpdates.youtube_link = updates.youtubeLink;
    if (updates.videoType) dbUpdates.video_type = updates.videoType;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.duration) dbUpdates.duration = parseInt(updates.duration);
    if (updates.difficulty) dbUpdates.difficulty = updates.difficulty;
    if (updates.category) dbUpdates.category = updates.category;

    const { error } = await supabase
      .from('classes')
      .update({
        ...dbUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', classId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating class:', error);
    return { success: false, error: error.message };
  }
};

export const deleteClass = async (classId) => {
  try {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId);

    if (error) throw error;
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