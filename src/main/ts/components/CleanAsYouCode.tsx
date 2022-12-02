/*
 * Copyright (C) SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import styled from "@emotion/styled";
import React from "react";
import CaycPresentation from "./CAYCPresentation";

export default function CleanAsYouCode() {
  return (
    <Container>
      <Card>
        <CaycPresentation />
      </Card>
    </Container>
  );
}

const Container = styled.div({
  display: "flex",
  flexWrap: "wrap",
  maxWidth: "1280px",
  margin: "48px auto",
  fontSize: "14px",
});

const Card = styled.div({
  backgroundColor: "white",
  border: "1px solid #e6e6e6",
  borderRadius: "4px",
  margin: "16px 32px",
  padding: "32px",
});
