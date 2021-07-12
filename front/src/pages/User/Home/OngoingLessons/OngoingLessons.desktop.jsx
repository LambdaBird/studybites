import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { USER_LESSONS } from '@sb-ui/utils/paths';

import LessonsList from './LessonsList';
import * as S from './OngoingLessons.desktop.styled';

const OngoingLessonsDesktop = (props) => {
  const { t } = useTranslation('user');

  return (
    <S.Wrapper>
      <S.LessonsHeader justify="space-between" align="middle">
        <Col>
          <Row justify="center" align="middle">
            <S.StyledTitle level={4}>
              {t('home.ongoing_lessons.title')}
            </S.StyledTitle>
          </Row>
        </Col>
        <Col>
          <Link to={USER_LESSONS}>
            {t('home.ongoing_lessons.view_all_lessons')}
          </Link>
        </Col>
      </S.LessonsHeader>
      <S.LessonsMainDiv>
        <LessonsList {...props} />
      </S.LessonsMainDiv>
    </S.Wrapper>
  );
};

export default OngoingLessonsDesktop;
