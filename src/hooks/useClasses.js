import { useState, useEffect } from 'react';
import { getAllClasses } from '../services/classesService';

export const useClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const result = await getAllClasses();
        
        if (result.success) {
          setClasses(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const refreshClasses = async () => {
    const result = await getAllClasses();
    if (result.success) {
      setClasses(result.data);
    }
  };

  return {
    classes,
    loading,
    error,
    refreshClasses
  };
};