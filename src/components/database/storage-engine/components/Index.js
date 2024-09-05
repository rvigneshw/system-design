import React, { useState, useEffect } from 'react';
import ConfigurableDashboard from './ConfigurableDashboard';
import FileSelector from './FileSelector';
import { 
  initializeStorage, 
  writeKeyValue, 
  getMemoryState, 
  getWALContents, 
  getDiskWALContents 
} from '../utils/storageEngine';

function App() {
  const [memoryState, setMemoryState] = useState(null);
  const [walContents, setWALContents] = useState('');
  const [operationLog, setOperationLog] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [degree, setDegree] = useState(3);
  const [diskWalContents, setDiskWalContents] = useState('');

  const handleFileSelect = async (fileHandle) => {
    try {
      await initializeStorage(fileHandle, degree);
      setIsInitialized(true);
      setError(null);
      updateState();
    } catch (error) {
      setError(`Error initializing storage: ${error.message}`);
    }
  };

  const handleSubmit = async (key, value) => {
    try {
      const result = await writeKeyValue(key, value);
      setOperationLog(prevLog => [...prevLog, ...result.operations]);
      updateState();
    } catch (error) {
      setError(`Error writing key-value: ${error.message}`);
      setOperationLog(prevLog => [...prevLog, `Error: ${error.message}`]);
    }
  };

  const updateState = () => {
    setMemoryState(getMemoryState());
    setWALContents(getWALContents());
    setDiskWalContents(getDiskWALContents());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isInitialized) {
        updateState();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isInitialized]);

  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">NoSQL Storage Engine Simulator</h1>
        {!isInitialized ? (
          <div className="space-y-4">
            <div className="flex justify-center items-center">
              <label htmlFor="degree" className="mr-2 font-medium">B-tree Degree:</label>
              <input
                id="degree"
                type="number"
                min="2"
                value={degree}
                onChange={(e) => setDegree(Math.max(2, parseInt(e.target.value)))}
                className="border rounded px-2 py-1 w-16 text-center"
              />
            </div>
            <div className="flex justify-center">
              <FileSelector onFileSelect={handleFileSelect} />
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>
        ) : (
          <ConfigurableDashboard
            memoryState={memoryState}
            walContents={walContents}
            diskWalContents={diskWalContents}
            onSubmit={handleSubmit}
            operationLog={operationLog}
          />
        )}
      </div>
    </div>
  );
}

export default App;