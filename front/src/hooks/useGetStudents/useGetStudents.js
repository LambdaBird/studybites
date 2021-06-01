import { useState, useCallback } from 'react';
import { getStudents } from '../../utils/api/v1/teacher';

const useGetStudents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [studentsData, setStudentsData] = useState(null);

  const getStudentsRequest = useCallback(async () => {
    setIsLoading(true);

    const { status, data } = await getStudents();
    setIsLoading(false);

    if (status === 200) {
      setStudentsData(data);
    }
  }, []);

  return {
    getStudentsRequest,
    studentsData,
    isLoading,
  };
};

export default useGetStudents;
