import { useState, useEffect } from 'react';
import { getCommunityStats, getCommunityPosts, getPopularTopics } from '../services/communityService';

export const useCommunity = () => {
  const [communityStats, setCommunityStats] = useState({
    totalMembers: 0,
    totalDiscussions: 0,
    totalResponses: 0,
    thisWeekActivity: 0
  });
  const [communityPosts, setCommunityPosts] = useState([]);
  const [popularTopics, setPopularTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setLoading(true);
        
        // Fetch community stats
        const statsResult = await getCommunityStats();
        if (statsResult.success) {
          setCommunityStats(statsResult.data);
        }

        // Fetch community posts
        const postsResult = await getCommunityPosts(10);
        if (postsResult.success) {
          setCommunityPosts(postsResult.data);
        }

        // Fetch popular topics
        const topicsResult = await getPopularTopics();
        if (topicsResult.success) {
          setPopularTopics(topicsResult.data);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, []);

  const refreshCommunityData = async () => {
    const statsResult = await getCommunityStats();
    if (statsResult.success) {
      setCommunityStats(statsResult.data);
    }
    
    const postsResult = await getCommunityPosts(10);
    if (postsResult.success) {
      setCommunityPosts(postsResult.data);
    }
  };

  return {
    communityStats,
    communityPosts,
    popularTopics,
    loading,
    error,
    refreshCommunityData,
    refreshCommunity: refreshCommunityData
  };
};