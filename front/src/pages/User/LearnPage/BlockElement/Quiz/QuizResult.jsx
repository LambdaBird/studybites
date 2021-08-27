import { Typography } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import ColumnDisabledCheckbox from '@sb-ui/components/atoms/ColumnDisabledCheckbox';

import * as S from './Quiz.styled';

const { Text } = Typography;

const QuizResult = ({ correct, value, options }) => {
  const { t } = useTranslation('user');

  if (correct) {
    return (
      <S.AnswerWrapper>
        <Text>{t('lesson.answer_result.correct')}</Text>
        <CheckCircleTwoTone twoToneColor="#52c41a" />
      </S.AnswerWrapper>
    );
  }

  return (
    <>
      <S.AnswerWrapper>
        <Text>{t('lesson.answer_result.wrong')}</Text>
        <CloseCircleTwoTone twoToneColor="#F5222D" />
      </S.AnswerWrapper>
      <ColumnDisabledCheckbox value={value} options={options} />
    </>
  );
};

QuizResult.propTypes = {
  correct: PropTypes.bool,
  value: PropTypes.arrayOf(PropTypes.number),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      value: PropTypes.number,
      correct: PropTypes.bool,
    }),
  ),
};

export default QuizResult;
