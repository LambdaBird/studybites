const errorArray = (m) => [].concat(m);

module.exports = (err, repl) => {
  switch (err.name) {
    case 'ValidationError':
      return repl.status(400).send({
        fallback: 'errors.validation_error',
        errors: errorArray(err.message),
      });
    default:
      return repl.status(500).send({
        fallback: 'errors.internal_error',
        errors: errorArray(err.message),
      });
  }
};
