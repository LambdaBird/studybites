import { useCallback, useMemo } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Col, Divider, Modal, Rate, Typography } from 'antd';
import {
  getEnrolledLesson,
  postEnroll,
} from '@sb-ui/utils/api/v1/lesson/lesson';
import { LESSON_PAGE, USER_HOME } from '@sb-ui/utils/paths';
import { USER_LESSON_MODAL_BASE_KEY } from '@sb-ui/utils/queries';
import lessonImg from '@sb-ui/resources/img/lesson.svg';
import * as S from './EnrollModal.desktop.styled';

const { Title, Text } = Typography;

const EnrollModalDesktop = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const query = useMemo(() => location.search, [location]);
  const history = useHistory();
  const { id } = useParams();

  const historyPushBack = useCallback(() => {
    history.push({
      search: query,
      pathname: USER_HOME,
    });
  }, [query, history]);

  const historyPushLesson = useCallback(() => {
    history.push(LESSON_PAGE.replace(':id', id));
  }, [history, id]);

  const { data: responseData } = useQuery(
    [
      USER_LESSON_MODAL_BASE_KEY,
      {
        id,
      },
    ],
    getEnrolledLesson,
  );
  const { name, authors, description } = responseData?.lesson || {
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
    historyPushLesson();
  }, [id, historyPushLesson]);

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
      <S.LeftColumn>
        <Col span={24}>
          <img width="100%" src={lessonImg} alt="" />
          <S.AuthorContainer>
            <S.AuthorAvatar>{author?.[0]}</S.AuthorAvatar>
            <S.AuthorName>{author}</S.AuthorName>
          </S.AuthorContainer>
        </Col>
        <S.NameColumn span={24}>
          <Title level={3}>{name}</Title>
        </S.NameColumn>
        <Col span={24}>
          <S.DescriptionText>{description}</S.DescriptionText>
        </Col>
      </S.LeftColumn>
      <S.RightColumn>
        <S.ReviewHeader>
          <S.ReviewHeaderSpace>
            <Text>{t('enroll_modal.review.header')}</Text>
            <Rate />
            <S.DescriptionText>(0)</S.DescriptionText>
          </S.ReviewHeaderSpace>
          <Divider />
        </S.ReviewHeader>
        <S.ReviewBody>
          <S.ReviewBodyText>
            <div>
              <S.DescriptionText>
                {t('enroll_modal.review.empty')}
              </S.DescriptionText>
            </div>
            <div>
              <Typography.Link>
                {t('enroll_modal.review.be_first')}
              </Typography.Link>
            </div>
          </S.ReviewBodyText>
          <Divider />
        </S.ReviewBody>
        <S.ReviewFooter>
          <S.StartButton
            onClick={onClickStartEnroll}
            size="large"
            type="primary"
          >
            {t('enroll_modal.start')}
          </S.StartButton>
        </S.ReviewFooter>
      </S.RightColumn>
    </Modal>
  );
};

export default EnrollModalDesktop;
