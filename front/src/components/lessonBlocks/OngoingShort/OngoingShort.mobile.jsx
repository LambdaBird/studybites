import { Button, Col, Row, Typography } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { LessonType } from '@sb-ui/components/lessonBlocks/types';
import lessonImg from '@sb-ui/resources/img/lesson.svg';
import { LEARN_PAGE } from '@sb-ui/utils/paths';

import * as S from './OngoingShort.styled';

const { Title } = Typography;

const OngoingShortMobile = ({ lesson }) => {
  const { t } = useTranslation('user');
  const history = useHistory();
  const { name, id, interactiveTotal, interactivePassed } = lesson;

  const handleContinueLesson = () => {
    history.push(LEARN_PAGE.replace(':id', id));
  };

  const countPercentage = useMemo(() => {
    if (!lesson.interactiveTotal && lesson.isStarted) {
      return 100;
    }
    return Math.round((interactivePassed / interactiveTotal) * 100);
  }, [lesson, interactivePassed, interactiveTotal]);

  return (
    <S.MainSpace>
      <S.LeftColumn span={8}>
        <S.StyledImage src={lessonImg} alt="Lesson" />
        <S.ProgressBar percent={countPercentage} />
      </S.LeftColumn>
      <S.RightColumn span={16}>
        <Title
          ellipsis={{
            tooltip: true,
            rows: 3,
          }}
          level={4}
        >
          {name}
        </Title>
        <Row justify="end" align="between">
          <Col>
            <Button type="primary" onClick={handleContinueLesson}>
              {t('home.ongoing_lessons.continue_button')}
            </Button>
          </Col>
        </Row>
      </S.RightColumn>
    </S.MainSpace>
  );
};

OngoingShortMobile.propTypes = {
  lesson: LessonType.isRequired,
};

export default OngoingShortMobile;
