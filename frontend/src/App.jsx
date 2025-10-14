import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <nav className="flex justify-between mb-6">
        <Link to="/" className="font-bold text-blue-600">
          Records
        </Link>
        <Link to="/add" className="text-blue-500">
          Add Record
        </Link>
      </nav>

      <Outlet />
    </div>
  );
}
