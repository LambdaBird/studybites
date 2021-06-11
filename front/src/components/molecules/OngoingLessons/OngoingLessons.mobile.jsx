import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import LessonsMain from '@sb-ui/components/molecules/OngoingLessons/LessonsMain';
import * as S from './OngoingLessons.mobile.styled';

const OngoingLessonsMobile = () => {
  const { t } = useTranslation();

  return (
    <>
      <S.Header justify="space-between" align="middle">
        <Col>
          <Row justify="center" align="middle">
            <S.HeaderTitle level={3}>
              {t('user_home.ongoing_lessons.title')}
            </S.HeaderTitle>
          </Row>
        </Col>
      </S.Header>
      <S.Main>
        <LessonsMain />
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
