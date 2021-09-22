const convertToolNameToTranslateKey = (name) => {
  switch (name) {
    case 'fillTheGap':
      return 'fill_the_gap';
    case 'closedQuestion':
      return 'closed_question';
    default:
      return name;
  }
};

export default convertToolNameToTranslateKey;
