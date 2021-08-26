import api from '@sb-ui/utils/api';

const PATH = '/api/v1/keywords';

export const getKeywords = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const {
    data: { keywords },
  } = await api.get(`${PATH}`, {
    params: paramsData,
  });

  return keywords.map((keyword) => ({
    value: keyword.name,
    label: keyword.name,
  }));
};
