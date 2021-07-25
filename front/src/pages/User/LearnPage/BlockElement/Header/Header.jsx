import { Typography } from 'antd';

import { HeaderContentType } from '../types';

const { Title } = Typography;

const Header = ({ content }) => {
  const { text, level } = content.data;
  return <Title level={level}>{text}</Title>;
};

Header.propTypes = {
  content: HeaderContentType,
};

export default Header;
