import { Link, Outlet } from 'react-router-dom';
import '../pages/Layout.css';
import AppBar from '@mui/material/AppBar';

export default function Layout() {
  return (
    <>
      <AppBar />
      <main className='content'>
        <Outlet /> {/* This is where nested routes render */}
      </main>
    </>
  );
}
