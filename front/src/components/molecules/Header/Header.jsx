import { Col, Dropdown, Menu } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';

import useMobile from '@sb-ui/hooks/useMobile';
import { LANGUAGES_LIST } from '@sb-ui/i18n';
import { queryClient } from '@sb-ui/query';
import logo from '@sb-ui/resources/img/logo.svg';
import { getUser } from '@sb-ui/utils/api/v1/user';
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

  const { data: userResponse } = useQuery(USER_BASE_QUERY, getUser);
  const user = userResponse?.data || {};
  const headerRef = useRef(null);
  const [scroll, setScroll] = useState(null);

  const handleSignOut = () => {
    clearJWT();
    queryClient.resetQueries();
    history.push(SIGN_IN);
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'signOut') {
      handleSignOut();
    } else if (key.startsWith('language')) {
      i18n.changeLanguage(key.split('-')?.[1]);
    }
  };

  const getTeacherMenu = () => {
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
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile">{t('header.profile')}</Menu.Item>
      {user?.roles?.includes(Roles.TEACHER) && getTeacherMenu()}

      <SubMenu title={t('header.language')}>
        {LANGUAGES_LIST.map(({ key, value }) => (
          <Menu.Item key={`language-${key}`}>{value}</Menu.Item>
        ))}
      </SubMenu>

      <Menu.Divider />
      <Menu.Item key="signOut">{t('header.sign_out')}</Menu.Item>
    </Menu>
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

  return (
    <S.Container
      className={className}
      hideOnScroll={hideOnScroll}
      scroll={scroll}
      ref={headerRef}
    >
      <S.RowMain
        hideOnScroll={hideOnScroll}
        align="middle"
        justify="space-between"
      >
        <Col>
          <Link to={HOME}>
            <S.Logo src={logo} alt="Logo" />
          </Link>
        </Col>
        {children}
        <Col>
          <Dropdown overlay={menu} trigger={['click']}>
            <S.Profile data-testid="profile">
              <S.StyledAvatar>{firstNameLetter}</S.StyledAvatar>
              {!isMobile && <S.StyledName>{fullName}</S.StyledName>}
              <DownOutlined />
            </S.Profile>
          </Dropdown>
        </Col>
      </S.RowMain>
      {bottom}
    </S.Container>
  );
};

Header.propTypes = {
  children: ChildrenType,
  className: ClassNameType,
  bottom: ChildrenType,
  hideOnScroll: HideOnScrollType,
};

export default Header;
