import { Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LessonsMain from '@sb-ui/components/molecules/OngoingLessons/LessonsMain';
import { USER_LESSONS } from '@sb-ui/utils/paths';
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
          <Link to={USER_LESSONS}>
            {t('user_home.ongoing_lessons.view_all_lessons')}
          </Link>
        </Col>
      </S.Footer>
    </>
  );
};

export default OngoingLessonsMobile;
