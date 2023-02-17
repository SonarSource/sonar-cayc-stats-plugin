/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import styled from '@emotion/styled';
import { t as translate } from 'i18n';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function CaycPresentation() {
  return (
    <Grid>
      <CenteredItem>
        <Illustration aria-hidden={true} src="/images/source-code.svg" />
      </CenteredItem>
      <div>
        <Title>
          <FormattedMessage
            id="cayc.title"
            defaultMessage={translate('cayc.title')}
            values={{
              cayc: <strong>{translate('cayc')}</strong>,
            }}
          />
        </Title>
        <Paragraph>{translate('cayc.description.intro')}</Paragraph>
        <Paragraph>{translate('cayc.description.history')}</Paragraph>
        <Paragraph>{translate('cayc.description.principles.intro')}</Paragraph>
        <List>
          <li>{translate('cayc.description.principles.cost')}</li>
          <li>{translate('cayc.description.principles.optimization')}</li>
          <li>{translate('cayc.description.principles.leak')}</li>
          <li>{translate('cayc.description.principles.impact')}</li>
        </List>
        <Paragraph>{translate('cayc.description.demo_intro')}</Paragraph>
      </div>
    </Grid>
  );
}

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
});

const CenteredItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Illustration = styled.img({
  width: '100px',
  marginRight: '32px',
});

const Title = styled.h1({
  fontSize: '1.5rem',
  marginTop: '1.5rem',
  marginBottom: '2.5rem',
});

const Paragraph = styled.p({
  fontSize: '1rem',
  marginTop: '1.5rem',
  marginBottom: '1.5rem',
});

const List = styled.ul({
  fontSize: '1rem',
  marginTop: '1.5rem',
  marginBottom: '1.5rem',
  listStyleType: '"-\\00A0"', // Non Breakable Space character
  listStylePosition: 'inside',
});
