import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cs2-dashboard-theme') || 'purple';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-purple', 'theme-red', 'theme-blue', 'theme-green', 'theme-yellow');
    
    // Add the current theme class
    root.classList.add(`theme-${theme}`);
    
    // Save to localStorage
    localStorage.setItem('cs2-dashboard-theme', theme);
  }, [theme]);

  return { theme, setTheme };
};