/* eslint no-use-before-define: "off" */
import { useParams } from 'react-router-dom';

import Header from '@sb-ui/components/molecules/Header';
import LearnContext from '@sb-ui/contexts/LearnContext';
import InfoBlock from '@sb-ui/pages/User/LearnPage/InfoBlock';
import { getEnrolledLesson, postLessonById } from '@sb-ui/utils/api/v1/student';

import LearnChunk from './LearnChunk';
import { useLearnChunks } from './useLearnChunks';
import * as S from './LearnPage.styled';

const LearnPage = () => {
  const { id: lessonId } = useParams();
  const {
    handleInteractiveClick,
    chunks,
    isLoading,
    lesson,
    total,
    learnProgress,
    progressStatus,
  } = useLearnChunks({
    lessonId,
    getEnrolledLesson,
    postLessonById,
  });

  return (
    <>
      <Header
        hideOnScroll
        bottom={<S.Progress percent={learnProgress} status={progressStatus} />}
      />
      <S.Wrapper>
        <S.GlobalStylesLearnPage />
        <S.Row>
          <S.BlockCell>
            <LearnContext.Provider
              value={{
                handleInteractiveClick,
                chunks,
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
