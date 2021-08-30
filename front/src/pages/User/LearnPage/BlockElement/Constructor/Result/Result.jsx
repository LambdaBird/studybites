import { Typography } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

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
        {correct ? <S.SuccessCircle /> : <S.FailCircle />}
      </S.AnswerWrapper>
      {!correct && <Text italic>{results.join(' ')}</Text>}
    </>
  );
};

Result.propTypes = {
  results: PropTypes.arrayOf(PropTypes.string),
  correct: PropTypes.bool,
};

export default Result;
