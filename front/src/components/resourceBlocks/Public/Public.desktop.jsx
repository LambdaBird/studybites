import { Button, Col } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import LessonKeywords from '@sb-ui/components/atoms/LessonKeywords';
import { PublicResourceType } from '@sb-ui/components/resourceBlocks/types';
import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';

import { useResource } from './useResource';
import * as S from './Public.desktop.styled';

const PublicDesktop = ({ resource, isCourse, isCourseLesson }) => {
  const { t } = useTranslation('user');

  const { name, description, keywords, image } = resource;
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

            <S.AuthorContainer>
              <S.AuthorAvatar>{firstNameLetter}</S.AuthorAvatar>
              <S.AuthorName>{fullName}</S.AuthorName>
            </S.AuthorContainer>
          </div>
        </S.LeftContent>
        <S.RightContent>
          <S.RowEllipsis>
            <Col span={24}>
              <S.TitleEllipsis>{name}</S.TitleEllipsis>
            </Col>
            <Col span={24}>
              <S.DescriptionText
                ellipsis={{
                  tooltip: true,
                  rows: 2,
                }}
              >
                {description}
              </S.DescriptionText>
            </Col>
          </S.RowEllipsis>
          <S.EnrollRow>
            <S.EnrollColKeyword>
              <LessonKeywords keywords={keywords} />
            </S.EnrollColKeyword>
            <S.EnrollColButton>
              <Button
                type={buttonType}
                onClick={buttonClickHandler}
                disabled={isButtonDisabled}
              >
                {t(buttonTitleKey)}
              </Button>
            </S.EnrollColButton>
          </S.EnrollRow>
        </S.RightContent>
      </S.MainSpace>
    </>
  );
};

PublicDesktop.propTypes = {
  resource: PublicResourceType.isRequired,
  isCourse: PropTypes.bool,
  isCourseLesson: PropTypes.bool,
};

export default PublicDesktop;
