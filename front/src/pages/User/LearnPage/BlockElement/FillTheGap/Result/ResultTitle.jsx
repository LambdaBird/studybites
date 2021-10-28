import { Typography } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
  CORRECT_ALL,
  CORRECT_NONE,
  CORRECT_PARTIAL,
} from '@sb-ui/pages/User/LearnPage/BlockElement/FillTheGap/constants';
import * as S from '@sb-ui/pages/User/LearnPage/BlockElement/FillTheGap/Result/Result.styled';

import {
  FailCircle,
  PartialFailCircle,
  SuccessCircle,
} from '../../BlockElement.styled';

const { Text } = Typography;

const ResultTitle = ({ correct }) => {
  const { t } = useTranslation('user');
  switch (correct) {
    case CORRECT_ALL:
      return (
        <S.AnswerWrapper>
          <Text>{t('lesson.answer_result.correct')}</Text>
          <SuccessCircle />
        </S.AnswerWrapper>
      );
    case CORRECT_PARTIAL:
      return (
        <S.AnswerWrapper>
          <Text>{t('lesson.answer_result.partially_wrong')}</Text>
          <PartialFailCircle />
        </S.AnswerWrapper>
      );
    case CORRECT_NONE:
      return (
        <S.AnswerWrapper>
          <Text>{t('lesson.answer_result.wrong')}</Text>
          <FailCircle />
        </S.AnswerWrapper>
      );
    default:
      return null;
  }
};

ResultTitle.propTypes = {
  correct: PropTypes.oneOf([CORRECT_ALL, CORRECT_NONE, CORRECT_PARTIAL]),
};

export default ResultTitle;
