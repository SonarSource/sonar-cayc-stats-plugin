/*
 * Clean as You Code Plugin
 * Copyright (C) 2022-2023 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import styled from '@emotion/styled';
import { t as translate } from 'i18n';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { baseUrl } from 'sonar-config';

export default function CaycPresentation() {
  return (
    <Grid>
      <CenteredItem>
        <Illustration
          data-testid="cayc-illustration"
          aria-hidden={true}
          src={`${baseUrl}/static/cayc/images/CaYC.svg`}
        />
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
  marginBottom: '2rem',
});

const Paragraph = styled.p({
  marginTop: '1rem',
});

const List = styled.ul({
  marginTop: '1.5rem',
  listStyleType: '"-\\00A0"', // Non Breakable Space character
  listStylePosition: 'inside',
});
