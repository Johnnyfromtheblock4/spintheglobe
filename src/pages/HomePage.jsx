import React, { useState } from "react";
import AppNavbar from "../components/AppNavbar";
import GlobeViewer from "../components/GlobeViewer";
import SpinButton from "../components/SpinButton";
import CountryModal from "../components/CountryModal";
import { getCountryDetails } from "../services/countryServices";

const HomePage = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pin, setPin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  const resetSelection = () => {
    setSelectedCountry(null);
    setSelectedCountryName("");
    setPin(null);
    setShowModal(false);
    setLoading(false);
    setHasSelection(false);
  };

  const handleSpin = () => {
    if (hasSelection) {
      setSelectedCountry(null);
      setSelectedCountryName("");
      setPin(null);
      setShowModal(false);
      setLoading(false);
      setHasSelection(false);
      setIsSpinning(true);
      return;
    }

    setIsSpinning((prev) => !prev);
  };

  const handleCountryClick = async ({ countryName, countryCode, lat, lng }) => {
    try {
      setLoading(true);
      setIsSpinning(false);
      setSelectedCountryName(countryName || "");
      setPin({ lat, lng });

      const countryData = await getCountryDetails(countryCode, countryName);

      setSelectedCountry(countryData);
      setShowModal(true);
      setHasSelection(true);
    } catch (error) {
      console.error("Errore nel recupero dati nazione:", error);

      setSelectedCountry({
        title: countryName || "Nazione selezionata",
        description:
          "Non sono riuscito a recuperare i dettagli di questa nazione.",
        image: "",
        images: [],
      });

      setShowModal(true);
      setHasSelection(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsSpinning(false);

    if (selectedCountryName || pin || selectedCountry) {
      setHasSelection(true);
    }
  };

  return (
    <div className="app-shell">
      <AppNavbar />

      <main className="container py-4 py-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <section className="hero-panel text-center">
              <h1 className="site-title">Welcome on board!</h1>
              <p className="site-subtitle">
                Spin the globe and let it find your next travel location!
              </p>

              <GlobeViewer
                isSpinning={isSpinning}
                pin={pin}
                selectedCountryName={selectedCountryName}
                onCountryClick={handleCountryClick}
              />

              <div className="d-flex justify-content-center mt-4">
                <SpinButton
                  isSpinning={isSpinning}
                  hasSelection={hasSelection}
                  onClick={handleSpin}
                />
              </div>

              {loading && (
                <p className="loading-text mt-3">Caricamento dati nazione...</p>
              )}
            </section>
          </div>
        </div>
      </main>

      <CountryModal
        show={showModal}
        onHide={handleCloseModal}
        country={selectedCountry}
      />
    </div>
  );
};

export default HomePage;
