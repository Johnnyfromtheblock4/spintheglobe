const { fetchCountryDetails } = require("../service/countryService");

const getCountryDetails = async (req, res) => {
  try {
    const { code, name } = req.query;

    if (!code && !name) {
      return res.status(400).json({
        message: "Codice o nome nazione mancante",
      });
    }

    const country = await fetchCountryDetails(code, name);
    return res.json(country);
  } catch (error) {
    console.error("Errore controller country:", error);

    return res.status(500).json({
      message: "Errore nel recupero dettagli della nazione",
    });
  }
};

module.exports = { getCountryDetails };
