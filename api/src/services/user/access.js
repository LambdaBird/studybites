import config from '../../../config.json';

import { UNAUTHORIZED } from './constants';

const access =
  ({
    instance,
    type = config.resources.LESSON,
    role = config.roles.TEACHER_ROLE,
  }) =>
  // eslint-disable-next-line consistent-return
  async (req, repl) => {
    try {
      const data = await instance.objection.models.userRole
        .query()
        .select()
        .skipUndefined()
        .where({
          userID: req.user.id,
          roleID: role,
          resourceId: req.params.id || undefined,
          resourceType: type,
        })
        .debug();

      if (!data.length) {
        return repl.status(401).send(UNAUTHORIZED);
      }
    } catch (err) {
      return repl.status(401).send(UNAUTHORIZED);
    }
  };

export default access;
