import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Row } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import lessonImage from '@sb-ui/resources/img/lesson.svg';
import { LESSON_PAGE, USER_ENROLL } from '@sb-ui/utils/paths';
import * as S from './UserLesson.mobile.styled';

const UserLessonMobile = ({ lesson }) => {
  const location = useLocation();
  const query = useMemo(() => location.search, [location]);
  const { t } = useTranslation();
  const history = useHistory();
  const { id, isEnrolled, name, description, firstName, lastName } = lesson;
  const author = `${firstName} ${lastName}`;

  const handleEnroll = () => {
    history.push({
      search: query,
      pathname: USER_ENROLL.replace(':id', id),
    });
  };

  const handleContinueLesson = () => {
    history.push(LESSON_PAGE.replace(':id', id));
  };

  return (
    <S.Main size="large" wrap={false}>
      <div style={{ height: '9rem' }}>
        <S.Image src={lessonImage} alt="Lesson" />
      </div>
      <Row>
        <S.Title level={3}>{name}</S.Title>
      </Row>
      <Row>
        <S.Description>{description}</S.Description>
      </Row>
      <S.EnrollRow>
        {isEnrolled ? (
          <S.Enroll type="primary" onClick={handleContinueLesson}>
            {t('user_home.ongoing_lessons.continue_button')}
          </S.Enroll>
        ) : (
          <S.Enroll size="medium" type="secondary" onClick={handleEnroll}>
            {t('user_home.open_lessons.enroll_button')}
          </S.Enroll>
        )}
      </S.EnrollRow>
      <S.AuthorContainer>
        <S.AuthorAvatar>{author?.[0]}</S.AuthorAvatar>
        <S.AuthorName>{author}</S.AuthorName>
      </S.AuthorContainer>
    </S.Main>
  );
};

UserLessonMobile.propTypes = {
  lesson: PropTypes.exact({
    id: PropTypes.number.isRequired,
    isEnrolled: PropTypes.bool.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserLessonMobile;
