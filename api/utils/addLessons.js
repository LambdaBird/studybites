import config from '../config.json';
import build from '../src/app';

const addLessons = async ({ name, description, status, userId }) => {
  const app = await build();

  const data = await app.objection.models.lesson.transaction(async (trx) => {
    const lesson = await app.objection.models.lesson
      .query(trx)
      .insert({
        name,
        description,
        status,
      })
      .returning('*');

    await app.objection.models.userRole
      .query(trx)
      .insert({
        userID: userId,
        roleID: config.roles.MAINTAINER_ROLE,
        resourceType: 'lesson',
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
