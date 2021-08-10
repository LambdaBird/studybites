import { WarningContentType } from '@sb-ui/pages/User/LearnPage/BlockElement/types';

import * as S from './Warning.styled';

const Warning = ({ content }) => {
  const { title, message } = content?.data;
  return (
    <S.Wrapper>
      <S.IconTitle>
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <S.Icon>☝</S.Icon>
        <S.Title>{title}</S.Title>
      </S.IconTitle>
      <S.Message>{message}</S.Message>
    </S.Wrapper>
  );
};

Warning.propTypes = {
  content: WarningContentType,
};

export default Warning;
