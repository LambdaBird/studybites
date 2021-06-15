import { Button, Col, Row, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { LESSON_PAGE } from '@sb-ui/utils/paths';
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
  const history = useHistory();
  const { name, id } = lesson;

  const handleContinueLesson = () => {
    history.push(LESSON_PAGE.replace(':id', id));
  };

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
            <Button type="primary" onClick={handleContinueLesson}>
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
