import { Form, Input, Tag, Typography } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { getUser } from '@sb-ui/utils/api/v1/user';
import { USER_BASE_QUERY } from '@sb-ui/utils/queries';

import * as S from './Profile.styled';

const { Title } = Typography;

const USER_ROLE = 'User';
const MAINTAINER_ROLE = 'Maintainer';
const SUPER_ADMIN = 'SuperAdmin';

const ROLE_KEYS = {
  [MAINTAINER_ROLE]: 'role.maintainer',
  [USER_ROLE]: 'role.user',
  [SUPER_ADMIN]: 'role.super_admin',
};

const Profile = () => {
  const { t } = useTranslation('profile');
  const { data: user } = useQuery(USER_BASE_QUERY, getUser);
  const { email, firstName, lastName, roles } = user || {};

  const roleKey = useMemo(() => ROLE_KEYS[roles?.[0] || USER_ROLE], [roles]);

  return (
    <S.Page>
      <S.Profile>
        <S.HeaderWrapper>
          <S.NameWrapper>
            <Title level={2}>{t('title')}</Title>
          </S.NameWrapper>
          <div>
            <Tag>{t(roleKey)}</Tag>
          </div>
        </S.HeaderWrapper>
        <S.FormWrapper>
          <S.FormInputsWrapper>
            <Form size="large" layout="vertical">
              <Form.Item label={t('first_name.label')}>
                <Input
                  placeholder={t('first_name.placeholder')}
                  defaultValue={firstName}
                />
              </Form.Item>
              <Form.Item label={t('last_name.label')}>
                <Input
                  placeholder={t('last_name.placeholder')}
                  defaultValue={lastName}
                />
              </Form.Item>
              <Form.Item label={t('email.label')}>
                <Input
                  placeholder={t('email.placeholder')}
                  defaultValue={email}
                />
              </Form.Item>
            </Form>
            <S.Button>{t('update_information_button')}</S.Button>
          </S.FormInputsWrapper>
          <S.FormInputsWrapper>
            <Form size="large" layout="vertical">
              <Form.Item
                label={t('current_password.label')}
                name="current-password"
              >
                <Input.Password
                  disabled
                  placeholder={t('password_placeholder')}
                />
              </Form.Item>
              <Form.Item label={t('new_password.label')} name="new-password">
                <Input.Password
                  disabled
                  placeholder={t('password_placeholder')}
                />
              </Form.Item>
              <Form.Item label={t('confirm_password.label')} name="password">
                <Input.Password
                  disabled
                  placeholder={t('password_placeholder')}
                />
              </Form.Item>
            </Form>
            <S.Button>{t('update_password_button')}</S.Button>
          </S.FormInputsWrapper>
        </S.FormWrapper>
      </S.Profile>
    </S.Page>
  );
};

export default Profile;
