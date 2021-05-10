import React from 'react';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="App">
      <h1>{t('Hello world')}</h1>
    </div>
  );
};

export default Home;
