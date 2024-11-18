// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CoLists from "./components/CoLists";
import Header from "./components/Header";

function App() {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <Router>
      <div>
        {isAuthenticated && <Header />}

        <Routes>
          <Route
            path="/CoLists"
            element={isAuthenticated ? <CoLists /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;