import { Typography } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import * as S from '@sb-ui/pages/User/LearnPage/BlockElement/Quiz/QuizResult/AnswerResult/AnswerResult.styled';
import variables from '@sb-ui/theme/variables';

const { Text } = Typography;

const Result = ({ correct, results }) => {
  const { t } = useTranslation('user');

  return (
    <>
      <S.AnswerWrapper>
        <Text>
          {correct
            ? t('lesson.answer_result.correct')
            : t('lesson.answer_result.wrong')}
        </Text>
        {correct ? (
          <CheckCircleTwoTone twoToneColor={variables['success-color']} />
        ) : (
          <CloseCircleTwoTone twoToneColor={variables['wrong-color']} />
        )}
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
