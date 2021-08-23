import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { CloseCircleTwoTone } from '@ant-design/icons';

import * as S from './Result.styled';

const { Text } = Typography;

const WrongTitle = () => {
  const { t } = useTranslation('user');
  return (
    <S.AnswerWrapper>
      <Text>{t('lesson.answer_result.wrong')}</Text>
      <CloseCircleTwoTone twoToneColor="#F5222D" />
    </S.AnswerWrapper>
  );
};

export default WrongTitle;
