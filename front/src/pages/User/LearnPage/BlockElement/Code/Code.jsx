import { CodeContentType } from '@sb-ui/pages/User/LearnPage/BlockElement/types';

import * as S from './Code.styled';

const Code = ({ content }) => {
  const code = content?.data?.code;
  return <S.Pre>{code}</S.Pre>;
};

Code.propTypes = {
  content: CodeContentType,
};

export default Code;
