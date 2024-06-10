import React from "react";
import UserPages from "./pages/UserPages";
import Interface from "./pages/Interface"
import { UserProvider } from "./hooks/UserContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from "./pages/admin/AdminPage";
import './App.css'

function App() {

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<UserPages />} />
          <Route path="/chatpage" element={<Interface />} />
          <Route path="/admin-page" element={<AdminPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App
