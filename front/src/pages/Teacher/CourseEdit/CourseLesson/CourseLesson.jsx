import { Avatar, Row, Space, Tooltip, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { StyledAvatar } from '@sb-ui/components/molecules/Header/Header.styled';
import { useCourseLesson } from '@sb-ui/pages/Teacher/CourseEdit/CourseLesson/useCourseLesson';
import lesson from '@sb-ui/resources/img/lesson.svg';
import { LESSONS_EDIT } from '@sb-ui/utils/paths';

import * as S from './CourseLesson.styled';

const { Text } = Typography;

const CourseLesson = ({
  id,
  index,
  name,
  description,
  status,
  students: studentsData,
  currentLesson,
  swapLessons,
  removeLessonById,
  moveTop,
  moveBottom,
  onMouseEnter,
}) => {
  const history = useHistory();

  const { handlerId, opacity, ref } = useCourseLesson({
    id,
    index,
    swapLessons,
  });
  const { t } = useTranslation('teacher');

  const students = useMemo(
    () =>
      studentsData?.map(({ id: studentId, firstName = '', lastName = '' }) => ({
        id: studentId,
        name: `${firstName} ${lastName}`,
      })) || [],
    [studentsData],
  );

  const handleEdit = useCallback(() => {
    history.push(LESSONS_EDIT.replace(':id', id));
  }, [history, id]);

  const handleRemoveClick = useCallback(() => {
    removeLessonById(id);
  }, [id, removeLessonById]);

  const handleMoveTop = useCallback(() => {
    moveTop(id);
  }, [id, moveTop]);

  const handleMoveBottom = useCallback(() => {
    moveBottom(id);
  }, [id, moveBottom]);

  return (
    <S.Wrapper
      ref={ref}
      data-handler-id={handlerId}
      opacity={opacity}
      onMouseEnter={onMouseEnter}
    >
      <S.ImageCol span={8}>
        <S.BadgeWrapper>
          <S.CardBadge>
            <S.StatusText>{status}</S.StatusText>
          </S.CardBadge>
        </S.BadgeWrapper>
        <S.CardImage src={lesson} />
      </S.ImageCol>
      <S.CardDescription span={16}>
        <S.CardText>
          <Row>
            <S.TitleEllipsis>{name}</S.TitleEllipsis>
          </Row>
          <Row>{description}</Row>
          <S.CardBottom>
            {!students.length ? (
              <Text type="secondary">
                {t('lesson_dashboard.card.no_students')}
              </Text>
            ) : (
              <Space>
                <Avatar.Group>
                  {students.slice(0, 3).map((el) => (
                    <Tooltip key={el.id} title={el.name} placement="top">
                      {el.avatar ? (
                        <Avatar src={el.avatar} />
                      ) : (
                        <StyledAvatar>{el.name?.[0]}</StyledAvatar>
                      )}
                    </Tooltip>
                  ))}
                </Avatar.Group>
                <Text type="secondary">
                  {students.length} {t('lesson_dashboard.card.students')}
                </Text>
              </Space>
            )}
            <S.CardButton onClick={handleEdit}>
              {t('course_edit.to_lesson_button')}
            </S.CardButton>
          </S.CardBottom>
        </S.CardText>
      </S.CardDescription>
      {id === currentLesson && (
        <S.ArrowWrapper>
          <S.ArrowUp onClick={handleMoveTop} />
          <S.Close onClick={handleRemoveClick} />
          <S.ArrowDown onClick={handleMoveBottom} />
        </S.ArrowWrapper>
      )}
    </S.Wrapper>
  );
};

CourseLesson.propTypes = {
  id: PropTypes.number,
  index: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  status: PropTypes.string,
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  ),
  currentLesson: PropTypes.number,
  moveTop: PropTypes.func,
  removeLessonById: PropTypes.func,
  moveBottom: PropTypes.func,
  onMouseEnter: PropTypes.func,
  swapLessons: PropTypes.func,
};

export default CourseLesson;
