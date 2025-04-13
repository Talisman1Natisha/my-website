import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <div className="text-xl font-bold">Talisman</div>
      <div className="space-x-4">
        <Link to="/" className="text-blue-600">Articles</Link>
        <Link to="/test" className="text-blue-600">Test</Link>
        <Link to="/check" className="text-blue-600">Check Firebase</Link>
        <Link to="/admin" className="text-blue-600">Admin</Link>
      </div>
    </nav>
  );
}
