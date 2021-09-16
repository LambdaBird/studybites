import { Button, Row } from 'antd';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import LessonKeywords from '@sb-ui/components/atoms/LessonKeywords';
import { LessonType } from '@sb-ui/components/resourceBlocks/types';
import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';

import { useResource } from './useResource';
import * as S from './OngoingFull.desktop.styled';

const OngoingFullDesktop = ({ resource, resourceKey }) => {
  const { t } = useTranslation('user');
  const {
    name,
    description,
    interactiveTotal,
    interactivePassed,
    image,
    keywords,
  } = resource;

  const { fullName, firstNameLetter, handleContinueResource } = useResource({
    ...resource,
    resourceKey,
  });

  const countPercentage = useMemo(() => {
    if (
      (!resource.interactiveTotal && resource.isStarted) ||
      resource.isFinished
    ) {
      return 100;
    }
    return Math.round((interactivePassed / interactiveTotal) * 100);
  }, [resource, interactivePassed, interactiveTotal]);

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
              status={resource.isFinished ? 'success' : 'normal'}
            />
          </div>
        </S.LeftContent>
        <S.RightContent>
          <Row>
            <S.TitleEllipsis>{name}</S.TitleEllipsis>
          </Row>
          <Row>
            <S.DescriptionText>{description}</S.DescriptionText>
          </Row>
          <S.EnrollRow>
            <S.EnrollColKeyword>
              <LessonKeywords keywords={keywords} />
            </S.EnrollColKeyword>
            <S.EnrollColButton>
              <Button type="primary" onClick={handleContinueResource}>
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
  resource: LessonType.isRequired,
  resourceKey: PropTypes.string.isRequired,
};

export default OngoingFullDesktop;
