import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

export default function BarModal({ bar, onClose }) {
  const [userData, setUserData] = useState("");
  const [comment, setComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState(bar.tags);

  const barId = bar.place_id;

  const fetchComments = useCallback(() => {
    fetch(`http://localhost:8080/${barId}/comments`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
      })
      .catch((error) => {
        console.error("Error getting comments:", error);
      });
  }, [barId]);

  const fetchTags = useCallback(() => {
    fetch(`http://localhost:8080/${barId}/tags`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setTags(data);
      })
      .catch((error) => {
        console.error("Error getting tags:", error);
      });
  }, [barId]);

  const addTag = (tag) => {
    setTags((prevTags) =>
      prevTags.map((t) =>
        t.tagName === tag.tagName ? { ...t, tagCount: t.tagCount + 1 } : t
      )
    );
    fetch(`http://localhost:8080/${barId}/add-tag`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tag),
    })
      .then((response) => {})
      .catch((error) => {
        console.error("Error adding tag:", error);
      });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/user", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchUser();
    fetchComments();
    fetchTags();
  }, [fetchComments, fetchTags]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handlePostComment = () => {
    if (!comment.trim()) return;
    setIsPosting(true);

    const newComment = {
      barId,
      author: userData.user.username,
      content: comment,
    };

    socket.emit("new-comment", newComment, (response) => {
      setIsPosting(false);
      if (response.error) {
        alert(response.error);
      } else {
        setComment("");

        setComments((prevComments) => [newComment, ...prevComments]);

        fetchComments();
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-dark-navy text-white flex items-center justify-center z-50">
      <div className="bg-dark-navy p-6 rounded-lg shadow-lg w-4/5 h-4/5 flex flex-col">
        <div className="flex flex-grow h-full">
          <div className="w-1/2 pr-4 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">{bar.name}</h2>
            <img
              src={bar.photoUrl}
              alt={bar.name}
              className="w-full h-72 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl mb-4">
              <b>Location:</b> {bar.vicinity}
            </h3>
            <div className="flex items-center gap-2">
              <div>
                <h4 className="text-m font-bold mb-2">Turnout:</h4>
              </div>
              {bar.tags.map((tag) => {
                return (
                  tag.tagCategory === "Crowd" && (
                    <button
                      key={tag.tagName}
                      type="button"
                      className="bg-[#003366] py-1 px-2 rounded-md text-white text-xs flex items-center mr-2 mb-2"
                      onClick={() => addTag(tag)}
                    >
                      {tag.tagName}
                      <span className="bg-[#00224d] font-bold text-white text-center py-1 px-2 text-xs rounded ml-2">
                        {tags.find((t) => t.tagName === tag.tagName)?.tagCount}
                      </span>
                    </button>
                  )
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <div>
                <h4 className="text-m font-bold mb-2">Crowd:</h4>
              </div>
              {bar.tags.map((tag) => {
                return (
                  tag.tagCategory === "Age" && (
                    <button
                      key={tag.tagName}
                      type="button"
                      className="bg-[#003366] py-1 px-2 rounded-md text-white text-xs flex items-center mr-2 mb-2"
                      onClick={() => addTag(tag)}
                    >
                      {tag.tagName}
                      <span className="bg-[#00224d] font-bold text-white text-center py-1 px-2 text-xs rounded ml-2">
                        {tags.find((t) => t.tagName === tag.tagName)?.tagCount}
                      </span>
                    </button>
                  )
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <div>
                <h4 className="text-m font-bold mb-2">Vibe:</h4>
              </div>
              {bar.tags.map((tag) => {
                return (
                  tag.tagCategory === "Vibe" && (
                    <button
                      key={tag.tagName}
                      type="button"
                      className="bg-[#003366] py-1 px-2 rounded-md text-white text-xs flex items-center mr-2 mb-2"
                      onClick={() => addTag(tag)}
                    >
                      {tag.tagName}
                      <span className="bg-[#00224d] font-bold text-white text-center py-1 px-2 text-xs rounded ml-2">
                        {tags.find((t) => t.tagName === tag.tagName)?.tagCount}
                      </span>
                    </button>
                  )
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <div>
                <h4 className="text-m font-bold mb-2">Entertainment:</h4>
              </div>
              {bar.tags.map((tag) => {
                return (
                  tag.tagCategory === "Entertainment" && (
                    <button
                      key={tag.tagName}
                      type="button"
                      className="bg-[#003366] py-1 px-2 rounded-md text-white text-xs flex items-center mr-2 mb-2"
                      onClick={() => addTag(tag)}
                    >
                      {tag.tagName}
                      <span className="bg-[#00224d] font-bold text-white text-center py-1 px-2 text-xs rounded ml-2">
                        {tags.find((t) => t.tagName === tag.tagName)?.tagCount}
                      </span>
                    </button>
                  )
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <div>
                <h4 className="text-m font-bold mb-2">Seating:</h4>
              </div>
              {bar.tags.map((tag) => {
                return (
                  tag.tagCategory === "Seating" && (
                    <button
                      key={tag.tagName}
                      type="button"
                      className="bg-[#003366] py-1 px-2 rounded-md text-white text-xs flex items-center mr-2 mb-2"
                      onClick={() => addTag(tag)}
                    >
                      {tag.tagName}
                      <span className="bg-[#00224d] font-bold text-white text-center py-1 px-2 text-xs rounded ml-2">
                        {tags.find((t) => t.tagName === tag.tagName)?.tagCount}
                      </span>
                    </button>
                  )
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <div>
                <h4 className="text-m font-bold mb-2">Food:</h4>
              </div>
              {bar.tags.map((tag) => {
                return (
                  tag.tagCategory === "Food" && (
                    <button
                      key={tag.tagName}
                      type="button"
                      className="bg-[#003366] py-1 px-2 rounded-md text-white text-xs flex items-center mr-2 mb-2"
                      onClick={() => addTag(tag)}
                    >
                      {tag.tagName}
                      <span className="bg-[#00224d] font-bold text-white text-center py-1 px-2 text-xs rounded ml-2">
                        {tags.find((t) => t.tagName === tag.tagName)?.tagCount}
                      </span>
                    </button>
                  )
                );
              })}
            </div>
          </div>

          <div className="w-1/2 pl-4 border-l border-gray-700 overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Comments
            </h2>
            <div className="border border-gray-300 rounded overflow-hidden">
              <div className="max-h-60 overflow-y-auto p-4">
                {comments.map((comment, index) => {
                  if (!comment.timestamp) {
                    return (
                      <p key={index}>
                        <b>{comment.author}:</b> {comment.content}
                      </p>
                    );
                  }
                  const now = new Date();
                  const past = new Date(comment.timestamp);
                  const diffInSeconds = Math.floor((now - past) / 1000);

                  const seconds = diffInSeconds;
                  const minutes = Math.floor(diffInSeconds / 60);
                  const hours = Math.floor(diffInSeconds / 3600);
                  const days = Math.floor(diffInSeconds / 86400);
                  let formattedDate = "";

                  if (seconds < 60) {
                    formattedDate = `${seconds}s`;
                  } else if (minutes < 60) {
                    formattedDate = `${minutes}m`;
                  } else if (hours < 24) {
                    formattedDate = `${hours}h`;
                  } else if (days < 7) {
                    formattedDate = `${days}d`;
                  } else {
                    formattedDate = past.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }

                  return (
                    <table key={index} className="table-auto w-full">
                      <tbody>
                        <tr>
                          <td className="px-4 py-2">
                            <b>{comment.author}:</b> {comment.content}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {formattedDate}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  );
                })}
              </div>
              <div className="border-t border-gray-700">
                <div className="flex items-center px-3 py-2 bg-dark-navy text-white">
                  <textarea
                    id="chat"
                    rows="1"
                    className="block mx-4 p-2.5 w-full text-sm text-white bg-dark-navy rounded-b-lg border border-white focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={handleCommentChange}
                  ></textarea>
                  <button
                    type="submit"
                    className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                    onClick={handlePostComment}
                    disabled={isPosting || !comment.trim()}
                  >
                    <svg
                      className="w-5 h-5 rotate-90 rtl:-rotate-90"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                    </svg>
                    <span className="sr-only">Send message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-bar-red text-white py-3 mt-4 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
