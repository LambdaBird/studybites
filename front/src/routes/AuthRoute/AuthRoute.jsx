import { Dropdown, Menu } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Route } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';

import {
  getLanguageValueByKey,
  LANGUAGES_LIST,
  setStorageLanguage,
} from '@sb-ui/i18n';
import { HOME } from '@sb-ui/utils/paths';
import { ChildrenType } from '@sb-ui/utils/types';

import { getJWTAccessToken } from '../../utils/jwt';

import * as S from './AuthRoute.styled';

const AuthRoute = ({ children: Component, ...rest }) => {
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

  if (!isLoggedIn) {
    return (
      <>
        <S.Logo>
          <S.LogoImg />
          <Dropdown overlay={menu} trigger={['click']}>
            <S.DropdownWrapper>
              <span>{getLanguageValueByKey(languageKey)}</span>
              <S.TranslateIcon /> <RightOutlined />
            </S.DropdownWrapper>
          </Dropdown>
        </S.Logo>
        <Route {...rest}>{Component}</Route>
      </>
    );
  }

  return <Redirect to={{ pathname: HOME }} />;
};

AuthRoute.propTypes = {
  children: ChildrenType.isRequired,
};

export default AuthRoute;
