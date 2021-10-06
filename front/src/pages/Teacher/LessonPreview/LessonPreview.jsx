import { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import Header from '@sb-ui/components/molecules/Header';
import LearnContext from '@sb-ui/contexts/LearnContext';
import {
  apiInteractiveBlocks,
  postLessonByIdPreview,
} from '@sb-ui/pages/Teacher/LessonPreview/utils';
import InfoBlock from '@sb-ui/pages/User/LearnPage/InfoBlock';
import LearnChunk from '@sb-ui/pages/User/LearnPage/LearnChunk';
import * as S from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { useLearnChunks } from '@sb-ui/pages/User/LearnPage/useLearnChunks';
import { getLesson } from '@sb-ui/utils/api/v1/teacher';
import { getUser } from '@sb-ui/utils/api/v1/user';
import { TEACHER_LESSON_BASE_KEY, USER_BASE_QUERY } from '@sb-ui/utils/queries';

const getLessonByIdPreview = async ({ queryKey }) => {
  const data = await getLesson({ queryKey });
  return {
    lesson: {
      ...data.lesson,
      blocks: [],
      interactivePassed: 0,
      interactiveTotal: data.lesson.blocks.filter((block) =>
        apiInteractiveBlocks.includes(block.type),
      ).length,
    },
    total: data.lesson.blocks.length,
  };
};

const LessonPreview = () => {
  const { t } = useTranslation('teacher');
  const { id: lessonId } = useParams();

  const { data: lessonData } = useQuery(
    [TEACHER_LESSON_BASE_KEY, { id: lessonId }],
    getLesson,
  );

  const { data: user } = useQuery(USER_BASE_QUERY, getUser);

  const postLessonByIdPreviewNew = useMemo(
    () => postLessonByIdPreview(lessonData),
    [lessonData],
  );

  const {
    handleInteractiveClick,
    chunks,
    isLoading,
    lesson,
    total,
    learnProgress,
  } = useLearnChunks({
    lessonId,
    getEnrolledLesson: getLessonByIdPreview,
    postLessonById: postLessonByIdPreviewNew,
  });

  const infoBlockLesson = useMemo(
    () => ({
      ...lesson,
      author: user,
    }),
    [lesson, user],
  );

  return (
    <>
      <Helmet>
        <title>{t('pages.lesson_preview')}</title>
      </Helmet>
      <Header hideOnScroll bottom={<S.Progress percent={learnProgress} />} />
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
                  author={user}
                  isLoading={isLoading}
                  total={total}
                  lesson={infoBlockLesson}
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

export default LessonPreview;
