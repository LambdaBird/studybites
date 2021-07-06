import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';

import QuizBlock from '@sb-ui/pages/User/LessonPage/QuizBlock';
import Header from '@sb-ui/pages/User/LessonPage/Header';

import GroupBlock from '@sb-ui/pages/User/LessonPage/GroupBlock';
import BlockElement from '@sb-ui/pages/User/LessonPage/BlockElement';

import * as S from './LessonPage.styled';
import { useLesson } from './useLesson';
import { NEXT_TYPE, QUIZ_TYPE } from './utils';

const LessonPage = () => {
  const { t } = useTranslation();
  const {
    lesson,
    blocks,
    total,
    nextCount,
    isLoading,
    isFinal,
    interactiveBlock,
    setQuizAnswer,
    handleSendClick,
    handleFinishClick,
    handleNextClick,
    handleStartClick,
  } = useLesson();

  return (
    <S.Page>
      <S.GlobalStylesLessonPage />
      <Header
        lesson={lesson}
        percent={(blocks?.flat()?.length / (total - nextCount)) * 100}
        total={total - nextCount}
        isLoading={isLoading}
      />

      {blocks.map((groupBlock) => (
        <GroupBlock
          key={groupBlock?.map((x) => x.blockId).join('')}
          elements={groupBlock.map((block) => (
            <BlockElement element={block} />
          ))}
        />
      ))}

      {!isLoading &&
        (isFinal ||
          (interactiveBlock?.type === NEXT_TYPE && !isFinal) ||
          (!interactiveBlock && blocks?.length === 0)) && (
          <S.PageRowStart justify="center" align="top">
            <S.BlockCol
              xs={{ span: 20 }}
              sm={{ span: 18 }}
              md={{ span: 16 }}
              lg={{ span: 14 }}
            >
              {!interactiveBlock && blocks?.length === 0 && (
                <S.LessonButton onClick={handleStartClick}>
                  {t('lesson.start')}
                </S.LessonButton>
              )}
              {interactiveBlock?.type === NEXT_TYPE && !isFinal && (
                <S.LessonButton onClick={handleNextClick}>
                  {t('lesson.next')}
                </S.LessonButton>
              )}

              {isFinal && (
                <S.LessonButton onClick={handleFinishClick}>
                  {t('lesson.finish')}
                </S.LessonButton>
              )}
            </S.BlockCol>
          </S.PageRowStart>
        )}

      {!isLoading && interactiveBlock?.type === QUIZ_TYPE && !isFinal && (
        <>
          <Row justify="center">
            <Col span={24}>
              <GroupBlock
                elements={[
                  <S.TextItalic>
                    {interactiveBlock?.content?.data?.question}
                  </S.TextItalic>,
                ]}
              />
            </Col>
          </Row>
          <S.RowQuiz justify="center" align="top">
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 16 }}
              lg={{ span: 14 }}
            >
              <QuizBlock
                key={interactiveBlock?.blockId}
                setQuiz={setQuizAnswer}
                data={interactiveBlock?.content?.data}
              />
            </Col>
            <S.SendWrapper
              xs={{ span: 20 }}
              sm={{ span: 18 }}
              md={{ span: 16 }}
              lg={{ span: 14 }}
            >
              <S.LessonButtonSend onClick={handleSendClick}>
                {t('lesson.send')}
              </S.LessonButtonSend>
            </S.SendWrapper>
          </S.RowQuiz>
        </>
      )}
    </S.Page>
  );
};

export default LessonPage;
