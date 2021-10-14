import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getConfig } from '@sb-ui/pages/Teacher/LessonEdit/utils';

export const useBlockIcons = () => {
  const { t } = useTranslation('teacher');
  return useMemo(
    () => ({
      ...getConfig(t).tools,
    }),
    [t],
  );
};
