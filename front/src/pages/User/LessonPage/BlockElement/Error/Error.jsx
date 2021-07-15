import { Typography } from 'antd';
import { useLocation } from 'react-router-dom';

import { BlockIdType } from '../types';

const { Text } = Typography;

const Error = ({ blockId }) => {
  const { t } = useLocation();
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
