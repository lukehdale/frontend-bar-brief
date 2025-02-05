import React from "react";

export default function FavoritesSection() {
  const favoriteBars = ["Bar 1", "Bar 2", "Bar 3"];

  return (
    <section className="flex overflow-x-auto gap-4 p-4 bg-gray-800">
      {favoriteBars.map((bar, idx) => (
        <div
          key={idx}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white"
        >
          {bar}
        </div>
      ))}
    </section>
  );
}
