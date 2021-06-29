import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';

import * as S from './OngoingLessons.desktop.styled';
import LessonsList from './LessonsList';

const OngoingLessonsDesktop = (props) => {
  const { t } = useTranslation();

  return (
    <S.Wrapper>
      <S.LessonsHeader justify="space-between" align="middle">
        <Col>
          <Row justify="center" align="middle">
            <S.StyledTitle level={4}>
              {t('user_home.ongoing_lessons.title')}
            </S.StyledTitle>
          </Row>
        </Col>
      </S.LessonsHeader>
      <S.LessonsMainDiv>
        <LessonsList {...props} />
      </S.LessonsMainDiv>
    </S.Wrapper>
  );
};

export default OngoingLessonsDesktop;
