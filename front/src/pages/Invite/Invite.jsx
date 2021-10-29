import { Row, Skeleton } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import LessonKeywords from '@sb-ui/components/atoms/LessonKeywords';
import * as SM from '@sb-ui/pages/User/EnrollCourseModal/EnrollModal.mobile.styled';
import { getInvite } from '@sb-ui/utils/api/v1/invite';
import { INVITE_LESSON_QUERY } from '@sb-ui/utils/queries';

import SignUp from './SignUp';
import * as S from './Invite.styled';

const Invite = () => {
  const { id } = useParams();
  const { t } = useTranslation('invite');

  const { data: responseData, isLoading } = useQuery(
    [INVITE_LESSON_QUERY, { id }],
    getInvite,
  );

  const { lesson, keywords, email, isRegistered, inviteUser } =
    responseData || {};

  const { name, description, author, image } = lesson || {};

  const fullName = useMemo(
    () => `${author?.firstName} ${author?.lastName}`.trim(),
    [author],
  );

  const firstNameLetter = useMemo(
    () => author?.firstName?.[0] || author?.lastName?.[0],
    [author],
  );

  const isAuth = false;

  return (
    <S.Page>
      <S.Container>
        <S.HeaderBlock>
          {isLoading ? (
            <Skeleton avatar paragraph={{ rows: 0 }} />
          ) : (
            <>
              <div>
                <S.Avatar />
              </div>
              <S.HeaderTitle>
                {t('header', { inviteUser, email })}
              </S.HeaderTitle>
            </>
          )}
        </S.HeaderBlock>
        <S.BodyBlock>
          <SM.ImageBlock>
            {isLoading ? (
              <Skeleton avatar paragraph={{ rows: 4 }} />
            ) : (
              <>
                <SM.Image src={image} alt="Lesson" />
                <SM.AuthorContainer>
                  <SM.AuthorAvatar>{firstNameLetter}</SM.AuthorAvatar>
                  <SM.AuthorName>{fullName}</SM.AuthorName>
                </SM.AuthorContainer>
              </>
            )}
          </SM.ImageBlock>
          <Row>
            <SM.Title>{name}</SM.Title>
          </Row>
          <Row>
            <SM.Description>{description}</SM.Description>
            {keywords && (
              <SM.KeywordsCol>
                <LessonKeywords keywords={keywords} />
              </SM.KeywordsCol>
            )}
          </Row>
          {isAuth ? (
            <S.JoinButton>{t('buttons.join')}</S.JoinButton>
          ) : (
            <SignUp email={email} isRegistered={isRegistered} />
          )}
        </S.BodyBlock>
      </S.Container>
    </S.Page>
  );
};

export default Invite;
