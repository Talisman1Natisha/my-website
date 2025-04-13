import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAmhIHbZGWfMk13pTwv5wpvRqKx4VaJgos",
  authDomain: "talisman-series.firebaseapp.com",
  projectId: "talisman-series",
  storageBucket: "talisman-series.appspot.com",
  messagingSenderId: "742011375995",
  appId: "1:742011375995:web:fb9ab273664e2dbd016dde"
};

function CheckFirebase() {
  const [status, setStatus] = useState('Initializing...');
  const [details, setDetails] = useState([]);

  useEffect(() => {
    try {
      // Add a log
      console.log('Attempting to initialize Firebase directly...');
      setDetails(prev => [...prev, 'Initializing Firebase app...']);
      
      // Initialize Firebase
      const app = initializeApp(firebaseConfig, { name: 'verification' });
      setDetails(prev => [...prev, 'Firebase app initialized successfully']);
      
      // Initialize Firestore
      const db = getFirestore(app);
      setDetails(prev => [...prev, 'Firestore initialized successfully']);
      setDetails(prev => [...prev, `Firestore instance: ${JSON.stringify(db)}`]);
      
      // Success
      setStatus('Firebase initialized successfully!');
    } catch (error) {
      console.error('Firebase initialization error:', error);
      setStatus('Firebase initialization failed');
      setDetails(prev => [...prev, `Error: ${error.message}`]);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white shadow p-6 mt-10 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Firebase Initialization Check</h1>
      
      <div className="p-4 rounded-md mb-4" style={{ 
        backgroundColor: status.includes('failed') ? '#fee2e2' : '#ecfdf5',
        color: status.includes('failed') ? '#b91c1c' : '#065f46' 
      }}>
        <p className="font-bold">{status}</p>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Details</h2>
        <ul className="list-disc pl-5 space-y-1">
          {details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CheckFirebase; 