import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('janabridge_theme') || 'light';
  });

  const [fontSize, setFontSizeState] = useState(() => {
    return localStorage.getItem('janabridge_font_size') || 'normal';
  });

  const [highContrast, setHighContrastState] = useState(() => {
    return localStorage.getItem('janabridge_contrast') === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Theme class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('janabridge_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-normal', 'text-large', 'text-xlarge');
    root.classList.add(`text-${fontSize}`);
    localStorage.setItem('janabridge_font_size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('janabridge_contrast', highContrast);
  }, [highContrast]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setFontSize = (size) => {
    setFontSizeState(size);
  };

  const toggleHighContrast = () => {
    setHighContrastState(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      fontSize,
      setFontSize,
      highContrast,
      toggleHighContrast
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
