import React, { ReactNode } from "react";
import type { Preview } from "@storybook/react";

import '../src/styles.scss';
import { I18nextProvider } from 'react-i18next';
import i18n from "./i18ForTest";



const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      actions: { argTypesRegex: "^on[A-Z].*" },
      expanded: true,
    },
    decorators: [(Story: React.FC): JSX.Element => <I18nextProvider i18n={i18n}><Story /></I18nextProvider>]
    },

  }

export default preview;
