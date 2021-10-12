import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getLanguageCodeByKey } from '@sb-ui/i18n';
import { getInteractiveResults } from '@sb-ui/pages/Teacher/LessonStudents/LessonResults/getInteractiveResults';
import { formatDate } from '@sb-ui/utils/utils';

export const useLessonResults = ({ results }) => {
  const { i18n } = useTranslation('teacher');

  const [start, finish, interactiveResults] = getInteractiveResults({
    results,
  });

  const startTime = start && results?.[0]?.createdAt;

  const languageCode = useMemo(
    () => getLanguageCodeByKey(i18n.language),
    [i18n.language],
  );
  const formattedStartTime = useMemo(
    () => start && formatDate(startTime, languageCode),
    [languageCode, start, startTime],
  );

  const finishTimeMillis = useMemo(
    () =>
      finish &&
      results.reduce((acc, next) => acc + next.time, 0) + (finish?.time || 0),
    [finish, results],
  );

  const formattedFinishTime = useMemo(
    () =>
      finish &&
      formatDate(
        new Date(new Date(startTime).getTime() + finishTimeMillis),
        languageCode,
      ),
    [finish, finishTimeMillis, languageCode, startTime],
  );

  return {
    start,
    finish,
    interactiveResults,
    formattedFinishTime,
    formattedStartTime,
    finishTimeMillis,
  };
};
