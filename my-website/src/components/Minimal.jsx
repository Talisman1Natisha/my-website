import React, { useState } from 'react';
import { db, auth, storage } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function Minimal() {
  const [status, setStatus] = useState('Ready to test');
  const [results, setResults] = useState('');

  const testFirestore = async () => {
    try {
      setStatus('Testing Firestore...');
      const articlesRef = collection(db, 'articles');
      const snapshot = await getDocs(articlesRef);
      setStatus('Firestore test successful!');
      setResults(`Found ${snapshot.docs.length} documents`);
    } catch (error) {
      setStatus('Firestore test failed');
      setResults(error.message);
      console.error('Firestore error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow p-6 mt-10 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Firebase Minimal Test</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-md">
        <h2 className="font-semibold mb-2">Status: {status}</h2>
        {results && <pre className="bg-gray-800 text-white p-3 rounded-md overflow-auto text-sm">{results}</pre>}
      </div>
      
      <div className="space-y-3">
        <button 
          onClick={testFirestore}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Test Firestore Connection
        </button>
      </div>
    </div>
  );
}

export default Minimal; 