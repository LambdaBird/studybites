const errorResponse = {
  '4xx': {
    type: 'object',
    properties: {
      fallback: { type: 'string' },
      errors: { type: 'array' },
    },
  },
  '5xx': {
    type: 'object',
    properties: {
      fallback: { type: 'string' },
      errors: { type: 'array' },
    },
  },
};

export default errorResponse;
