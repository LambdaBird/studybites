import bcrypt from 'bcrypt';
import config from '../config.json';
import build from '../src/app.js';

const app = await build();

const addUser = async ({ id, email, password, firstName, secondName }) => {
  const data = await app.objection.models.user.transaction(async (trx) => {
    const passwd = await bcrypt.hash(password, 12);
    const user = await app.objection.models.user
    .query(trx)
    .insert({
      id,
      email,
      password: passwd,
      firstName,
      secondName,
    })
    .returning('*');
    await app.objection.models.userRole
      .query(trx)
      .insert({
        userID: user.id,
        roleID: config.roles.MAINTAINER_ROLE,
        resourceType: config.resources.LESSON,
      })
      .returning('*');
    return user;
  });
  return data;
}; 

const addLessons = async ({ name, description, status, userId }) => {
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

await addUser({
  id: 6,
  email: 'test1@gmail.com',
  password: 'test1',
  firstName: 'Test',
  secondName: 'Teacher',
});

await addLessons({
  id: 21,
  name: 'How to use Studybites',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci dignissimos eaque, hic magnam nemo officiis porro quidem recusandae repellat repellendus.',
  status: 'Public',
  userId: 6,
});

await addLessons({
  id: 22,
  name: 'Test lesson',
  description:
    'Adipisci dignissimos eaque, hic magnam nemo officiis porro quidem recusandae repellat repellendus.',
  status: 'Draft',
  userId: 6,
});

await addLessons({
  id: 23,
  name: 'New test',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
  status: 'Archived',
  userId: 6,
});