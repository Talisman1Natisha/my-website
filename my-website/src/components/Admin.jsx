import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Login from "./Login";
import ArticleEditor from "./ArticleEditor";

export default function Admin() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6">
      {!user ? (
        <Login onLogin={() => {}} />
      ) : (
        <>
          <ArticleEditor />
          <button
            onClick={() => auth.signOut()}
            className="text-sm text-blue-500 mt-4 underline"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
