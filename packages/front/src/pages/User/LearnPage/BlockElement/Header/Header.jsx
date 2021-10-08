import { Typography } from 'antd';

import { htmlToReact } from '@sb-ui/pages/User/LearnPage/utils';

import { HeaderContentType } from '../types';

const { Title } = Typography;

const Header = ({ content }) => {
  const { text, level } = content.data;
  return <Title level={level}>{htmlToReact(text)}</Title>;
};

Header.propTypes = {
  content: HeaderContentType,
};

export default Header;
