import { useCallback, useMemo } from 'react';
import { Col, Divider, Modal, Rate, Typography } from 'antd';
import { useQuery } from 'react-query';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getLessonById, postEnroll } from '@sb-ui/utils/api/v1/lesson/lesson';
import { USER_HOME } from '@sb-ui/utils/paths';
import { USER_LESSON_MODAL_BASE_KEY } from '@sb-ui/components/atoms/PublicLesson/LessonModal/constants';
import { useTranslation } from 'react-i18next';
import lessonImg from '../../../../resources/img/lesson.svg';
import {
  AuthorAvatar,
  AuthorName,
  DescriptionText,
} from '../PublicLesson.desktop.styled';
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

const LessonModal = ({ onStartEnroll }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const query = useMemo(() => location.search, [location]);
  const history = useHistory();
  const { id } = useParams();

  const historyPushBack = () => {
    history.push({
      search: query,
      pathname: USER_HOME,
    });
  };

  const { data: responseData } = useQuery(
    [
      USER_LESSON_MODAL_BASE_KEY,
      {
        id,
      },
    ],
    getLessonById,
    { keepPreviousData: true },
  );
  const { name, authors, description } = responseData?.data || {
    authors: [
      {
        firstName: '',
        lastName: '',
      },
    ],
    name: '',
    description: '',
  };

  const { firstName, lastName } = authors?.[0];
  const author = `${firstName} ${lastName}`;

  const onClickStartEnroll = useCallback(async () => {
    await postEnroll(id);
    historyPushBack();
    onStartEnroll();
  }, [id, historyPushBack, onStartEnroll]);

  return (
    <Modal
      centered
      visible
      onOk={historyPushBack}
      onCancel={historyPushBack}
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
            <Text>{t('enroll_modal.review.header')}</Text>
            <Rate />
            <DescriptionText>(0)</DescriptionText>
          </ReviewHeaderSpace>
          <Divider />
        </ReviewHeader>
        <ReviewBody>
          <ReviewBodyText>
            <div>
              <DescriptionText>
                {t('enroll_modal.review.empty')}
              </DescriptionText>
            </div>
            <div>
              <Typography.Link>
                {t('enroll_modal.review.be_first')}
              </Typography.Link>
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
};

export default LessonModal;
