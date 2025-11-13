/*
 * Clean as You Code Plugin
 * Copyright (C) 2022-2025 SonarSource Sàrl
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
import React from 'react';
import CaycPresentation from './CAYCPresentation';
import Chart from './Chart';

export default function CleanAsYouCode() {
  return (
    <Container>
      <Card>
        <CaycPresentation />
      </Card>
      <Card>
        <Chart />
      </Card>
    </Container>
  );
}

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '1280px',
  margin: '0 auto',
});

const Card = styled.div({
  backgroundColor: 'white',
  border: '1px solid #e6e6e6',
  borderRadius: '4px',
  marginTop: '16px',
  padding: '32px',
});
