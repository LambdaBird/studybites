import { Comment, List, Rate, Row, Typography } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';

import { DescriptionText } from '@sb-ui/components/lessonBlocks/Public/Public.desktop.styled';
import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';
import { getEnrolledLesson, postEnroll } from '@sb-ui/utils/api/v1/student';
import { LEARN_PAGE, USER_HOME } from '@sb-ui/utils/paths';
import { USER_LESSON_MODAL_BASE_KEY } from '@sb-ui/utils/queries';

import * as S from './EnrollModal.mobile.styled';

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

const EnrollModalMobile = () => {
  const history = useHistory();
  const { t } = useTranslation('user');
  const { id } = useParams();

  const historyPushLesson = useCallback(() => {
    history.push(LEARN_PAGE.replace(':id', id));
  }, [history, id]);

  const { data: responseData } = useQuery(
    [USER_LESSON_MODAL_BASE_KEY, { id }],
    getEnrolledLesson,
    { keepPreviousData: true },
  );

  const { mutate: mutatePostEnroll } = useMutation(postEnroll);

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
    () => author.firstName[0] || author.lastName[0],
    [author],
  );

  const historyReplaceBack = useCallback(() => {
    history.replace({
      pathname: USER_HOME,
    });
  }, [history]);

  useEffect(() => {
    if (responseData !== undefined && !responseData?.lesson) {
      historyReplaceBack();
    }
  }, [historyReplaceBack, responseData]);

  const onClickStartEnroll = useCallback(async () => {
    mutatePostEnroll(id, {
      onSuccess: historyPushLesson,
    });
  }, [historyPushLesson, id, mutatePostEnroll]);

  return (
    <S.Main>
      <S.ImageBlock>
        <S.Image
          fallback={DefaultLessonImage}
          src={image || DefaultLessonImage}
          alt="Lesson"
        />
        <S.AuthorContainer>
          <S.AuthorAvatar>{firstNameLetter}</S.AuthorAvatar>
          <S.AuthorName>{fullName}</S.AuthorName>
        </S.AuthorContainer>
      </S.ImageBlock>
      <Row>
        <S.Title>{name}</S.Title>
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
        <S.StartButton onClick={onClickStartEnroll}>
          {t('home.open_lessons.start_button')}
        </S.StartButton>
      </S.EnrollRow>
    </S.Main>
  );
};

export default EnrollModalMobile;
