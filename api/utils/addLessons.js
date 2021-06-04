import config from '../config';
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
        userID: userId,
        roleID: config.roles.MAINTAINER.id,
        resourceType: config.resources.LESSON,
        resourceId: lesson.id,
      })
      .returning('*');

    return lesson;
  });
  return data;
};

addLessons({
  name: 'How to use Studybites',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci dignissimos eaque, hic magnam nemo officiis porro quidem recusandae repellat repellendus.',
  status: 'Public',
  userId: 2,
});
