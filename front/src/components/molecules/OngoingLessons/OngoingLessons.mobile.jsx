import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import CurrentLesson from '@sb-ui/components/atoms/CurrentLesson';

import * as S from './OngoingLessons.mobile.styled';

const lessonExample = {
  title: 'How to use StudyBites. ',
};

const lessonMultipleExample = {
  title: 'How to use StudyBites. Multiline title 🌚',
};

const OngoingLessonsMobile = () => {
  const { t } = useTranslation();

  return (
    <>
      <S.Header justify="space-between" align="middle">
        <Col>
          <Row justify="center" align="middle">
            <S.HeaderTitle level={3}>{t('user_home.ongoing_lessons.title')}</S.HeaderTitle>
          </Row>
        </Col>
      </S.Header>
      <S.Main gutter={[32, 16]}>
        <Col xl={{ span: 8 }} lg={{ span: 24 }}>
          <CurrentLesson lesson={lessonExample} />
        </Col>
        <Col xl={{ span: 8 }} lg={{ span: 24 }}>
          <CurrentLesson lesson={lessonMultipleExample} />
        </Col>
        <Col xl={{ span: 8 }} lg={{ span: 24 }}>
          <CurrentLesson lesson={lessonExample} />
        </Col>
      </S.Main>
      <S.Footer>
        <Col>
          <Typography.Link>
            {t('user_home.ongoing_lessons.view_all_lessons')}
          </Typography.Link>
        </Col>
      </S.Footer>
    </>
  );
};

export default OngoingLessonsMobile;
