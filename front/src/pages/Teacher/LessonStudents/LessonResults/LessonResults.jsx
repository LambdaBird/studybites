import T from 'prop-types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import { getLanguageCodeByKey } from '@sb-ui/i18n';
import { useBlockIcons } from '@sb-ui/pages/Teacher/LessonStudents/LessonResults/useBlockIcons';
import BlockElement from '@sb-ui/pages/User/LearnPage/BlockElement';
import { LearnWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { formatDate } from '@sb-ui/utils/utils';

import { getInteractiveResults } from './getInteractiveResults';
import ResultItem from './ResultItem';
import * as S from './LessonResults.styled';

const generateResultsWithTime = (results) =>
  results.map((result, i) => ({
    ...result,
    time:
      new Date(result.createdAt).getTime() -
      new Date(results?.[i - 1]?.createdAt || result.createdAt).getTime(),
  }));

const LessonResults = ({ results }) => {
  const resultsWithTime = useMemo(
    () => generateResultsWithTime(results),
    [results],
  );

  const { t, i18n } = useTranslation('teacher');
  const blockIcons = useBlockIcons();

  const languageCode = useMemo(
    () => getLanguageCodeByKey(i18n.language),
    [i18n.language],
  );
  const [start, finish, interactiveResults] = getInteractiveResults({
    results: resultsWithTime,
  });
  const startTime = start && resultsWithTime?.[0]?.createdAt;

  const formattedStartTime = start && formatDate(startTime, languageCode);
  const finishTimeMillis =
    finish &&
    interactiveResults.reduce((acc, next) => acc + next.time, 0) + finish?.time;

  const formattedFinishTime =
    finish &&
    formatDate(
      new Date(new Date(startTime).getTime() + finishTimeMillis),
      languageCode,
    );

  return (
    <S.Wrapper>
      {start && (
        <S.Start>
          <span>{t('lesson_students_results.start')} </span>
          <S.Time>{formattedStartTime}</S.Time>
        </S.Start>
      )}
      <LearnContext.Provider value={{ handleInteractiveClick: () => {} }}>
        <S.Collapse>
          {interactiveResults.map(
            ({ block, data, correctness, time = 0 }, index) => {
              const isResult = typeof correctness === 'number';
              return (
                <S.Panel
                  key={block.blockId}
                  isResult={isResult}
                  header={
                    <ResultItem
                      icons={blockIcons}
                      block={block}
                      correctness={correctness}
                      time={time}
                    />
                  }
                >
                  {isResult && (
                    <LearnWrapper>
                      <BlockElement
                        element={{
                          blockId: `${index}`,
                          ...block,
                          reply: data,
                          isSolved: true,
                        }}
                      />
                    </LearnWrapper>
                  )}
                </S.Panel>
              );
            },
          )}
        </S.Collapse>
      </LearnContext.Provider>
      {finish && (
        <S.Finish>
          <span>{t('lesson_students_results.finish')} </span>
          <S.Time>
            <span>{formattedFinishTime}</span>
            <b>
              ({finishTimeMillis / 1000} {t('lesson_students_results.seconds')})
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
      createdAt: T.string,
    }),
  ),
};

export default LessonResults;
