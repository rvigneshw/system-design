import React, { useState, useCallback } from 'react';
import MemoryVisualization from './MemoryVisualization';
import WALVisualization from './WALVisualization';
import WALComparison from './WALComparison';
import KeyValueInput from './KeyValueInput';
import OperationLog from './OperationLog';

const toggleableComponents = {
  MemoryVisualization,
  WALVisualization,
  WALComparison,
  OperationLog,
};

function ConfigurableDashboard({ memoryState, walContents, diskWalContents, onSubmit, operationLog = [] }) {
  const [activeComponents, setActiveComponents] = useState(['MemoryVisualization', 'WALComparison', 'OperationLog']);

  const toggleComponent = useCallback((componentName) => {
    setActiveComponents(prev => 
      prev.includes(componentName)
        ? prev.filter(name => name !== componentName)
        : [...prev, componentName]
    );
  }, []);

  return (
    <div className="w-full space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Key-Value Input</h2>
        <KeyValueInput onSubmit={onSubmit} />
      </div>
      <div className="flex flex-wrap justify-center my-4">
        {Object.keys(toggleableComponents).map(componentName => (
          <button
            key={componentName}
            onClick={() => toggleComponent(componentName)}
            className={`m-2 px-4 py-2 rounded-full transition-colors duration-200 ${
              activeComponents.includes(componentName)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {componentName}
          </button>
        ))}
      </div>
      <div className="space-y-6">
        {activeComponents.map(componentName => {
          const Component = toggleableComponents[componentName];
          return (
            <div key={componentName} className={`bg-white shadow-md rounded-lg overflow-hidden ${componentName === 'MemoryVisualization' ? 'col-span-full' : ''}`}>
              <div className="p-4">
                <Component
                  memoryState={memoryState}
                  walContents={walContents}
                  diskWalContents={diskWalContents}
                  log={operationLog}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(ConfigurableDashboard);