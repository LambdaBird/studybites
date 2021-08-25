import { Typography } from 'antd';
import { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import LearnContext from '@sb-ui/contexts/LearnContext';
import Select from '@sb-ui/pages/User/LearnPage/BlockElement/Match/Select/Select';
import { useMatch } from '@sb-ui/pages/User/LearnPage/BlockElement/Match/useMatch';
import {
  BlockContentType,
  BlockIdType,
  MatchBlockAnswerType,
  MatchResponseDataType,
  RevisionType,
  SolvedType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { RESPONSE_TYPE } from '@sb-ui/pages/User/LearnPage/utils';

import { verifyAnswers } from './verifyAnswers';
import * as S from './Match.styled';

const { Text } = Typography;

const Match = ({ blockId, revision, answer, content, reply, isSolved }) => {
  const { t } = useTranslation('user');
  const { handleInteractiveClick, id: lessonId } = useContext(LearnContext);

  const { left, setLeft, right, setRight } = useMatch(content.data.values);

  const { correct, results } = useMemo(
    () => verifyAnswers(answer?.results, reply?.response),
    [answer?.results, reply?.response],
  );

  const handleSendClick = useCallback(() => {
    handleInteractiveClick({
      id: lessonId,
      action: RESPONSE_TYPE,
      blockId,
      revision,
      reply: {
        response: left.map(({ value: leftValue }, index) => ({
          left: leftValue,
          right: right[index].value,
        })),
      },
    });
  }, [blockId, handleInteractiveClick, left, lessonId, revision, right]);

  const result = useMatch(results);

  const correctResult = useMatch(answer?.results);

  if (!isSolved) {
    return (
      <>
        <ChunkWrapper>
          <Select
            left={left}
            right={right}
            setLeft={setLeft}
            setRight={setRight}
          />
        </ChunkWrapper>
        <S.ButtonWrapper>
          <S.LessonButtonSend onClick={handleSendClick}>
            {t('lesson.send')}
          </S.LessonButtonSend>
        </S.ButtonWrapper>
      </>
    );
  }

  return (
    <>
      <ChunkWrapper>
        <Select {...result} disabled />
      </ChunkWrapper>
      <ChunkWrapper>
        {correct ? (
          <S.AnswerWrapper>
            <Text>{t('lesson.answer_result.correct')}</Text>
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          </S.AnswerWrapper>
        ) : (
          <>
            <S.AnswerWrapperWrong>
              <S.AnswerWrapperWrongTitle>
                <Text>{t('lesson.answer_result.wrong')}</Text>
                <CloseCircleTwoTone twoToneColor="#F5222D" />
              </S.AnswerWrapperWrongTitle>
              <S.MatchWrapper>
                <Select {...correctResult} disabled showCorrect />
              </S.MatchWrapper>
            </S.AnswerWrapperWrong>
          </>
        )}
      </ChunkWrapper>
    </>
  );
};

Match.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  content: BlockContentType,
  answer: MatchBlockAnswerType,
  reply: MatchResponseDataType,
  isSolved: SolvedType,
};

export default Match;
