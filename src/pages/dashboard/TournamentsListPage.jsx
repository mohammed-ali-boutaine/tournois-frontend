import React from "react";
import TournamentsList from "../../components/smart/TournamentsList";
import Navbar from "../../components/static/NavBar";
import Footer from "../../components/static/Footer";

const TournamentsListPage = () => {
  return (
    <>
      <Navbar />
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Tournaments</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <TournamentsList />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TournamentsListPage;
