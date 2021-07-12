import { Col, Typography } from 'antd';
import PropTypes from 'prop-types';

const { Text } = Typography;

const Question = ({ text }) => (
  <Col span={24}>
    <Text style={{ fontStyle: 'italic' }}>{text}</Text>
  </Col>
);

Question.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Question;
