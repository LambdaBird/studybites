import { useMemo } from 'react';
import { Col, Dropdown, Menu } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { HOME, SIGN_IN, TEACHER_HOME, USER_HOME } from '@sb-ui/utils/paths';
import logo from '@sb-ui/resources/img/logo.svg';
import { clearJWT } from '@sb-ui/utils/jwt';
import { USER_BASE_QUERY } from '@sb-ui/utils/queries';
import { getUser } from '@sb-ui/utils/api/v1/user';
import { Roles } from '@sb-ui/utils/constants';
import * as S from './Header.styled';

const Header = ({ children }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const location = useLocation();

  const { data: userResponse } = useQuery(USER_BASE_QUERY, getUser);
  const user = userResponse?.data || {};

  const handleSignOut = () => {
    clearJWT();
    history.push(SIGN_IN);
  };

  const handleHome = () => {
    history.push(HOME);
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'signOut') {
      handleSignOut();
    }
    if (key === 'teacherHome') {
      history.push(TEACHER_HOME);
    }
    if (key === 'studentHome') {
      history.push(USER_HOME);
    }
  };

  const getTeacherMenu = () => {
    if (location.pathname.includes(USER_HOME)) {
      return (
        <Menu.Item key="teacherHome">{t('header.switch_teacher')}</Menu.Item>
      );
    }
    return (
      <Menu.Item key="studentHome">{t('header.switch_student')}</Menu.Item>
    );
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile">{t('header.profile')}</Menu.Item>
      {user.roles.includes(Roles.TEACHER) && getTeacherMenu()}
      <Menu.Divider />
      <Menu.Item key="signOut">{t('header.sign_out')}</Menu.Item>
    </Menu>
  );

  const fullName = useMemo(
    () => `${user.firstName} ${user.lastName}`.trim(),
    [user.firstName, user.lastName],
  );

  const firstNameLetter = useMemo(
    () => user.firstName[0] || user.lastName[0],
    [user.firstName, user.lastName],
  );

  return (
    <S.Container>
      <S.RowMain align="middle" justify="space-between">
        <Col>
          <S.Logo onClick={handleHome} src={logo} alt="Logo" />
        </Col>
        {children}
        <Col>
          <Dropdown overlay={menu} trigger={['click']}>
            <S.Profile data-testid="profile">
              <S.StyledAvatar>{firstNameLetter}</S.StyledAvatar>
              <S.StyledName>{fullName}</S.StyledName>
              <DownOutlined />
            </S.Profile>
          </Dropdown>
        </Col>
      </S.RowMain>
    </S.Container>
  );
};

Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
