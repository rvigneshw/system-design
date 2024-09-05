import React from 'react';

function OperationLog({ log }) {
  return (
    <div className="operation-log">
      <h2 className="text-2xl font-bold mb-4">Operation Log</h2>
      <ul className="space-y-2 max-h-96 overflow-y-auto">
        {log.map((entry, index) => (
          <li key={index} className="bg-gray-100 p-2 rounded break-words">{entry}</li>
        ))}
      </ul>
    </div>
  );
}

export default OperationLog;