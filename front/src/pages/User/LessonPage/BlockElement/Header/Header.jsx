import { Typography } from 'antd';
import { BlockElementProps } from '../utils';

const { Title } = Typography;

const Header = ({ content }) => {
  const { text, level } = content.data;
  return <Title level={level}>{text}</Title>;
};

Header.propTypes = BlockElementProps;

export default Header;
