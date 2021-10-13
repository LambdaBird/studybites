import T from 'prop-types';

import LearnContext from '@sb-ui/contexts/LearnContext';
import ResultItem from '@sb-ui/pages/Teacher/LessonStudents/LessonResults/ResultItem';
import { useBlockIcons } from '@sb-ui/pages/Teacher/LessonStudents/LessonResults/useBlockIcons';
import BlockElement from '@sb-ui/pages/User/LearnPage/BlockElement';
import { LearnWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';

import * as S from './InteractiveResults.styled';

const InteractiveResults = ({ interactiveResults }) => {
  const blockIcons = useBlockIcons();

  return (
    <LearnContext.Provider value={{ handleInteractiveClick: () => {} }}>
      <S.Collapse>
        {interactiveResults.map(({ block, correctness, time, data }) => {
          const isResult = !!correctness || correctness === 0;
          return (
            <S.Panel
              key={block.blockId}
              $isResult={isResult}
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
        })}
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
