import React from 'react';
import { Route, Link, Routes, useLocation } from 'react-router-dom';
import StorageEngineSimulator from './database/storage-engine/components/StorageEngineSimulator';

const components = {
  StorageEngine: StorageEngineSimulator,
};

function Database() {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Database Concepts</h2>
      <nav className="mb-4">
        <ul className="flex space-x-4">
          {Object.keys(components).map(name => (
            <li key={name}>
              <Link 
                to={name.toLowerCase()} 
                className={`text-blue-600 hover:text-blue-800 ${currentPath === name.toLowerCase() ? 'font-bold' : ''}`}
              >
                {name.replace(/([A-Z])/g, ' $1').trim()}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Routes>
        {Object.entries(components).map(([name, Component]) => (
          <Route key={name} path={name.toLowerCase()} element={<Component />} />
        ))}
      </Routes>
    </div>
  );
}

export default Database;