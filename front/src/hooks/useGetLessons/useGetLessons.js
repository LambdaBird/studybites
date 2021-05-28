import { useState, useCallback } from 'react';
import { getLessons } from '../../utils/api/v1/lesson';

const useGetLessons = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lessonsData, setLessonsData] = useState(null);

  const getLessonsRequest = useCallback(
    async () => {
      setIsLoading(true);
  
      const { status, data } = await getLessons();
      setIsLoading(false);
  
      if (status === 200) {
        setLessonsData(data);
      }
    },
    [],
  )

  return {
    getLessonsRequest,
    lessonsData,
    isLoading
  };
};

export default useGetLessons;
