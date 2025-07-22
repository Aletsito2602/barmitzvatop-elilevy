import { collection, getDocs, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

// Test Firebase connection and permissions
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Test 1: Try to read from classes collection
    try {
      const classesRef = collection(db, 'classes');
      const snapshot = await getDocs(classesRef);
      console.log('✅ Can read classes collection. Documents found:', snapshot.size);
    } catch (error) {
      console.error('❌ Cannot read classes collection:', error.message);
      return { success: false, error: 'Cannot read classes: ' + error.message };
    }
    
    // Test 2: Try to write a test document
    try {
      const testRef = doc(db, 'test', 'connection-test');
      await setDoc(testRef, {
        timestamp: new Date(),
        test: true
      });
      console.log('✅ Can write to Firestore');
    } catch (error) {
      console.error('❌ Cannot write to Firestore:', error.message);
    }
    
    return { success: true, message: 'Firebase connection successful' };
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return { success: false, error: error.message };
  }
};

// Initialize Firebase collections if they don't exist
export const initializeFirebaseCollections = async () => {
  try {
    console.log('Initializing Firebase collections...');
    
    // Check and create sample class if classes collection is empty
    const classesRef = collection(db, 'classes');
    const classesSnapshot = await getDocs(classesRef);
    
    if (classesSnapshot.empty) {
      console.log('Creating sample classes...');
      
      const sampleClasses = [
        {
          title: 'Introducción al Curso Barmitzva',
          classNumber: 1,
          youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Bienvenida al curso y presentación del programa completo de preparación para Barmitzva.',
          duration: '15',
          difficulty: 'beginner',
          category: 'introduccion',
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        {
          title: 'Letras y Vocales Básicas del Hebreo',
          classNumber: 2,
          youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Aprende las letras del alfabeto hebreo y las vocales básicas para comenzar a leer.',
          duration: '25',
          difficulty: 'beginner',
          category: 'hebreo',
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        {
          title: 'Berajot Básicas: Talit y Tefilín',
          classNumber: 3,
          youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Las bendiciones fundamentales para el Talit y Tefilín, con pronunciación correcta.',
          duration: '30',
          difficulty: 'beginner',
          category: 'berajot',
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      ];
      
      for (const classData of sampleClasses) {
        await addDoc(classesRef, classData);
        console.log(`✅ Created class: ${classData.title}`);
      }
    }
    
    return { success: true, message: 'Collections initialized successfully' };
  } catch (error) {
    console.error('❌ Failed to initialize collections:', error);
    return { success: false, error: error.message };
  }
};