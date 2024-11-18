import React, { useState } from "react";
import axios from "axios";

const ListDetails = ({ selectedList, onClose, fetchLists }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(selectedList.name);
  const [editContent, setEditContent] = useState(selectedList.content);
  const [shareLink, setShareLink] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");

  const handleModifyClick = () => {
    if (isEditing) {
      const updatedList = {
        name: editName,
        content: editContent,
      };
      handleUpdateList(updatedList);
    } else {
      setIsEditing(true);
    }
  };

  const handleContentChange = (e, index) => {
    const updatedContent = [...editContent];
    updatedContent[index] = e.target.value;
    setEditContent(updatedContent);
  };

  const handleAddField = () => {
    setEditContent([...editContent, ""]);
  };

  const handleUpdateList = async (updatedList) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3001/api/list/update/${selectedList._id}`,
        updatedList,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("List updated successfully");
      fetchLists();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error updating the list");
    }
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
      onClose();
      fetchLists();
    } catch (error) {
      console.error(error);
      alert("Error deleting the list");
    }
  };

  const handleShareClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3001/api/list/share/${selectedList._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShareLink(response.data.link);
    } catch (error) {
      console.error(error);
      alert("Error generating the invitation link");
    }
  };

  const handleCopyClick = () => {
    if (shareLink) {
      navigator.clipboard
        .writeText(shareLink)
        .then(() => setCopySuccess("Link copied!"))
        .catch(() => setCopySuccess("Failed to copy"));
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-md shadow-lg w-1/2"
      >
        <h2 className="text-2xl font-bold">{selectedList.name}</h2>
        <p className="text-sm text-gray-600">Owner: {selectedList.owner}</p>
        <p className="text-sm text-gray-600">
          Writters: {selectedList.writters}
        </p>

        {isEditing ? (
          <div>
            <h3 className="text-lg font-semibold">Edit List</h3>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border p-2 rounded-md w-full mb-4"
              placeholder="List Name"
            />
            <div className="mb-4">
              {editContent.map((item, index) => (
                <div key={index} className="mb-2 flex items-center">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleContentChange(e, index)}
                    className="border p-2 rounded-md w-full"
                    placeholder={`Item ${index + 1}`}
                  />
                </div>
              ))}
              <button
                onClick={handleAddField}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mt-2"
              >
                Add Item
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600">Content:</p>
            <ul>
              {selectedList.content.map((item, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {shareLink && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Invitation Link:</p>
            <div className="overflow-x-auto whitespace-nowrap">
              <a
                href={shareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {shareLink}
              </a>
            </div>
            <button
              onClick={handleCopyClick}
              className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md"
            >
              Copy Link
            </button>
            {copySuccess && (
              <p className="text-green-500 mt-2">{copySuccess}</p>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-between">
          {selectedList.writters.includes(localStorage.getItem("pseudo")) ||
          selectedList.owner === localStorage.getItem("pseudo") ? (
            <button
              onClick={handleModifyClick}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              {isEditing ? "Save" : "Modify"}
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

          {selectedList.owner === localStorage.getItem("pseudo") && (
            <button
              onClick={handleShareClick}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
            >
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListDetails;
