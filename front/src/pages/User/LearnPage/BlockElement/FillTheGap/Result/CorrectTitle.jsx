import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { CheckCircleTwoTone } from '@ant-design/icons';

import * as S from './Result.styled';

const { Text } = Typography;

const CorrectTitle = () => {
  const { t } = useTranslation('user');
  return (
    <S.AnswerWrapper>
      <Text>{t('lesson.answer_result.correct')}</Text>
      <CheckCircleTwoTone twoToneColor="#52c41a" />
    </S.AnswerWrapper>
  );
};

export default CorrectTitle;
