import { useEffect, useState } from 'react';
import { getEnrolledLessons } from '@sb-ui/utils/api/v1/student';

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
