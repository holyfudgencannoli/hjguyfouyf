import { Link, Outlet } from 'react-router-dom';
import '../pages/Layout.css';
import '../components/sidebar/Sidebar.jsx'

export default function Layout() {
  return (
    <>
      <main className='content'>
        <Outlet /> {/* This is where nested routes render */}
      </main>
    </>
  );
}
