import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import LessonKeywords from '@sb-ui/components/atoms/LessonKeywords';
import { PublicResourceType } from '@sb-ui/components/resourceBlocks/types';
import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';

import { useResource } from './useResource';
import * as S from './Public.mobile.styled';

const PublicMobile = ({ resource, isCourse, isCourseLesson }) => {
  const { t } = useTranslation('user');

  const { name, description, image, keywords } = resource;
  const {
    fullName,
    firstNameLetter,
    buttonType,
    buttonTitleKey,
    buttonClickHandler,
  } = useResource({ resource, isCourse, isCourseLesson });

  const isButtonDisabled =
    isCourseLesson && !resource.isFinished && !resource.isCurrent;

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
      <S.DescriptionRow style={{ marginBottom: '1rem' }}>
        <Col span={24}>
          <S.Description>{description}</S.Description>
        </Col>
        <Col span={24}>
          <LessonKeywords keywords={keywords} />
        </Col>
      </S.DescriptionRow>
      <S.EnrollRow>
        <S.Enroll
          type={buttonType}
          onClick={buttonClickHandler}
          disabled={isButtonDisabled}
        >
          {t(buttonTitleKey)}
        </S.Enroll>
      </S.EnrollRow>
      <S.AuthorContainer>
        <S.AuthorAvatar>{firstNameLetter}</S.AuthorAvatar>
        <S.AuthorName>{fullName}</S.AuthorName>
      </S.AuthorContainer>
    </S.Main>
  );
};

PublicMobile.propTypes = {
  resource: PublicResourceType.isRequired,
  isCourse: PropTypes.bool,
  isCourseLesson: PropTypes.bool,
};

export default PublicMobile;
