import { collection, addDoc, query, orderBy, limit, getDocs, doc, getDoc, updateDoc, increment, serverTimestamp, where, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Community Stats Operations
export const getCommunityStats = async () => {
  try {
    // Get total members count
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const totalMembers = usersSnapshot.size;
    
    // Get active discussions count
    const postsRef = collection(db, 'community_posts');
    const postsSnapshot = await getDocs(postsRef);
    const totalDiscussions = postsSnapshot.size;
    
    // Count total responses
    let totalResponses = 0;
    postsSnapshot.forEach(doc => {
      const data = doc.data();
      totalResponses += data.repliesCount || 0;
    });
    
    // Get this week's activity
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentPostsQuery = query(
      postsRef,
      where('timestamp', '>=', oneWeekAgo)
    );
    const recentPostsSnapshot = await getDocs(recentPostsQuery);
    const thisWeekActivity = recentPostsSnapshot.size;
    
    return {
      success: true,
      data: {
        totalMembers,
        totalDiscussions,
        totalResponses,
        thisWeekActivity
      }
    };
  } catch (error) {
    console.error('Error getting community stats:', error);
    return { success: false, error: error.message };
  }
};

// Forum Posts Operations
export const getCommunityPosts = async (limitCount = 20) => {
  try {
    const postsRef = collection(db, 'community_posts');
    const q = query(
      postsRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    for (const docSnap of querySnapshot.docs) {
      const postData = docSnap.data();
      
      // Get user info for the post
      const userRef = doc(db, 'users', postData.userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : { name: 'Usuario Anónimo' };
      
      posts.push({
        id: docSnap.id,
        ...postData,
        author: userData.name || userData.email || 'Usuario Anónimo',
        authorImage: userData.profileImage || null
      });
    }
    
    return { success: true, data: posts };
  } catch (error) {
    console.error('Error getting community posts:', error);
    return { success: false, error: error.message };
  }
};

export const createCommunityPost = async (userId, postData) => {
  try {
    const postsRef = collection(db, 'community_posts');
    const post = {
      userId,
      title: postData.title,
      content: postData.content,
      category: postData.category || 'general',
      likes: 0,
      repliesCount: 0,
      isActive: true,
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(postsRef, post);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating community post:', error);
    return { success: false, error: error.message };
  }
};

export const likePost = async (postId, userId) => {
  try {
    const postRef = doc(db, 'community_posts', postId);
    await updateDoc(postRef, {
      likes: increment(1),
      lastActivity: serverTimestamp()
    });
    
    // Log the like activity
    const activitiesRef = collection(db, 'activities');
    await addDoc(activitiesRef, {
      userId,
      type: 'like_post',
      postId,
      timestamp: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error liking post:', error);
    return { success: false, error: error.message };
  }
};

// Popular Topics
export const getPopularTopics = async () => {
  try {
    const postsRef = collection(db, 'community_posts');
    const querySnapshot = await getDocs(postsRef);
    
    const topicCounts = {};
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const category = data.category || 'general';
      topicCounts[category] = (topicCounts[category] || 0) + 1;
    });
    
    // Convert to array and sort by count
    const topics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return { success: true, data: topics };
  } catch (error) {
    console.error('Error getting popular topics:', error);
    return { success: false, error: error.message };
  }
};

// Initialize sample community data
export const initializeCommunityData = async () => {
  try {
    // Check if data already exists
    const postsRef = collection(db, 'community_posts');
    const existingPosts = await getDocs(postsRef);
    
    if (existingPosts.size > 0) {
      console.log('Community data already exists');
      return { success: true, message: 'Data already exists' };
    }
    
    // Sample users for community posts
    const sampleUsers = [
      { id: 'user1', name: 'David Rosen', email: 'david@example.com' },
      { id: 'user2', name: 'Sarah Goldberg', email: 'sarah@example.com' },
      { id: 'user3', name: 'Michael Rosen', email: 'michael@example.com' },
      { id: 'user4', name: 'Rachel Klein', email: 'rachel@example.com' },
      { id: 'user5', name: 'Aaron Levy', email: 'aaron@example.com' }
    ];
    
    // Create sample users
    for (const user of sampleUsers) {
      const userRef = doc(db, 'users', user.id);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.name,
          email: user.email,
          createdAt: serverTimestamp(),
          studyPlan: 'alef',
          isActive: true
        });
      }
    }
    
    // Sample community posts
    const samplePosts = [
      {
        userId: 'user1',
        title: '¿Cómo mejorar la pronunciación del hebreo?',
        content: 'Llevo unas semanas estudiando y me cuesta trabajo pronunciar algunas letras. ¿Algún consejo para practicar la pronunciación correcta?',
        category: 'pronunciacion',
        likes: 15,
        repliesCount: 8
      },
      {
        userId: 'user2',
        title: 'Consejos para aprender Taamim efectivamente',
        content: 'He estado practicando los Taamim y quería compartir algunos recursos que me han ayudado mucho. También me gustaría escuchar sus experiencias.',
        category: 'taamim',
        likes: 23,
        repliesCount: 12
      },
      {
        userId: 'user3',
        title: 'Nervios antes de la ceremonia',
        content: 'Mi Barmitzva es en dos meses y empiezo a sentir nervios. ¿Es normal? ¿Cómo manejaron ustedes la ansiedad antes del gran día?',
        category: 'ceremonia',
        likes: 31,
        repliesCount: 18
      },
      {
        userId: 'user4',
        title: 'Recursos adicionales para el estudio',
        content: 'Encontré algunos libros y sitios web que complementan muy bien el curso. Los comparto por si les sirven a otros estudiantes.',
        category: 'recursos',
        likes: 19,
        repliesCount: 6
      },
      {
        userId: 'user5',
        title: 'Mi experiencia con el plan Alef',
        content: 'Terminé el plan Alef la semana pasada y quería compartir mi experiencia. Definitivamente recomiendo este curso para principiantes.',
        category: 'experiencias',
        likes: 27,
        repliesCount: 14
      },
      {
        userId: 'user1',
        title: 'Dudas sobre las berajot básicas',
        content: '¿Alguien puede ayudarme con la pronunciación correcta de las berajot del Talit y Tefilín? Tengo algunas dudas específicas.',
        category: 'berajot',
        likes: 12,
        repliesCount: 9
      }
    ];
    
    // Create sample posts
    for (const post of samplePosts) {
      await addDoc(postsRef, {
        ...post,
        timestamp: serverTimestamp(),
        isActive: true
      });
    }
    
    return { success: true, message: 'Community data initialized successfully' };
  } catch (error) {
    console.error('Error initializing community data:', error);
    return { success: false, error: error.message };
  }
};