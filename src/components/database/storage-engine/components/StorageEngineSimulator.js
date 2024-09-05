import React, { useState, useEffect, useCallback } from 'react';
import ConfigurableDashboard from './ConfigurableDashboard';
import FileSelector from './FileSelector';
import { initializeStorage, writeKeyValue, getMemoryState, getWALContents, getDiskWALContents } from '../utils/storageEngine';

function StorageEngineSimulator() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [memoryState, setMemoryState] = useState(null);
  const [walContents, setWALContents] = useState('');
  const [diskWalContents, setDiskWalContents] = useState('');
  const [operationLog, setOperationLog] = useState([]);
  const [error, setError] = useState(null);
  const [degree, setDegree] = useState(3);

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

  const handleSubmit = useCallback(async (key, value) => {
    console.log('handleSubmit called in StorageEngineSimulator', key, value);
    try {
      const result = await writeKeyValue(key, value);
      setOperationLog(prevLog => [...prevLog, ...result.operations]);
      updateState();
    } catch (error) {
      setOperationLog(prevLog => [...prevLog, `Error: ${error.message}`]);
      setError(error.message);
    }
  }, []);

  const updateState = useCallback(() => {
    setMemoryState(getMemoryState());
    setWALContents(getWALContents());
    setDiskWalContents(getDiskWALContents());
  }, []);

  useEffect(() => {
    const interval = setInterval(updateState, 100);
    return () => clearInterval(interval);
  }, [updateState]);

  if (!isInitialized) {
    return (
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
    );
  }

  return (
    <ConfigurableDashboard
      memoryState={memoryState}
      walContents={walContents}
      diskWalContents={diskWalContents}
      onSubmit={handleSubmit}
      operationLog={operationLog}
    />
  );
}

export default StorageEngineSimulator;