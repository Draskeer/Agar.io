import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importer useNavigate

const Login = () => {
  const [pseudo, setPseudo] = useState(""); // Changer de "email" à "pseudo"
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Initialiser useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      pseudo, // Utilisez "pseudo" au lieu de "email"
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        userData
      );
      localStorage.setItem("token", response.data.token);
      alert("Login successful");

      // Redirection vers la page CoLists après la connexion réussie
      navigate("/CoLists"); // Rediriger vers CoLists
    } catch (error) {
      setErrorMessage("Invalid pseudo or password.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {errorMessage && (
          <div className="bg-red-500 text-white p-2 rounded-md text-center">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="pseudo"
              className="block text-sm font-medium text-gray-700"
            >
              Pseudo
            </label>
            <input
              id="pseudo"
              name="pseudo"
              type="text"
              required
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
