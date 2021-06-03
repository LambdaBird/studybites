import { UNAUTHORIZED } from './constants';

const auth =
  ({ instance, isAdminOnly = false }) =>
  // eslint-disable-next-line consistent-return
  async (req, repl) => {
    try {
      const decoded = await req.jwtVerify();
      req.userId = decoded.id;

      if (!decoded.access) {
        return repl.status(401).send(UNAUTHORIZED);
      }

      const userData = await instance.objection.models.user.query().findOne({
        id: decoded.id,
      });

      if (!userData) {
        return repl.status(401).send(UNAUTHORIZED);
      }

      if (isAdminOnly) {
        if (!userData.isSuperAdmin) {
          return repl.status(401).send(UNAUTHORIZED);
        }
      }
    } catch (err) {
      return repl.status(401).send(UNAUTHORIZED);
    }
  };

export default auth;
