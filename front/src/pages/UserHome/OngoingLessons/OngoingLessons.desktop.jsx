import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { USER_LESSONS } from '@sb-ui/utils/paths';
import { LessonsHeader, LessonsMainDiv } from './OngoingLessons.desktop.styled';
import LessonsList from './LessonsList';

const { Title } = Typography;

const OngoingLessonsDesktop = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <LessonsHeader justify="space-between" align="middle">
        <Col>
          <Row justify="center" align="middle">
            <Title level={3}>{t('user_home.ongoing_lessons.title')}</Title>
          </Row>
        </Col>
        <Col>
          <Link to={USER_LESSONS}>
            {t('user_home.ongoing_lessons.view_all_lessons')}
          </Link>
        </Col>
      </LessonsHeader>
      <LessonsMainDiv>
        <LessonsList {...props} />
      </LessonsMainDiv>
    </>
  );
};

export default OngoingLessonsDesktop;
