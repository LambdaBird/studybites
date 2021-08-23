import { Typography } from 'antd';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import LearnContext from '@sb-ui/contexts/LearnContext';
import Select from '@sb-ui/pages/User/LearnPage/BlockElement/Match/Select/Select';
import {
  BlockContentType,
  BlockIdType,
  MatchBlockAnswerType,
  MatchResponseDataType,
  RevisionType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import { RESPONSE_TYPE } from '@sb-ui/pages/User/LearnPage/utils';

import { verifyAnswers } from './verifyAnswers';
import * as S from './Match.styled';

const { Text } = Typography;

const Match = ({ blockId, revision, answer, content, data }) => {
  const { t } = useTranslation('user');
  const { handleInteractiveClick, id: lessonId } = useContext(LearnContext);
  const [response, setResponse] = useState([]);
  const handleSendClick = () => {
    handleInteractiveClick({
      id: lessonId,
      action: RESPONSE_TYPE,
      blockId,
      revision,
      data: {
        response,
      },
    });
  };

  if (!answer) {
    return (
      <>
        <ChunkWrapper>
          <Select values={content.data.values} onData={setResponse} />
        </ChunkWrapper>
        <S.ButtonWrapper>
          <S.LessonButtonSend onClick={handleSendClick}>
            {t('lesson.send')}
          </S.LessonButtonSend>
        </S.ButtonWrapper>
      </>
    );
  }

  const newData = {
    answer: content.data.answer,
  };
  if (data?.response) {
    newData.answer = data.response;
  }

  const { correct, results } = verifyAnswers(answer?.results, newData?.answer);
  return (
    <>
      <ChunkWrapper>
        <Select values={results} disabled />
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
                <Select values={answer.results} disabled showCorrect />
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
  data: MatchResponseDataType,
};

export default Match;
