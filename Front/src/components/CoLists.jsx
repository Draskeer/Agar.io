import React, { useState, useEffect } from "react";
import axios from "axios";
import AddList from "./AddList";

const CoLists = () => {
  const [lists, setLists] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fonction pour récupérer toutes les listes
  const fetchLists = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/list");
      setLists(response.data); // Enregistrer les listes dans l'état
    } catch (error) {
      setErrorMessage("An error occurred while fetching lists.");
      console.error(error);
    }
  };

  const handleListClick = async (listId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/list/${listId}`
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div>
      <AddList />
      <h1>My Lists</h1>

      {errorMessage && <div className="text-red-500">{errorMessage}</div>}

      {lists.length > 0 ? (
        <div>
          {lists.map((list) => (
            <div
              key={list._id}
              onClick={() => handleListClick(list._id)}
              className="cursor-pointer border p-4 mb-4 rounded-md shadow-md hover:bg-gray-100"
            >
              <h2 className="text-xl font-bold">{list.name}</h2>
              <p className="text-sm text-gray-600">Owner: {list.owner}</p>
              <p className="text-sm text-gray-600">Creator: {list.pseudo}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No lists found</p>
      )}
    </div>
  );
};

export default CoLists;
