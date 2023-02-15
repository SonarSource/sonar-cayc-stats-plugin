/*
 * Copyright (C) 2022-2022 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const spin = keyframes`
from { transform: rotate(0deg) }
to { transform: rotate(360deg) }
`;

const Spinner = styled.div`
  position: relative;
  vertical-align: middle;
  width: 16px;
  height: 16px;
  border: 2px solid #236a97;
  border-radius: 50%;
  animation: ${spin} 0.75s infinite linear;

  &:before,
  &:after {
    left: -2px;
    top: -2px;
    display: none;
    position: absolute;
    content: '';
    width: inherit;
    height: inherit;
    border: inherit;
    border-radius: inherit;
  }

  &,
  &:before,
  &:after {
    display: inline-block;
    box-sizing: border-box;
    border-color: transparent;
    border-top-color: #236a97;
    animation-duration: 1.2s;
  }

  &:before {
    transform: rotate(120deg);
  }

  &:after {
    transform: rotate(240deg);
  }
`;

export default Spinner;
