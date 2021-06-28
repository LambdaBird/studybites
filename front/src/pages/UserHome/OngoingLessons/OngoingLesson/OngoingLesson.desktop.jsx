import { useMemo } from 'react';
import { Button, Col, Row, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { LESSON_PAGE } from '@sb-ui/utils/paths';
import lessonImg from '@sb-ui/resources/img/lesson.svg';
import { getProgressEnrolledLesson } from '@sb-ui/utils';
import * as S from './OngoingLesson.styled';

const { Title } = Typography;

const OngoingLessonDesktop = ({ lesson }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const { name, id, blocks, totalBlocks, isFinished } = lesson;

  const progressPercent = useMemo(
    () => (isFinished ? 100 : getProgressEnrolledLesson(blocks, totalBlocks)),
    [blocks, isFinished, totalBlocks],
  );

  const handleContinueLesson = () => {
    history.push(LESSON_PAGE.replace(':id', id));
  };

  return (
    <S.MainSpace>
      <S.LeftColumn span={8}>
        <img height={100} src={lessonImg} alt="Lesson" />
        <S.ProgressBar percent={progressPercent} />
      </S.LeftColumn>
      <S.RightColumn span={16}>
        <Title level={4}>{name}</Title>
        <Row justify="end" align="between">
          <Col>
            <Button type="primary" onClick={handleContinueLesson}>
              {t('user_home.ongoing_lessons.continue_button')}
            </Button>
          </Col>
        </Row>
      </S.RightColumn>
    </S.MainSpace>
  );
};

OngoingLessonDesktop.propTypes = {
  lesson: PropTypes.exact({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    maintainer: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    blocks: PropTypes.array.isRequired,
    totalBlocks: PropTypes.number.isRequired,
    isFinished: PropTypes.bool,
  }).isRequired,
};

export default OngoingLessonDesktop;
