import { Form, Input, message, Tag, Typography } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

import { queryClient } from '@sb-ui/query';
import { SELF_STALE_TIME } from '@sb-ui/utils/api/config';
import { resetPassword } from '@sb-ui/utils/api/v1/email';
import { getUser, patchUser } from '@sb-ui/utils/api/v1/user';
import { EMAIL_ERR_TOO_FREQUENTLY } from '@sb-ui/utils/errors';
import { EMAIL_SENT } from '@sb-ui/utils/paths';
import { USER_BASE_QUERY } from '@sb-ui/utils/queries';

import * as S from './Profile.styled';

const { Title } = Typography;
const { TextArea } = Input;

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
  const history = useHistory();
  const { data: user } = useQuery(USER_BASE_QUERY, getUser, {
    staleTime: SELF_STALE_TIME,
  });
  const { email, firstName, lastName, description, roles } = user || {};
  const [isFormErrors, setIsFormErrors] = useState(false);

  const handleFieldsChange = useCallback(() => {
    setIsFormErrors(form.getFieldsError().some(({ errors }) => errors.length));
  }, [form]);

  const roleKey = useMemo(
    () => ROLE_KEYS?.[roles?.find((role) => ROLE_KEYS?.[role])],
    [roles],
  );

  const { mutate: mutateResetPassword, isLoading: isLoadingResetPassword } =
    useMutation(resetPassword, {
      onSuccess: () => {
        history.push(EMAIL_SENT);
      },
      onError: (err) => {
        if (err.response.data?.message === EMAIL_ERR_TOO_FREQUENTLY) {
          const timeout = err.response.data.payload?.timeout;
          message.error({
            content: t('error_save_frequently', { timeout }),
            key: `link.fail${timeout}`,
            duration: 2,
          });
          return;
        }
        throw new Error(err);
      },
    });

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
    const values = form.getFieldsValue([
      'firstName',
      'lastName',
      'email',
      'description',
    ]);
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

  const handleResetPassword = () => {
    mutateResetPassword();
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
                description,
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
                <Input disabled placeholder={t('email.placeholder')} />
              </Form.Item>
              <Form.Item name="description" label={t('description.label')}>
                <TextArea
                  placeholder={t('description.placeholder')}
                  showCount
                  maxLength={140}
                />
              </Form.Item>
            </Form>
            <S.ButtonsWrapper>
              <S.ResetButton
                loading={isLoadingResetPassword}
                onClick={handleResetPassword}
              >
                {t('reset_password_button')}
              </S.ResetButton>
              <S.Button
                disabled={isFormErrors}
                loading={isLoading}
                onClick={handleSave}
              >
                {t('update_information_button')}
              </S.Button>
            </S.ButtonsWrapper>
          </S.FormInputsWrapper>
        </S.FormWrapper>
      </S.Profile>
    </S.Page>
  );
};

export default Profile;
