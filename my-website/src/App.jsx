import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import ArticlePage from "./components/ArticlePage";
import Admin from "./components/Admin";
import Navbar from "./components/Navbar";
import Minimal from "./components/Minimal";
import CheckFirebase from "./CheckFirebase";

function App() {
  const location = useLocation();
  const showNav = !location.pathname.startsWith("/admin");

  return (
    <div className="bg-gray-100 min-h-screen">
      {showNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles/:id" element={<ArticlePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/test" element={<Minimal />} />
        <Route path="/check" element={<CheckFirebase />} />
      </Routes>
    </div>
  );
}

export default App;
