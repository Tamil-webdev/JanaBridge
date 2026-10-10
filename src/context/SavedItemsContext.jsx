import React, { createContext, useContext, useState, useEffect } from 'react';

const SavedItemsContext = createContext();
const SAVED_STORAGE_KEY = 'janabridge_saved_items_v1';

export const SavedItemsProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedItems));
    } catch (e) {
      console.error('Failed to persist saved items', e);
    }
  }, [savedItems]);

  const isSaved = (type, id) => {
    return savedItems.some(item => item.type === type && item.id === id);
  };

  const toggleSave = (type, itemData) => {
    setSavedItems(prev => {
      const exists = prev.some(item => item.type === type && item.id === itemData.id);
      if (exists) {
        return prev.filter(item => !(item.type === type && item.id === itemData.id));
      } else {
        return [
          ...prev,
          {
            type,
            id: itemData.id,
            name: itemData.name,
            tamilName: itemData.tamilName || null,
            hindiName: itemData.hindiName || null,
            category: itemData.category || itemData.beneficiaryCategories?.[0] || 'General',
            tamilCategory: itemData.tamilCategory || null,
            hindiCategory: itemData.hindiCategory || null,
            department: itemData.department || itemData.issuingAuthority || 'Government Department',
            tamilDepartment: itemData.tamilDepartment || itemData.tamilIssuingAuthority || null,
            hindiDepartment: itemData.hindiDepartment || itemData.hindiIssuingAuthority || null,
            description: itemData.description || itemData.purpose || '',
            tamilDescription: itemData.tamilDescription || itemData.tamilPurpose || null,
            hindiDescription: itemData.hindiDescription || itemData.hindiPurpose || null,
            savedAt: new Date().toISOString()
          }
        ];
      }
    });
  };

  const removeSaved = (type, id) => {
    setSavedItems(prev => prev.filter(item => !(item.type === type && item.id === id)));
  };

  const clearAllSaved = () => {
    setSavedItems([]);
  };

  return (
    <SavedItemsContext.Provider value={{
      savedItems,
      isSaved,
      toggleSave,
      removeSaved,
      clearAllSaved,
      count: savedItems.length
    }}>
      {children}
    </SavedItemsContext.Provider>
  );
};

export const useSavedItems = () => {
  const context = useContext(SavedItemsContext);
  if (!context) throw new Error('useSavedItems must be used within SavedItemsProvider');
  return context;
};
