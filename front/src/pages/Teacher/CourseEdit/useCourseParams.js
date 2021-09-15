import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_NAME_LENGTH = 255;

export const useCourseParams = ({ course = {} }) => {
  const inputTitle = useRef(null);
  const { name: courseName, description: courseDescription } = course;
  const [name, setName] = useState(courseName);
  const [description, setDescription] = useState(courseDescription);

  const handleInputTitle = useCallback((e) => {
    const newText = e.target.value;
    if (newText.length < MAX_NAME_LENGTH) {
      setName(newText);
    }
  }, []);

  const handleChangeDescription = useCallback(
    (e) => setDescription(e.target.value),
    [],
  );

  useEffect(() => {
    if (course?.name) {
      setName(course.name);
    }
    if (course?.description) {
      setDescription(course.description);
    }
  }, [course]);

  return {
    inputTitle,
    name,
    setName,
    description,
    handleInputTitle,
    handleChangeDescription,
  };
};
