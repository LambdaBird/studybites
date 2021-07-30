import { Button, Row } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { LessonType } from '@sb-ui/components/lessonBlocks/types';
import lessonImage from '@sb-ui/resources/img/lesson.svg';

import { useLesson } from './useLesson';
import * as S from './OngoingFull.desktop.styled';

const OngoingFullDesktop = ({ lesson }) => {
  const { t } = useTranslation('user');
  const { name, description, interactiveTotal, interactivePassed } = lesson;

  const { fullName, firstNameLetter, handleContinueLesson } = useLesson(lesson);

  const countPercentage = useMemo(() => {
    if ((!lesson.interactiveTotal && lesson.isStarted) || lesson.isFinished) {
      return 100;
    }
    return Math.round((interactivePassed / interactiveTotal) * 100);
  }, [lesson, interactivePassed, interactiveTotal]);

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
            <S.ProgressBar
              percent={countPercentage}
              status={lesson.isFinished ? 'success' : 'normal'}
            />
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
            <S.DescriptionText
              ellipsis={{
                tooltip: true,
                rows: 2,
              }}
            >
              {description}
            </S.DescriptionText>
          </Row>
          <S.EnrollRow justify="end">
            <Button type="primary" onClick={handleContinueLesson}>
              {t('home.ongoing_lessons.continue_button')}
            </Button>
          </S.EnrollRow>
        </S.RightContent>
      </S.MainSpace>
    </>
  );
};

OngoingFullDesktop.propTypes = {
  lesson: LessonType.isRequired,
};

export default OngoingFullDesktop;
