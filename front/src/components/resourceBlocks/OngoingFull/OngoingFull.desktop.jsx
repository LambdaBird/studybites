import { Button, Row } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import LessonKeywords from '@sb-ui/components/atoms/LessonKeywords';
import { LessonType } from '@sb-ui/components/resourceBlocks/types';
import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';

import { useResource } from './useResource';
import * as S from './OngoingFull.desktop.styled';

const OngoingFullDesktop = ({ lesson }) => {
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
          <S.EnrollRow>
            <S.EnrollColKeyword>
              <LessonKeywords keywords={keywords} />
            </S.EnrollColKeyword>
            <S.EnrollColButton>
              <Button type="primary" onClick={handleContinueLesson}>
                {t('home.ongoing_lessons.continue_button')}
              </Button>
            </S.EnrollColButton>
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