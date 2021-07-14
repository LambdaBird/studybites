import { Button, Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { LessonType } from '@sb-ui/components/lessonBlocks/types';
import lessonImg from '@sb-ui/resources/img/lesson.svg';
import { LESSON_PAGE } from '@sb-ui/utils/paths';

import * as S from './OngoingShort.styled';

const { Title } = Typography;

const OngoingShortDesktop = ({ lesson }) => {
  const { t } = useTranslation('user');
  const history = useHistory();

  const { name, id, percentage } = lesson;

  const handleContinueLesson = () => {
    history.push(LESSON_PAGE.replace(':id', id));
  };

  return (
    <S.MainSpace>
      <S.LeftColumn span={8}>
        <img height={100} src={lessonImg} alt="Lesson" />
        <S.ProgressBar percent={Math.round(percentage)} />
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

OngoingShortDesktop.propTypes = {
  lesson: LessonType.isRequired,
};

export default OngoingShortDesktop;
