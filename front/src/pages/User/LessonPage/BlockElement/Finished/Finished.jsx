import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';

import { NextPropType } from '../types';

const { Text } = Typography;

const Finished = () => {
  const { t } = useTranslation('user');
  return (
    <ChunkWrapper>
      <Text strong>{t('lesson.finished')}</Text>
    </ChunkWrapper>
  );
};

Finished.propTypes = NextPropType;

export default Finished;
