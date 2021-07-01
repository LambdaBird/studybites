import { useEffect, useState } from 'react';
import { getEnrolledLessons } from '../../../../../utils/api/v1/lesson/lesson';

export const useLessonsRequest = () => {
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState([]);

  const getLessons = async () => {
    setLoading(true);
    try {
      const { status, data } = await getEnrolledLessons({ limit: 3 });
      if (status === 200) {
        setLessons(data?.data);
      }
    } catch (e) {
      setLessons([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getLessons();
  }, []);

  return { loading, lessons };
};
