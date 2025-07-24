import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

// User Profile Operations
export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid);
    const profileData = {
      ...userData,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      studyPlan: 'alef', // Default plan
      preferences: {
        language: 'es',
        notifications: true,
        timezone: 'America/Panama'
      }
    };
    
    await setDoc(userRef, profileData);
    
    // Create initial progress document with comprehensive KPIs
    const progressRef = doc(db, 'progress', uid);
    const initialProgress = {
      userId: uid,
      
      // Core Learning Metrics
      lessonsCompleted: 0,
      totalLessons: 24,
      studyHours: 0,
      currentLevel: 'basico',
      currentClass: 1,
      lastWatchedClass: null,
      
      // Skill Progress (0-100%)
      skillProgress: {
        prayers: 0,      // Berajot y Tefilá
        taamim: 0,       // Melodías de Torá
        general: 0,      // Progreso general
        hebrew: 0        // Lectura en hebreo
      },
      
      // Engagement Metrics
      totalStudyTime: 0,           // Total en minutos
      averageSessionTime: 0,       // Promedio por sesión
      totalSessions: 0,            // Número de sesiones de estudio
      totalLogins: 0,              // Número de veces que ha entrado
      
      // Streak & Consistency
      currentStreak: 0,            // Días consecutivos estudiando
      longestStreak: 0,            // Racha más larga
      streakDays: 0,               // Días de racha actual
      lastStudyDate: null,         // Última vez que estudió
      
      // Goals & Progress
      weeklyGoalMinutes: 60,       // Meta semanal en minutos
      monthlyProgress: 0,          // Progreso del mes (0-100%)
      weeklyProgress: 0,           // Progreso de la semana (0-100%)
      
      // Achievements & Milestones
      achievements: [],            // Array de logros obtenidos
      badges: [],                  // Insignias ganadas
      milestones: [],             // Hitos alcanzados
      
      // Class Tracking
      completedClasses: [],        // Array de números de clases completadas
      classRatings: {},           // Ratings de clases {classId: rating}
      favoriteClasses: [],        // Clases marcadas como favoritas
      
      // Activity Stats
      lastActivityDate: serverTimestamp(),
      firstLoginDate: serverTimestamp(),
      profileCompletionDate: null,
      barmitzvaStartDate: serverTimestamp(),
      
      // Performance Metrics
      averageClassScore: 0,        // Promedio de calificaciones
      timeToCompleteClass: 0,      // Tiempo promedio por clase
      mostActiveTimeOfDay: null,   // Hora del día más activa
      mostActiveDay: null,         // Día de la semana más activo
      
      // Timestamps
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp()
    };
    
    await setDoc(progressRef, initialProgress);
    
    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() };
    } else {
      return { success: false, error: 'User profile not found' };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (uid, updates) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      lastModified: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

// Progress Operations
export const getUserProgress = async (uid) => {
  try {
    const progressRef = doc(db, 'progress', uid);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      return { success: true, data: progressSnap.data() };
    } else {
      return { success: false, error: 'Progress not found' };
    }
  } catch (error) {
    console.error('Error getting user progress:', error);
    return { success: false, error: error.message };
  }
};

