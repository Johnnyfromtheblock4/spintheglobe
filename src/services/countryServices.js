import countriesData from "../data/countries.json";

const normalizeString = (value = "") => String(value).trim().toLowerCase();

const countryAliases = {
  usa: "us",
  "u.s.a.": "us",
  "united states": "us",
  "united states of america": "us",
  america: "us",

  uk: "gb",
  "united kingdom": "gb",
  britain: "gb",
  "great britain": "gb",

  russia: "ru",
  germany: "de",
  france: "fr",
  spain: "es",
  italy: "it",
  japan: "jp",
  china: "cn",
  india: "in",
  brazil: "br",
  argentina: "ar",
  mexico: "mx",
  canada: "ca",
  australia: "au",
  portugal: "pt",
  greece: "gr",
  egypt: "eg",
  turkey: "tr",
  netherlands: "nl",
  switzerland: "ch",
  austria: "at",
  belgium: "be",
  sweden: "se",
  norway: "no",
  finland: "fi",
  denmark: "dk",
  poland: "pl",
  ukraine: "ua",
  romania: "ro",
  hungary: "hu",
  czechia: "cz",
  "czech republic": "cz",
  ireland: "ie",
  iceland: "is",
  morocco: "ma",
  thailand: "th",
  vietnam: "vn",
  indonesia: "id",
  "south korea": "kr",
  "north korea": "kp",
  iran: "ir",
  iraq: "iq",
  israel: "il",
  palestine: "ps",
  vatican: "va",
};

const getFallbackTitle = (code, name) => {
  if (name) return name;
  if (code) return String(code).toUpperCase();
  return "Nazione selezionata";
};

const findCountryByName = (name) => {
  const normalizedName = normalizeString(name);

  if (countryAliases[normalizedName]) {
    return countriesData[countryAliases[normalizedName]] || null;
  }

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

export const getCountryDetails = async (code, name) => {
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
