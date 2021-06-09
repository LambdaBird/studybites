import { useCallback } from 'react';
import { Col, Divider, Modal, Rate, Typography } from 'antd';
import PropTypes from 'prop-types';
import { postEnroll } from '@sb-ui/utils/api/v1/lesson/lesson';
import lessonImg from '../../../../resources/img/lesson.svg';
import {
  AuthorAvatar,
  AuthorName,
  DescriptionText,
} from '../PublicLessonDesktop.styled';
import {
  AuthorContainer,
  LeftColumn,
  NameColumn,
  ReviewBody,
  ReviewBodyText,
  ReviewFooter,
  ReviewHeader,
  ReviewHeaderSpace,
  RightColumn,
  StartButton,
} from './LessonModal.styled';

const { Title, Text } = Typography;

const LessonModal = ({ onStartEnroll, visible, setVisible, lesson }) => {
  const { id, firstName, lastName, name, description } = lesson;
  const author = `${firstName} ${lastName}`;

  const onClickStartEnroll = useCallback(async () => {
    await postEnroll(id);
    setVisible(false);
    onStartEnroll();
  }, [onStartEnroll, setVisible, id]);

  return (
    <Modal
      centered
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      footer={null}
      width="50%"
      bodyStyle={{
        display: 'flex',
      }}
    >
      <LeftColumn>
        <Col span={24}>
          <img width="100%" src={lessonImg} alt="" />
          <AuthorContainer>
            <AuthorAvatar>{author?.[0]}</AuthorAvatar>
            <AuthorName>{author}</AuthorName>
          </AuthorContainer>
        </Col>
        <NameColumn span={24}>
          <Title level={3}>{name}</Title>
        </NameColumn>
        <Col span={24}>
          <DescriptionText>{description}</DescriptionText>
        </Col>
      </LeftColumn>
      <RightColumn>
        <ReviewHeader>
          <ReviewHeaderSpace>
            <Text>Reviews</Text>
            <Rate />
            <DescriptionText>(0)</DescriptionText>
          </ReviewHeaderSpace>
          <Divider />
        </ReviewHeader>
        <ReviewBody>
          <ReviewBodyText>
            <div>
              <DescriptionText>No reviews yet</DescriptionText>
            </div>
            <div>
              <Typography.Link>Be first to rate a lesson</Typography.Link>
            </div>
          </ReviewBodyText>
          <Divider />
        </ReviewBody>
        <ReviewFooter>
          <StartButton onClick={onClickStartEnroll} size="large" type="primary">
            Start
          </StartButton>
        </ReviewFooter>
      </RightColumn>
    </Modal>
  );
};

LessonModal.propTypes = {
  onStartEnroll: PropTypes.func.isRequired,
  lesson: PropTypes.exact({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};

export default LessonModal;
