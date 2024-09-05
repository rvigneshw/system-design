import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';

// Dynamically import components
const importAll = (r) => {
  return r.keys().reduce((acc, key) => {
    const name = key.replace(/^\.\/|\.js$/g, '');
    acc[name] = r(key).default;
    return acc;
  }, {});
};

const components = importAll(require.context('./components', true, /\.js$/));

function App() {
  const topLevelRoutes = Object.keys(components).filter(key => !key.includes('/'));

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <ul className="flex justify-center space-x-4 p-4">
            <li><Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link></li>
            {topLevelRoutes.map(route => (
              <li key={route}>
                <Link to={`/${route.toLowerCase()}`} className="text-blue-600 hover:text-blue-800">
                  {route}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="container mx-auto mt-8 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            {Object.entries(components).map(([name, Component]) => (
              <Route 
                key={name} 
                path={`/${name.toLowerCase()}/*`} 
                element={<Component />} 
              />
            ))}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">System Design Concepts</h1>
      <p className="text-xl">Click on a link above to explore different system design concepts.</p>
    </div>
  );
}

export default App;
