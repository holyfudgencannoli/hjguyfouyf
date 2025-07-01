// import './assets/styles/App.css'
import Layout from './pages/layout.jsx';
import LoginBox from './components/loginBox.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import TaskForm from './pages/forms/TaskForm.jsx';
import ProdForm from './pages/forms/ProdForm.jsx';
import BatchForm from './pages/forms/BatchForm.jsx';
import Archive from './pages/logs/Archive.jsx';
import NewAgentForm from './pages/forms/NewAgentForm.jsx';
import InnocForm from './pages/forms/InnocForm.jsx';
import ContamForm from './pages/forms/ContamForm.jsx';
import ProdSelectForm from './pages/forms/ProdSelectForm.jsx';
import Confirm from './pages/forms/Confirm.jsx';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<LoginBox />}></Route>
        <Route 
          path='/dashboard' 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/task-form"
          element={
            <ProtectedRoute>
              <TaskForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prod-form"
          element={
            <ProtectedRoute>
              <ProdForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/batch-form"
          element={
            <ProtectedRoute>
              <BatchForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archive"
          element={
            <ProtectedRoute>
              <Archive />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-agent-form"
          element={
            <ProtectedRoute>
              <NewAgentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/innoc-form"
          element={
            <ProtectedRoute>
              <InnocForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contam-form"
          element={
            <ProtectedRoute>
              <ContamForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prod-select-form"
          element={
            <ProtectedRoute>
              <ProdSelectForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/confirm-contam"
          element={
            <ProtectedRoute>
              <Confirm />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
