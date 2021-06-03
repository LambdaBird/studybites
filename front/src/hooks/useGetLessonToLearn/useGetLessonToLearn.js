import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getLessonToLearn } from '../../utils/api/v1/lesson';

const getTranslationFromMessageData = (t, data) => {
  const { key, message } = data;
  const text = t(key);
  if (text === key) {
    return message;
  }
  return text;
};

const useGetLessonToLearn = (lessonId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lessonData, setLessonData] = useState(null);
  const [isError, setIsError] = useState(null);
  const { t } = useTranslation();

  const getLessonToLearnRequest = useCallback(async () => {
    setIsLoading(true);
    const {
      status,
      data,
    } = await getLessonToLearn({
      id: lessonId,
    });
    setIsLoading(false);

    if (status === 200) {
      setLessonData(data);
    } else {
      const { errors, fallback } = data;
      let textError = errors
        ?.map((errorData) => getTranslationFromMessageData(t, errorData))
        .join(', ');
      if (!textError) {
        textError = t(fallback);
      }
      if (!fallback) {
        textError = t('errors.no_internet');
      }
      setIsError(textError);
    }
  }, [lessonId]);

  return {
    getLessonToLearnRequest,
    lessonData,
    isLoading,
    isError,
  };
};

export default useGetLessonToLearn;