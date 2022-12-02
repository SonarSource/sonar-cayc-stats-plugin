/*
 * Copyright (C) SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */

import styled from "@emotion/styled";
import { t as translate } from "i18n";
import React from "react";
import { FormattedMessage } from "react-intl";

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
            defaultMessage={translate("cayc.title")}
            values={{
              cayc: <strong>{translate("cayc")}</strong>,
            }}
          />
        </Title>
        <p>{translate("cayc.description")}</p>
      </div>
    </Grid>
  );
}

const Grid = styled.div({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
});

const CenteredItem = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const Illustration = styled.img({
  width: "100px",
  marginRight: "32px",
});

const Title = styled.h1({
  fontSize: "20px",
  marginTop: "8px",
  marginBottom: "32px",
});
