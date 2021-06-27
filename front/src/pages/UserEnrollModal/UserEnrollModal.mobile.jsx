import { useMemo } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Comment, List, Rate, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import lessonImage from '@sb-ui/resources/img/lesson.svg';
import { DescriptionText } from '@sb-ui/pages/UserHome/PublicLessons/PublicLesson/PublicLesson.desktop.styled';
import {
  getEnrolledLesson,
  postEnroll,
} from '@sb-ui/utils/api/v1/lesson/lesson';
import { USER_HOME } from '@sb-ui/utils/paths';
import { USER_LESSON_MODAL_BASE_KEY } from '@sb-ui/utils/queries';
import * as S from './UserEnrollModal.mobile.styled';

const { Title } = Typography;

// TODO dataReview
const TEST_DATA = 0;
const dataReview = TEST_DATA
  ? [
      {
        datetime: 'Ultimate Student',
        author: 'Han Solo',
        avatar:
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content: (
          <p>
            So yes, the alcohol (ethanol) in hand sanitizers can be absorbed
            through the skin, but no, it would not cause intoxication.
          </p>
        ),
      },
      {
        datetime: 'Ultimate Student',
        author: 'Han Solo',
        avatar:
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content: (
          <p>
            Alcohol based exposures through inadvertently consuming hand
            sanitizer, have been observed to produce more negative side effects
            for children than non-alcohol based.
          </p>
        ),
      },
    ]
  : [];

const UserEnrollModal = () => {
  const location = useLocation();
  const query = useMemo(() => location.search, [location]);
  const history = useHistory();
  const { t } = useTranslation();
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
    getEnrolledLesson,
    { keepPreviousData: true },
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

  const onClickStartEnroll = async () => {
    await postEnroll(id);
    historyPushBack();
  };

  return (
    <S.Main size="large" wrap={false}>
      <S.ImageBlock>
        <S.Image src={lessonImage} alt="Lesson" />
        <S.AuthorContainer>
          <S.AuthorAvatar>{author?.[0]}</S.AuthorAvatar>
          <S.AuthorName>{author}</S.AuthorName>
        </S.AuthorContainer>
      </S.ImageBlock>
      <Row>
        <S.Title level={3}>{name}</S.Title>
      </Row>
      <Row>
        <S.Description>{description}</S.Description>
      </Row>
      <S.ReviewHeader>
        <Title level={5}>{t('enroll_modal.review.header')}</Title>
        <Rate value={0} />
        <DescriptionText>(0)</DescriptionText>
      </S.ReviewHeader>
      {dataReview?.length > 0 ? (
        <List
          className="comment-list"
          itemLayout="horizontal"
          dataSource={dataReview}
          renderItem={(item) => (
            <li>
              <Comment
                actions={item.actions}
                author={item.author}
                avatar={item.avatar}
                content={item.content}
                datetime={item.datetime}
              />
            </li>
          )}
        />
      ) : (
        <S.ReviewBodyText>
          <div>
            <DescriptionText>{t('enroll_modal.review.empty')}</DescriptionText>
          </div>
          <div>
            <Typography.Link>
              {t('enroll_modal.review.be_first')}
            </Typography.Link>
          </div>
        </S.ReviewBodyText>
      )}

      <S.EnrollRow>
        <S.StartButton onClick={onClickStartEnroll} size="large" type="primary">
          {t('user_home.open_lessons.start_button')}
        </S.StartButton>
      </S.EnrollRow>
    </S.Main>
  );
};

export default UserEnrollModal;