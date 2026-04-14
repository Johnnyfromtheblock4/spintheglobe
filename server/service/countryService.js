const path = require("path");
const countriesData = require(
  path.join(__dirname, "../../src/data/countries.json"),
);

const normalizeString = (value = "") => String(value).trim().toLowerCase();

const getFallbackTitle = (code, name) => {
  if (name) return name;
  if (code) return String(code).toUpperCase();
  return "Nazione selezionata";
};

const findCountryByName = (name) => {
  const normalizedName = normalizeString(name);

  const entry = Object.entries(countriesData).find(([, country]) => {
    const countryName = normalizeString(country?.name);

    return (
      countryName === normalizedName ||
      normalizedName.includes(countryName) ||
      countryName.includes(normalizedName)
    );
  });

  return entry ? entry[1] : null;
};

const fetchCountryDetails = async (code, name) => {
  const normalizedCode = normalizeString(code);

  let localCountry = normalizedCode ? countriesData[normalizedCode] : null;

  if (!localCountry && name) {
    localCountry = findCountryByName(name);
  }

  if (!localCountry) {
    return {
      title: getFallbackTitle(code, name),
      description: "Descrizione non disponibile per questa nazione.",
      image: "",
      images: [],
    };
  }

  return {
    title: localCountry.name || getFallbackTitle(code, name),
    description: localCountry.description || "Descrizione non disponibile.",
    image: Array.isArray(localCountry.images)
      ? localCountry.images[0] || ""
      : "",
    images: Array.isArray(localCountry.images) ? localCountry.images : [],
  };
};

module.exports = { fetchCountryDetails };
