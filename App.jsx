import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './Navbar';
import LoginModal from './LoginModal';
import Home from './Home';
import CV from './CV';
import Skills from './Skills';
import Research from './Research';
import Projects from './Projects';

function AppInner() {
  const { showLogin } = useAuth();
  return (
    <>
      <Navbar />
      {showLogin && <LoginModal />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/research" element={<Research />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AuthProvider>
  );
}
