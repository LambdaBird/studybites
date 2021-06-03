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
  ({ instance, type, role }) =>
  // eslint-disable-next-line consistent-return
  async (req, repl) => {
    try {
      if (!role) {
        return repl.status(400).send(MISSING_ROLE);
      }

      const id = parseInt(req.params.id || req.query.id, 10);

      const data = await instance.objection.models.userRole
        .query()
        .select()
        .skipUndefined()
        .where({
          userID: req.user.id,
          roleID: role,
          resourceId: id || undefined,
          resourceType: type,
        });

      if (!data.length) {
        return repl.status(401).send(UNAUTHORIZED);
      }
    } catch (err) {
      return repl.status(401).send(UNAUTHORIZED);
    }
  };

export default access;
