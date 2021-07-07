import { Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import { BlockElementProps } from '../utils';

const { Text } = Typography;

const Error = ({ blockId }) => {
  const { t } = useLocation();
  return (
    <Text key={blockId} type="danger">
      {t('errors.parse_block')}
    </Text>
  );
};

Error.propTypes = BlockElementProps;

export default Error;
