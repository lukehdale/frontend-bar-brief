import React from "react";
import { FaRegStar } from "react-icons/fa";

export default function BarCard({ place, image, name, comments, onClick }) {
  const latestComment = comments[comments.length - 1];

  const handleAddFavorite = async (place) => {
    try {
      const response = await fetch("http://localhost:8080/add-favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ place }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to add to favorites");
      }

      const result = await response.json();

      console.log("Successfully added to favorites:", result);
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  return (
    <div
      className="cursor-pointer bg-gray-800 rounded-lg shadow-lg p-4 hover:bg-gray-700"
      onClick={onClick}
    >
      <div className="top-3 cursor-pointer">
        <FaRegStar
          size={24}
          className="text-bar-blue transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleAddFavorite(place);
          }}
        />
      </div>

      <div className="flex flex-col items-center">
        <img
          src={image}
          alt={name}
          className="rounded-lg mb-4 object-cover w-96 max-h-56 h-auto"
        />
        <h2 className="text-xl font-bold text-center">{name}</h2>
      </div>
      {comments && comments.length > 0 ? (
        <p className="text-gray-400">
          <span className="text-gray-200">
            <b>{latestComment.author}: </b>
          </span>
          {latestComment.content}
        </p>
      ) : (
        <p className="text-gray-400">Be the first to comment!</p>
      )}
    </div>
  );
}
