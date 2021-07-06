import { Typography } from 'antd';
import { BlockElementProps } from '../utils';

const { Text } = Typography;

const Error = ({ blockId }) => (
  <Text key={blockId} type="danger">
    ERROR PARSE BLOCK
  </Text>
);

Error.propTypes = BlockElementProps;

export default Error;
