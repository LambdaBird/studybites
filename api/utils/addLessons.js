import { roles, resources } from '../src/config';
import build from '../src/app';

const addLessons = async ({ name, description, status, userId }) => {
  const app = await build();
  const { Lesson, UserRole } = app.models;
  const data = await Lesson.transaction(async (trx) => {
    const lesson = await Lesson.query(trx)
      .insert({
        name,
        description,
        status,
      })
      .returning('*');
    await UserRole.query(trx)
      .insert({
        userId,
        roleId: roles.MAINTAINER.id,
        resourceType: resources.LESSON.name,
        resourceId: lesson.id,
      })
      .returning('*');

    return lesson;
  });
  return data;
};

addLessons({
  name: 'One more lesson',
  description: 'Hello 444',
  status: 'Public',
  userId: 2,
});
