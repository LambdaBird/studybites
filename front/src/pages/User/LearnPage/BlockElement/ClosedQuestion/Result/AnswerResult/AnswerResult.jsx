import { Typography } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
  FailCircle,
  SuccessCircle,
} from '@sb-ui/pages/User/LearnPage/BlockElement/BlockElement.styled';
import * as S from '@sb-ui/pages/User/LearnPage/BlockElement/Quiz/Quiz.styled';

const { Text } = Typography;

const AnswerResult = ({ correct, results, explanation }) => {
  const { t } = useTranslation('user');
  return (
    <>
      {correct ? (
        <S.AnswerWrapper>
          <Text>{t('lesson.answer_result.correct')}</Text>
          <SuccessCircle />
        </S.AnswerWrapper>
      ) : (
        <>
          <S.AnswerWrapper>
            <Text>
              {`${t('lesson.answer_result.wrong')} ${
                results ? `${results?.join(', ')}.` : ''
              } ${explanation || ''}`}
            </Text>
            <FailCircle />
          </S.AnswerWrapper>
        </>
      )}
    </>
  );
};

AnswerResult.propTypes = {
  results: PropTypes.arrayOf(PropTypes.string),
  explanation: PropTypes.string,
  correct: PropTypes.bool,
};

export default AnswerResult;
