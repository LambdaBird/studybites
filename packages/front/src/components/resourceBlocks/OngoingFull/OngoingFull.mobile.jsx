import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import LessonKeywords from '@sb-ui/components/atoms/LessonKeywords';
import { LessonType } from '@sb-ui/components/resourceBlocks/types';
import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';

import { useResource } from './useResource';
import * as S from './OngoingFull.mobile.styled';

const OngoingFullMobile = ({ resource, resourceKey }) => {
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
    <S.Main size="large" wrap={false}>
      <S.ImageWrapper>
        <S.Image
          fallback={DefaultLessonImage}
          src={image || DefaultLessonImage}
          alt="Lesson"
        />
        <S.ProgressBar
          percent={countPercentage}
          status={resource.isFinished ? 'success' : 'normal'}
        />
      </S.ImageWrapper>
      <Row>
        <S.Title>{name}</S.Title>
      </Row>
      <Row>
        <S.Description>{description}</S.Description>
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
        <S.Enroll type="primary" onClick={handleContinueResource}>
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
  resource: LessonType.isRequired,
  resourceKey: PropTypes.string.isRequired,
};

export default OngoingFullMobile;
