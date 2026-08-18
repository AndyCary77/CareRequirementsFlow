import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { NavModeProvider } from './components/layout/NavModeContext';
import { FeatureFlagsProvider } from './data/FeatureFlagsContext';

export default function App() {
  useEffect(() => {
    document.documentElement.style.setProperty('overflow-anchor', 'none');
    document.body.style.setProperty('overflow-anchor', 'none');
  }, []);

  return (
    <FeatureFlagsProvider>
      <NavModeProvider>
        <RouterProvider router={router} />
      </NavModeProvider>
    </FeatureFlagsProvider>
  );
}