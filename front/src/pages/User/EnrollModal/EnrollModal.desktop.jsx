import { Col, Divider, Modal, Rate, Typography } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';
import { enrollLesson, getLesson } from '@sb-ui/utils/api/v1/lessons';
import { LEARN_PAGE, USER_HOME } from '@sb-ui/utils/paths';
import { USER_LESSON_MODAL_BASE_KEY } from '@sb-ui/utils/queries';

import * as S from './EnrollModal.desktop.styled';

const { Title, Text } = Typography;

const EnrollModalDesktop = () => {
  const { t } = useTranslation('user');
  const location = useLocation();
  const query = useMemo(() => location.search, [location]);
  const history = useHistory();
  const { id } = useParams();

  const historyReplaceBack = useCallback(() => {
    history.replace({
      pathname: USER_HOME,
    });
  }, [history]);

  const historyPushBack = useCallback(() => {
    history.push({
      search: query,
      pathname: USER_HOME,
    });
  }, [query, history]);

  const historyPushLesson = useCallback(() => {
    history.push(LEARN_PAGE.replace(':id', id));
  }, [history, id]);

  const { data: responseData } = useQuery(
    [USER_LESSON_MODAL_BASE_KEY, { id }],
    getLesson,
  );

  const { mutate: mutatePostEnroll } = useMutation(enrollLesson);

  const { name, author, description, image } = responseData?.lesson || {
    author: {
      firstName: '',
      lastName: '',
    },
    name: '',
    description: '',
    image: '',
  };

  const fullName = useMemo(
    () => `${author.firstName} ${author.lastName}`.trim(),
    [author],
  );

  const firstNameLetter = useMemo(
    () => author.firstName?.[0] || author.lastName?.[0],
    [author],
  );

  useEffect(() => {
    if (responseData !== undefined && !responseData?.lesson) {
      historyReplaceBack();
    }
  }, [historyReplaceBack, responseData]);

  const onClickStartEnroll = useCallback(async () => {
    mutatePostEnroll(id, {
      onSuccess: historyPushLesson,
    });
  }, [mutatePostEnroll, id, historyPushLesson]);

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
          <S.Image
            fallback={DefaultLessonImage}
            src={image || DefaultLessonImage}
            alt="Lesson"
          />
          <S.AuthorContainer>
            <S.AuthorAvatar>{firstNameLetter}</S.AuthorAvatar>
            <S.AuthorName>{fullName}</S.AuthorName>
          </S.AuthorContainer>
        </Col>
        <S.NameColumn>
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
