import { message } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

import { useCoursePublish } from '@sb-ui/hooks/useCoursePublish';
import { Statuses } from '@sb-ui/pages/Teacher/Home/Dashboard/constants';
import { queryClient } from '@sb-ui/query';
import {
  createCourse,
  getCourse,
  putCourse,
} from '@sb-ui/utils/api/v1/courses-management';
import { getTeacherLessons } from '@sb-ui/utils/api/v1/teacher';
import { COURSES_EDIT } from '@sb-ui/utils/paths';
import {
  TEACHER_COURSE_BASE_KEY,
  TEACHER_LESSONS_BASE_KEY,
} from '@sb-ui/utils/queries';

export const useCourse = ({ isEditCourse, courseId, search }) => {
  const { t } = useTranslation('teacher');
  const history = useHistory();

  const { data: teacherLessonsData } = useQuery(
    [
      TEACHER_LESSONS_BASE_KEY,
      {
        search,
      },
    ],
    getTeacherLessons,
    {
      keepPreviousData: true,
      onError: () => {
        message.error({
          content: t('lesson_dashboard.error'),
          duration: 2,
        });
      },
    },
  );

  const teacherLessons = useMemo(
    () => teacherLessonsData?.lessons,
    [teacherLessonsData?.lessons],
  );

  const { data: courseData, isLoading } = useQuery(
    [TEACHER_COURSE_BASE_KEY, { id: courseId }],
    getCourse,
    {
      enabled: isEditCourse,
    },
  );

  const createCourseMutation = useMutation(createCourse, {
    onSuccess: (data) => {
      const { id } = data?.course;
      history.replace(COURSES_EDIT.replace(':id', id));
      message.success({
        content: t('course_edit.message.success_created'),
        duration: 2,
      });
    },
    onError: () => {
      message.error({
        content: t('course_edit.message.error_created'),
        duration: 2,
      });
    },
  });

  const updateCourseMutation = useMutation(putCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries([
        TEACHER_COURSE_BASE_KEY,
        { id: courseId },
      ]);
      message.success({
        content: t('course_edit.message.success_updated'),
        duration: 2,
      });
    },
    onError: () => {
      message.error({
        content: t('course_edit.message.error_updated'),
        duration: 2,
      });
    },
  });

  const { handlePublish, handleDraft, isUpdateInProgress } = useCoursePublish({
    lessons: courseData?.course?.lessons,
    courseId,
  });

  const isSaveButtonDisabled = useMemo(
    () =>
      !(
        courseData?.course?.status === Statuses.DRAFT ||
        !courseData?.course?.status
      ),
    [courseData?.course?.status],
  );

  return {
    courseData,
    createCourseMutation,
    updateCourseMutation,
    teacherLessons,
    handlePublish,
    handleDraft,
    isLoading,
    isUpdateInProgress,
    isSaveButtonDisabled,
  };
};
