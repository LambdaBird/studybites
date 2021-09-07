import { Modal } from 'antd';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import { Statuses } from '@sb-ui/pages/Teacher/Home/Dashboard/constants';
import { queryClient } from '@sb-ui/query';
import { putCourse } from '@sb-ui/utils/api/v1/courses-management';
import {
  TEACHER_COURSE_BASE_KEY,
  TEACHER_COURSES_BASE_KEY,
} from '@sb-ui/utils/queries';

export const useCoursePublish = ({ lessons, courseId }) => {
  const { t } = useTranslation('teacher');
  const isCanPublish = useMemo(
    () =>
      !lessons?.some(
        (lesson) =>
          lesson.status === Statuses.DRAFT ||
          lesson.status === Statuses.ARCHIVED,
      ),
    [lessons],
  );

  const { mutateAsync: updateCourseStatus, isLoading: isUpdateInProgress } =
    useMutation(putCourse, {
      onSuccess: () => {
        queryClient.invalidateQueries(TEACHER_COURSES_BASE_KEY);
        queryClient.invalidateQueries([
          TEACHER_COURSE_BASE_KEY,
          {
            id: courseId,
          },
        ]);
      },
    });

  const handlePublish = useCallback(async () => {
    if (isCanPublish) {
      await updateCourseStatus({
        course: { id: +courseId, status: Statuses.PUBLIC },
      });
      Modal.success({
        width: 480,
        title: t('course_edit.publish_modal_success.title'),
        okText: t('course_edit.publish_modal_success.ok'),
      });
      return;
    }

    Modal.error({
      width: 480,
      title: t('course_edit.publish_modal_fail.title'),
      content: t('course_edit.publish_modal_fail.content'),
      okText: t('course_edit.publish_modal_fail.ok'),
    });
  }, [courseId, isCanPublish, t, updateCourseStatus]);

  const handleDraft = async () => {
    await updateCourseStatus({
      course: { id: +courseId, status: Statuses.DRAFT },
    });
  };

  return { handlePublish, handleDraft, isUpdateInProgress, updateCourseStatus };
};
