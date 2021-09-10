import { Col, Row } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

<<<<<<< HEAD:front/src/components/resourceBlocks/OngoingFull/OngoingFull.mobile.jsx
import { LessonType } from '@sb-ui/components/resourceBlocks/types';
import lessonImage from '@sb-ui/resources/img/lesson.svg';
=======
import LessonKeywords from '@sb-ui/components/atoms/LessonKeywords';
import { LessonType } from '@sb-ui/components/lessonBlocks/types';
import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';
>>>>>>> develop:front/src/components/lessonBlocks/OngoingFull/OngoingFull.mobile.jsx

import { useResource } from './useResource';
import * as S from './OngoingFull.mobile.styled';

const OngoingFullMobile = ({ lesson }) => {
  const { t } = useTranslation('user');
  const {
    name,
    description,
    interactiveTotal,
    interactivePassed,
    image,
    keywords,
  } = lesson;

  const { fullName, firstNameLetter, handleContinueLesson } = useResource({
    resource: lesson,
  });

  const countPercentage = useMemo(() => {
    if ((!lesson.interactiveTotal && lesson.isStarted) || lesson.isFinished) {
      return 100;
    }
    return Math.round((interactivePassed / interactiveTotal) * 100);
  }, [lesson, interactivePassed, interactiveTotal]);

  return (
    <S.Main size="large" wrap={false}>
      <S.ImageWrapper>
        <S.Image
          fallback={DefaultLessonImage}
          src={image || DefaultLessonImage}
          alt="Lesson"
        />
        <S.ProgressBar
          percent={countPercentage}
          status={lesson.isFinished ? 'success' : 'normal'}
        />
      </S.ImageWrapper>
      <Row>
        <S.Title
          level={3}
          ellipsis={{
            tooltip: true,
          }}
        >
          {name}
        </S.Title>
      </Row>
      <S.DescriptionRow>
        <Col span={24}>
          <S.Description>{description}</S.Description>
        </Col>
        <Col span={24}>
          <LessonKeywords keywords={keywords} />
        </Col>
      </S.DescriptionRow>
      <S.EnrollRow>
        <S.Enroll type="primary" onClick={handleContinueLesson}>
          {t('home.ongoing_lessons.continue_button')}
        </S.Enroll>
      </S.EnrollRow>
      <S.AuthorContainer>
        <S.AuthorAvatar>{firstNameLetter}</S.AuthorAvatar>
        <S.AuthorName>{fullName}</S.AuthorName>
      </S.AuthorContainer>
    </S.Main>
  );
};

OngoingFullMobile.propTypes = {
  lesson: LessonType.isRequired,
};

export default OngoingFullMobile;
