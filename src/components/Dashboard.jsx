import { Link, Outlet } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import '../pages/Layout.css'
import Sidebar from './sidebar/Sidebar';

export default function Dashboard() {

  // const navigate = useNavigate();
  

  return (
    <div id='dashboard'>   
      <Sidebar />   
      <h1>Hello World!</h1>
      <Link to={"/task-form"}>New Task</Link>
      <Link to={"/archive"}>New Product</Link>
      <Link to={"/new-agent-form"}>New Batch</Link>
    </div>
  );
}
