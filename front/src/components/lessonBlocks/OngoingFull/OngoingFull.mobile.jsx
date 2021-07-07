import PropTypes from 'prop-types';
import { Row } from 'antd';
import { useTranslation } from 'react-i18next';
import lessonImage from '@sb-ui/resources/img/lesson.svg';
import { useLesson } from './useLesson';
import * as S from './OngoingFull.mobile.styled';

const OngoingFullMobile = ({ lesson }) => {
  const { t } = useTranslation('user');
  const { name, description, percentage } = lesson;

  const { fullName, firstNameLetter, handleContinueLesson } = useLesson(lesson);

  return (
    <S.Main size="large" wrap={false}>
      <div>
        <S.Image src={lessonImage} alt="Lesson" />
        <S.ProgressBar percent={Math.round(percentage)} />
      </div>
      <Row>
        <S.Title
          level={3}
          ellipsis={{
            tooltip: true,
          }}
        >
          {name}
        </S.Title>
      </Row>
      <Row>
        <S.Description
          ellipsis={{
            tooltip: true,
            rows: 2,
          }}
        >
          {description}
        </S.Description>
      </Row>
      <S.EnrollRow>
        <S.Enroll type="primary" onClick={handleContinueLesson}>
          {t('home.ongoing_lessons.continue_button')}
        </S.Enroll>
      </S.EnrollRow>
      <S.AuthorContainer>
        <S.AuthorAvatar>{firstNameLetter}</S.AuthorAvatar>
        <S.AuthorName>{fullName}</S.AuthorName>
      </S.AuthorContainer>
    </S.Main>
  );
};

OngoingFullMobile.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired,
    maintainer: PropTypes.shape({
      userInfo: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};

export default OngoingFullMobile;
