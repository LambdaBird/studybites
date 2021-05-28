// import axios from 'axios';

// const PATH = '/api/v1/lesson';

const FakeDataNumber = 6;
const statusSuccess = 200;

export const getStudents = async () => {
  try {
    // const { status, data } = await axios.post(`${PATH}/maintain`, {
    // });
    // return { status, data };
    const fakeData = [...new Array(FakeDataNumber)].map((el, index) => ({
      id: index,
      name: `Student ${index}`,
      cover: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
    }));

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    await sleep(1000);

    return { status: statusSuccess, data: fakeData };
  } catch (e) {
    const { status, data } = e.response;
    return {
      status,
      data,
    };
  }
};
