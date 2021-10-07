import signUp from './controllers/signUp';
import signIn from './controllers/signIn';
import refreshToken from './controllers/refreshToken';
import getSelf from './controllers/getSelf';
import updateSelf from './controllers/updateSelf';
import getAllAuthors from './controllers/getAllAuthors';
import getAllUsers from './controllers/getAllUsers';
import getUser from './controllers/getUser';
import updateUser from './controllers/updateUser';
import deleteUser from './controllers/deleteUser';
import addTeacherRole from './controllers/addTeacherRole';
import removeTeacherRole from './controllers/removeTeacherRole';
import updateUserLanguage from './controllers/updateUserLanguage';

export default async function router(instance) {
  instance.post('/signup', signUp.options, signUp.handler);

  instance.post('/signin', signIn.options, signIn.handler);

  instance.post('/refresh_token', refreshToken.options, refreshToken.handler);

  instance.get('/self', getSelf.options, getSelf.handler);

  instance.patch('/self', updateSelf.options, updateSelf.handler);

  instance.get('/authors', getAllAuthors.options, getAllAuthors.handler);

  instance.get('/', getAllUsers.options, getAllUsers.handler);

  instance.get('/:userId', getUser.options, getUser.handler);

  instance.patch('/:userId', updateUser.options, updateUser.handler);

  instance.delete('/:userId', deleteUser.options, deleteUser.handler);

  instance.post(
    '/appoint_teacher',
    addTeacherRole.options,
    addTeacherRole.handler,
  );

  instance.post(
    '/remove_teacher',
    removeTeacherRole.options,
    removeTeacherRole.handler,
  );

  instance.patch(
    '/language',
    updateUserLanguage.options,
    updateUserLanguage.handler,
  );
}
