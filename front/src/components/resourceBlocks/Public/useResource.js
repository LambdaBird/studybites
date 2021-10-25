import { useCallback, useMemo } from 'react';
import { useMutation } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom';

import { enrollLesson } from '@sb-ui/utils/api/v1/lessons';
import {
  LEARN_COURSE_PAGE,
  LEARN_PAGE,
  USER_ENROLL_COURSE,
  USER_ENROLL_LESSON,
} from '@sb-ui/utils/paths';

export const useResource = ({
  resource: { id, author, isEnrolled, isFinished },
  isCourse = false,
  isCourseLesson,
}) => {
  const location = useLocation();
  const query = useMemo(() => location.search, [location]);
  const history = useHistory();
  const { mutate: mutatePostEnroll } = useMutation(enrollLesson);

  const fullName = useMemo(
    () => `${author?.firstName} ${author?.lastName}`.trim(),
    [author],
  );

  const firstNameLetter = useMemo(
    () => author?.firstName?.[0] || author?.lastName?.[0],
    [author],
  );
  const handleEnroll = useCallback(() => {
    history.push({
      search: query,
      pathname: isCourse
        ? USER_ENROLL_COURSE.replace(':id', id)
        : USER_ENROLL_LESSON.replace(':id', id),
    });
  }, [history, id, isCourse, query]);

  const handleContinueLesson = useCallback(
    () =>
      isCourse
        ? history.push(LEARN_COURSE_PAGE.replace(':id', id))
        : history.push(LEARN_PAGE.replace(':id', id)),
    [history, id, isCourse],
  );

  const handleEnrollAndContinueLesson = useCallback(() => {
    mutatePostEnroll(id, {
      onSettled: () => {
        handleContinueLesson();
      },
    });
  }, [handleContinueLesson, id, mutatePostEnroll]);

  const buttonTitleKey = useMemo(() => {
    if (isFinished) {
      return 'home.ongoing_lessons.view_button';
    }
    if (isCourseLesson && !isEnrolled) {
      return 'home.open_lessons.start_button';
    }
    if (isEnrolled || isCourseLesson) {
      return 'home.ongoing_lessons.continue_button';
    }
    return 'home.open_lessons.enroll_button';
  }, [isCourseLesson, isEnrolled, isFinished]);

  const buttonClickHandler = useMemo(() => {
    if (isFinished) {
      return handleContinueLesson;
    }
    if (isCourseLesson) {
      return handleEnrollAndContinueLesson;
    }
    if (isEnrolled) {
      return handleContinueLesson;
    }

    return handleEnroll;
  }, [
    handleContinueLesson,
    handleEnroll,
    handleEnrollAndContinueLesson,
    isCourseLesson,
    isEnrolled,
    isFinished,
  ]);

  const buttonType = useMemo(() => {
    if (isFinished || isEnrolled || isCourseLesson) {
      return 'primary';
    }
    return 'secondary';
  }, [isCourseLesson, isEnrolled, isFinished]);

  return {
    fullName,
    firstNameLetter,
    buttonType,
    buttonTitleKey,
    buttonClickHandler,
  };
};
