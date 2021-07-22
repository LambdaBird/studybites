import { BadRequestError } from '../../../../validation/errors';

import { ENROLL_SUCCESS, INVALID_ENROLL } from '../../constants';

export async function enrollToLessonHandler({
  user: { id: userId },
  params: { lessonId },
}) {
  const {
    config,
    models: { Lesson, UserRole },
  } = this;

  const lesson = await Lesson.query()
    .findById(lessonId)
    .where({ status: 'Public' })
    .whereNotExists(
      UserRole.query().select().where({
        userId,
        roleId: config.roles.STUDENT.id,
        resourceType: config.resources.LESSON,
        resourceId: lessonId,
      }),
    );

  if (!lesson) {
    throw new BadRequestError(INVALID_ENROLL);
  }

  await UserRole.query()
    .insert({
      userId,
      roleId: config.roles.STUDENT.id,
      resourceType: config.resources.LESSON,
      resourceId: lesson.id,
    })
    .returning('*');

  return ENROLL_SUCCESS;
}
