import { roles, resources } from '../../src/config';

import * as lessons from './lessons';

export const defaultPassword = 'passwd3';

export const superAdmin = {
  id: 100,
  email: 'admin@test.io',
  first_name: 'Super',
  last_name: 'Admin',
  is_super_admin: true,
  is_confirmed: true,
};

export const teacherMike = {
  id: 101,
  email: 'mike@test.io',
  first_name: 'Mike',
  last_name: 'Teacher',
  is_confirmed: true,
};

export const studentJohn = {
  id: 102,
  email: 'john@test.io',
  first_name: 'John',
  last_name: 'Student',
  is_confirmed: true,
};

export const studentJane = {
  id: 103,
  email: 'jane@test.io',
  first_name: 'Jane',
  last_name: 'Student',
  is_confirmed: true,
};

export const userBob = {
  id: 104,
  email: 'bob@test.io',
  first_name: 'Bob',
  last_name: 'Deletable',
  is_confirmed: true,
};

export const teacherNathan = {
  id: 105,
  email: 'nathan@test.io',
  first_name: 'Nathan',
  last_name: 'Teacher',
  is_confirmed: true,
};

export const teacherJack = {
  id: 106,
  email: 'jack@test.io',
  first_name: 'Jack',
  last_name: 'Teacher',
  is_confirmed: true,
};

export const users = [
  superAdmin,
  teacherMike,
  studentJohn,
  studentJane,
  userBob,
  teacherNathan,
  teacherJack,
];

export const usersRoles = [
  {
    user_id: teacherMike.id,
    role_id: roles.TEACHER.id,
  },
  {
    user_id: teacherNathan.id,
    role_id: roles.TEACHER.id,
  },
  {
    user_id: teacherJack.id,
    role_id: roles.TEACHER.id,
  },
  {
    user_id: teacherMike.id,
    role_id: roles.MAINTAINER.id,
    resource_type: resources.LESSON.name,
    resource_id: lessons.math.id,
  },
  {
    user_id: teacherMike.id,
    role_id: roles.MAINTAINER.id,
    resource_type: resources.LESSON.name,
    resource_id: lessons.english.id,
  },
  {
    user_id: teacherMike.id,
    role_id: roles.MAINTAINER.id,
    resource_type: resources.LESSON.name,
    resource_id: lessons.biology.id,
  },
  {
    user_id: teacherMike.id,
    role_id: roles.MAINTAINER.id,
    resource_type: resources.LESSON.name,
    resource_id: lessons.literature.id,
  },
  {
    user_id: teacherMike.id,
    role_id: roles.MAINTAINER.id,
    resource_type: resources.LESSON.name,
    resource_id: lessons.french.id,
  },
  {
    user_id: studentJohn.id,
    role_id: roles.STUDENT.id,
    resource_type: resources.LESSON.name,
    resource_id: lessons.math.id,
  },
  {
    user_id: studentJohn.id,
    role_id: roles.STUDENT.id,
    resource_type: resources.LESSON.name,
    resource_id: lessons.english.id,
  },
  {
    user_id: studentJohn.id,
    role_id: roles.STUDENT.id,
    resource_type: resources.LESSON.name,
    resource_id: lessons.biology.id,
  },
  {
    user_id: studentJohn.id,
    role_id: roles.STUDENT.id,
    resource_type: resources.LESSON.name,
    resource_id: lessons.french.id,
  },
  {
    user_id: studentJane.id,
    role_id: roles.STUDENT.id,
    resource_type: resources.LESSON.name,
    resource_id: lessons.math.id,
  },
];
