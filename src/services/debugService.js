import { supabase } from '../supabase/client';

// Test Supabase connection
export const testDatabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');

    // Test 1: Try to read from classes table
    const { count, error } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    console.log('✅ Can read classes table. Documents found:', count);

    return { success: true, message: 'Supabase connection successful' };
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return { success: false, error: error.message };
  }
};

// Initialize Supabase collections if they don't exist
export const initializeDatabaseCollections = async () => {
  try {
    console.log('Initializing Supabase collections...');

    // Check if classes exist
    const { count, error } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    if (count === 0) {
      console.log('Creating sample classes...');

      const sampleClasses = [
        {
          title: 'Introducción al Curso Barmitzva',
          class_number: 1,
          youtube_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Bienvenida al curso y presentación del programa completo de preparación para Barmitzva.',
          duration: 15,
          difficulty: 'basico',
          category: 'alef',
          is_active: true
        },
        {
          title: 'Letras y Vocales Básicas del Hebreo',
          class_number: 2,
          youtube_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Aprende las letras del alfabeto hebreo y las vocales básicas para comenzar a leer.',
          duration: 25,
          difficulty: 'basico',
          category: 'hebreo',
          is_active: true
        },
        {
          title: 'Berajot Básicas: Talit y Tefilín',
          class_number: 3,
          youtube_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Las bendiciones fundamentales para el Talit y Tefilín, con pronunciación correcta.',
          duration: 30,
          difficulty: 'basico',
          category: 'berajot',
          is_active: true
        }
      ];

      const { error: insertError } = await supabase
        .from('classes')
        .insert(sampleClasses);

      if (insertError) throw insertError;

      console.log('✅ Sample classes created');
    }

    return { success: true, message: 'Collections initialized successfully' };
  } catch (error) {
    console.error('❌ Failed to initialize collections:', error);
    return { success: false, error: error.message };
  }
};