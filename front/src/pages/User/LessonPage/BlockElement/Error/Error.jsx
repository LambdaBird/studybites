import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { BlockIdType } from '../types';

const { Text } = Typography;

const Error = ({ blockId }) => {
  const { t } = useTranslation();
  return (
    <Text key={blockId} type="danger">
      {t('errors.parse_block')}
    </Text>
  );
};

Error.propTypes = {
  blockId: BlockIdType,
};

export default Error;
