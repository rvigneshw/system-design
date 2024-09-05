import React, { useState, useCallback } from 'react';

function KeyValueInput({ onSubmit }) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (key && value && typeof onSubmit === 'function') {
      onSubmit(key, value);
      setKey('');
      setValue('');
    } else {
      console.error('Invalid input or onSubmit is not a function');
    }
  }, [key, value, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Key"
        className="border rounded px-2 py-1"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Value"
        className="border rounded px-2 py-1"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}

export default React.memo(KeyValueInput);