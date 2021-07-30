import { signUpHandler, signUpOptions } from './handlers/signUp';

import { signInHandler, signInOptions } from './handlers/signIn';

import {
  refreshTokenHandler,
  refreshTokenOptions,
} from './handlers/refreshToken';

import { selfHandler, selfOptions } from './handlers/self';

import { getAllUsersHandler, getAllUsersOptions } from './handlers/getAllUsers';

import { getUserHandler, getUserOptions } from './handlers/getUser';

import { updateUserHandler, updateUserOptions } from './handlers/updateUser';

import { deleteUserHandler, deleteUserOptions } from './handlers/deleteUser';

import { addTeacherHandler, addTeacherOptions } from './handlers/addTeacher';

import {
  removeTeacherHandler,
  removeTeacherOptions,
} from './handlers/removeTeacher';

export default async function router(instance) {
  instance.post('/signup', signUpOptions, signUpHandler);

  instance.post('/signin', signInOptions, signInHandler);

  instance.post('/refresh_token', refreshTokenOptions, refreshTokenHandler);

  instance.get('/self', selfOptions, selfHandler);

  instance.get('/', getAllUsersOptions, getAllUsersHandler);

  instance.get('/:userId', getUserOptions, getUserHandler);

  instance.patch('/:userId', updateUserOptions, updateUserHandler);

  instance.delete('/:userId', deleteUserOptions, deleteUserHandler);

  instance.post('/appoint_teacher', addTeacherOptions, addTeacherHandler);

  instance.post('/remove_teacher', removeTeacherOptions, removeTeacherHandler);
}
