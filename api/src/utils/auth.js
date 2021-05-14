const authUser = async (instance, next, req, repl) => {
  const decoded = await req.jwtVerify();
  req.userId = decoded.id;

  if (!decoded.access) {
    return repl.status(401).send({
      fallback: 'errors.unauthorized',
      errors: [
        {
          message: 'Unauthorized',
        },
      ],
    });
  }

  const userData = await instance.objection.models.user.query().findOne({
    id: decoded.id,
  });

  if (!userData) {
    return repl.status(401).send({
      fallback: 'errors.unauthorized',
      errors: [
        {
          message: 'Unauthorized',
        },
      ],
    });
  }

  return next();
};

export default authUser;
