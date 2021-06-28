import config from '../../config';

export const users = [
  {
    id: 1,
    email: 'admin@test.io',
    first_name: 'Super',
    last_name: 'Admin',
    is_super_admin: true,
    is_confirmed: true,
  },
  {
    id: 2,
    email: 'teacher@test.io',
    first_name: 'Teacher',
    last_name: 'User',
    is_confirmed: true,
  },
  {
    id: 3,
    email: 'student@test.io',
    first_name: 'Student',
    last_name: 'User',
    is_confirmed: true,
  },
  {
    id: 4,
    email: 'userToBeDeleted@test.io',
    first_name: 'Deleteme',
    last_name: 'User',
    is_confirmed: true,
  },
];

export const usersRoles = [
  {
    user_id: 2,
    role_id: config.roles.TEACHER.id,
  },
  {
    user_id: 2,
    role_id: config.roles.MAINTAINER.id,
    resource_type: config.resources.LESSON,
    resource_id: 1,
  },
  {
    user_id: 2,
    role_id: config.roles.MAINTAINER.id,
    resource_type: config.resources.LESSON,
    resource_id: 2,
  },
  {
    user_id: 2,
    role_id: config.roles.MAINTAINER.id,
    resource_type: config.resources.LESSON,
    resource_id: 3,
  },
  {
    user_id: 2,
    role_id: config.roles.MAINTAINER.id,
    resource_type: config.resources.LESSON,
    resource_id: 4,
  },
  {
    user_id: 2,
    role_id: config.roles.MAINTAINER.id,
    resource_type: config.resources.LESSON,
    resource_id: 5,
  },
  {
    user_id: 3,
    role_id: config.roles.STUDENT.id,
    resource_type: config.resources.LESSON,
    resource_id: 1,
  },
  {
    user_id: 3,
    role_id: config.roles.STUDENT.id,
    resource_type: config.resources.LESSON,
    resource_id: 5,
  },
];
