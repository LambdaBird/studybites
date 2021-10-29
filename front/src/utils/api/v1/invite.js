import lessonImage from '@sb-ui/resources/img/lesson.svg';
// TODO: remove eslint-disables when it will be used after connecting with API
// eslint-disable-next-line no-unused-vars
import api from '@sb-ui/utils/api';

// eslint-disable-next-line no-unused-vars
const PATH = '/api/v1/invite';

export const getInvite = async ({ id }) => {
  // TODO: use this instead of mocked data
  // const { data } = await api.get(`${PATH}/${id}`);

  // Mocked data
  const data = {
    invite: id,
    lesson: {
      name: 'How to use Studybites',
      description:
        'Open repair of infrarenal aortic aneurysm or dissection, plus repair of associated arterial trauma, following unsuccessful endovascular repair; tube prosthesis  ',
      author: {
        firstName: 'John',
        lastName: 'Galt',
      },
      image: lessonImage,
    },
    inviteUser: 'George Bakman',
    keywords: [
      {
        id: 1,
        name: 'Tutorial',
      },
      {
        id: 2,
        name: 'English',
      },
    ],
    email: 'my@mail.com',
    isRegistered: false,
  };

  return data;
};
