import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '../firebase/config';

// Upload video to Firebase Storage
export const uploadVideo = async (file, classId, onProgress) => {
  try {
    // Create a reference to the video file
    const videoRef = ref(storage, `videos/classes/${classId}/${file.name}`);
    
    // Upload the file
    const snapshot = await uploadBytes(videoRef, file);
    console.log('Video uploaded successfully');
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { 
      success: true, 
      url: downloadURL,
      path: snapshot.ref.fullPath,
      name: file.name,
      size: file.size
    };
  } catch (error) {
    console.error('Error uploading video:', error);
    return { success: false, error: error.message };
  }
};

// Delete video from Firebase Storage
export const deleteVideo = async (videoPath) => {
  try {
    const videoRef = ref(storage, videoPath);
    await deleteObject(videoRef);
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
    const videosRef = ref(storage, `videos/classes/${classId}`);
    const result = await listAll(videosRef);
    
    const videos = await Promise.all(
      result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          name: item.name,
          path: item.fullPath,
          url: url
        };
      })
    );
    
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
      resolve({ duration: 0, width: 0, height: 0, aspectRatio: 16/9 });
    };
    
    video.src = URL.createObjectURL(file);
  });
};