import React from 'react';
import StorageEngineSimulator from './StorageEngineSimulator';

function Index() {
  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">NoSQL Storage Engine Simulator</h1>
        <StorageEngineSimulator />
      </div>
    </div>
  );
}

export default Index;