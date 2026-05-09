import './App.css'
import { useState } from "react";

import AlgorithmSelector
  from "@/components/controls/AlgorithmSelector";

import { algorithms }
  from "./config/algorithms";
import BigOVisualizer from './components/complexity/BigOVisualizer';

function App() {

  const [selectedAlgorithm,
    setSelectedAlgorithm] =
    useState("sliding-window");

  const currentAlgorithm =
    algorithms
      .flatMap(group => group.items)
      .find(
        item =>
          item.id === selectedAlgorithm
      );

  return (

    <div className='p-10'>

      <AlgorithmSelector

        value={selectedAlgorithm}

        onChange={setSelectedAlgorithm}

        algorithms={algorithms}

      />

      <div className="mt-10">

        {currentAlgorithm?.component}

      </div>

      <div className='w-full'>

      <div className='max-w-200 mx-auto mb-50'>
        <BigOVisualizer/>
      </div>
      </div>

    </div>

  );
}

export default App;
