import React, { useState, useEffect } from "react";
import axios from "axios";
import AddList from "./AddList";

const CoLists = () => {
  const [lists, setLists] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedList, setSelectedList] = useState(null); // Nouvelle variable d'état pour la liste sélectionnée
  const [isModalOpen, setIsModalOpen] = useState(false); // Pour ouvrir/fermer le modal

  const fetchLists = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/list");
      setLists(response.data.lists);
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
      setSelectedList(response.data.list);
      setIsModalOpen(true); // Ouvrir le modal
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Fermer le modal
    setSelectedList(null); // Réinitialiser les détails de la liste
  };

  const handleModifyClick = () => {
    console.log("Modify list clicked");
    // Ajoute la logique pour modifier la liste
  };

  const handleDeleteClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:3001/api/list/delete/${selectedList._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("List deleted successfully");
      setIsModalOpen(false);
      fetchLists(); // Recharger les listes après la suppression
    } catch (error) {
      console.error(error);
      alert("Error deleting the list");
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
              <p className="text-sm text-gray-600">Creator: {list.owner}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No lists found</p>
      )}

      {isModalOpen && selectedList && (
        <div
          onClick={handleCloseModal}
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-md shadow-lg w-1/2"
          >
            <h2 className="text-2xl font-bold">{selectedList.name}</h2>
            <p className="text-sm text-gray-600">Owner: {selectedList.owner}</p>
            <p className="text-sm text-gray-600">Content:</p>
            <ul>
              {selectedList.content.map((item, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between">
              {selectedList.writters.includes(localStorage.getItem("pseudo")) ||
              selectedList.owner === localStorage.getItem("pseudo") ? (
                <button
                  onClick={handleModifyClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Modify
                </button>
              ) : null}

              {selectedList.owner === localStorage.getItem("pseudo") && (
                <button
                  onClick={handleDeleteClick}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoLists;
