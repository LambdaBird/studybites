import { Typography } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import {
  CORRECT_ALL,
  CORRECT_NONE,
  CORRECT_PARTIAL,
} from '@sb-ui/pages/User/LearnPage/BlockElement/FillTheGap/constants';
import * as S from '@sb-ui/pages/User/LearnPage/BlockElement/FillTheGap/Result/Result.styled';
import variables from '@sb-ui/theme/variables';

const { Text } = Typography;

const ResultTitle = ({ correct }) => {
  const { t } = useTranslation('user');
  switch (correct) {
    case CORRECT_ALL:
      return (
        <S.AnswerWrapper>
          <Text>{t('lesson.answer_result.correct')}</Text>
          <CheckCircleTwoTone twoToneColor={variables['success-color']} />
        </S.AnswerWrapper>
      );
    case CORRECT_PARTIAL:
      return (
        <S.AnswerWrapper>
          <Text>{t('lesson.answer_result.partially_wrong')}</Text>
          <S.WarningTwoTone twoToneColor={variables['partial-wrong-color']} />
        </S.AnswerWrapper>
      );
    case CORRECT_NONE:
      return (
        <S.AnswerWrapper>
          <Text>{t('lesson.answer_result.wrong')}</Text>
          <CloseCircleTwoTone twoToneColor={variables['wrong-color']} />
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
