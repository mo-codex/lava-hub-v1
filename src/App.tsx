/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { LanguageProvider } from './i18n/LanguageContext.tsx';
import { AdminAuthProvider } from './context/AdminAuthContext.tsx';
import { AppRoutes } from './routes/index.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AdminAuthProvider>
            <AppRoutes />
          </AdminAuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
