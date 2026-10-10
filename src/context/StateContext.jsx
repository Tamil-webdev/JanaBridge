import React, { createContext, useContext, useState, useEffect } from 'react';
import statesData from '../data/states.json';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [selectedState, setSelectedStateState] = useState(() => {
    return localStorage.getItem('janabridge_state') || 'tamil-nadu';
  });

  const [selectedDistrict, setSelectedDistrictState] = useState(() => {
    return localStorage.getItem('janabridge_district') || 'Chennai';
  });

  const setSelectedState = (stateId) => {
    setSelectedStateState(stateId);
    localStorage.setItem('janabridge_state', stateId);
  };

  const setSelectedDistrict = (districtName) => {
    setSelectedDistrictState(districtName);
    localStorage.setItem('janabridge_district', districtName);
  };

  const currentStateObj = statesData.find(s => s.id === selectedState) || statesData.find(s => s.id === 'tamil-nadu');

  return (
    <StateContext.Provider value={{
      selectedState,
      setSelectedState,
      selectedDistrict,
      setSelectedDistrict,
      currentStateObj,
      allStates: statesData
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) throw new Error('useStateContext must be used within StateProvider');
  return context;
};
