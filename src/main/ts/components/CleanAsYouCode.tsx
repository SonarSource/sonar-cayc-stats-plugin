/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
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
