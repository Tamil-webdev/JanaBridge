import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { Footer } from './Footer';
import { VoiceModal } from '../common/VoiceModal';
import { AccessibilityModal } from '../common/AccessibilityModal';

export const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenAccessibilityModal={() => setIsAccessibilityModalOpen(true)}
      />

      {/* Main Body Shell */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop Collapsible Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Mobile Slide-out Drawer */}
        <MobileDrawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Page Content Container */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col">
          <Outlet context={{ onOpenVoiceModal: () => setIsVoiceModalOpen(true) }} />
        </main>
      </div>

      {/* Global Footer */}
      <Footer />

      {/* Voice Interaction Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      {/* Accessibility Settings Modal */}
      <AccessibilityModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
      />
    </div>
  );
};
