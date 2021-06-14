import { Button, Col, Row, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  LeftColumn,
  MainSpace,
  ProgressBar,
  RightColumn,
} from './CurrentLesson.styled';

import lessonImg from '../../../resources/img/lesson.svg';

const { Title } = Typography;

const CurrentLessonMobile = ({ lesson }) => {
  const { t } = useTranslation();
  const { name } = lesson;

  return (
    <MainSpace>
      <LeftColumn span={8}>
        <img height={100} src={lessonImg} alt="Lesson" />
        <ProgressBar percent={50} />
      </LeftColumn>
      <RightColumn span={14}>
        <Title level={4}>{name}</Title>
        <Row justify="end" align="between">
          <Col>
            <Button type="primary">
              {t('user_home.ongoing_lessons.continue_button')}
            </Button>
          </Col>
        </Row>
      </RightColumn>
    </MainSpace>
  );
};

CurrentLessonMobile.propTypes = {
  lesson: PropTypes.exact({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    maintainer: PropTypes.string.isRequired,
  }).isRequired,
};

export default CurrentLessonMobile;
