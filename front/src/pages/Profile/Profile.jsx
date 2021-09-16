import { Form, Input, message, Tag, Typography } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';

import { queryClient } from '@sb-ui/query';
import { getUser, patchUser } from '@sb-ui/utils/api/v1/user';
import { USER_BASE_QUERY } from '@sb-ui/utils/queries';

import * as S from './Profile.styled';

const { Title } = Typography;

const USER_ROLE = 'User';
const TEACHER_ROLE = 'Teacher';
const SUPER_ADMIN = 'SuperAdmin';

const ROLE_KEYS = {
  [TEACHER_ROLE]: 'role.teacher',
  [USER_ROLE]: 'role.user',
  [SUPER_ADMIN]: 'role.super_admin',
};

const Profile = () => {
  const { t } = useTranslation('profile');
  const [form] = Form.useForm();
  const { data: user } = useQuery(USER_BASE_QUERY, getUser);
  const { email, firstName, lastName, roles } = user || {};
  const [isFormErrors, setIsFormErrors] = useState(false);

  const handleFieldsChange = useCallback(() => {
    setIsFormErrors(form.getFieldsError().some(({ errors }) => errors.length));
  }, [form]);

  const roleKey = useMemo(
    () => ROLE_KEYS?.[roles?.find((role) => ROLE_KEYS?.[role])],
    [roles],
  );

  const { mutate: mutateUser, isLoading } = useMutation(patchUser, {
    onSuccess: (userData) => {
      message.success({
        content: t('save.success'),
        key: 'save.success',
        duration: 2,
      });
      form.setFieldsValue(userData);
    },
    onError: (e) => {
      if (e.response.data.message === 'errors.unique_violation') {
        message.error({
          content: t('save.duplicate'),
          key: 'save.duplicate',
          duration: 2,
        });
        form.setFieldsValue({ firstName, lastName, email });
        return;
      }

      message.error({
        content: t('save.fail'),
        key: 'save.fail',
        duration: 2,
      });

      throw new Error(e);
    },
    onSettled: () => {
      queryClient.invalidateQueries(USER_BASE_QUERY);
    },
  });

  const handleSave = useCallback(() => {
    const values = form.getFieldsValue(['firstName', 'lastName', 'email']);
    mutateUser(values);
    form.setFieldsValue(values);
  }, [form, mutateUser]);

  const nameValidator = (_, value) => {
    if (value.trim().split(' ').length === 1) {
      return Promise.resolve();
    }
    return Promise.reject();
  };

  const formRules = {
    firstName: [
      { required: true, message: t('first_name.error') },
      {
        message: t('first_name.correct_error'),
        validator: nameValidator,
      },
    ],
    lastName: [
      { required: true, message: t('last_name.error') },
      {
        message: t('last_name.correct_error'),
        validator: nameValidator,
      },
    ],
    email: [
      { required: true, message: t('email.error') },
      { type: 'email', message: t('email.validation') },
    ],
  };

  return (
    <S.Page>
      <S.Profile>
        <S.HeaderWrapper>
          <S.NameWrapper>
            <Title level={2}>{t('title')}</Title>
          </S.NameWrapper>
          {roleKey && (
            <div>
              <Tag>{t(roleKey)}</Tag>
            </div>
          )}
        </S.HeaderWrapper>
        <S.FormWrapper>
          <S.FormInputsWrapper>
            <Form
              size="large"
              onFieldsChange={handleFieldsChange}
              form={form}
              initialValues={{
                firstName,
                lastName,
                email,
              }}
              layout="vertical"
            >
              <Form.Item
                name="firstName"
                rules={formRules.firstName}
                label={t('first_name.label')}
              >
                <Input
                  maxLength={30}
                  placeholder={t('first_name.placeholder')}
                />
              </Form.Item>
              <Form.Item
                name="lastName"
                rules={formRules.lastName}
                label={t('last_name.label')}
              >
                <Input
                  maxLength={30}
                  placeholder={t('last_name.placeholder')}
                />
              </Form.Item>
              <Form.Item
                name="email"
                rules={formRules.email}
                label={t('email.label')}
              >
                <Input placeholder={t('email.placeholder')} />
              </Form.Item>
            </Form>
            <S.Button
              disabled={isFormErrors}
              loading={isLoading}
              onClick={handleSave}
            >
              {t('update_information_button')}
            </S.Button>
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
            <S.Button disabled>{t('update_password_button')}</S.Button>
          </S.FormInputsWrapper>
        </S.FormWrapper>
      </S.Profile>
    </S.Page>
  );
};

export default Profile;
