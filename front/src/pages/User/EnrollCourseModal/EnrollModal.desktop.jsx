import { Col, Divider, Modal, Rate, Typography } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import lessonImg from '@sb-ui/resources/img/lesson.svg';
import { enrollCourse, getCourse } from '@sb-ui/utils/api/v1/courses';
import { LEARN_PAGE, USER_HOME } from '@sb-ui/utils/paths';
import { USER_COURSE_MODAL_BASE_KEY } from '@sb-ui/utils/queries';

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

  const historyPushCourse = useCallback(() => {
    history.push(LEARN_PAGE.replace(':id', id));
  }, [history, id]);

  const { data: responseData } = useQuery(
    [USER_COURSE_MODAL_BASE_KEY, { id }],
    getCourse,
  );

  const { mutate: mutatePostEnroll } = useMutation(enrollCourse);

  const { name, author, description } = responseData?.course || {
    author: {
      firstName: '',
      lastName: '',
    },
    name: '',
    description: '',
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
    if (responseData !== undefined && !responseData?.course) {
      historyReplaceBack();
    }
  }, [historyReplaceBack, responseData]);

  const onClickStartEnroll = useCallback(async () => {
    mutatePostEnroll(id, {
      onSuccess: historyPushCourse,
    });
  }, [mutatePostEnroll, id, historyPushCourse]);

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
