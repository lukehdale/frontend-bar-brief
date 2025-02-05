import React, { useState, useEffect } from "react";
import BarCard from "./BarCard";
import BarModal from "./BarModal";

export default function BarsNearMeSection() {
  const [bars, setBars] = useState([]);
  const [error, setError] = useState("");
  const [selectedBar, setSelectedBar] = useState(null);

  useEffect(() => {
    const fetchBars = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/bars/nearby?lat=${latitude}&lng=${longitude}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bars");
        }

        const data = await response.json();

        const barsWithComments = await Promise.all(
          data.map(async (bar) => {
            const commentsResponse = await fetch(
              `http://localhost:8080/${bar.place_id}/comments`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const tagsResponse = await fetch(
              `http://localhost:8080/${bar.place_id}/tags`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (commentsResponse.ok && tagsResponse.ok) {
              const comments = await commentsResponse.json();
              const tags = await tagsResponse.json();
              return { ...bar, comments, tags };
            } else {
              return { ...bar, comments: [], tags: [] };
            }
          })
        );

        setBars(barsWithComments);
      } catch (error) {
        console.error(error.message);
        setError("Failed to fetch bars");
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchBars(latitude, longitude);
          },
          (error) => {
            console.error("Error fetching location:", error.message);
            setError("Failed to fetch location");
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setError("Geolocation is not supported by this browser.");
      }
    };

    getUserLocation();
  }, []);

  const handleCardClick = (bar) => {
    setSelectedBar(bar);
  };

  const handleCloseModal = () => {
    setSelectedBar(null);
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bars.map((bar) => (
        <BarCard
          key={bar.place_id}
          image={bar.photoUrl}
          place={bar}
          name={bar.name}
          comments={bar.comments}
          onClick={() => handleCardClick(bar)}
        />
      ))}
      {selectedBar && <BarModal bar={selectedBar} onClose={handleCloseModal} />}
    </main>
  );
}
