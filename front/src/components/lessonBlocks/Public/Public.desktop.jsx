import { Button, Col } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import lessonImage from '@sb-ui/resources/img/lesson.svg';

import { useLesson } from './useLesson';
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
  RowEllipsis,
  TitleEllipsis,
} from './Public.desktop.styled';

const PublicDesktop = ({ lesson }) => {
  const { t } = useTranslation('user');

  const { name, description, isEnrolled } = lesson;
  const { author, handleContinueLesson, handleEnroll } = useLesson(lesson);

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
          <RowEllipsis>
            <Col span={24}>
              <TitleEllipsis
                ellipsis={{
                  tooltip: true,
                }}
                level={3}
              >
                {name}
              </TitleEllipsis>
            </Col>
            <Col span={24}>
              <DescriptionText
                ellipsis={{
                  tooltip: true,
                  rows: 2,
                }}
              >
                {description}
              </DescriptionText>
            </Col>
          </RowEllipsis>
          <EnrollRow justify="end">
            {isEnrolled ? (
              <Button type="primary" onClick={handleContinueLesson}>
                {t('home.ongoing_lessons.continue_button')}
              </Button>
            ) : (
              <Button size="medium" type="secondary" onClick={handleEnroll}>
                {t('home.open_lessons.enroll_button')}
              </Button>
            )}
          </EnrollRow>
        </RightContent>
      </MainSpace>
    </>
  );
};

PublicDesktop.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.number.isRequired,
    isEnrolled: PropTypes.bool.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default PublicDesktop;
