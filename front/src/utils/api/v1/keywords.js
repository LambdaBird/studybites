import { PAGE_SIZE } from '@sb-ui/pages/User/Lessons/LessonsList/constants';
import api from '@sb-ui/utils/api';

const PATH = '/api/v1/keywords';

export const fetchKeywords = async ({ search = '' } = {}) => {
  const {
    data: { keywords },
  } = await api.get(`${PATH}`, {
    params: {
      offset: 0,
      limit: PAGE_SIZE,
      search,
    },
  });

  return keywords.map((keyword) => ({
    value: keyword.id,
    label: keyword.name,
  }));
};
