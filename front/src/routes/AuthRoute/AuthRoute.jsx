import { Dropdown, Menu } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, useHistory } from 'react-router-dom';

import { RightOutlinedAntd } from '@sb-ui/components/Icons';
import {
  getLanguageValueByKey,
  LANGUAGES_LIST,
  setStorageLanguage,
} from '@sb-ui/i18n';
import { HOME } from '@sb-ui/utils/paths';
import { ChildrenType, IsPublicType } from '@sb-ui/utils/types';

import { getJWTAccessToken } from '../../utils/jwt';

import * as S from './AuthRoute.styled';

const AuthRoute = ({ children: Component, isPublic, ...rest }) => {
  const history = useHistory();
  const isLoggedIn = getJWTAccessToken();
  const { i18n } = useTranslation();

  const [languageKey, setLanguageKey] = useState(i18n.language);

  const handleMenuClick = ({ key }) => {
    i18n.changeLanguage(key);
    setLanguageKey(key);
    setStorageLanguage(key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {LANGUAGES_LIST.map(({ key, value }) => (
        <Menu.Item key={key}>{value}</Menu.Item>
      ))}
    </Menu>
  );

  const handleHomeClick = useCallback(() => {
    history.push(HOME);
  }, [history]);

  if (!isLoggedIn || isPublic) {
    return (
      <>
        <S.Logo>
          <S.LogoLink onClick={handleHomeClick}>
            <S.LogoImg />
          </S.LogoLink>
          <S.LogoLink>
            <Dropdown overlay={menu} trigger={['click']}>
              <S.DropdownWrapper>
                <span>{getLanguageValueByKey(languageKey)}</span>
                <S.TranslateIcon /> <RightOutlinedAntd />
              </S.DropdownWrapper>
            </Dropdown>
          </S.LogoLink>
        </S.Logo>

        <Route {...rest}>{Component}</Route>
      </>
    );
  }

  return <Redirect to={{ pathname: HOME }} />;
};

AuthRoute.propTypes = {
  children: ChildrenType.isRequired,
  isPublic: IsPublicType,
};

export default AuthRoute;
