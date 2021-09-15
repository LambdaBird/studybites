export const verifyAnswers = (answers, results) => {
  if (answers?.length !== results?.length) {
    return false;
  }
  return results
    ?.map((result, index) => result === answers[index])
    ?.every((result) => result);
};
