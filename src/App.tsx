import './App.css'
import { useState } from "react";

import AlgorithmSelector
from "@/components/controls/AlgorithmSelector";

import { algorithms }
from "./config/algorithms";

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

        <div className="p-10">

            <AlgorithmSelector

                value={selectedAlgorithm}

                onChange={setSelectedAlgorithm}

                algorithms={algorithms}

            />

            <div className="mt-10">

                {currentAlgorithm?.component}

            </div>

        </div>

    );
}

export default App;
