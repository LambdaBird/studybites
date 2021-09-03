import { Button, Col } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { PublicResourceType } from '@sb-ui/components/resourceBlocks/types';
import lessonImage from '@sb-ui/resources/img/lesson.svg';

import { useResource } from './useResource';
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

const PublicDesktop = ({ resource, isCourse }) => {
  const { t } = useTranslation('user');

  const { name, description, isEnrolled } = resource;
  const { fullName, firstNameLetter, handleContinueLesson, handleEnroll } =
    useResource({ resource, isCourse });

  return (
    <>
      <MainSpace size="large" wrap={false}>
        <LeftContent>
          <div>
            <LessonImg src={lessonImage} alt="Lesson" />
            <AuthorContainer>
              <AuthorAvatar>{firstNameLetter}</AuthorAvatar>
              <AuthorName>{fullName}</AuthorName>
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
  resource: PublicResourceType.isRequired,
  isCourse: PropTypes.bool,
};

export default PublicDesktop;
