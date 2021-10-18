const valueTransformation = (value) =>
  value
    ?.trim?.()
    ?.replace(/([.,/#!$%^&*;:{}=\-_`~()\][])+$/g, '')
    ?.toLowerCase?.();

export const verifyAnswers = (results, userValue) =>
  results?.some(
    (result) => valueTransformation(result) === valueTransformation(userValue),
  );
