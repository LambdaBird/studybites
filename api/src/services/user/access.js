import { UNAUTHORIZED } from './constants';

export const MISSING_ROLE = {
  fallback: 'errors.bad_request',
  errors: [
    {
      key: 'access.missing_role',
      message: 'Role is required',
    },
  ],
};

const access =
  ({ instance, type, role, getId = () => undefined }) =>
  // eslint-disable-next-line consistent-return
  async (req, repl) => {
    try {
      if (!role) {
        return repl.status(400).send(MISSING_ROLE);
      }

      const id = getId(req);

      const data = await instance.objection.models.userRole
        .query()
        .select()
        .skipUndefined()
        .where({
          userID: req.user.id,
          roleID: role,
          resourceType: type,
          resourceId: id,
        });

      if (!data.length) {
        return repl.status(401).send(UNAUTHORIZED);
      }
    } catch (err) {
      return repl.status(401).send(UNAUTHORIZED);
    }
  };

export default access;
