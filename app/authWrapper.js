// app/authWrapper.js
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import Home from './page'; // Adjust path if necessary
import Auth from './Auth'; // Authentication component
import SignOut from './SignOut'; // Sign out component

const auth = getAuth();

export default function AuthWrapper() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <SignOut />
          <Home />
        </div>
      ) : (
        <Auth />
      )}
    </div>
  );
}
