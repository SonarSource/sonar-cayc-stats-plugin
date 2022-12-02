/*
 * Copyright (C) 2009-2020 SonarSource SA
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
import { formatISO, subYears } from "date-fns";
import { t } from "i18n";
import React, { useEffect } from "react";
import { getJSON } from "sonar-request";

export default function CleanAsYouCode() {
  useEffect(() => {
    (async () => {
      const result = await getJSON("/api/issues/search", {
        createdAfter: formatISO(subYears(new Date(), 1), { representation: "date" }),
        metrics: "bugs, code_smells,vulnerabilities",
      });
      console.log(result);
    })();
  }, []);

  return (
    <div>
      <h1>{t("cayc.title")}</h1>
      <p>{t("cayc.description")}</p>
    </div>
  );
}
