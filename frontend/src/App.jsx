import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import RetailerDashboard from './pages/retailer'
import CustomRetailerDashboard from './pages/customretailer'
import Image from './components/Image'
import Json from './components/Json'
import Upload from './components/Upload'
import User from './pages/User'

// Component to conditionally render Navbar
const AppLayout = ({darkMode, setDarkMode, children}) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  
  return (
    <>
      {!isAuthPage && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}
      {children}
    </>
  );
};

function App() {
  // Initialize darkMode as true
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/upload" element={<Upload/>} />
          <Route path="/" element={
            <AppLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <Landing/>
            </AppLayout>
          } />
          <Route path="/user" element={
            <AppLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <User/>
            </AppLayout>
          } />
          <Route path="/retailer" element={
            <AppLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <RetailerDashboard/>
            </AppLayout>
          } />
          <Route path="/upload-img" element={
            <AppLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <Image/>
            </AppLayout>
          } />
          <Route path="/upload-csv" element={
            <AppLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <Json/>
            </AppLayout>
          } />

          <Route path="/customretailer" element={
            <AppLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <CustomRetailerDashboard/>
            </AppLayout>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;