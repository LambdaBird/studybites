import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { usePasswordInput } from '@sb-ui/hooks/usePasswordInput';

export const useForm = ({ isRegistered }) => {
  const { password, passwordValidator } = usePasswordInput();
  const { t } = useTranslation('sign_up');

  const additionalRules = useMemo(
    () =>
      isRegistered
        ? {}
        : {
            firstName: [
              {
                required: true,
                message: t('first_name.error'),
              },
            ],
            lastName: [
              {
                required: true,
                message: t('last_name.error'),
              },
            ],
          },
    [isRegistered, t],
  );

  const formRules = useMemo(
    () => ({
      email: [
        {
          required: true,
          message: t('email.error'),
        },
        {
          type: 'email',
          message: t('email.validation'),
        },
      ],
      ...additionalRules,
      password: [
        {
          required: true,
          message: t('password.error'),
        },
        isRegistered
          ? {}
          : {
              validator: passwordValidator,
            },
      ],
    }),
    [t, additionalRules, isRegistered, passwordValidator],
  );

  return { formRules, password };
};
