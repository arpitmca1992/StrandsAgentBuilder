/**
 * App Root
 * 
 * Routes between the Framework Selector page and the Builder (MainLayout).
 * Wraps everything in FrameworkProvider context.
 */

import { FrameworkProvider, useFramework } from './context/framework-context';
import { FrameworkSelector } from './pages/framework-selector';
import { MainLayout } from './components/main-layout';
import { getStoredFramework } from './frameworks/registry';

// Import and register framework adapters
import './frameworks/strands';
import './frameworks/google-adk';

function AppRouter() {
  const { isFrameworkActive } = useFramework();

  if (!isFrameworkActive) {
    return <FrameworkSelector />;
  }

  return <MainLayout />;
}

function App() {
  // Check if user had a framework selected previously
  const initialFramework = getStoredFramework();

  return (
    <FrameworkProvider initialFramework={initialFramework}>
      <AppRouter />
    </FrameworkProvider>
  );
}

export default App;
