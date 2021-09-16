import { Col, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { USER_COURSES, USER_LESSONS } from '@sb-ui/utils/paths';

import LessonsList from './LessonsList';
import * as S from './OngoingLessons.mobile.styled';

const OngoingLessonsMobile = (props) => {
  const { t } = useTranslation('user');

  return (
    <>
      <S.Header>
        <Col>
          <Row justify="center" align="middle">
            <S.HeaderTitle>{t('home.ongoing_lessons.title')}</S.HeaderTitle>
          </Row>
        </Col>
      </S.Header>
      <S.Main>
        <LessonsList {...props} />
      </S.Main>
      <S.Footer>
        <Col>
          <Space size="large">
            <Link to={USER_LESSONS}>
              {t('home.ongoing_lessons.view_all_lessons')}
            </Link>
            <Link to={USER_COURSES}>
              {t('home.ongoing_lessons.view_all_courses')}
            </Link>
          </Space>
        </Col>
      </S.Footer>
    </>
  );
};

export default OngoingLessonsMobile;
