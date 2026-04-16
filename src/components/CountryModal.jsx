import React, { useEffect, useMemo, useState } from "react";

const CountryModal = ({ show, onHide, country }) => {
  const images = useMemo(() => {
    if (Array.isArray(country?.images) && country.images.length > 0) {
      return country.images;
    }

    if (country?.image) {
      return [country.image];
    }

    return [];
  }, [country]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [country, show]);

  if (!show) return null;

  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="country-modal-overlay" onClick={onHide}>
      <div className="country-modal-box" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="country-modal-close" onClick={onHide}>
          ×
        </button>

        <div className="row g-4 align-items-start">
          <div className="col-12 col-md-7">
            <h2 className="country-modal-title">
              {country?.title || "Nazione selezionata"}
            </h2>

            <p className="country-modal-text">
              {country?.description || "Descrizione non disponibile."}
            </p>
          </div>

          <div className="col-12 col-md-5">
            <div className="country-image-box">
              {hasImages ? (
                <div className="country-carousel">
                  <img
                    src={images[currentIndex]}
                    alt={`${country?.title || "Nazione"} ${currentIndex + 1}`}
                    className="country-image"
                  />

                  {hasMultipleImages && (
                    <>
                      <button
                        type="button"
                        className="carousel-arrow carousel-arrow-left"
                        onClick={goToPrev}
                        aria-label="Immagine precedente"
                      >
                        ‹
                      </button>

                      <button
                        type="button"
                        className="carousel-arrow carousel-arrow-right"
                        onClick={goToNext}
                        aria-label="Immagine successiva"
                      >
                        ›
                      </button>

                      <div className="carousel-dots">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`carousel-dot ${
                              index === currentIndex ? "active" : ""
                            }`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Vai all'immagine ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="country-image-placeholder">
                  Nessuna immagine disponibile
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryModal;
