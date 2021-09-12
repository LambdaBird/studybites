import { message } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import * as S from '../LessonEdit.styled';

const DemoPublish = ({ link }) => {
  const { t } = useTranslation('teacher');

  return (
    <>
      <S.JoinText>{t('lesson_edit.demo_publish_modal.content')}:</S.JoinText>
      <S.CopyLinkInput
        onChange={() => {}}
        value={link}
        addonAfter={
          <S.CopyButton
            onClick={() => {
              navigator.clipboard.writeText(link);
              message.success(t('lesson_edit.demo_publish_modal.copy_success'));
            }}
          >
            {t('lesson_edit.demo_publish_modal.copy')}
          </S.CopyButton>
        }
      />
    </>
  );
};

DemoPublish.propTypes = {
  link: PropTypes.string.isRequired,
};

export default DemoPublish;
