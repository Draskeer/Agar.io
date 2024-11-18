import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinLink, setJoinLink] = useState("");
  const [joinError, setJoinError] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleJoinList = async () => {
    if (!joinLink) {
      setJoinError("Please enter a valid link.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${joinLink}`,
        { link: joinLink },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Successfully joined the list!");
      setJoinLink("");
      setShowJoinModal(false);
    } catch (error) {
      console.error(error);
      setJoinError(
        "Error joining the list. Please check the link and try again."
      );
    }
  };

  return (
    <header className="p-4 bg-white text-black flex justify-between items-center">
      <h1 className="text-xl font-bold">CoList</h1>

      {isLoggedIn && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowJoinModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Join a List
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      )}

      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-md shadow-lg p-6 w-1/3">
            <h2 className="text-lg font-bold mb-4 text-gray-700">
              Join a List
            </h2>
            <textarea
              value={joinLink}
              onChange={(e) => setJoinLink(e.target.value)}
              placeholder="Paste the list link here"
              className="w-full text-black border p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {joinError && (
              <p className="text-red-500 text-sm mt-2">{joinError}</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowJoinModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinList}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
