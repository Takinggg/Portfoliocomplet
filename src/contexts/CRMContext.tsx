/**
 * CRM Context - Global state management for CRM interface
 * Manages current selection, tabs, and navigation
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type EntityType = 'leads' | 'clients' | 'quotes' | 'invoices';

interface CRMState {
  // Current view
  currentTab: EntityType;
  selectedId: string | null;
  
  // Actions
  setCurrentTab: (tab: EntityType) => void;
  setSelectedId: (id: string | null) => void;
  
  // Modal/Slideover state
  isSlideOverOpen: boolean;
  slideOverContent: 'convert-lead' | 'new-quote' | 'new-invoice' | 'edit-lead' | 'edit-client' | 'edit-quote' | 'edit-invoice' | null;
  openSlideOver: (content: 'convert-lead' | 'new-quote' | 'new-invoice' | 'edit-lead' | 'edit-client' | 'edit-quote' | 'edit-invoice') => void;
  closeSlideOver: () => void;
  
  // Refresh mechanism
  refreshKey: number;
  triggerRefresh: () => void;
  
  // Notifications
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const CRMContext = createContext<CRMState | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse URL params
  const getInitialState = () => {
    const params = new URLSearchParams(location.search);
    const hash = location.hash.replace('#', '');
    const hashParams = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
    
    return {
      tab: (params.get('tab') || hashParams.get('tab') || 'leads') as EntityType,
      id: params.get('id') || hashParams.get('id') || null,
    };
  };
  
  const initial = getInitialState();
  const [currentTab, setCurrentTabState] = useState<EntityType>(initial.tab);
  const [selectedId, setSelectedIdState] = useState<string | null>(initial.id);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [slideOverContent, setSlideOverContent] = useState<CRMState['slideOverContent']>(null);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  // Sync URL with state (deep linking)
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('tab', currentTab);
    if (selectedId) params.set('id', selectedId);
    
    // Stay on /dashboard, just update query params
    const newSearch = `?${params.toString()}`;
    if (location.search !== newSearch) {
      navigate({ search: newSearch }, { replace: true });
    }
  }, [currentTab, selectedId, navigate, location.search]);
  
  // Update state from URL changes (back/forward)
  useEffect(() => {
    const state = getInitialState();
    setCurrentTabState(state.tab);
    setSelectedIdState(state.id);
  }, [location.search, location.hash]);
  
  const setCurrentTab = (tab: EntityType) => {
    setCurrentTabState(tab);
    setSelectedIdState(null); // Reset selection when changing tab
  };
  
  const setSelectedId = (id: string | null) => {
    setSelectedIdState(id);
  };
  
  const openSlideOver = (content: CRMState['slideOverContent']) => {
    setSlideOverContent(content);
    setIsSlideOverOpen(true);
  };
  
  const closeSlideOver = () => {
    setIsSlideOverOpen(false);
    setTimeout(() => setSlideOverContent(null), 300); // Wait for animation
  };
  
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };
  
  return (
    <CRMContext.Provider value={{
      currentTab,
      selectedId,
      setCurrentTab,
      setSelectedId,
      isSlideOverOpen,
      slideOverContent,
      openSlideOver,
      closeSlideOver,
      refreshKey,
      triggerRefresh,
      showToast,
    }}>
      {children}
      
      {/* Toast notification */}
      {toastMessage && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-5 ${
          toastMessage.type === 'success' ? 'bg-green-500' :
          toastMessage.type === 'error' ? 'bg-red-500' :
          'bg-blue-500'
        } text-white`}>
          {toastMessage.message}
        </div>
      )}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within CRMProvider');
  }
  return context;
}
