import { message, Radio } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as S from './LessonShare.styled';

const INVITE_VALUE = 'invite';
const EVERYONE_VALUE = 'everyone';

const LessonShare = (props) => {
  const { t } = useTranslation('teacher');

  const [inviteOnly, setInviteOnly] = useState(true);
  const [link, setLink] = useState('');
  const inputLinkRef = useRef(null);

  const handleCopyClick = useCallback(() => {
    if (link) {
      inputLinkRef.current.select();
      document.execCommand('copy');
      message.info({
        content: t('lesson_edit.share.link_copy'),
        duration: 1,
      });
    }
  }, [link, t]);

  const handleGenerateLink = useCallback(() => {
    // TODO: generate link
    const generatedLink = `http://localhost:3000/link/${Math.random()}`;
    setLink(generatedLink);
  }, []);

  const handleChangeShare = useCallback((e) => {
    const isInviteOnly = e.target.value === INVITE_VALUE;
    setInviteOnly(isInviteOnly);
  }, []);

  return (
    <S.Row {...props}>
      <S.Col>{t('lesson_edit.share.title')}</S.Col>
      <S.Col>
        <S.Row>
          <S.Col>
            <Radio.Group
              defaultValue={INVITE_VALUE}
              onChange={handleChangeShare}
            >
              <Radio.Button value={INVITE_VALUE}>
                {t('lesson_edit.share.invite_button')}
              </Radio.Button>
              <Radio.Button value={EVERYONE_VALUE}>
                {t('lesson_edit.share.everyone_button')}
              </Radio.Button>
            </Radio.Group>
          </S.Col>

          <S.LinkWrapper>
            <S.Input
              value={link}
              disabled={!inviteOnly}
              onDoubleClick={handleCopyClick}
              ref={inputLinkRef}
              placeholder={t('lesson_edit.share.link_placeholder')}
            />
            <S.GenerateButton
              disabled={!inviteOnly}
              onClick={handleGenerateLink}
            >
              {t('lesson_edit.share.generate_button')}
            </S.GenerateButton>
            <S.Button disabled={!inviteOnly || !link} onClick={handleCopyClick}>
              {t('lesson_edit.share.copy_button')}
            </S.Button>
          </S.LinkWrapper>
        </S.Row>
      </S.Col>
    </S.Row>
  );
};

export default LessonShare;
