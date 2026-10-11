import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { StateProvider } from './context/StateContext';
import { SavedItemsProvider } from './context/SavedItemsContext';

import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import { SchemesPage } from './pages/SchemesPage';
import { SchemeDetailsPage } from './pages/SchemeDetailsPage';
import { DocumentGuidePage } from './pages/DocumentGuidePage';
import { DocumentDetailsPage } from './pages/DocumentDetailsPage';
import { ChatPage } from './pages/ChatPage';
import { TamilNaduPage } from './pages/TamilNaduPage';
import { SavedItemsPage } from './pages/SavedItemsPage';
import { ChatHistoryPage } from './pages/ChatHistoryPage';
import { HelpPage } from './pages/HelpPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RecommendationPage } from './pages/RecommendationPage';

export function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <StateProvider>
          <SavedItemsProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/services/:id" element={<ServiceDetailsPage />} />
                  <Route path="/schemes" element={<SchemesPage />} />
                  <Route path="/schemes/:id" element={<SchemeDetailsPage />} />
                  <Route path="/documents" element={<DocumentGuidePage />} />
                  <Route path="/documents/:id" element={<DocumentDetailsPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/tamil-nadu" element={<TamilNaduPage />} />
                  <Route path="/saved" element={<SavedItemsPage />} />
                  <Route path="/chat-history" element={<ChatHistoryPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/recommend" element={<RecommendationPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </SavedItemsProvider>
        </StateProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
