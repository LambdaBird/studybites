import T from 'prop-types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useLessonResults } from '@sb-ui/pages/Teacher/LessonStudents/LessonResults/useLessonResults';

import InteractiveResults from './InteractiveResults';
import * as S from './LessonResults.styled';

const generateResultsWithTime = (results) =>
  results.map((result, i) => ({
    ...result,
    time:
      new Date(result.createdAt).getTime() -
      new Date(results?.[i - 1]?.createdAt || result.createdAt).getTime(),
  }));

const LessonResults = ({ results }) => {
  const { t } = useTranslation('teacher');

  const resultsWithTime = useMemo(
    () => generateResultsWithTime(results),
    [results],
  );

  const {
    start,
    finish,
    formattedStartTime,
    formattedFinishTime,
    finishTimeMillis,
    interactiveResults,
  } = useLessonResults({ results: resultsWithTime });

  return (
    <S.Wrapper>
      {start && (
        <S.Start>
          <span>{t('lesson_students_results.start')} </span>
          <S.Time>{formattedStartTime}</S.Time>
        </S.Start>
      )}
      <InteractiveResults interactiveResults={interactiveResults} />
      {finish && (
        <S.Finish>
          <span>{t('lesson_students_results.finish')} </span>
          <S.Time>
            <span>{formattedFinishTime}</span>
            <b>
              (
              {t('lesson_students_results.seconds', {
                time: finishTimeMillis / 1000,
              })}
              )
            </b>
          </S.Time>
        </S.Finish>
      )}
    </S.Wrapper>
  );
};

LessonResults.propTypes = {
  results: T.arrayOf(
    T.shape({
      action: T.string,
      block: T.shape,
      data: T.shape,
      correctness: T.number,
      time: T.number,
    }),
  ),
};

export default LessonResults;
