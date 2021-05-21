import React from 'react';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { clearJWT } from '../../utils/jwt';

const Home = () => {
  const history = useHistory();
  return (
    <div className="App">
      <Button
        onClick={() => {
          clearJWT();
          history.push('/');
        }}
      >
        Test clear JWT
      </Button>
    </div>
  );
};

export default Home;
