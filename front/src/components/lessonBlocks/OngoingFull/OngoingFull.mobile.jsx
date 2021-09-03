import { Col, Row } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import LessonKeywords from '@sb-ui/components/atoms/LessonKeywords';
import { LessonType } from '@sb-ui/components/lessonBlocks/types';
import lessonImage from '@sb-ui/resources/img/lesson.svg';

import { useLesson } from './useLesson';
import * as S from './OngoingFull.mobile.styled';

const OngoingFullMobile = ({ lesson }) => {
  const { t } = useTranslation('user');
  const { name, description, interactiveTotal, interactivePassed, keywords } =
    lesson;

  const { fullName, firstNameLetter, handleContinueLesson } = useLesson(lesson);

  const countPercentage = useMemo(() => {
    if ((!lesson.interactiveTotal && lesson.isStarted) || lesson.isFinished) {
      return 100;
    }
    return Math.round((interactivePassed / interactiveTotal) * 100);
  }, [lesson, interactivePassed, interactiveTotal]);

  return (
    <S.Main size="large" wrap={false}>
      <div>
        <S.Image src={lessonImage} alt="Lesson" />
        <S.ProgressBar
          percent={countPercentage}
          status={lesson.isFinished ? 'success' : 'normal'}
        />
      </div>
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
