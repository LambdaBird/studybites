import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="App">
      <Button type="primary">Test ANTD</Button>
      <h1>{t('general.hw')}</h1>
    </div>
  );
};

export default Home;
