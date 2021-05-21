const UNAUTHORIZED = {
  fallback: 'errors.unauthorized',
  errors: [
    {
      message: 'Unauthorized',
    },
  ],
};

const auth = async (instance, next, req, repl, admin = false) => {
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

    if (admin) {
      if (!userData.isSuperAdmin) {
        return repl.status(401).send(UNAUTHORIZED);
      }

      return next();
    }

    return next();
  } catch (err) {
    return repl.status(401).send(UNAUTHORIZED);
  }
};

export default auth;
