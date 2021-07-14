import { Result } from 'antd';
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

  render() {
    const { hasError } = this.state;
    const { t, children } = this.props;
    if (hasError) {
      return (
        <S.ErrorWrapper>
          <Result
            status="500"
            title={t('errors.boundary_title')}
            subTitle={t('errors.boundary_subtitle')}
          />
        </S.ErrorWrapper>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = ErrorBoundaryPropTypes;

export default withTranslation()(ErrorBoundary);
