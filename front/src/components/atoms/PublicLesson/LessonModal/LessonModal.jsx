import React from 'react';
import { Col, Divider, Modal, Rate, Typography } from 'antd';
import PropTypes from 'prop-types';

import lessongImg from '../../../../resources/img/lesson.svg';
import {
  AuthorAvatar,
  AuthorName,
  DescriptionText,
} from '../PublicLesson.styled';
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

const LessonModal = ({ visible, setVisible, lesson }) => {
  const { author, name, description } = lesson;
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
          <img width="100%" src={lessongImg} alt="" />
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
          <StartButton size="large" type="primary">
            Start
          </StartButton>
        </ReviewFooter>
      </RightColumn>
    </Modal>
  );
};

LessonModal.propTypes = {
  lesson: PropTypes.exact({
    id: PropTypes.number.isRequired,
    author: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};

export default LessonModal;
