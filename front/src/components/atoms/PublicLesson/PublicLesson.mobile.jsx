import { useState } from 'react';
import PropTypes from 'prop-types';
import { Row } from 'antd';
import { useTranslation } from 'react-i18next';

import lessonImage from '@sb-ui/resources/img/lesson.svg';
import LessonModal from './LessonModal';

import * as S from './PublicLesson.mobile.styled';

const PublicLessonMobile = ({ getLessons, lesson }) => {
  const { t } = useTranslation();
  const { isEnrolled, name, description, firstName, lastName } = lesson;
  const author = `${firstName} ${lastName}`;

  const [visible, setVisible] = useState(false);

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
          <S.Enroll type="primary">
            {t('user_home.ongoing_lessons.continue_button')}
          </S.Enroll>
        ) : (
          <S.Enroll
            size="medium"
            type="secondary"
            onClick={() => setVisible(true)}
          >
            {t('user_home.open_lessons.enroll_button')}
          </S.Enroll>
        )}
      </S.EnrollRow>
      <S.AuthorContainer>
        <S.AuthorAvatar>{author?.[0]}</S.AuthorAvatar>
        <S.AuthorName>{author}</S.AuthorName>
      </S.AuthorContainer>
       <LessonModal
        onStartEnroll={getLessons}
        visible={visible}
        setVisible={setVisible}
        lesson={lesson}
      />
    </S.Main>
  );
};

PublicLessonMobile.propTypes = {
  getLessons: PropTypes.func.isRequired,
  lesson: PropTypes.exact({
    id: PropTypes.number.isRequired,
    isEnrolled: PropTypes.bool.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default PublicLessonMobile;
