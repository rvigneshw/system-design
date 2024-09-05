import React from 'react';

function WALVisualization({ walContents }) {
  const entries = walContents.split('\n').filter(entry => entry.trim() !== '');

  return (
    <div className="wal-visualization">
      <h2 className="text-2xl font-bold mb-4">Write-Ahead Log (WAL)</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {entries.map((entry, index) => {
          try {
            const parsedEntry = JSON.parse(entry);
            return (
              <div key={index} className="bg-gray-100 p-2 rounded break-words">
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
        })}
      </div>
    </div>
  );
}

export default WALVisualization;