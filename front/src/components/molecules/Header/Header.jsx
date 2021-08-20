import { Col, Dropdown, Menu } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';

import useMobile from '@sb-ui/hooks/useMobile';
import { LANGUAGES_LIST } from '@sb-ui/i18n';
import { queryClient } from '@sb-ui/query';
import logo from '@sb-ui/resources/img/logo.svg';
import { getUser, patchLanguage } from '@sb-ui/utils/api/v1/user';
import { Roles } from '@sb-ui/utils/constants';
import { clearJWT } from '@sb-ui/utils/jwt';
import {
  HOME,
  SIGN_IN,
  TEACHER_HOME,
  USER_HOME,
  USER_LESSONS,
} from '@sb-ui/utils/paths';
import { USER_BASE_QUERY } from '@sb-ui/utils/queries';
import {
  ChildrenType,
  ClassNameType,
  HideOnScrollType,
} from '@sb-ui/utils/types';

import * as S from './Header.styled';
import { HEADER_HEIGHT } from './Header.styled';

const { SubMenu } = Menu;

const USER_LOGO_FALLBACK = 'X';

const Header = ({ className, hideOnScroll, bottom, children }) => {
  const history = useHistory();
  const { t, i18n } = useTranslation(['common', 'user']);
  const location = useLocation();
  const isMobile = useMobile();

  const { data: user } = useQuery(USER_BASE_QUERY, getUser);
  const headerRef = useRef(null);
  const [scroll, setScroll] = useState(null);
  const [visible, setVisible] = useState(false);

  const handleSignOut = useCallback(() => {
    clearJWT();
    queryClient.resetQueries();
    history.push(SIGN_IN);
  }, [history]);

  const { mutate: changeLanguage } = useMutation(patchLanguage);

  const handleMenuClick = useCallback(
    ({ key }) => {
      setVisible(false);
      if (key === 'signOut') {
        handleSignOut();
      } else if (key.startsWith('language')) {
        const language = key.split('-')?.[1];
        i18n.changeLanguage(language);
        changeLanguage({ language });
      }
    },
    [changeLanguage, handleSignOut, i18n],
  );

  const getTeacherMenu = useCallback(() => {
    if (location.pathname.includes(USER_HOME)) {
      return (
        <>
          <Menu.Item key="teacherHome">
            <Link to={TEACHER_HOME}>{t('header.switch_teacher')}</Link>
          </Menu.Item>
          <Menu.Item key="viewAllMyLessons">
            <Link to={USER_LESSONS}>
              {t('user:home.ongoing_lessons.view_all_lessons')}
            </Link>
          </Menu.Item>
        </>
      );
    }
    return (
      <Menu.Item key="studentHome">
        <Link to={USER_HOME}>{t('header.switch_student')}</Link>
      </Menu.Item>
    );
  }, [location.pathname, t]);

  const menu = useMemo(
    () => (
      <S.Menu onClick={handleMenuClick}>
        <Menu.Item key="profile">{t('header.profile')}</Menu.Item>
        {user?.roles?.includes(Roles.TEACHER) && getTeacherMenu()}

        {isMobile ? (
          <Menu.ItemGroup title={t('header.language')}>
            {LANGUAGES_LIST.map(({ key, value }) => (
              <Menu.Item key={`language-${key}`}>{value}</Menu.Item>
            ))}
          </Menu.ItemGroup>
        ) : (
          <SubMenu title={t('header.language')}>
            {LANGUAGES_LIST.map(({ key, value }) => (
              <Menu.Item key={`language-${key}`}>{value}</Menu.Item>
            ))}
          </SubMenu>
        )}

        <Menu.Divider />
        <Menu.Item key="signOut">{t('header.sign_out')}</Menu.Item>
      </S.Menu>
    ),
    [getTeacherMenu, handleMenuClick, isMobile, t, user?.roles],
  );

  const isUsername = useMemo(
    () => user?.firstName && user?.lastName,
    [user?.firstName, user?.lastName],
  );

  const fullName = useMemo(
    () => isUsername && `${user?.firstName} ${user?.lastName}`.trim(),
    [user?.firstName, user?.lastName, isUsername],
  );

  const firstNameLetter = useMemo(
    () =>
      (isUsername && (user?.firstName?.[0] || user?.lastName?.[0])) ||
      USER_LOGO_FALLBACK,
    [user?.firstName, user?.lastName, isUsername],
  );

  useEffect(() => {
    if (hideOnScroll !== true || !headerRef) {
      return () => {};
    }

    let lastScrollTop = 0;
    const listener = () => {
      const scrollTop = window.scrollY;

      if (scrollTop < lastScrollTop) {
        setScroll('up');
      } else if (scrollTop > HEADER_HEIGHT) {
        setScroll('down');
      }
      lastScrollTop = scrollTop;
    };

    window.addEventListener('scroll', listener);
    return () => {
      window.removeEventListener('scroll', listener);
    };
  }, [headerRef, hideOnScroll]);

  useEffect(() => {
    if (user?.language) {
      i18n.changeLanguage(user?.language);
    }
  }, [i18n, user]);

  const handleHomeClick = useCallback(() => {
    if (isMobile && visible === true) {
      setVisible(false);
    }
    history.push(HOME);
  }, [history, isMobile, visible]);

  const handleHeaderClick = useCallback(() => {
    if (isMobile && visible === true) {
      setVisible(false);
    }
  }, [isMobile, visible]);

  const handleMenuBackgroundClick = useCallback(() => {
    setVisible(false);
  }, []);

  const handleMenuWrapperClick = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  const profileContent = useMemo(
    () => (
      <S.Profile data-testid="profile">
        <S.StyledAvatar>{firstNameLetter}</S.StyledAvatar>
        {!isMobile && <S.StyledName>{fullName}</S.StyledName>}
        {isMobile ? <S.MenuOutlined /> : <DownOutlined />}
      </S.Profile>
    ),
    [firstNameLetter, fullName, isMobile],
  );

  return (
    <>
      <S.Container
        className={className}
        hideOnScroll={hideOnScroll}
        scroll={scroll}
        ref={headerRef}
        onClick={handleHeaderClick}
      >
        <S.RowMain hideOnScroll={hideOnScroll}>
          <Col>
            <S.LogoLink onClick={handleHomeClick}>
              <S.Logo src={logo} alt="Logo" />
            </S.LogoLink>
          </Col>
          {children}
          <Col>
            {isMobile ? (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
              <div onClick={handleMenuWrapperClick}>{profileContent}</div>
            ) : (
              <Dropdown
                overlay={menu}
                onVisibleChange={(newVisible) => {
                  setVisible(newVisible);
                }}
                trigger={['click']}
              >
                {profileContent}
              </Dropdown>
            )}
          </Col>
        </S.RowMain>
        {bottom}
      </S.Container>
      {isMobile && (
        <>
          <S.MenuWrapper visible={visible}>{visible && menu}</S.MenuWrapper>
          {visible && (
            <S.DropdownBackground onClick={handleMenuBackgroundClick} />
          )}
        </>
      )}
    </>
  );
};

Header.propTypes = {
  children: ChildrenType,
  className: ClassNameType,
  bottom: ChildrenType,
  hideOnScroll: HideOnScrollType,
};

export default Header;
