import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <form onSubmit={login} className="space-y-4 bg-white p-6 rounded shadow">
      <input type="email" className="w-full border p-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" className="w-full border p-2 rounded" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password" required />
      <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
