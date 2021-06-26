import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { LESSON_PAGE, USER_ENROLL } from '@sb-ui/utils/paths';
import lessonImage from '@sb-ui/resources/img/lesson.svg';
import * as S from './UserLesson.desktop.styled';

const { Title } = Typography;

const UserLessonDesktop = ({ lesson }) => {
  const location = useLocation();
  const query = useMemo(() => location.search, [location]);

  const { t } = useTranslation();
  const history = useHistory();
  const { id, isEnrolled, name, description, maintainer } = lesson;

  const fullName = useMemo(
    () =>
      `${maintainer.userInfo.firstName} ${maintainer.userInfo.lastName}`.trim(),
    [maintainer.userInfo.firstName, maintainer.userInfo.lastName],
  );

  const firstNameLetter = useMemo(
    () => maintainer.userInfo.firstName[0] || maintainer.userInfo.lastName[0],
    [maintainer.userInfo.firstName, maintainer.userInfo.lastName],
  );

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
    <>
      <S.MainSpace size="large" wrap={false}>
        <S.LeftContent>
          <div>
            <S.LessonImg src={lessonImage} alt="Lesson" />
            <S.AuthorContainer>
              <S.AuthorAvatar>{firstNameLetter}</S.AuthorAvatar>
              <S.AuthorName>{fullName}</S.AuthorName>
            </S.AuthorContainer>
          </div>
        </S.LeftContent>
        <S.RightContent>
          <Row>
            <Title level={3}>{name}</Title>
          </Row>
          <Row>
            <S.DescriptionText>{description}</S.DescriptionText>
          </Row>
          <S.EnrollRow justify="end">
            {isEnrolled ? (
              <Button type="primary" onClick={handleContinueLesson}>
                {t('user_home.ongoing_lessons.continue_button')}
              </Button>
            ) : (
              <Button size="medium" type="secondary" onClick={handleEnroll}>
                {t('user_home.open_lessons.enroll_button')}
              </Button>
            )}
          </S.EnrollRow>
        </S.RightContent>
      </S.MainSpace>
    </>
  );
};

UserLessonDesktop.propTypes = {
  lesson: PropTypes.exact({
    id: PropTypes.number.isRequired,
    isEnrolled: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    maintainer: PropTypes.shape({
      userInfo: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};

export default UserLessonDesktop;
