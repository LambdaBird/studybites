import { useEffect, useState } from 'react';

import { useHistory, useParams } from 'react-router-dom';
import { Col, Progress, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { LESSON_BASE_QUERY } from '@sb-ui/utils/queries';
import {
  generateBlockByElement,
  groupBlocks,
  prepareResultToAnswers,
} from '@sb-ui/pages/User/LessonPage/utils';
import Block from '@sb-ui/pages/User/LessonPage/Block';
import { getLessonById, postLessonById } from '@sb-ui/utils/api/v1/lesson';
import { USER_HOME } from '@sb-ui/utils/paths';
import QuizBlock from '@sb-ui/pages/User/LessonPage/QuizBlock';
import InfoBlock from './InfoBlock';
import * as S from './LessonPage.styled';

const { Text } = Typography;

const LessonPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const { id: lessonId } = useParams();
  const [blocks, setBlocks] = useState([]);
  const [interactiveBlock, setInteractiveBlock] = useState();
  const [quizAnswer, setQuizAnswer] = useState({});
  const [isFinal, setIsFinal] = useState(false);
  const [total, setTotal] = useState(0);
  const [nextCount, setNextCount] = useState(0);

  const { data: responseData, isLoading } = useQuery(
    [
      LESSON_BASE_QUERY,
      {
        id: lessonId,
      },
    ],
    getLessonById,
  );

  const { mutate } = useMutation(postLessonById, {
    onSuccess: (newBlocks) => {
      const { isFinal: finishStatus, lesson, total: totalBlocks } = newBlocks;
      if (finishStatus) {
        setIsFinal(finishStatus);
      }
      const answers = lesson?.userAnswer?.response;

      const dataBlocks = lesson?.blocks;
      if (dataBlocks) {
        if (lesson?.blocks?.length === totalBlocks) {
          setNextCount(dataBlocks.filter((x) => x.type === 'next').length);
          setBlocks([...groupBlocks(dataBlocks)]);
          setInteractiveBlock(null);
        } else {
          setNextCount(
            (prev) => prev + dataBlocks.filter((x) => x.type === 'next').length,
          );
          setBlocks((prev) => {
            const newPrev = JSON.parse(JSON.stringify(prev));
            if (answers) {
              newPrev[newPrev.length - 1][0].content.data.answers = newPrev[
                newPrev.length - 1
              ]?.[0]?.content?.data?.answers?.map((x, i) => ({
                ...x,
                correct: answers[i],
              }));
              newPrev[newPrev.length - 1][0].answer = {
                results: lesson?.answer?.results,
              };
            }
            return [...newPrev, ...groupBlocks(dataBlocks)];
          });
          const lastBlock = dataBlocks[dataBlocks.length - 1];
          if (lastBlock) {
            setInteractiveBlock(lastBlock);
          }
        }
      }
    },
  });

  useEffect(() => {
    const preparedData = prepareResultToAnswers(responseData);
    const dataBlocks = preparedData?.lesson?.blocks;
    const finishStatus = preparedData?.isFinal;
    if (finishStatus) {
      setIsFinal(finishStatus);
    }
    const totalData = preparedData?.total;
    setTotal(totalData);

    if (dataBlocks) {
      setBlocks(groupBlocks(dataBlocks));
      setNextCount(dataBlocks.filter((x) => x.type === 'next').length);
      if (totalData === dataBlocks.length) {
        setInteractiveBlock(null);
      } else {
        const lastBlock = dataBlocks[dataBlocks.length - 1];
        if (lastBlock) {
          setInteractiveBlock(lastBlock);
        }
      }
    }
  }, [responseData]);

  const { lesson } = responseData || {};

  const handleStartClick = () => {
    mutate({ id: lessonId, action: 'start' });
  };

  const handleNextClick = () => {
    const { revision, blockId } = interactiveBlock;
    mutate({ id: lessonId, action: 'next', revision, blockId });
  };

  const handleFinishClick = () => {
    mutate({ id: lessonId, action: 'finish' });
    history.push(USER_HOME);
  };

  const handleSendClick = () => {
    const { revision, blockId } = interactiveBlock;
    mutate({
      id: lessonId,
      action: 'response',
      revision,
      blockId,
      data: {
        response: interactiveBlock?.content?.data?.answers.map(
          (x, i) => !!quizAnswer.includes(i),
        ),
      },
    });
  };

  return (
    <S.Page>
      <S.GlobalStylesLessonPage />
      <S.ProgressCol span={24}>
        <Progress
          showInfo={false}
          percent={(blocks?.flat()?.length / (total - nextCount)) * 100}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </S.ProgressCol>
      <S.PageRow justify="center" align="top">
        <S.BlockCol
          xs={{ span: 20 }}
          sm={{ span: 18 }}
          md={{ span: 16 }}
          lg={{ span: 14 }}
        >
          <InfoBlock
            isLoading={isLoading}
            total={total - nextCount}
            lesson={lesson}
          />
        </S.BlockCol>
      </S.PageRow>

      {blocks?.map((block) => (
        <Block>
          {block
            .map((element) => generateBlockByElement(element))
            .filter((x) => !!x)}
        </Block>
      ))}
      {!isLoading &&
        (isFinal ||
          (interactiveBlock?.type === 'next' && !isFinal) ||
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
              {interactiveBlock?.type === 'next' && !isFinal && (
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

      {!isLoading && interactiveBlock?.type === 'quiz' && !isFinal && (
        <>
          <Row justify="center">
            <Col
              xs={{ span: 20 }}
              sm={{ span: 18 }}
              md={{ span: 16 }}
              lg={{ span: 14 }}
            >
              <Block isQuiz>
                <Text
                  style={{
                    fontStyle: 'italic',
                  }}
                >
                  {interactiveBlock?.content?.data?.question}
                </Text>
              </Block>
            </Col>
          </Row>
          <S.RowQuiz justify="center" align="top">
            <Col span={24}>
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
                Send
              </S.LessonButtonSend>
            </S.SendWrapper>
          </S.RowQuiz>
        </>
      )}
    </S.Page>
  );
};

export default LessonPage;
