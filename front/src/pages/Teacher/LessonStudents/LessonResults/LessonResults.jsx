import T from 'prop-types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getLanguageCodeByKey } from '@sb-ui/i18n';
import { useBlockIcons } from '@sb-ui/pages/Teacher/LessonStudents/LessonResults/useBlockIcons';
import BlockElement from '@sb-ui/pages/User/LearnPage/BlockElement';
import { LearnWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { formatDate } from '@sb-ui/utils/utils';

import { getInteractiveResults } from './getInteractiveResults';
import ResultItem from './ResultItem';
import * as S from './LessonResults.styled';

const LessonResults = ({ results, startTime }) => {
  const { t, i18n } = useTranslation('teacher');

  const blockIcons = useBlockIcons();

  const languageCode = useMemo(
    () => getLanguageCodeByKey(i18n.language),
    [i18n.language],
  );
  const [start, finish, interactiveResults] = getInteractiveResults({
    results,
  });

  const formattedStartTime = formatDate(startTime, languageCode);
  const finishTimeMillis = interactiveResults.reduce(
    (acc, next) => acc + next.time,
    0,
  );

  const formattedFinishTime = formatDate(
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
      <S.Collapse>
        {interactiveResults.map(
          ({ block, data, correctness, time = 0 }, index) => {
            const isResult = !!correctness || correctness === 0;
            return (
              <S.Panel
                key={block.id}
                isResult={isResult}
                header={
                  <ResultItem
                    showCircle={isResult}
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
