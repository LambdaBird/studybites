import T from 'prop-types';
import { useTranslation } from 'react-i18next';

import { camelToSnakeCase } from '@sb-ui/utils/editorjs/utils';

import * as S from './BaseHeader.styled';

const BaseHeader = ({ toolName }) => {
  const { t } = useTranslation('editorjs');
  const snakeCasedToolName = camelToSnakeCase(toolName);
  const title = t(`tools.${snakeCasedToolName}.title`);
  const hint = t(`tools.${snakeCasedToolName}.hint`);
  return (
    <S.TitleWrapper>
      <S.BaseText>{title}</S.BaseText>
      <S.BaseText>{hint}</S.BaseText>
    </S.TitleWrapper>
  );
};

BaseHeader.propTypes = {
  toolName: T.string,
};

export default BaseHeader;
