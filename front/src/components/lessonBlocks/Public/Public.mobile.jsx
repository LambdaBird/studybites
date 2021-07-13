import { Row } from 'antd';
import { useTranslation } from 'react-i18next';

import { PublicLessonType } from '@sb-ui/components/lessonBlocks/types';
import lessonImage from '@sb-ui/resources/img/lesson.svg';

import { useLesson } from './useLesson';
import * as S from './Public.mobile.styled';

const PublicMobile = ({ lesson }) => {
  const { t } = useTranslation('user');

  const { name, description, isEnrolled } = lesson;
  const { author, handleContinueLesson, handleEnroll } = useLesson(lesson);

  return (
    <S.Main size="large" wrap={false}>
      <div style={{ height: '9rem' }}>
        <S.Image src={lessonImage} alt="Lesson" />
      </div>
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
        <S.AuthorAvatar>{author?.[0]}</S.AuthorAvatar>
        <S.AuthorName>{author}</S.AuthorName>
      </S.AuthorContainer>
    </S.Main>
  );
};

PublicMobile.propTypes = {
  lesson: PublicLessonType,
};

export default PublicMobile;
