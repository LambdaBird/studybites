import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import LessonKeywords from '@sb-ui/components/atoms/LessonKeywords';
import { PublicResourceType } from '@sb-ui/components/resourceBlocks/types';
import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';

import { useResource } from './useResource';
import * as S from './Public.mobile.styled';

const PublicMobile = ({ resource, isCourse }) => {
  const { t } = useTranslation('user');

  const { name, description, isEnrolled, image, keywords } = resource;
  const { fullName, firstNameLetter, handleContinueLesson, handleEnroll } =
    useResource({ resource, isCourse });

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
  resource: PublicResourceType.isRequired,
  isCourse: PropTypes.bool,
};

export default PublicMobile;
