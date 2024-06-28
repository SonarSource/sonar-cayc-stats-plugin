/*
 * Clean as You Code Plugin
 * Copyright (C) 2022-2024 SonarSource SA
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
