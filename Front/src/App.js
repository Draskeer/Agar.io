// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CoLists from "./components/CoLists";
import Header from "./components/Header";

function App() {
  // Vérifie si le token d'authentification existe dans le localStorage
  const isAuthenticated = localStorage.getItem("token");

  return (
    <Router>
      <div>
        {/* Afficher le Header seulement si l'utilisateur est authentifié */}
        {isAuthenticated && <Header />}

        <Routes>
          {/* Redirection vers la page de connexion si l'utilisateur n'est pas authentifié */}
          <Route
            path="/CoLists"
            element={isAuthenticated ? <CoLists /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Si aucun chemin n'est trouvé, rediriger vers la page de connexion */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;