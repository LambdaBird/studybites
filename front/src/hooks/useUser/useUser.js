import { useEffect, useState } from 'react';
import { getUser } from '@sb-ui/utils/api/v1/user';

const useUser = () => {
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: response } = await getUser();
      setUser(response.data);
      setLoading(false);
    })();
  }, []);

  return { user, isUserLoading: isLoading };
};
export default useUser;