export const updateProgress = async (uid, progressData) => {
  try {
    const progressRef = doc(db, 'progress', uid);
    await updateDoc(progressRef, {
      ...progressData,
      lastUpdated: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating progress:', error);
    return { success: false, error: error.message };
  }
};

// Track last watched class
export const updateLastWatchedClass = async (uid, classNumber) => {
  try {
    const progressRef = doc(db, 'progress', uid);
    await updateDoc(progressRef, {
      lastWatchedClass: parseInt(classNumber),
      lastUpdated: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating last watched class:', error);
    return { success: false, error: error.message };
  }
};

// Class Progress Operations
export const markClassAsCompleted = async (uid, classId, classNumber, duration) => {
  try {
    const progressRef = doc(db, 'progress', uid);
    const progressSnap = await getDoc(progressRef);
    
    if (!progressSnap.exists()) {
      return { success: false, error: 'User progress not found' };
    }
    
    const currentProgress = progressSnap.data();
    const completedClasses = currentProgress.completedClasses || [];
    
    // Check if class is already completed
    if (completedClasses.includes(parseInt(classNumber))) {
      return { success: true, message: 'Class already completed' };
    }
    
    // Add to completed classes
    const updatedCompletedClasses = [...completedClasses, parseInt(classNumber)];
    const newLessonsCompleted = updatedCompletedClasses.length;
    const addedStudyTime = parseInt(duration) || 0;
    const newStudyHours = (currentProgress.studyHours || 0) + Math.round(addedStudyTime / 60 * 10) / 10;
    
    // Calculate updated skill progress
    const updatedSkillProgress = calculateSkillProgress(updatedCompletedClasses, currentProgress.totalLessons || 24);

    // Update progress including last watched class and skill progress
    await updateDoc(progressRef, {
      completedClasses: updatedCompletedClasses,
      lessonsCompleted: newLessonsCompleted,
      studyHours: newStudyHours,
      lastWatchedClass: parseInt(classNumber),
      lastStudyDate: serverTimestamp(),
      skillProgress: updatedSkillProgress,
      lastUpdated: serverTimestamp()
    });
    
    // Log activity
    await logActivity(uid, {
      type: 'lesson_completed',
      classId: classId,
      classNumber: parseInt(classNumber),
      description: `Completó la Clase ${classNumber}`,
      studyTime: addedStudyTime
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error marking class as completed:', error);
    return { success: false, error: error.message };
  }
};

// Unmark class as completed
export const unmarkClassAsCompleted = async (uid, classNumber) => {
  try {
    const progressRef = doc(db, 'progress', uid);
    const progressSnap = await getDoc(progressRef);
    
    if (!progressSnap.exists()) {
      return { success: false, error: 'User progress not found' };
    }
    
    const currentProgress = progressSnap.data();
    const completedClasses = currentProgress.completedClasses || [];
    
    // Remove from completed classes
    const updatedCompletedClasses = completedClasses.filter(num => num !== parseInt(classNumber));
    const newLessonsCompleted = updatedCompletedClasses.length;
    
    // Calculate new current class (lowest uncompleted class)
    const allClassNumbers = Array.from({length: 24}, (_, i) => i + 1);
    const nextClass = allClassNumbers.find(num => !updatedCompletedClasses.includes(num)) || 1;
    
    // Update progress
    await updateDoc(progressRef, {
      completedClasses: updatedCompletedClasses,
      lessonsCompleted: newLessonsCompleted,
      currentClass: nextClass,
      lastUpdated: serverTimestamp()
    });
    
    // Log activity
    await logActivity(uid, {
      type: 'lesson_unmarked',
      classNumber: parseInt(classNumber),
      description: `Desmarcó como completada la Clase ${classNumber}`
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error unmarking class as completed:', error);
    return { success: false, error: error.message };
  }
};

// Activity Operations
export const logActivity = async (uid, activityData) => {
  try {
    const activitiesRef = collection(db, 'activities');
    const activity = {
      userId: uid,
      ...activityData,
      timestamp: serverTimestamp()
    };
    
    await addDoc(activitiesRef, activity);
    return { success: true };
  } catch (error) {
    console.error('Error logging activity:', error);
    return { success: false, error: error.message };
  }
};

export const getUserActivities = async (uid, limitCount = 10) => {
  try {
    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef, 
      orderBy('timestamp', 'desc'), 
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const activities = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.userId === uid) {
        activities.push({ id: doc.id, ...data });
      }
    });
    
    return { success: true, data: activities };
  } catch (error) {
    console.error('Error getting user activities:', error);
    return { success: false, error: error.message };
  }
};

// Parasha Calculation
export const calculatePersonalParasha = (birthDate) => {
  try {
    const birth = new Date(birthDate);
    const currentYear = new Date().getFullYear();
    const thisYearBirthday = new Date(currentYear, birth.getMonth(), birth.getDate());
    
    // If birthday hasn't passed this year, use this year, otherwise next year
    const barmitzvaDate = thisYearBirthday < new Date() ? 
      new Date(currentYear + 1, birth.getMonth(), birth.getDate()) :
      thisYearBirthday;
    
    // Add 13 years to birth date for Barmitzva
    barmitzvaDate.setFullYear(barmitzvaDate.getFullYear() + (13 - (currentYear - birth.getFullYear())));
    
    // Simple parasha rotation (in reality this would be more complex)
    const parashas = [
      { name: 'Parashat Bereshit', hebrew: 'בְּרֵאשִׁית', reference: 'Génesis 1:1-6:8' },
      { name: 'Parashat Noach', hebrew: 'נֹחַ', reference: 'Génesis 6:9-11:32' },
      { name: 'Parashat Lech-Lecha', hebrew: 'לֶךְ-לְךָ', reference: 'Génesis 12:1-17:27' },
      { name: 'Parashat Vayera', hebrew: 'וַיֵּרָא', reference: 'Génesis 18:1-22:24' },
      { name: 'Parashat Chayei Sarah', hebrew: 'חַיֵּי שָׂרָה', reference: 'Génesis 23:1-25:18' },
      { name: 'Parashat Toldot', hebrew: 'תּוֹלְדֹת', reference: 'Génesis 25:19-28:9' },
      { name: 'Parashat Vayetzei', hebrew: 'וַיֵּצֵא', reference: 'Génesis 28:10-32:3' },
      { name: 'Parashat Vayishlach', hebrew: 'וַיִּשְׁלַח', reference: 'Génesis 32:4-36:43' },
      { name: 'Parashat Vayeshev', hebrew: 'וַיֵּשֶׁב', reference: 'Génesis 37:1-40:23' },
      { name: 'Parashat Miketz', hebrew: 'מִקֵּץ', reference: 'Génesis 41:1-44:17' }
    ];
    
    const weekOfYear = Math.floor((barmitzvaDate - new Date(barmitzvaDate.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
    const parashaIndex = weekOfYear % parashas.length;
    
    return {
      parasha: parashas[parashaIndex],
      barmitzvaDate: barmitzvaDate,
      calculated: true
    };
  } catch (error) {
    console.error('Error calculating parasha:', error);
    return {
      parasha: { name: 'Parashat Vayeshev', hebrew: 'וַיֵּשֶׁב', reference: 'Génesis 37:1-40:23' },
      barmitzvaDate: null,
      calculated: false
    };
  }
};

// Calculate skill progress based on completed classes
export const calculateSkillProgress = (completedClasses = [], totalClasses = 24) => {
  if (!Array.isArray(completedClasses)) {
    return { prayers: 0, taamim: 0, general: 0, hebrew: 0 };
  }

  const totalCompleted = completedClasses.length;
  const generalProgress = Math.round((totalCompleted / totalClasses) * 100);

  // Define which classes contribute to each skill
  // Classes 1-8: Prayers and Hebrew basics
  // Classes 9-16: Taamim (Torah melodies)
  // Classes 17-24: Advanced Hebrew and integration
  
  const prayerClasses = completedClasses.filter(classNum => classNum >= 1 && classNum <= 8).length;
  const taamimClasses = completedClasses.filter(classNum => classNum >= 9 && classNum <= 16).length;
  const hebrewClasses = completedClasses.filter(classNum => classNum >= 17 && classNum <= 24).length;

  // Calculate progress for each skill (each section has 8 classes)
  const prayersProgress = Math.round((prayerClasses / 8) * 100);
  const taamimProgress = Math.round((taamimClasses / 8) * 100);
  const hebrewProgress = Math.round((hebrewClasses / 8) * 100);

  return {
    prayers: Math.min(prayersProgress, 100),
    taamim: Math.min(taamimProgress, 100),
    hebrew: Math.min(hebrewProgress, 100),
    general: Math.min(generalProgress, 100)
  };
};

// Update user progress with skill calculations
export const updateUserProgressWithSkills = async (uid, userProgress) => {
  try {
    const calculatedSkillProgress = calculateSkillProgress(
      userProgress.completedClasses,
      userProgress.totalLessons || 24
    );

    const progressRef = doc(db, 'progress', uid);
    await updateDoc(progressRef, {
      skillProgress: calculatedSkillProgress,
      lastUpdated: serverTimestamp()
    });

    return { success: true, skillProgress: calculatedSkillProgress };
  } catch (error) {
    console.error('Error updating skill progress:', error);
    return { success: false, error: error.message };
  }
};