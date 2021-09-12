import { Result } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';

import Header from '@sb-ui/components/molecules/Header';
import LearnPage from '@sb-ui/pages/User/LearnPage';
import { enrollDemoLesson } from '@sb-ui/utils/api/v1/user';
import { getJWTAccessToken, setJWT } from '@sb-ui/utils/jwt';

const Demo = () => {
  const { id: lessonId } = useParams();
  const [error, setError] = useState(null);
  const { t } = useTranslation('common');
  const isLoggedIn = getJWTAccessToken();
  const [isEnrolled, setEnrolled] = useState(false);

  const { mutate: enrollToLesson } = useMutation(enrollDemoLesson, {
    onSuccess: ({ accessToken, refreshToken }) => {
      if (!isLoggedIn) {
        setJWT({ accessToken, refreshToken });
      }
      setEnrolled(true);
    },
    onError: (err) => {
      const { key, message } = err.response.data?.errors?.[0] || {};

      setError({ message: t(key) || message, status: err.response.status });
    },
  });

  useEffect(() => {
    enrollToLesson(lessonId);
  }, [enrollToLesson, lessonId]);

  return (
    <>
      <Header />
      {error ? (
        <Result
          status={error.status}
          title={error.status}
          subTitle={error.message}
        />
      ) : (
        isEnrolled && <LearnPage />
      )}
    </>
  );
};

export default Demo;
