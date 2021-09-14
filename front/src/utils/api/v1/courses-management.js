import api from '@sb-ui/utils/api';

const PATH = '/api/v1/courses-management';

export const getTeacherCourses = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}/courses`, {
    params: paramsData,
  });

  return data;
};

export const createCourse = async (values) => {
  const { data } = await api.post(`${PATH}/courses`, values);
  return data;
};

export const putCourse = async (params) => {
  const { data } = await api.put(`${PATH}/courses/${params.course.id}`, params);
  return data;
};

export const getCourse = async ({ queryKey }) => {
  const [, { id }] = queryKey;

  const { data } = await api.get(`${PATH}/courses/${id}`);
  return data;
};

export const patchCourseStatus = async (params) => {
  const { data } = await api.patch(
    `${PATH}/courses/${params.id}/update-status`,
    params,
  );
  return data;
};

export const patchCoursesStatus = async (params) => {
  const { data } = await api.patch(`${PATH}/courses/update-status`, params);
  return data;
};
