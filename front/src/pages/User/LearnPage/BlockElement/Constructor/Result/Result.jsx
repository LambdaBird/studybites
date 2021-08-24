import { Typography } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import * as S from '@sb-ui/pages/User/LearnPage/BlockElement/Quiz/QuizResult/AnswerResult/AnswerResult.styled';

const { Text } = Typography;

const Result = ({ correct, results }) => {
  const { t } = useTranslation('user');

  return (
    <>
      {correct ? (
        <S.AnswerWrapper>
          <Text>{t('lesson.answer_result.correct')}</Text>
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        </S.AnswerWrapper>
      ) : (
        <>
          <S.AnswerWrapper>
            <Text>{t('lesson.answer_result.wrong')}</Text>
            <CloseCircleTwoTone twoToneColor="#F5222D" />
          </S.AnswerWrapper>
          <Text italic>{results.join(' ')}</Text>
        </>
      )}
    </>
  );
};

Result.propTypes = {
  results: PropTypes.arrayOf(PropTypes.string),
  correct: PropTypes.bool,
};

export default Result;
