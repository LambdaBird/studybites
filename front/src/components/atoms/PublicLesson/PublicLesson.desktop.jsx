import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { LESSON_PAGE, USER_ENROLL, USER_HOME } from '@sb-ui/utils/paths';
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

const { Title } = Typography;

const PublicLessonDesktop = ({ lesson }) => {
  const location = useLocation();
  const query = useMemo(() => location.search, [location]);

  const { t } = useTranslation();
  const history = useHistory();
  const { id, isEnrolled, name, description, firstName, lastName } = lesson;
  const author = `${firstName} ${lastName}`;

  const handleEnroll = () => {
    history.push({
      search: query,
      pathname: `${USER_HOME}${USER_ENROLL}/${id}`,
    });
  };

  const handleContinueLesson = () => {
    history.push(LESSON_PAGE.replace(':id', id));
  };

  return (
    <>
      <MainSpace size="large" wrap={false}>
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
              <Button size="medium" type="secondary" onClick={handleEnroll}>
                {t('user_home.open_lessons.enroll_button')}
              </Button>
            )}
          </EnrollRow>
        </RightContent>
      </MainSpace>
    </>
  );
};

PublicLessonDesktop.propTypes = {
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
