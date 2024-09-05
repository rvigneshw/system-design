import React from 'react';

function OperationLog({ log = [] }) {
  if (!Array.isArray(log)) {
    console.error('Expected log to be an array, but received:', log);
    return null;
  }

  return (
    <div className="operation-log">
      <h2 className="text-2xl font-bold mb-4">Operation Log</h2>
      <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
        {log.map((operation, index) => (
          <div key={index} className="mb-2">
            <span className="font-semibold">{index + 1}.</span> {operation}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OperationLog;