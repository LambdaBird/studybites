import styled from 'styled-components';

import TranslateIconSvg from '@sb-ui/resources/icons/translate.svg';
import LogoSvg from '@sb-ui/resources/img/logo.svg';

export const Logo = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;

export const LogoImg = styled.img.attrs({
  alt: 'Logo',
  src: LogoSvg,
})``;

export const LogoLink = styled.div`
  cursor: pointer;
`;

export const DropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  & > *:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

export const TranslateIcon = styled.img.attrs({
  alt: 'Translate',
  src: TranslateIconSvg,
})`
  height: 14px;
`;
