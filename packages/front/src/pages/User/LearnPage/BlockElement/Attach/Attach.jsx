import { useTranslation } from 'react-i18next';

import { AttachContentType } from '@sb-ui/pages/User/LearnPage/BlockElement/types';

const Attach = ({ content }) => {
  const { t } = useTranslation('user');

  return <a href={content?.data?.location}>{t('lesson.attach.download')}</a>;
};

Attach.propTypes = {
  content: AttachContentType,
};

export default Attach;
