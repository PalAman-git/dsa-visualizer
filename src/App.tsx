import './App.css'
import { useState } from "react";

import BigOVisualizer from './components/complexity/BigOVisualizer';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/layout/AppSidebar';
import FindInSortedArray from './pages/BinarySearch/FindInSortedArray';

function App() {

  const [selectedComponent,
    setSelectedComponent] =
    useState<React.ReactNode>(<FindInSortedArray />);

  
  return (

    <SidebarProvider>
      <div className='flex h-screen w-full'>

      <AppSidebar setSelectedComponent={setSelectedComponent}/>

      <main className='flex-1 p-4 overflow-auto'>
        {selectedComponent}
          <div className='max-w-200 mx-auto mt-20 mb-50'>
            <BigOVisualizer />
          </div>
      </main>
      </div>
    </SidebarProvider>

  );
}

export default App;
