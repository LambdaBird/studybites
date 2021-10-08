import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getLanguageCodeByKey } from '@sb-ui/i18n';
import { formatDate } from '@sb-ui/utils/utils';

export const useLessonResults = ({ startTime, results }) => {
  const { i18n } = useTranslation('teacher');
  const languageCode = useMemo(
    () => getLanguageCodeByKey(i18n.language),
    [i18n.language],
  );
  const formattedStartTime = useMemo(
    () => formatDate(startTime, languageCode),
    [languageCode, startTime],
  );
  const finishTimeMillis = useMemo(
    () => results.reduce((acc, next) => acc + next.time, 0),
    [results],
  );

  const formattedFinishTime = useMemo(
    () =>
      formatDate(
        new Date(new Date(startTime).getTime() + finishTimeMillis),
        languageCode,
      ),
    [finishTimeMillis, languageCode, startTime],
  );

  return { formattedFinishTime, formattedStartTime, finishTimeMillis };
};
