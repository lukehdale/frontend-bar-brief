import React from "react";
import Navbar from "../components/Navbar";
import FavoritesSection from "../components/FavoritesSection";
import BarsNearMeSection from "../components/BarsNearMeSection";

export default function HomePage() {
  return (
    <div className="bg-dark-navy min-h-screen text-white">
      <Navbar />
      <FavoritesSection />
      <BarsNearMeSection />
    </div>
  );
}
