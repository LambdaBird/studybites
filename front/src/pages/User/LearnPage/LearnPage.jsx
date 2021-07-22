/* eslint no-use-before-define: "off" */

import { useParams } from 'react-router-dom';

import LearnContext from '@sb-ui/contexts/LearnContext';
import InfoBlock from '@sb-ui/pages/User/LessonPage/InfoBlock';

import LearnChunk from './LearnChunk';
import { useLearnChunks } from './useLearnChunks';
import * as S from './LearnPage.styled';

const LearnPage = () => {
  const { id: lessonId } = useParams();
  const leanProgress = 50;
  const { handleInteractiveClick, chunks, isLoading, lesson, total } =
    useLearnChunks({ lessonId });

  return (
    <>
      <S.Header bottom={<S.Progress percent={leanProgress} />} />
      <S.Wrapper>
        <S.GlobalStylesLearnPage />
        <S.Row>
          <S.BlockCell>
            <LearnContext.Provider
              value={{
                handleInteractiveClick,
                id: lessonId,
              }}
            >
              <S.LearnWrapper>
                <InfoBlock
                  isLoading={isLoading}
                  total={total}
                  lesson={lesson}
                />
                {chunks.map((chunk, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <LearnChunk key={index} chunk={chunk} />
                ))}
              </S.LearnWrapper>
            </LearnContext.Provider>
          </S.BlockCell>
        </S.Row>
      </S.Wrapper>
    </>
  );
};

export default LearnPage;
