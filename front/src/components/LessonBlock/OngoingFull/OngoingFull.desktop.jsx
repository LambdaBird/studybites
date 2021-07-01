import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { LESSON_PAGE } from '@sb-ui/utils/paths';
import lessonImage from '@sb-ui/resources/img/lesson.svg';
import * as S from './OngoingFull.desktop.styled';

const OngoingFullDesktop = ({ lesson }) => {
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
    <>
      <S.MainSpace size="large" wrap={false}>
        <S.LeftContent>
          <div>
            <S.LessonImg src={lessonImage} alt="Lesson" />
            <S.AuthorContainer>
              <S.AuthorAvatar>{firstNameLetter}</S.AuthorAvatar>
              <S.AuthorName>{fullName}</S.AuthorName>
            </S.AuthorContainer>
            <S.ProgressBar percent={Math.round(percentage)} />
          </div>
        </S.LeftContent>
        <S.RightContent>
          <Row>
            <S.TitleEllipsis
              ellipsis={{
                tooltip: true,
              }}
              level={3}
            >
              {name}
            </S.TitleEllipsis>
          </Row>
          <Row>
            <S.DescriptionText>{description}</S.DescriptionText>
          </Row>
          <S.EnrollRow justify="end">
            <Button type="primary" onClick={handleContinueLesson}>
              {t('user_home.ongoing_lessons.continue_button')}
            </Button>
          </S.EnrollRow>
        </S.RightContent>
      </S.MainSpace>
    </>
  );
};

OngoingFullDesktop.propTypes = {
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

export default OngoingFullDesktop;