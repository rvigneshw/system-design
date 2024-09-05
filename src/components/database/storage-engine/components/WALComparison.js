import React, { useState, useEffect } from 'react';
import { getLastFlushTimestamp, getWALContents, getDiskWALContents, walEventEmitter, getTimeUntilNextFlush } from '../utils/storageEngine';

function WALComparison() {
  const [memoryWAL, setMemoryWAL] = useState('');
  const [diskWAL, setDiskWAL] = useState('');
  const [timeUntilFlush, setTimeUntilFlush] = useState(10000);

  useEffect(() => {
    const updateTimer = () => {
      setTimeUntilFlush(getTimeUntilNextFlush());
    };

    const updateWAL = () => {
      setMemoryWAL(getWALContents());
      setDiskWAL(getDiskWALContents());
    };

    const timer = setInterval(() => {
      updateTimer();
      updateWAL();
    }, 100); // Update more frequently for smoother countdown

    // Listen for flush events
    walEventEmitter.on('flush', updateWAL);

    updateTimer();
    updateWAL();

    return () => {
      clearInterval(timer);
      walEventEmitter.off('flush', updateWAL);
    };
  }, []);

  const renderWALEntries = (content) => {
    return content.split('\n').filter(entry => entry.trim() !== '').map((entry, index) => {
      try {
        const parsedEntry = JSON.parse(entry);
        return (
          <div key={index} className="bg-gray-100 p-2 rounded mb-2 break-words">
            <span className="font-semibold mr-2">{parsedEntry.type}</span>
            <span className="text-blue-600 mr-2">{parsedEntry.key}</span>
            <span className="text-green-600 mr-2">{parsedEntry.value}</span>
            <span className="text-gray-500 text-sm">{new Date(parsedEntry.timestamp).toLocaleString()}</span>
          </div>
        );
      } catch (error) {
        console.error('Error parsing WAL entry:', error);
        return null;
      }
    });
  };

  return (
    <div className="wal-comparison">
      <h2 className="text-2xl font-bold mb-4">WAL Comparison</h2>
      <div className="bg-yellow-100 p-4 rounded-lg mb-4">
        <p className="font-semibold">Time until next WAL flush: {Math.ceil(timeUntilFlush / 1000)} seconds</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">WAL in Memory</h3>
          <div className="bg-white p-4 rounded-lg shadow overflow-y-auto max-h-96">
            {renderWALEntries(memoryWAL)}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">WAL on Disk</h3>
          <div className="bg-white p-4 rounded-lg shadow overflow-y-auto max-h-96">
            {renderWALEntries(diskWAL)}
          </div>
        </div>
      </div>
      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Write-Ahead Logging (WAL) Info</h3>
        <p className="mb-2">WAL is a standard method for ensuring data integrity. It ensures that changes to data files are written only after those changes have been logged in the WAL file.</p>
        <p className="mb-2">Benefits of WAL:</p>
        <ul className="list-disc list-inside mb-2">
          <li>Reduced disk writes</li>
          <li>Improved transaction speed</li>
          <li>Support for crash recovery</li>
          <li>Enables point-in-time recovery</li>
        </ul>
        <p>The WAL in memory represents the current state of operations, while the WAL on disk ensures durability in case of system failures.</p>
      </div>
    </div>
  );
}

export default WALComparison;