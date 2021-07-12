import { Typography } from 'antd';
import PropTypes from 'prop-types';

import { BlockElementProps } from '../types';

const { Title } = Typography;

const Header = ({ content }) => {
  const { text, level } = content.data;
  return <Title level={level}>{text}</Title>;
};

Header.propTypes = {
  ...BlockElementProps,
  content: {
    ...BlockElementProps.content,
    data: PropTypes.shape({
      text: PropTypes.string,
      level: PropTypes.number,
    }),
  },
};

export default Header;
