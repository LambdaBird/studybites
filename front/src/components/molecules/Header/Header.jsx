import { Col, Dropdown, Menu } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';

import useMobile from '@sb-ui/hooks/useMobile';
import {
  getStorageLanguage,
  LANGUAGES_LIST,
  removeStorageLanguage,
} from '@sb-ui/i18n';
import { queryClient } from '@sb-ui/query';
import logo from '@sb-ui/resources/img/logo.svg';
import { getUser, patchLanguage } from '@sb-ui/utils/api/v1/user';
import { Roles } from '@sb-ui/utils/constants';
import { clearJWT } from '@sb-ui/utils/jwt';
import {
  HOME,
  SIGN_IN,
  TEACHER_HOME,
  USER_COURSES,
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

const MENU_KEYS = {
  TEACHER_HOME: 'teacherHome',
  STUDENT_HOME: 'studentHome',
  VIEW_ALL_MY_LESSONS: 'viewAllMyLessons',
  VIEW_ALL_MY_COURSES: 'viewAllMyCourses',
  PROFILE: 'profile',
  LANGUAGE: 'language',
  SIGN_OUT: 'signOut',
};

const MENU_LANGUAGES_LIST = new Map(
  LANGUAGES_LIST.map((language) => [
    `${MENU_KEYS.LANGUAGE}-${language.key}`,
    language,
  ]),
);

const Header = ({ className, hideOnScroll, bottom, children }) => {
  const history = useHistory();
  const { t, i18n } = useTranslation(['common', 'user']);
  const location = useLocation();
  const isMobile = useMobile();

  const { data: user } = useQuery(USER_BASE_QUERY, getUser);
  const headerRef = useRef(null);
  const [scroll, setScroll] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleSignOut = useCallback(() => {
    clearJWT();
    queryClient.resetQueries();
    history.push(SIGN_IN);
  }, [history]);

  const { mutate: changeLanguage } = useMutation(patchLanguage);

  const handleMenuLanguageClick = useCallback(
    (key) => {
      const { key: languageCode } = MENU_LANGUAGES_LIST.get(key) || {};
      i18n.changeLanguage(languageCode);
      changeLanguage({ language: languageCode });
    },
    [changeLanguage, i18n],
  );

  const handleMenuClick = useCallback(
    ({ key, keyPath }) => {
      setIsVisible(false);
      const upperKey = keyPath?.[keyPath.length - 1];
      switch (upperKey) {
        case MENU_KEYS.SIGN_OUT:
          handleSignOut();
          break;
        case MENU_KEYS.LANGUAGE:
          handleMenuLanguageClick(key);
          break;
        default:
          break;
      }
    },
    [handleMenuLanguageClick, handleSignOut],
  );

  const getTeacherMenu = useCallback(() => {
    if (location.pathname.includes(USER_HOME)) {
      return (
        <>
          <Menu.Item key={MENU_KEYS.TEACHER_HOME}>
            <Link to={TEACHER_HOME}>{t('header.switch_teacher')}</Link>
          </Menu.Item>
          <Menu.Item key={MENU_KEYS.VIEW_ALL_MY_LESSONS}>
            <Link to={USER_LESSONS}>
              {t('user:home.ongoing_lessons.view_all_lessons')}
            </Link>
          </Menu.Item>
          <Menu.Item key={MENU_KEYS.VIEW_ALL_MY_COURSES}>
            <Link to={USER_COURSES}>
              {t('user:home.ongoing_lessons.view_all_courses')}
            </Link>
          </Menu.Item>
        </>
      );
    }
    return (
      <Menu.Item key={MENU_KEYS.STUDENT_HOME}>
        <Link to={USER_HOME}>{t('header.switch_student')}</Link>
      </Menu.Item>
    );
  }, [location.pathname, t]);

  const languageSubMenu = useMemo(() => {
    return LANGUAGES_LIST.map(({ key, value }) => (
      <Menu.Item key={`${MENU_KEYS.LANGUAGE}-${key}`}>{value}</Menu.Item>
    ));
  }, []);

  const menu = useMemo(
    () => (
      <S.Menu onClick={handleMenuClick}>
        <Menu.Item key={MENU_KEYS.PROFILE}>{t('header.profile')}</Menu.Item>
        {user?.roles?.includes(Roles.TEACHER) && getTeacherMenu()}

        {isMobile ? (
          <Menu.ItemGroup key={MENU_KEYS.LANGUAGE} title={t('header.language')}>
            {languageSubMenu}
          </Menu.ItemGroup>
        ) : (
          <SubMenu key={MENU_KEYS.LANGUAGE} title={t('header.language')}>
            {languageSubMenu}
          </SubMenu>
        )}

        <Menu.Divider />
        <Menu.Item key={MENU_KEYS.SIGN_OUT}>{t('header.sign_out')}</Menu.Item>
      </S.Menu>
    ),
    [
      getTeacherMenu,
      handleMenuClick,
      isMobile,
      languageSubMenu,
      t,
      user?.roles,
    ],
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
      const storageLanguage = getStorageLanguage();
      if (storageLanguage) {
        removeStorageLanguage();
        i18n.changeLanguage(storageLanguage);
        changeLanguage({ language: storageLanguage });
      } else {
        i18n.changeLanguage(user?.language);
      }
    }
  }, [i18n, user]);

  const handleHomeClick = useCallback(() => {
    if (isMobile && isVisible) {
      setIsVisible(false);
    }
    history.push(HOME);
  }, [history, isMobile, isVisible]);

  const handleHeaderClick = useCallback(() => {
    if (isMobile && isVisible) {
      setIsVisible(false);
    }
  }, [isMobile, isVisible]);

  const handleMenuBackgroundClick = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMenuWrapperClick = useCallback(() => {
    setIsVisible((prev) => !prev);
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
              <div
                onKeyDown={handleMenuWrapperClick}
                onClick={handleMenuWrapperClick}
                role="button"
                tabIndex={0}
              >
                {profileContent}
              </div>
            ) : (
              <Dropdown
                overlay={menu}
                onVisibleChange={(newVisible) => {
                  setIsVisible(newVisible);
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
          <S.MenuWrapper visible={isVisible}>{isVisible && menu}</S.MenuWrapper>
          {isVisible && (
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
