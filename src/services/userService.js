import { supabase } from '../supabase/client';

// User Profile Operations
export const createUserProfile = async (uid, userData) => {
  try {
    // Check if profile exists (might be created by trigger)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', uid)
      .single();

    if (!existingProfile) {
      // Create profile if not exists
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: uid,
          email: userData.email,
          full_name: userData.name || userData.full_name,
          study_plan: 'alef',
          preferences: {
            language: 'es',
            notifications: true,
            timezone: 'America/Panama'
          }
        });

      if (profileError) throw profileError;

      // Create initial stats
      await supabase
        .from('user_stats')
        .insert({
          user_id: uid,
          total_lessons: 24,
          current_level: 'basico',
          current_class: 1
        });
    } else {
      // Update existing
      await supabase
        .from('profiles')
        .update({
          full_name: userData.name || userData.full_name,
          // associated data
        })
        .eq('id', uid);
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (uid) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();

    if (error) throw error;

    // Transform snake_case to camelCase for frontend compatibility
    const formattedData = {
      ...data,
      name: data.full_name,
      profileImage: data.avatar_url,
      personalParasha: data.personal_parasha
    };

    return { success: true, data: formattedData };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (uid, updates) => {
  try {
    // Map camelCase updates to snake_case db fields
    const dbUpdates = {};
    if (updates.name) dbUpdates.full_name = updates.name;
    if (updates.profileImage) dbUpdates.avatar_url = updates.profileImage;
    if (updates.personalParasha) dbUpdates.personal_parasha = updates.personalParasha;
    if (updates.studyPlan) dbUpdates.study_plan = updates.studyPlan;
    if (updates.preferences) dbUpdates.preferences = updates.preferences;

    const { error } = await supabase
      .from('profiles')
      .update({
        ...dbUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', uid);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

// Progress Operations
export const getUserProgress = async (uid) => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', uid)
      .single();

    if (error) throw error;

    // Also fetch completed classes list
    const { data: completions } = await supabase
      .from('class_completions')
      .select('class_number')
      .eq('user_id', uid);

    const completedClasses = completions ? completions.map(c => c.class_number) : [];

    // Map to frontend format
    const formattedData = {
      lessonsCompleted: data.lessons_completed,
      totalLessons: data.total_lessons,
      studyHours: data.study_hours,
      currentLevel: data.current_level,
      currentClass: data.current_class,
      lastWatchedClass: data.last_watched_class,
      skillProgress: data.skill_progress,
      completedClasses: completedClasses,
      achievements: data.achievements || [],
      // defaults
      currentStreak: data.current_streak || 0
    };

    return { success: true, data: formattedData };
  } catch (error) {
    console.error('Error getting user progress:', error);
    return { success: false, error: error.message };
  }
};

export const updateProgress = async (uid, progressData) => {
  try {
    const dbUpdates = {};
    if (progressData.lessonsCompleted !== undefined) dbUpdates.lessons_completed = progressData.lessonsCompleted;
    if (progressData.studyHours !== undefined) dbUpdates.study_hours = progressData.studyHours;
    if (progressData.currentLevel !== undefined) dbUpdates.current_level = progressData.currentLevel;
    if (progressData.currentClass !== undefined) dbUpdates.current_class = progressData.currentClass;
    if (progressData.skillProgress !== undefined) dbUpdates.skill_progress = progressData.skillProgress;

    const { error } = await supabase
      .from('user_stats')
      .update({
        ...dbUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', uid);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating progress:', error);
    return { success: false, error: error.message };
  }
};

// Track last watched class
export const updateLastWatchedClass = async (uid, classNumber) => {
  try {
    const { error } = await supabase
      .from('user_stats')
      .update({
        last_watched_class: parseInt(classNumber),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', uid);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating last watched class:', error);
    return { success: false, error: error.message };
  }
};

// Class Progress Operations
export const markClassAsCompleted = async (uid, classId, classNumber, duration) => {
  try {
    // 1. Insert into class_completions
    const { error: completionError } = await supabase
      .from('class_completions')
      .upsert({
        user_id: uid,
        class_number: parseInt(classNumber),
        completed_at: new Date().toISOString()
      }, { onConflict: 'user_id, class_number' });

    if (completionError) throw completionError;

    // 2. Fetch current stats to recalculate
    const { data: currentStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', uid)
      .single();

    const { data: allCompletions } = await supabase
      .from('class_completions')
      .select('class_number')
      .eq('user_id', uid);

    const completedClassNumbers = allCompletions.map(c => c.class_number);

    // Calculate new stats
    const addedStudyTime = parseInt(duration) || 0;
    const newStudyHours = (Number(currentStats.study_hours) || 0) + Math.round(addedStudyTime / 60 * 10) / 10;
    const updatedSkillProgress = calculateSkillProgress(completedClassNumbers, currentStats.total_lessons || 24);

    // 3. Update user_stats
    await supabase
      .from('user_stats')
      .update({
        lessons_completed: completedClassNumbers.length,
        study_hours: newStudyHours,
        last_watched_class: parseInt(classNumber),
        skill_progress: updatedSkillProgress,
        last_study_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', uid);

    // 4. Log activity
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
    // 1. Remove from class_completions
    const { error: deleteError } = await supabase
      .from('class_completions')
      .delete()
      .eq('user_id', uid)
      .eq('class_number', parseInt(classNumber));

    if (deleteError) throw deleteError;

    // 2. Recalculate stats
    const { data: allCompletions } = await supabase
      .from('class_completions')
      .select('class_number')
      .eq('user_id', uid);

    const completedClassNumbers = allCompletions.map(c => c.class_number);

    // Determine next class (lowest uncompleted)
    const allClassNumbers = Array.from({ length: 24 }, (_, i) => i + 1);
    const nextClass = allClassNumbers.find(num => !completedClassNumbers.includes(num)) || 1;

    // 3. Update stats
    await supabase
      .from('user_stats')
      .update({
        lessons_completed: completedClassNumbers.length,
        current_class: nextClass,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', uid);

    // 4. Log
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
    const { error } = await supabase
      .from('activities')
      .insert({
        user_id: uid,
        type: activityData.type,
        description: activityData.description,
        metadata: activityData, // store full object
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error logging activity:', error);
    return { success: false, error: error.message };
  }
};

export const getUserActivities = async (uid, limitCount = 10) => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(limitCount);

    if (error) throw error;

    const activities = data.map(act => ({
      id: act.id,
      ...act.metadata,
      timestamp: { toDate: () => new Date(act.created_at) } // Mock Firebase timestamp
    }));

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

    const { error } = await supabase
      .from('user_stats')
      .update({
        skill_progress: calculatedSkillProgress,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', uid);

    if (error) throw error;

    return { success: true, skillProgress: calculatedSkillProgress };
  } catch (error) {
    console.error('Error updating skill progress:', error);
    return { success: false, error: error.message };
  }
};

// Admin Check
export const checkIsAdmin = async (uid) => {
  try {
    const { data, error } = await supabase
      .from('administrators')
      .select('user_id')
      .eq('user_id', uid)
      .single();

    // Handle table not existing (406) or no rows found (PGRST116)
    if (error) {
      // 406 = table doesn't exist, PGRST116 = no rows found
      if (error.code === 'PGRST116' || error.message?.includes('406') || error.code === '42P01') {
        return { success: true, isAdmin: false };
      }
      console.error('Error checking admin status:', error);
      return { success: true, isAdmin: false };
    }

    return { success: true, isAdmin: !!data };
  } catch (error) {
    // Silently fail - administrators table might not exist
    return { success: true, isAdmin: false };
  }
};