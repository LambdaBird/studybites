import { Row } from 'antd';
import { useTranslation } from 'react-i18next';

import { PublicLessonType } from '@sb-ui/components/lessonBlocks/types';
import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';

import { useLesson } from './useLesson';
import * as S from './Public.mobile.styled';

const PublicMobile = ({ lesson }) => {
  const { t } = useTranslation('user');

  const { name, description, isEnrolled, image } = lesson;
  const { fullName, firstNameLetter, handleContinueLesson, handleEnroll } =
    useLesson(lesson);

  return (
    <S.Main size="large" wrap={false}>
      <S.ImageWrapper>
        <S.Image
          fallback={DefaultLessonImage}
          src={image || DefaultLessonImage}
          alt="Lesson"
        />
      </S.ImageWrapper>
      <Row>
        <S.Title
          ellipsis={{
            tooltip: true,
          }}
          level={3}
        >
          {name}
        </S.Title>
      </Row>
      <Row>
        <S.Description
          ellipsis={{
            rows: 2,
            tooltip: true,
          }}
        >
          {description}
        </S.Description>
      </Row>
      <S.EnrollRow>
        {isEnrolled ? (
          <S.Enroll type="primary" onClick={handleContinueLesson}>
            {t('home.ongoing_lessons.continue_button')}
          </S.Enroll>
        ) : (
          <S.Enroll size="medium" type="secondary" onClick={handleEnroll}>
            {t('home.open_lessons.enroll_button')}
          </S.Enroll>
        )}
      </S.EnrollRow>
      <S.AuthorContainer>
        <S.AuthorAvatar>{firstNameLetter}</S.AuthorAvatar>
        <S.AuthorName>{fullName}</S.AuthorName>
      </S.AuthorContainer>
    </S.Main>
  );
};

PublicMobile.propTypes = {
  lesson: PublicLessonType.isRequired,
};

export default PublicMobile;
