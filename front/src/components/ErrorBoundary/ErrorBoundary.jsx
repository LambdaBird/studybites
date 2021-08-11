import { Button, Result } from 'antd';
import React from 'react';
import { withTranslation } from 'react-i18next';

import { ErrorBoundaryPropTypes } from '@sb-ui/components/ErrorBoundary/types';

import * as S from './ErrorBoundary.styled';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  static handleRefreshClick() {
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }

  render() {
    const { hasError } = this.state;
    const { t, children } = this.props;
    if (hasError) {
      return (
        <S.ErrorWrapper>
          <Result
            status="500"
            title={t('errors_page.boundary_title')}
            subTitle={t('errors_page.boundary_subtitle')}
            extra={
              <Button type="primary" onClick={this.handleRefreshClick}>
                {t('errors_page.refresh_page_button')}
              </Button>
            }
          />
        </S.ErrorWrapper>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = ErrorBoundaryPropTypes;

export default withTranslation()(ErrorBoundary);
