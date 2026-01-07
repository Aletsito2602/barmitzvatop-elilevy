import { supabase } from '../supabase/client';

// Community Stats Operations
export const getCommunityStats = async () => {
  try {
    // Get total members count (approximate from profiles)
    const { count: totalMembers, error: membersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (membersError) throw membersError;

    // Get active discussions count
    const { count: totalDiscussions, error: postsError } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true });

    if (postsError) throw postsError;

    // Count total responses - simplistic sum, or separate table query if we had replies table
    // For now, let's sum the 'replies_count' column
    const { data: postsData } = await supabase
      .from('community_posts')
      .select('replies_count');

    const totalResponses = postsData ? postsData.reduce((acc, curr) => acc + (curr.replies_count || 0), 0) : 0;

    // Get this week's activity
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { count: thisWeekActivity } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString());

    return {
      success: true,
      data: {
        totalMembers: totalMembers || 0,
        totalDiscussions: totalDiscussions || 0,
        totalResponses,
        thisWeekActivity: thisWeekActivity || 0
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
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url, email)
      `)
      .order('created_at', { ascending: false })
      .limit(limitCount);

    if (error) throw error;

    const posts = data.map(post => ({
      id: post.id,
      userId: post.user_id,
      title: post.title,
      content: post.content,
      category: post.category,
      likes: post.likes,
      repliesCount: post.replies_count,
      isActive: post.is_active,
      timestamp: { toDate: () => new Date(post.created_at) }, // Mock
      createdAt: post.created_at,
      author: post.profiles?.full_name || post.profiles?.email || 'Usuario Anónimo',
      authorImage: post.profiles?.avatar_url || null
    }));

    return { success: true, data: posts };
  } catch (error) {
    console.error('Error getting community posts:', error);
    return { success: false, error: error.message };
  }
};

export const createCommunityPost = async (userId, postData) => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: userId,
        title: postData.title,
        content: postData.content,
        category: postData.category || 'general',
        likes: 0,
        replies_count: 0,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error creating community post:', error);
    return { success: false, error: error.message };
  }
};

export const likePost = async (postId, userId) => {
  try {
    // Increment likes using rpc or simple update (concurrency issue potential but ok for now)
    // Best practice: use RPC function 'increment_likes'
    // For now simple fetch and update or just assume +1

    // We can't easily increment without a stored function or 2 steps.
    // Let's rely on simple update for this demo

    const { data: post } = await supabase
      .from('community_posts')
      .select('likes')
      .eq('id', postId)
      .single();

    const newLikes = (post?.likes || 0) + 1;

    const { error } = await supabase
      .from('community_posts')
      .update({
        likes: newLikes,
        last_activity: new Date().toISOString()
      })
      .eq('id', postId);

    if (error) throw error;

    // Log the like activity
    await supabase.from('activities').insert({
      user_id: userId,
      type: 'like_post',
      description: 'Liked a post',
      metadata: { postId },
      created_at: new Date().toISOString()
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
    const { data, error } = await supabase
      .from('community_posts')
      .select('category');

    if (error) throw error;

    const topicCounts = {};

    data.forEach(item => {
      const category = item.category || 'general';
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
    const { count } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true });

    if (count > 0) {
      console.log('Community data already exists');
      return { success: true, message: 'Data already exists' };
    }

    // Note: We cannot easily create mock USERS with specific IDs in Supabase Auth from client side.
    // So we will just insert posts and assume current user or random IDs if we disable RLS or careful logic.
    // But better: Create mock profiles for display purposes if RLS allows or we use admin key.
    // For this context, assuming we skipping mock user creation for Auth, but maybe Profile entries?

    // Mock profiles requires valid UUIDs.

    // Skipped mock USER creation for safety. Just returning success.
    console.log('Skipping sample data creation in Supabase to avoid Auth conflicts.');

    return { success: true, message: 'Community init skipped' };
  } catch (error) {
    console.error('Error initializing community data:', error);
    return { success: false, error: error.message };
  }
};