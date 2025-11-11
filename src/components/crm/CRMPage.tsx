/**
 * CRM Page - Unified interface for Leads, Clients, Quotes & Invoices
 * Master-detail layout with progressive disclosure
 */

import { useState } from 'react';
import { CRMProvider, useCRM } from '../../contexts/CRMContext';
import { CRMSidebar } from './CRMSidebar';
import { CRMMasterList } from './CRMMasterList';
import { CRMDetailPane } from './CRMDetailPane';
import { CRMSlideOver } from './CRMSlideOver';
import { motion, AnimatePresence } from 'motion/react';

export default function CRMPage() {
  return (
    <CRMProvider>
      <CRMPageContent />
    </CRMProvider>
  );
}

function CRMPageContent() {
  const { currentTab, selectedId } = useCRM();
  
  return (
    <div className="h-screen flex bg-[#0C0C0C]">
      {/* Sidebar Navigation */}
      <CRMSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Master List */}
        <div className={`${selectedId ? 'w-1/3' : 'w-full'} border-r border-gray-800 transition-all duration-300`}>
          <CRMMasterList />
        </div>
        
        {/* Detail Pane - Only show when item selected */}
        <AnimatePresence>
          {selectedId && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden"
            >
              <CRMDetailPane />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Slide Over (modals for actions) */}
      <CRMSlideOver />
    </div>
  );
}
