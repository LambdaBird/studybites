import config from '../../config';

export const users = [
  {
    id: 100,
    email: 'admin@test.io',
    first_name: 'Super',
    last_name: 'Admin',
    is_super_admin: true,
    is_confirmed: true,
  },
  {
    id: 101,
    email: 'mike@test.io',
    first_name: 'Mike',
    last_name: 'Teacher',
    is_confirmed: true,
  },
  {
    id: 102,
    email: 'john@test.io',
    first_name: 'John',
    last_name: 'Student',
    is_confirmed: true,
  },
  {
    id: 103,
    email: 'jane@test.io',
    first_name: 'Jane',
    last_name: 'Student',
    is_confirmed: true,
  },
  {
    id: 104,
    email: 'bob@test.io',
    first_name: 'Bob',
    last_name: 'Deletable',
    is_confirmed: true,
  },
];

export const usersRoles = [
  {
    user_id: 101,
    role_id: config.roles.TEACHER.id,
  },
  {
    user_id: 101,
    role_id: config.roles.MAINTAINER.id,
    resource_type: config.resources.LESSON,
    resource_id: 100,
  },
  {
    user_id: 101,
    role_id: config.roles.MAINTAINER.id,
    resource_type: config.resources.LESSON,
    resource_id: 101,
  },
  {
    user_id: 101,
    role_id: config.roles.MAINTAINER.id,
    resource_type: config.resources.LESSON,
    resource_id: 102,
  },
  {
    user_id: 101,
    role_id: config.roles.MAINTAINER.id,
    resource_type: config.resources.LESSON,
    resource_id: 103,
  },
  {
    user_id: 101,
    role_id: config.roles.MAINTAINER.id,
    resource_type: config.resources.LESSON,
    resource_id: 200,
  },
  {
    user_id: 102,
    role_id: config.roles.STUDENT.id,
    resource_type: config.resources.LESSON,
    resource_id: 100,
  },
  {
    user_id: 102,
    role_id: config.roles.STUDENT.id,
    resource_type: config.resources.LESSON,
    resource_id: 101,
  },
  {
    user_id: 102,
    role_id: config.roles.STUDENT.id,
    resource_type: config.resources.LESSON,
    resource_id: 102,
  },
  {
    user_id: 102,
    role_id: config.roles.STUDENT.id,
    resource_type: config.resources.LESSON,
    resource_id: 200,
  },
  {
    user_id: 103,
    role_id: config.roles.STUDENT.id,
    resource_type: config.resources.LESSON,
    resource_id: 100,
  },
];
