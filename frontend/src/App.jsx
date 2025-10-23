import React from "react";
import { Link, Outlet } from "react-router-dom";
import '@mantine/core/styles.css';
import { MantineProvider, Button } from '@mantine/core';
import MyButton from './components/MyButton';


export default function App() {
  return (
    <MantineProvider>{
    <div className="max-w-xl mx-auto p-6">
      <nav className="flex justify-between mb-6">
        <Link to="/" className="font-bold text-blue-600">
          <MyButton>Records</MyButton>
        </Link>
        
        <Link to="/add" className="text-blue-500" >
          <MyButton>Add Record</MyButton>
        </Link>
      </nav>

      <Outlet />
    </div>
    }</MantineProvider>
  );
}
