import { BTree } from './BTree';
import { EventEmitter } from 'events';

const DB_NAME = 'KeyValueStore';
const STORE_NAME = 'KeyValuePairs';

let db;
let walFileHandle;
let bTree;
let memoryWAL = '';
let diskWalContents = '';
let lastFlushTimestamp = Date.now();
let flushInterval;

const FLUSH_INTERVAL = 10000; // 10 seconds

export const walEventEmitter = new EventEmitter();

let isFileSystemAccessSupported = false;

export async function initializeStorage(fileHandle, degree) {
  console.log('Initializing storage...');
  db = await new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(STORE_NAME);
    };
  });

  isFileSystemAccessSupported = fileHandle && typeof fileHandle.createWritable === 'function';
  walFileHandle = isFileSystemAccessSupported ? fileHandle : null;
  
  if (!isFileSystemAccessSupported) {
    console.warn('File System Access API not supported. WAL will be simulated in memory.');
  }

  bTree = new BTree(degree);
  lastFlushTimestamp = Date.now();
  flushInterval = setInterval(flushWAL, FLUSH_INTERVAL);
}

async function appendToWAL(entry) {
  const entryString = JSON.stringify(entry) + '\n';
  
  if (isFileSystemAccessSupported) {
    try {
      const writable = await walFileHandle.createWritable({ keepExistingData: true });
      const file = await walFileHandle.getFile();
      const size = file.size;
      await writable.seek(size);
      await writable.write(entryString);
      await writable.close();
    } catch (error) {
      console.error('Error appending to WAL file:', error);
      isFileSystemAccessSupported = false;
      console.warn('Falling back to in-memory WAL simulation.');
    }
  }
  
  memoryWAL += entryString;
}

async function flushWAL() {
  if (memoryWAL.trim() === '') return;

  if (isFileSystemAccessSupported) {
    try {
      const writable = await walFileHandle.createWritable({ keepExistingData: true });
      await writable.write(memoryWAL);
      await writable.close();
    } catch (error) {
      console.error('Error flushing WAL to file:', error);
      isFileSystemAccessSupported = false;
      console.warn('Falling back to in-memory WAL simulation.');
    }
  }

  diskWalContents += memoryWAL;
  memoryWAL = '';
  lastFlushTimestamp = Date.now();
  walEventEmitter.emit('flush');
}

export async function writeKeyValue(key, value) {
  let operations = [];
  try {
    if (!db) {
      throw new Error('Database not initialized. Please select a WAL file first.');
    }
    operations.push(`Received write request for key: ${key}, value: ${value}`);
    const walEntry = { type: 'write', key, value, timestamp: Date.now() };
    await appendToWAL(walEntry);
    operations.push('Appending to WAL');
    bTree.insert(key, value);
    operations.push('Updating B-Tree');
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
    operations.push('Updating IndexedDB');
    return { success: true, operations };
  } catch (error) {
    console.error('Error in writeKeyValue:', error);
    return { success: false, operations, error: error.message };
  }
}

export function getMemoryState() {
  return bTree ? bTree.getTreeRepresentation() : null;
}

export function getWALContents() {
  return memoryWAL;
}

export function getDiskWALContents() {
  return diskWalContents;
}

export function getLastFlushTimestamp() {
  return lastFlushTimestamp;
}

export function getFlushInterval() {
  return flushInterval;
}

export function getTimeUntilNextFlush() {
  const timeSinceLastFlush = Date.now() - lastFlushTimestamp;
  return Math.max(0, FLUSH_INTERVAL - timeSinceLastFlush);
}

// Remove these as they are not implemented and causing conflicts
// export const initializeStorageEngine = () => {
//   // Implement storage engine initialization
// };

// export const loadWALFile = (file) => {
//   // Implement WAL file loading
// };

// Add other storage engine related functions as needed

// Remove this duplicate export block
// export {
//   initializeStorage,
//   writeKeyValue,
//   getMemoryState,
//   getWALContents,
//   getDiskWALContents
// };