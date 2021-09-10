import { Row } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { PublicResourceType } from '@sb-ui/components/resourceBlocks/types';
import lessonImage from '@sb-ui/resources/img/lesson.svg';

import { useResource } from './useResource';
import * as S from './Public.mobile.styled';

const PublicMobile = ({ resource, isCourse, isCourseLesson }) => {
  const { t } = useTranslation('user');

  const { name, description, isEnrolled } = resource;
  const { fullName, firstNameLetter, handleContinueLesson, handleEnroll } =
    useResource({ resource, isCourse });

  const isButtonDisabled =
    isCourseLesson && !resource.isFinished && !resource.isCurrent;

  return (
    <S.Main size="large" wrap={false}>
      <div style={{ height: '9rem' }}>
        <S.Image src={lessonImage} alt="Lesson" />
      </div>
      <Row>
        <S.Title
          ellipsis={{
            tooltip: true,
          }}
          level={3}
        >
          {name}
        </S.Title>
      </Row>
      <Row>
        <S.Description
          ellipsis={{
            rows: 2,
            tooltip: true,
          }}
        >
          {description}
        </S.Description>
      </Row>
      <S.EnrollRow>
        {isEnrolled ? (
          <S.Enroll
            type="primary"
            onClick={handleContinueLesson}
            disabled={isButtonDisabled}
          >
            {t('home.ongoing_lessons.continue_button')}
          </S.Enroll>
        ) : (
          <S.Enroll
            size="medium"
            type="secondary"
            onClick={handleEnroll}
            disabled={isButtonDisabled}
          >
            {t('home.open_lessons.enroll_button')}
          </S.Enroll>
        )}
      </S.EnrollRow>
      <S.AuthorContainer>
        <S.AuthorAvatar>{firstNameLetter}</S.AuthorAvatar>
        <S.AuthorName>{fullName}</S.AuthorName>
      </S.AuthorContainer>
    </S.Main>
  );
};

PublicMobile.propTypes = {
  resource: PublicResourceType.isRequired,
  isCourse: PropTypes.bool,
  isCourseLesson: PropTypes.bool,
};

export default PublicMobile;
