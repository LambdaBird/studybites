import T from 'prop-types';

import LearnContext from '@sb-ui/contexts/LearnContext';
import ResultItem from '@sb-ui/pages/Teacher/LessonStudents/LessonResults/ResultItem';
import { BLOCKS_TYPE_LIST_RATED } from '@sb-ui/pages/Teacher/LessonStudents/LessonResults/ResultItem/constants';
import { useBlockIcons } from '@sb-ui/pages/Teacher/LessonStudents/LessonResults/useBlockIcons';
import BlockElement from '@sb-ui/pages/User/LearnPage/BlockElement';
import { LearnWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';

import * as S from './InteractiveResults.styled';

const InteractiveResults = ({ interactiveResults }) => {
  const blockIcons = useBlockIcons();

  return (
    <LearnContext.Provider value={{ handleInteractiveClick: () => {} }}>
      <S.Collapse>
        {interactiveResults.map(
          ({ block, correctness, time, data, lessonId, id }) => {
            const isResult =
              !!correctness ||
              correctness === 0 ||
              BLOCKS_TYPE_LIST_RATED.includes(block.type);
            return (
              <S.Panel
                key={block.blockId}
                $isResult={isResult}
                header={
                  <ResultItem
                    id={id}
                    showCircle={isResult}
                    icons={blockIcons}
                    block={block}
                    correctness={correctness}
                    time={time}
                    lessonId={lessonId}
                  />
                }
              >
                {isResult && (
                  <LearnWrapper>
                    <BlockElement
                      element={{
                        blockId: block.id,
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
  );
};

InteractiveResults.propTypes = {
  interactiveResults: T.arrayOf(
    T.shape({
      block: T.shape({}),
      data: T.shape({}),
      correctness: T.number,
      time: T.number,
    }),
  ),
};

export default InteractiveResults;
