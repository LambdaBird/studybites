import PropTypes from 'prop-types';
import { Button, Col, Progress, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import lessonImage from '../../../resources/img/lesson.svg';
import {
  MainSpaced,
  MoreIconImg,
  ProgressBarCol,
} from './OngoingLesson.styled';
import {
  AuthorAvatar,
  AuthorContainer,
  AuthorName,
  DescriptionText,
  EnrollRow,
  LeftContent,
  LessonImg,
  RightContent,
} from '../PublicLesson/PublicLesson.desktop.styled';

import moreIcon from '../../../resources/icons/moreIcon.svg';

const { Title } = Typography;

const OngoingLesson = ({ lesson }) => {
  const { t } = useTranslation();
  const { description, name, maintainer } = lesson;
  const { firstName, lastName } = maintainer?.userInfo;
  const author = `${firstName} ${lastName}`;

  return (
    <MainSpaced size="large" wrap={false}>
      <LeftContent>
        <Row>
          <Col span={24}>
            <div>
              <LessonImg src={lessonImage} alt="Lesson" />
              <AuthorContainer>
                <AuthorAvatar>{author?.[0]}</AuthorAvatar>
                <AuthorName>{author}</AuthorName>
              </AuthorContainer>
            </div>
          </Col>
          <ProgressBarCol span={24}>
            <Progress percent={50} />
          </ProgressBarCol>
        </Row>
      </LeftContent>
      <RightContent>
        <Row justify="space-between" align="top">
          <Title level={3}>{name}</Title>
          <MoreIconImg src={moreIcon} alt="more" />
        </Row>
        <Row>
          <DescriptionText>{description}</DescriptionText>
        </Row>
        <EnrollRow justify="end">
          <Button size="medium" type="primary">
            {t('user_lessons.ongoing_lessons.continue_button')}
          </Button>
        </EnrollRow>
      </RightContent>
    </MainSpaced>
  );
};

OngoingLesson.propTypes = {
  lesson: PropTypes.exact({
    id: PropTypes.number.isRequired,
    maintainer: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default OngoingLesson;
