import { Button, Col } from 'antd';
import { useTranslation } from 'react-i18next';

import LessonKeywords from '@sb-ui/components/atoms/LessonKeywords';
import { PublicLessonType } from '@sb-ui/components/lessonBlocks/types';
import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';

import { useLesson } from './useLesson';
import * as S from './Public.desktop.styled';

const PublicDesktop = ({ lesson }) => {
  const { t } = useTranslation('user');

  const { name, description, isEnrolled, keywords, image } = lesson;
  const { fullName, firstNameLetter, handleContinueLesson, handleEnroll } =
    useLesson(lesson);

  return (
    <>
      <S.MainSpace size="large" wrap={false}>
        <S.LeftContent>
          <div>
            <S.LessonImg
              fallback={DefaultLessonImage}
              src={image || DefaultLessonImage}
              alt="Lesson"
            />
            <S.AuthorContainer>
              <S.AuthorAvatar>{firstNameLetter}</S.AuthorAvatar>
              <S.AuthorName>{fullName}</S.AuthorName>
            </S.AuthorContainer>

            <S.AuthorContainer>
              <S.AuthorAvatar>{firstNameLetter}</S.AuthorAvatar>
              <S.AuthorName>{fullName}</S.AuthorName>
            </S.AuthorContainer>
          </div>
        </S.LeftContent>
        <S.RightContent>
          <S.RowEllipsis>
            <Col span={24}>
              <S.TitleEllipsis>{name}</S.TitleEllipsis>
            </Col>
            <Col span={24}>
              <S.DescriptionText
                ellipsis={{
                  tooltip: true,
                  rows: 2,
                }}
              >
                {description}
              </S.DescriptionText>
            </Col>
          </S.RowEllipsis>
          <S.EnrollRow>
            <S.EnrollColKeyword>
              <LessonKeywords keywords={keywords} />
            </S.EnrollColKeyword>
            <S.EnrollColButton>
              {isEnrolled ? (
                <Button type="primary" onClick={handleContinueLesson}>
                  {t('home.ongoing_lessons.continue_button')}
                </Button>
              ) : (
                <Button size="medium" type="secondary" onClick={handleEnroll}>
                  {t('home.open_lessons.enroll_button')}
                </Button>
              )}
            </S.EnrollColButton>
          </S.EnrollRow>
        </S.RightContent>
      </S.MainSpace>
    </>
  );
};

PublicDesktop.propTypes = {
  lesson: PublicLessonType.isRequired,
};

export default PublicDesktop;
