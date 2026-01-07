import { supabase } from '../supabase/client';

const BUCKET_NAME = 'videos';

// Upload video to Supabase Storage
export const uploadVideo = async (file, classId, onProgress) => {
  try {
    const filePath = `classes/${classId}/${file.name}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    console.log('Video uploaded successfully');

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
      path: filePath,
      name: file.name,
      size: file.size
    };
  } catch (error) {
    console.error('Error uploading video:', error);
    return { success: false, error: error.message };
  }
};

// Delete video from Supabase Storage
export const deleteVideo = async (videoPath) => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([videoPath]);

    if (error) throw error;
    console.log('Video deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Error deleting video:', error);
    return { success: false, error: error.message };
  }
};

// Get all videos for a class
export const getClassVideos = async (classId) => {
  try {
    const folderPath = `classes/${classId}`;

    // List files in the folder
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folderPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) throw error;

    const videos = data.map(item => {
      const path = `${folderPath}/${item.name}`;
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);

      return {
        name: item.name,
        path: path,
        url: publicUrl,
        metadata: item.metadata // size, mimetype, etc
      };
    });

    return { success: true, videos };
  } catch (error) {
    console.error('Error getting class videos:', error);
    return { success: false, error: error.message };
  }
};

// Validate video file
export const validateVideoFile = (file) => {
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  const maxSize = 500 * 1024 * 1024; // 500MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Formato de video no válido. Use MP4, WebM o OGG.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'El archivo es demasiado grande. Máximo 500MB.' };
  }

  return { valid: true };
};

// Get video metadata
export const getVideoMetadata = (file) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      resolve({
        duration: Math.round(video.duration),
        width: video.videoWidth,
        height: video.videoHeight,
        aspectRatio: video.videoWidth / video.videoHeight
      });
    };

    video.onerror = () => {
      resolve({ duration: 0, width: 0, height: 0, aspectRatio: 16 / 9 });
    };

    video.src = URL.createObjectURL(file);
  });
};