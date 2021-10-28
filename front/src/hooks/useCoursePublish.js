import { Modal } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import { Statuses } from '@sb-ui/pages/Teacher/Home/Dashboard/constants';
import { queryClient } from '@sb-ui/query';
import { patchCourseStatus } from '@sb-ui/utils/api/v1/courses-management';
import {
  TEACHER_COURSE_BASE_KEY,
  TEACHER_COURSES_BASE_KEY,
  TEACHER_LESSONS_BASE_KEY,
} from '@sb-ui/utils/queries';

export const useCoursePublish = ({ courseId }) => {
  const { t } = useTranslation('teacher');

  const { mutateAsync: updateCourseStatus, isLoading: isUpdateInProgress } =
    useMutation(patchCourseStatus, {
      onSuccess: () => {
        queryClient.invalidateQueries(TEACHER_LESSONS_BASE_KEY);
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
    try {
      await updateCourseStatus({
        id: +courseId,
        status: Statuses.PUBLIC,
      });
      Modal.success({
        width: 480,
        title: t('course_edit.publish_modal_success.title'),
        okText: t('course_edit.publish_modal_success.ok'),
      });
    } catch (e) {
      if (e.response.data.message === 'errors.publish_restricted') {
        Modal.error({
          width: 480,
          title: t('course_edit.publish_modal_fail.title'),
          content: t('course_edit.publish_modal_fail.content'),
          okText: t('course_edit.publish_modal_fail.ok'),
        });
        return;
      }

      throw new Error(e);
    }
  }, [courseId, t, updateCourseStatus]);

  const handleDraft = async () => {
    await updateCourseStatus({
      id: +courseId,
      status: Statuses.DRAFT,
    });
  };

  return { handlePublish, handleDraft, isUpdateInProgress, updateCourseStatus };
};
