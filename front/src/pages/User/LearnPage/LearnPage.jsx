/* eslint no-use-before-define: "off" */
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import Header from '@sb-ui/components/molecules/Header';
import LearnContext from '@sb-ui/contexts/LearnContext';
import InfoBlock from '@sb-ui/pages/User/LearnPage/InfoBlock';
import { getEnrolledLesson, postLessonById } from '@sb-ui/utils/api/v1/student';
import { sbPostfix } from '@sb-ui/utils/constants';
import { USER_HOME } from '@sb-ui/utils/paths';

import LearnChunk from './LearnChunk';
import { useLearnChunks } from './useLearnChunks';
import * as S from './LearnPage.styled';

const HISTORY_BACK = 'POP';

const LearnPage = () => {
  const { t } = useTranslation('user');
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
  const history = useHistory();
  const location = useLocation();

  useEffect(
    () => () => {
      if (location.state.fromEnroll && history.action === HISTORY_BACK) {
        history.replace(USER_HOME);
      }
    },
    [history, location],
  );

  return (
    <>
      <Helmet>
        <title>
          {t('pages.learn', { name: lesson?.name })}
          {sbPostfix}
        </title>
      </Helmet>
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
