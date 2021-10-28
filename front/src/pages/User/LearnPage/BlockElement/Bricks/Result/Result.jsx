import { Typography } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { FailCircle, SuccessCircle } from '../../BlockElement.styled';
import * as S from './Result.styled';

const { Text } = Typography;

const Result = ({ correct, results }) => {
  const { t } = useTranslation('user');
  const titleKey = correct
    ? `lesson.answer_result.correct`
    : `lesson.answer_result.wrong`;

  return (
    <>
      <S.AnswerWrapper>
        <Text>{t(titleKey)}</Text>
        {correct ? <SuccessCircle /> : <FailCircle />}
      </S.AnswerWrapper>
      {!correct && (
        <S.ResultWrapper>
          <Text italic>{results.join(' ')}</Text>
        </S.ResultWrapper>
      )}
    </>
  );
};

Result.propTypes = {
  results: PropTypes.arrayOf(PropTypes.string),
  correct: PropTypes.bool,
};

export default Result;
