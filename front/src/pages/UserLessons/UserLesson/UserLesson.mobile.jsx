import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Row } from 'antd';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import lessonImage from '@sb-ui/resources/img/lesson.svg';
import { LESSON_PAGE } from '@sb-ui/utils/paths';
import * as S from './UserLesson.mobile.styled';

const UserLessonMobile = ({ lesson }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { id, name, description, maintainer, percentage } = lesson;

  const fullName = useMemo(
    () =>
      `${maintainer.userInfo.firstName} ${maintainer.userInfo.lastName}`.trim(),
    [maintainer.userInfo.firstName, maintainer.userInfo.lastName],
  );

  const firstNameLetter = useMemo(
    () => maintainer.userInfo.firstName[0] || maintainer.userInfo.lastName[0],
    [maintainer.userInfo.firstName, maintainer.userInfo.lastName],
  );

  const handleContinueLesson = () => {
    history.push(LESSON_PAGE.replace(':id', id));
  };

  return (
    <S.Main size="large" wrap={false}>
      <div>
        <S.Image src={lessonImage} alt="Lesson" />
        <S.ProgressBar percent={Math.round(percentage)} />
      </div>
      <Row>
        <S.Title level={3}>{name}</S.Title>
      </Row>
      <Row>
        <S.Description>{description}</S.Description>
      </Row>
      <S.EnrollRow>
        <S.Enroll type="primary" onClick={handleContinueLesson}>
          {t('user_home.ongoing_lessons.continue_button')}
        </S.Enroll>
      </S.EnrollRow>
      <S.AuthorContainer>
        <S.AuthorAvatar>{firstNameLetter}</S.AuthorAvatar>
        <S.AuthorName>{fullName}</S.AuthorName>
      </S.AuthorContainer>
    </S.Main>
  );
};

UserLessonMobile.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired,
    maintainer: PropTypes.shape({
      userInfo: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};

export default UserLessonMobile;
