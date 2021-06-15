import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { LESSON_PAGE } from '@sb-ui/utils/paths';
import lessonImage from '../../../resources/img/lesson.svg';
import {
  AuthorAvatar,
  AuthorContainer,
  AuthorName,
  DescriptionText,
  EnrollRow,
  LeftContent,
  LessonImg,
  MainSpace,
  RightContent,
} from './PublicLesson.desktop.styled';
import LessonModal from './LessonModal';

const { Title } = Typography;

const PublicLessonDesktop = ({ getLessons, lesson }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { isEnrolled, name, description, firstName, lastName, id } = lesson;
  const author = `${firstName} ${lastName}`;

  const [visible, setVisible] = useState(false);

  const handleContinueLesson = () => {
    history.push(LESSON_PAGE.replace(':id', id));
  };

  return (
    <MainSpace size="large" wrap={false}>
      <LessonModal
        onStartEnroll={getLessons}
        visible={visible}
        setVisible={setVisible}
        lesson={lesson}
      />
      <LeftContent>
        <div>
          <LessonImg src={lessonImage} alt="Lesson" />
          <AuthorContainer>
            <AuthorAvatar>{author?.[0]}</AuthorAvatar>
            <AuthorName>{author}</AuthorName>
          </AuthorContainer>
        </div>
      </LeftContent>
      <RightContent>
        <Row>
          <Title level={3}>{name}</Title>
        </Row>
        <Row>
          <DescriptionText>{description}</DescriptionText>
        </Row>
        <EnrollRow justify="end">
          {isEnrolled ? (
            <Button type="primary" onClick={handleContinueLesson}>
              {t('user_home.ongoing_lessons.continue_button')}
            </Button>
          ) : (
            <Button
              size="medium"
              type="secondary"
              onClick={() => setVisible(true)}
            >
              {t('user_home.open_lessons.enroll_button')}
            </Button>
          )}
        </EnrollRow>
      </RightContent>
    </MainSpace>
  );
};

PublicLessonDesktop.propTypes = {
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

export default PublicLessonDesktop;
