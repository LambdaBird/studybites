import { Button } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import * as S from './ErrorPage.styled';

const NOT_FOUND_STATUS = '404';

const ErrorPage = ({ status }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleHomeClick = () => {
    history.push('/');
  };

  if (status === NOT_FOUND_STATUS) {
    return (
      <S.Result
        status={NOT_FOUND_STATUS}
        title={NOT_FOUND_STATUS}
        subTitle={t('errors_page.not_exist')}
        extra={
          <Button type="primary" onClick={handleHomeClick}>
            {t('errors_page.back_home_button')}
          </Button>
        }
      />
    );
  }

  return null;
};

ErrorPage.propTypes = {
  status: PropTypes.string,
};

export default ErrorPage;
