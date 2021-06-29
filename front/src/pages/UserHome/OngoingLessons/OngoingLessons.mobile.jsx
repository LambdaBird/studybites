import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import * as S from './OngoingLessons.mobile.styled';
import LessonsList from './LessonsList';

const OngoingLessonsMobile = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <S.Header justify="space-between" align="middle">
        <Col>
          <Row justify="center" align="middle">
            <S.HeaderTitle level={4}>
              {t('user_home.ongoing_lessons.title')}
            </S.HeaderTitle>
          </Row>
        </Col>
      </S.Header>
      <S.Main>
        <LessonsList {...props} />
      </S.Main>
    </>
  );
};

export default OngoingLessonsMobile;
