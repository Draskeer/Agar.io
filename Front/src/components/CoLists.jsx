import React, { useState, useEffect } from "react";
import axios from "axios";
import AddList from "./AddList";
import ListDetails from "./ListDetails";

const CoLists = () => {
  const [lists, setLists] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedList, setSelectedList] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedList(null);
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
            </div>
          ))}
        </div>
      ) : (
        <p>No lists found</p>
      )}

      {isModalOpen && selectedList && (
        <ListDetails
          selectedList={selectedList}
          onClose={handleCloseModal}
          fetchLists={fetchLists}
        />
      )}
    </div>
  );
};

export default CoLists;
