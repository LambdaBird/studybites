module.exports = (err, repl) => {
  switch (err.name) {
    case 'SyntaxError':
      return repl.status(400).send({
        fallback: 'errors.syntax_error',
        errors: Array.isArray(err.message) ? err.message : [err.message],
      });
    case 'ValidationError':
      return repl.status(400).send({
        fallback: 'errors.validation_error',
        errors: Array.isArray(err.message) ? err.message : [err.message],
      });
    default:
      return repl.status(500).send({
        fallback: 'errors.internal_error',
        errors: Array.isArray(err.message) ? err.message : [err.message],
      });
  }
};
