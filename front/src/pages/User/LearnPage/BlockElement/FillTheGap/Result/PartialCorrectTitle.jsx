import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import * as S from './Result.styled';

const { Text } = Typography;

const PartialCorrectTitle = () => {
  const { t } = useTranslation('user');
  return (
    <S.AnswerWrapper>
      <Text>{t('lesson.answer_result.partially_wrong')}</Text>
      <S.WarningTwoTone twoToneColor="#FADB14" />
    </S.AnswerWrapper>
  );
};

export default PartialCorrectTitle;
