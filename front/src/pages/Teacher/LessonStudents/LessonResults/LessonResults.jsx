import T from 'prop-types';
import { useTranslation } from 'react-i18next';

import { useLessonResults } from '@sb-ui/pages/Teacher/LessonStudents/LessonResults/useLessonResults';

import InteractiveResults from './InteractiveResults';
import * as S from './LessonResults.styled';

const LessonResults = ({ results, startTime }) => {
  const { t } = useTranslation('teacher');

  const {
    start,
    finish,
    interactiveResults,
    formattedStartTime,
    formattedFinishTime,
    finishTimeMillis,
  } = useLessonResults({ startTime, results });

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
  startTime: T.string,
};

export default LessonResults;
